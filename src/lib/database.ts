import { supabase, isSupabaseConfigured, DbProgram, DbEnrollment, DbLesson, DbLessonProgress, DbContactMessage } from './supabase';
import { programs as fallbackPrograms, Program } from '../data/programsData';
import { submitEnrollmentToBackend, submitContactToBackend } from '../services/emailService';

/**
 * Fetch programs from Supabase or fallback to curated list
 */
export async function fetchPrograms(): Promise<Program[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((p: DbProgram) => {
          const fallback =
            fallbackPrograms.find((f) => f.id === p.id || f.id.includes(p.id)) ||
            fallbackPrograms[0];
          return {
            ...fallback,
            id: p.id,
            title: p.title,
            category: p.category as Program['category'],
            ageRange: p.age_range,
            difficulty: p.difficulty as Program['difficulty'],
            duration: p.duration,
            shortDesc: p.short_desc,
            skillsLearned: p.skills_learned || fallback.skillsLearned,
            image: p.image || fallback.image,
          };
        });
      }
    } catch (err) {
      console.warn('Could not query Supabase programs, using fallback list:', err);
    }
  }

  return fallbackPrograms;
}

/**
 * Fetch user's enrollments from Supabase
 */
export async function fetchUserEnrollments(userId: string): Promise<DbEnrollment[]> {
  if (!isSupabaseConfigured || !userId) {
    // Check localStorage fallback
    try {
      const local = JSON.parse(localStorage.getItem('james_tech_enrollments') || '[]');
      return local.map((item: Record<string, unknown>, index: number) => ({
        id: `local-${index}`,
        user_id: userId,
        program_id: (item.programTitle as string)?.toLowerCase().replace(/\s+/g, '-') || 'scratch',
        status: 'active',
        format: (item.learningFormat as 'in-person' | 'online') || 'in-person',
        schedule: (item.preferredDays as 'weekends' | 'weekdays' | 'flexible') || 'weekends',
        ref_code: (item.refCode as string) || `JT-LOCAL-${index}`,
        notes: (item.message as string) || null,
        created_at: (item.submittedAt as string) || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        programs: {
          id: 'scratch',
          title: (item.programTitle as string) || 'Technology Program',
          category: 'coding',
          age_range: 'Ages 7–16',
          difficulty: 'Beginner',
          duration: '8 Weeks',
          short_desc: 'Comprehensive practical technology curriculum.',
          description: '',
          image: '/src/assets/images/hero_young_coders_1790772247820.jpg',
          skills_learned: ['Problem Solving', 'Coding Fundamentals'],
          is_published: true,
          order_index: 0,
          created_at: new Date().toISOString(),
        },
      }));
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, programs(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching enrollments from Supabase:', error.message);
      return [];
    }

    return (data as DbEnrollment[]) || [];
  } catch (err) {
    console.error('Unexpected error fetching enrollments:', err);
    return [];
  }
}

export interface CreateEnrollmentParams {
  userId?: string | null;
  programId: string;
  programTitle: string;
  format: 'in-person' | 'online';
  schedule: 'weekends' | 'weekdays' | 'flexible';
  notes?: string;
  parentName: string;
  studentName: string;
  studentAge: string;
  phone: string;
  email: string;
}

/**
 * Creates enrollment record in Supabase and triggers backend email notification
 */
export async function createEnrollment(params: CreateEnrollmentParams): Promise<{
  success: boolean;
  refCode: string;
  error?: string;
}> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const refCode = `JT-2026-${randomSuffix}`;

  // 1. If user is authenticated and Supabase is configured, store in enrollments table
  if (isSupabaseConfigured && params.userId) {
    try {
      const { error: dbError } = await supabase.from('enrollments').upsert(
        {
          user_id: params.userId,
          program_id: params.programId,
          status: 'pending',
          format: params.format,
          schedule: params.schedule,
          ref_code: refCode,
          notes: params.notes || null,
        },
        { onConflict: 'user_id,program_id' }
      );

      if (dbError) {
        console.warn('Supabase enrollment insert warning:', dbError.message);
      }
    } catch (err) {
      console.error('Error inserting enrollment into Supabase:', err);
    }
  }

  // 2. Persist locally in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('james_tech_enrollments') || '[]');
    existing.unshift({
      refCode,
      parentName: params.parentName,
      studentName: params.studentName,
      studentAge: params.studentAge,
      phone: params.phone,
      email: params.email,
      programTitle: params.programTitle,
      learningFormat: params.format,
      preferredDays: params.schedule,
      message: params.notes,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('james_tech_enrollments', JSON.stringify(existing));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }

  // 3. Dispatch to backend API route for instant notification to director yaikobdiriba22@gmail.com
  await submitEnrollmentToBackend({
    refCode,
    parentName: params.parentName,
    studentName: params.studentName,
    studentAge: params.studentAge,
    phone: params.phone,
    email: params.email,
    programTitle: params.programTitle,
    learningFormat: params.format,
    preferredDays: params.schedule,
    message: params.notes,
  });

  return { success: true, refCode };
}

/**
 * Fetch program lessons
 */
export async function fetchProgramLessons(programId: string): Promise<DbLesson[]> {
  if (!isSupabaseConfigured) {
    // Generate default structured curriculum lessons
    return [
      {
        id: `${programId}-l1`,
        program_id: programId,
        title: 'Module 1: Orientation & Computational Thinking Foundations',
        description: 'Mental models, problem decomposition, algorithm design basics.',
        order_num: 1,
        duration_min: 60,
        is_free_preview: true,
        created_at: new Date().toISOString(),
      },
      {
        id: `${programId}-l2`,
        program_id: programId,
        title: 'Module 2: Core Syntax, Variables & Control Flow',
        description: 'Understanding sequencing, conditionals (if/else), and loops.',
        order_num: 2,
        duration_min: 90,
        is_free_preview: false,
        created_at: new Date().toISOString(),
      },
      {
        id: `${programId}-l3`,
        program_id: programId,
        title: 'Module 3: Functions, Events & Modular Architecture',
        description: 'Building reusable code blocks and handling user events.',
        order_num: 3,
        duration_min: 90,
        is_free_preview: false,
        created_at: new Date().toISOString(),
      },
      {
        id: `${programId}-l4`,
        program_id: programId,
        title: 'Module 4: Debugging Strategies & Engineering Rigor',
        description: 'Tracing runtime errors, testing edge cases, and building resilience.',
        order_num: 4,
        duration_min: 90,
        is_free_preview: false,
        created_at: new Date().toISOString(),
      },
      {
        id: `${programId}-l5`,
        program_id: programId,
        title: 'Module 5: Capstone Project Build & Presentation',
        description: 'Designing, programming, and showcasing an original working application.',
        order_num: 5,
        duration_min: 120,
        is_free_preview: false,
        created_at: new Date().toISOString(),
      },
    ];
  }

  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('program_id', programId)
      .order('order_num', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as DbLesson[];
    }
  } catch (err) {
    console.warn('Error fetching lessons:', err);
  }

  return [];
}

