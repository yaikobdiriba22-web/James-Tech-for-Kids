-- ==============================================================================
-- James Tech for Kids - Production PostgreSQL Database Schema & RLS Policies
-- Target Supabase Project: https://wxhzbhggavjxiqxxfmvu.supabase.co
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE: profiles
-- Extends auth.users with student, parent & academy metadata
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  student_age INTEGER CHECK (student_age IS NULL OR (student_age >= 5 AND student_age <= 20)),
  phone TEXT,
  guardian_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'parent', 'admin', 'instructor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: programs
-- Curriculum tracks offered by James Tech
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('coding', 'web', 'python', 'ai', 'robotics')),
  age_range TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  skills_learned TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: enrollments
-- Student program admissions, cohort assignments & statuses
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  format TEXT NOT NULL DEFAULT 'in-person' CHECK (format IN ('in-person', 'online')),
  schedule TEXT NOT NULL DEFAULT 'weekends' CHECK (schedule IN ('weekends', 'weekdays', 'flexible')),
  ref_code TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_program_enrollment UNIQUE (user_id, program_id)
);

-- ==============================================================================
-- TABLE: lessons
-- Structured modular curriculum for each program
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_num INTEGER NOT NULL DEFAULT 1,
  duration_min INTEGER NOT NULL DEFAULT 60,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: lesson_progress
-- Student completion tracking per lesson
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_lesson_progress UNIQUE (user_id, lesson_id)
);

-- ==============================================================================
-- TABLE: contact_messages
-- Inquiries and consultation requests submitted to James Tech
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program_id ON public.enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_lessons_program_id ON public.lessons(program_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_messages(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Enable insert by authenticated user for self
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Programs Policies
-- Public read access for published programs
CREATE POLICY "Anyone can view published programs"
  ON public.programs FOR SELECT
  USING (is_published = true);

-- 3. Enrollments Policies
-- Users can view only their own enrollments
CREATE POLICY "Users can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create enrollment records for themselves
CREATE POLICY "Users can insert own enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update notes/schedule on their own enrollments
CREATE POLICY "Users can update own enrollments"
  ON public.enrollments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Lessons Policies
-- Anyone can view lessons for published programs
CREATE POLICY "Anyone can view published lessons"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.programs
      WHERE public.programs.id = public.lessons.program_id
      AND public.programs.is_published = true
    )
  );

