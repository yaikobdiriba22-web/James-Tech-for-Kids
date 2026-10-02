import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe environment variable retriever supporting Vite import.meta.env and Node/SSR
const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env[key] === 'string') {
      return import.meta.env[key];
    }
  } catch {
    // Fall through
  }
  try {
    if (typeof process !== 'undefined' && process.env && typeof process.env[key] === 'string') {
      return process.env[key] || '';
    }
  } catch {
    // Fall through
  }
  return '';
};

// Retrieve environment variables using Vite's import.meta.env
const rawUrl =
  getEnvVar('VITE_SUPABASE_URL') || 'https://wxhzbhggavjxiqxxfmvu.supabase.co';

const rawKey =
  getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') ||
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  '';

// Clean and sanitize string values (trim and remove wrapping quotes if present)
const sanitizeEnvVar = (val: unknown): string => {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/^["']|["']$/g, '');
};

export const supabaseUrl = sanitizeEnvVar(rawUrl);
export const supabasePublishableKey = sanitizeEnvVar(rawKey);

/**
 * Validates whether a given string is a valid HTTP/HTTPS URL
 */
const isValidHttpUrl = (urlString: string): boolean => {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Checks if key is missing or still set to a template placeholder
 */
const isPlaceholderOrEmptyKey = (key: string): boolean => {
  if (!key) return true;
  const normalized = key.toLowerCase();
  return (
    normalized.includes('placeholder') ||
    normalized.includes('your_real') ||
    normalized === 'your_real_supabase_publishable_key' ||
    key.length < 20
  );
};

/**
 * Indicates whether Supabase is fully configured with valid project credentials
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    isValidHttpUrl(supabaseUrl) &&
    supabasePublishableKey &&
    !isPlaceholderOrEmptyKey(supabasePublishableKey)
);

/**
 * Diagnostics helper providing actionable feedback for setup in UI
 */
export interface SupabaseConfigStatus {
  isConfigured: boolean;
  hasUrl: boolean;
  hasKey: boolean;
  url: string;
  missingVars: string[];
  isVercelEnv: boolean;
}

export const getSupabaseConfigStatus = (): SupabaseConfigStatus => {
  const missing: string[] = [];
  const hasValidUrl = Boolean(supabaseUrl && isValidHttpUrl(supabaseUrl));
  const hasValidKey = Boolean(supabasePublishableKey && !isPlaceholderOrEmptyKey(supabasePublishableKey));

  if (!hasValidUrl) missing.push('VITE_SUPABASE_URL');
  if (!hasValidKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');

  const isVercel =
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('vercel.app') || window.location.hostname === 'james-tech-learn.vercel.app');

  return {
    isConfigured: missing.length === 0,
    hasUrl: hasValidUrl,
    hasKey: hasValidKey,
    url: supabaseUrl,
    missingVars: missing,
    isVercelEnv: isVercel,
  };
};

/**
 * Initialize the Supabase Client.
 * If credentials are missing, we provide a safe fallback client that will not crash
 * on initial load (e.g. getSession), while isSupabaseConfigured safely informs the UI.
 */
export const supabase: SupabaseClient = createClient(
  isValidHttpUrl(supabaseUrl) ? supabaseUrl : 'https://wxhzbhggavjxiqxxfmvu.supabase.co',
  isSupabaseConfigured ? supabasePublishableKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'james_tech_auth_token',
    },
  }
);

// Database Interfaces
export interface DbProfile {
  id: string;
  email: string;
  full_name: string | null;
  student_age: number | null;
  phone: string | null;
  guardian_name: string | null;
  role: 'student' | 'parent' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProgram {
  id: string;
  title: string;
  slug: string;
  category: string;
  age_range: string;
  difficulty: string;
  duration: string;
  short_desc: string;
  description: string;
  image: string;
  skills_learned: string[];
  is_published: boolean;
  order_index: number;
  created_at: string;
}

export interface DbEnrollment {
  id: string;
  user_id: string;
  program_id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  format: 'in-person' | 'online';
  schedule: 'weekends' | 'weekdays' | 'flexible';
  ref_code: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  programs?: DbProgram;
}

export interface DbLesson {
  id: string;
  program_id: string;
  title: string;
  description: string | null;
  order_num: number;
  duration_min: number;
  is_free_preview: boolean;
  created_at: string;
}

export interface DbLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface DbContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  created_at: string;
}