/**
 * Fetch user's completed lessons
 */
export async function fetchUserLessonProgress(userId: string): Promise<Record<string, boolean>> {
  if (!isSupabaseConfigured || !userId) {
    try {
      const saved = localStorage.getItem(`james_tech_progress_${userId || 'guest'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', userId);

    if (!error && data) {
      const map: Record<string, boolean> = {};
      (data as { lesson_id: string; completed: boolean }[]).forEach((item) => {
        map[item.lesson_id] = item.completed;
      });
      return map;
    }
  } catch (err) {
    console.warn('Error loading progress:', err);
  }

  return {};
}

/**
 * Toggle lesson completion in database
 */
export async function toggleLessonProgress(
  userId: string,
  lessonId: string,
  completed: boolean
): Promise<boolean> {
  // Always update local cache
  try {
    const key = `james_tech_progress_${userId || 'guest'}`;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    saved[lessonId] = completed;
    localStorage.setItem(key, JSON.stringify(saved));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }

  if (isSupabaseConfigured && userId) {
    try {
      const { error } = await supabase.from('lesson_progress').upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        },
        { onConflict: 'user_id,lesson_id' }
      );

      if (error) {
        console.warn('Supabase toggle lesson error:', error.message);
        return false;
      }
    } catch (err) {
      console.error('Error toggling progress:', err);
      return false;
    }
  }

  return true;
}

/**
 * Save contact message to database and trigger notification
 */
export async function submitContactMessage(params: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  // 1. Insert into Supabase contact_messages table
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: params.name,
        email: params.email,
        subject: params.subject || 'General Inquiry',
        message: params.message,
        status: 'new',
      });

      if (error) {
        console.warn('Supabase contact message insert warning:', error.message);
      }
    } catch (err) {
      console.error('Error storing contact message:', err);
    }
  }

  // 2. Dispatch to backend API /api/contact for email to director
  await submitContactToBackend({
    name: params.name,
    email: params.email,
    subject: params.subject,
    message: params.message,
  });

  return { success: true };
}