-- 5. Lesson Progress Policies
-- Users can view and manage only their own progress records
CREATE POLICY "Users can view own progress"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Contact Messages Policies
-- Public users can submit contact inquiries
CREATE POLICY "Anyone can insert contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON AUTH.USERS REGISTRATION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    student_age,
    phone,
    guardian_name,
    role
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(NULLIF(new.raw_user_meta_data->>'student_age', '')::integer, 10),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'guardian_name',
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    student_age = COALESCE(EXCLUDED.student_age, profiles.student_age),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    guardian_name = COALESCE(EXCLUDED.guardian_name, profiles.guardian_name);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- INITIAL SEED DATA FOR CORE CURRICULUM
-- ==============================================================================
INSERT INTO public.programs (
  id, title, slug, category, age_range, difficulty, duration, short_desc, description, image, skills_learned, is_published, order_index
) VALUES
(
  'scratch',
  'Scratch & Game Development',
  'scratch-game-development',
  'coding',
  'Ages 7–10',
  'Beginner',
  '8 Weeks · 2 hrs/week',
  'Visual block-based coding introducing computational thinking, animations, and arcade-style 2D game mechanics.',
  'Scratch is MIT’s world-renowned visual programming environment designed specifically for young learners. In this track, children master core programming paradigms—loops, variables, events, and broadcast messaging—without syntax frustration.',
  '/src/assets/images/hero_young_coders_1790772247820.jpg',
  ARRAY['Block-based logic', 'Event listeners', 'Coordinate geometry', 'Game physics', 'Creative storytelling'],
  true,
  1
),
(
  'web-dev',
  'Web Development (HTML, CSS, JS)',
  'web-development',
  'web',
  'Ages 10–16',
  'Intermediate',
  '12 Weeks · 3 hrs/week',
  'Build and publish real, responsive websites using modern HTML5, CSS3, Flexbox/Grid, and interactive JavaScript.',
  'Students transition from block coding to writing authentic code. They design and construct personal portfolios, interactive educational tools, and multi-page web applications published live to the internet.',
  '/src/assets/images/hero_young_coders_1790772247820.jpg',
  ARRAY['Semantic HTML5', 'CSS Flexbox & Grid', 'JavaScript DOM manipulation', 'Responsive UI Design', 'Git & Cloud Hosting'],
  true,
  2
),
(
  'python',
  'Python Programming & Problem Solving',
  'python-programming',
  'python',
  'Ages 11–16',
  'Intermediate',
  '10 Weeks · 3 hrs/week',
  'Clean syntax, data structures, algorithmic problem solving, automated scripts, and text adventure games.',
  'Python is the world’s most popular language for software engineering, scientific research, and artificial intelligence. Students learn clean object-oriented concepts and solve algorithmic puzzles.',
  '/src/assets/images/hero_young_coders_1790772247820.jpg',
  ARRAY['Python syntax & functions', 'Lists, tuples & dictionaries', 'Algorithmic thinking', 'File handling & automation', 'Modular program design'],
  true,
  3
),
(
  'robotics',
  'Robotics & STEM Engineering',
  'robotics-stem',
  'robotics',
  'Ages 8–16',
  'Beginner',
  '8 Weeks · 2.5 hrs/week',
  'Hands-on microcontrollers, breadboard circuitry, motors, sensors, and embedded programming.',
  'Connect code to the physical universe. Students build real working electronic systems using microcontrollers, LEDs, ultrasonic distance sensors, and servo motors.',
  '/src/assets/images/hero_young_coders_1790772247820.jpg',
  ARRAY['Electrical circuits', 'Sensor integration', 'Microcontroller coding', 'Hardware debugging', 'Mechanical assembly'],
  true,
  4
),
(
  'ai-tech',
  'AI & Emerging Technologies',
  'ai-emerging-technologies',
  'ai',
  'Ages 12–16',
  'Advanced',
  '8 Weeks · 2 hrs/week',
  'Demystify artificial intelligence, machine learning principles, prompt engineering, and ethical digital creation.',
  'Move beyond consumer hype into how machine learning actually works. Students train custom image classification models, integrate smart APIs, and explore ethical AI governance.',
  '/src/assets/images/hero_young_coders_1790772247820.jpg',
  ARRAY['Machine learning concepts', 'Computer vision models', 'Prompt engineering', 'AI Ethics & safety', 'API integrations'],
  true,
  5
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Lessons for Scratch
INSERT INTO public.lessons (id, program_id, title, description, order_num, duration_min, is_free_preview) VALUES
('scratch-1', 'scratch', 'Lesson 1: Welcome to the Scratch Studio & Sprite Motion', 'Understand the stage, coordinates (X/Y), and moving sprites.', 1, 60, true),
('scratch-2', 'scratch', 'Lesson 2: Loops, Sequencing & Dance Animations', 'Creating repetitive actions with repeat and forever loops.', 2, 60, false),
('scratch-3', 'scratch', 'Lesson 3: Conditionals & Keyboard Controls', 'Using If-Then blocks to steer characters across obstacles.', 3, 75, false),
('scratch-4', 'scratch', 'Lesson 4: Scorekeeping, Variables & Timers', 'Adding lives, points, and countdown timers to games.', 4, 75, false),
('scratch-5', 'scratch', 'Lesson 5: Capstone Arcade Game Build', 'Publishing and presenting an original playable game.', 5, 90, false)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Lessons for Web Dev
INSERT INTO public.lessons (id, program_id, title, description, order_num, duration_min, is_free_preview) VALUES
('web-1', 'web-dev', 'Lesson 1: The Anatomy of a Webpage (HTML5)', 'Tags, headers, paragraphs, links, and semantic structure.', 1, 60, true),
('web-2', 'web-dev', 'Lesson 2: Styling with CSS: Colors, Typography & Box Model', 'Margins, paddings, borders, and modern fonts.', 2, 90, false),
('web-3', 'web-dev', 'Lesson 3: Responsive Layouts with Flexbox', 'Making websites adapt to phones, tablets, and desktops.', 3, 90, false),
('web-4', 'web-dev', 'Lesson 4: Interactive Web with JavaScript Basics', 'Events, button clicks, and updating text dynamically.', 4, 90, false),
('web-5', 'web-dev', 'Lesson 5: Capstone Live Portfolio Deployment', 'Deploying a personal website to Vercel/GitHub Pages.', 5, 120, false)
ON CONFLICT (id) DO NOTHING;
