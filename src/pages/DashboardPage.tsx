import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserEnrollments,
  fetchPrograms,
  fetchProgramLessons,
  fetchUserLessonProgress,
  toggleLessonProgress,
  createEnrollment,
} from '../lib/database';
import { DbEnrollment, DbLesson } from '../lib/supabase';
import { Program } from '../data/programsData';
import {
  User,
  BookOpen,
  CheckCircle2,
  Calendar,
  LogOut,
  Settings,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Shield,
  Clock,
  Code,
  Layers,
  Check,
  AlertCircle,
  ExternalLink,
  Award,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile, signOut, updateProfile, updatePassword, isConfigured } = useAuth();
  const navigate = useNavigate();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'curriculum' | 'catalog' | 'settings'>('overview');

  // Database Data States
  const [enrollments, setEnrollments] = useState<DbEnrollment[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('scratch');
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [loadingData, setLoadingData] = useState(true);

  // Profile Form State
  const [editFullName, setEditFullName] = useState(profile?.full_name || '');
  const [editStudentAge, setEditStudentAge] = useState(String(profile?.student_age || 10));
  const [editPhone, setEditPhone] = useState(profile?.phone || '');
  const [editGuardianName, setEditGuardianName] = useState(profile?.guardian_name || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);

  // Password Update State
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Quick Enroll Modal State
  const [enrollModalProgram, setEnrollModalProgram] = useState<Program | null>(null);
  const [enrollFormat, setEnrollFormat] = useState<'in-person' | 'online'>('in-person');
  const [enrollSchedule, setEnrollSchedule] = useState<'weekends' | 'weekdays' | 'flexible'>('weekends');
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState<string | null>(null);

  // Sync profile fields when profile changes
  useEffect(() => {
    if (profile) {
      setEditFullName(profile.full_name || '');
      setEditStudentAge(String(profile.student_age || 10));
      setEditPhone(profile.phone || '');
      setEditGuardianName(profile.guardian_name || '');
    }
  }, [profile]);

  // Load User Data
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoadingData(true);
      try {
        const [enrolls, progs] = await Promise.all([
          fetchUserEnrollments(user.id),
          fetchPrograms(),
        ]);
        setEnrollments(enrolls);
        setAvailablePrograms(progs);

        const initialProgId = enrolls.length > 0 ? enrolls[0].program_id : progs[0]?.id || 'scratch';
        setSelectedProgramId(initialProgId);

        const [initialLessons, initialProgress] = await Promise.all([
          fetchProgramLessons(initialProgId),
          fetchUserLessonProgress(user.id),
        ]);
        setLessons(initialLessons);
        setLessonProgress(initialProgress);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [user]);

  // When selected curriculum track changes
  const handleSelectTrack = async (trackId: string) => {
    setSelectedProgramId(trackId);
    if (!user) return;
    const trackLessons = await fetchProgramLessons(trackId);
    setLessons(trackLessons);
  };

  // Toggle Lesson Completion
  const handleToggleLesson = async (lessonId: string, currentCompleted: boolean) => {
    if (!user) return;
    const newStatus = !currentCompleted;
    setLessonProgress((prev) => ({ ...prev, [lessonId]: newStatus }));
    await toggleLessonProgress(user.id, lessonId, newStatus);
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveError(null);
    setProfileSaveSuccess(false);

    const { error } = await updateProfile({
      full_name: editFullName.trim(),
      student_age: parseInt(editStudentAge, 10),
      phone: editPhone.trim(),
      guardian_name: editGuardianName.trim(),
    });

    if (error) {
      setProfileSaveError(error.message);
    } else {
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    }
  };

  // Handle Password Update
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    const { error } = await updatePassword(newPassword);
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  // Handle Quick Enroll in another track
  const handleConfirmEnroll = async () => {
    if (!enrollModalProgram || !user) return;
    setEnrollSubmitting(true);
    try {
      const res = await createEnrollment({
        userId: user.id,
        programId: enrollModalProgram.id,
        programTitle: enrollModalProgram.title,
        format: enrollFormat,
        schedule: enrollSchedule,
        parentName: profile?.guardian_name || profile?.full_name || 'Parent',
        studentName: profile?.full_name || user.email?.split('@')[0] || 'Student',
        studentAge: String(profile?.student_age || 10),
        phone: profile?.phone || '',
        email: user.email || '',
      });

      // Refresh enrollments
      const updated = await fetchUserEnrollments(user.id);
      setEnrollments(updated);
      setEnrollSuccessMsg(`Successfully reserved seat for ${enrollModalProgram.title} (Ref: ${res.refCode})`);
      setEnrollModalProgram(null);
    } catch (err: unknown) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrollSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  // Progress metrics calculation
  const totalLessons = lessons.length;
  const completedCount = lessons.filter((l) => lessonProgress[l.id]).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group focus-visible:outline-none">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-base font-display">
                JT
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display hidden sm:inline">
                James <span className="text-amber-400">Tech</span>
              </span>
            </Link>

            <span className="text-slate-700 hidden sm:inline">/</span>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/programs"
              className="text-xs text-slate-400 hover:text-white transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>Explore Tracks</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden md:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                {profile?.full_name ? profile.full_name.charAt(0) : user?.email?.charAt(0) || 'S'}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  {profile?.full_name || 'Student Learner'}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight truncate max-w-[140px]">
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Admin Clearance Quick Switch Banner */}
        {(profile?.role === 'admin' || user?.email === 'jamesechsolutionandacademy@gmail.com') && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">
                  Executive Administration Privileges Active
                </span>
                <span className="text-xs text-slate-300">
                  You are signed in as Director/Admin. Manage student enrollments, rosters, curriculum, and inquiries in the Admin Console.
                </span>
              </div>
            </div>

            <Link
              to="/admin"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-sm"
            >
              <span>Launch Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-blue-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-lg font-display">
                {profile?.full_name ? profile.full_name.charAt(0) : 'S'}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-display">
                  {profile?.full_name || (profile?.role === 'admin' ? 'Academy Admin' : 'Student Learner')}
                </h2>
                <span className="text-[11px] text-amber-400 font-semibold block">
                  {profile?.role === 'admin'
                    ? 'Academy Administrator'
                    : profile?.student_age
                    ? `Age ${profile.student_age} · Youth Track`
                    : 'Ages 7–16'}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{profile?.role === 'admin' ? 'Verified Admin Account' : 'Authenticated Account'}</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[120px]">
                  {user?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Enrolled Tracks:</span>
                <span className="text-amber-400 font-bold">{enrollments.length}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="bg-slate-900 border border-slate-800 rounded-2xl p-2 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('enrollments')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'enrollments'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>My Enrolled Tracks</span>
              {enrollments.length > 0 && (
                <span className="ml-auto bg-slate-800 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {enrollments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('curriculum')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Modules & Progress</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Browse All Programs</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account & Profile</span>
            </button>
          </nav>

          {/* Academy Contact Quick Info */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="font-semibold text-white block">Need Mentor Guidance?</span>
            <p className="text-[11px] leading-relaxed">
              Have questions regarding class timings or lab setup? Reach Director Yaikob directly at:
            </p>
            <div className="pt-1">
              <a
                href="mailto:yaikobdiriba22@gmail.com"
                className="text-amber-400 hover:underline block truncate font-medium"
              >
                yaikobdiriba22@gmail.com
              </a>
              <a href="tel:+251922067302" className="text-slate-300 hover:underline block mt-0.5 font-medium">
                +251 922 067 302
              </a>
            </div>
          </div>
        </aside>

        {/* Dynamic Main Content Pane */}
        <main className="lg:col-span-9 space-y-6">
          {/* Notification Alert if quick enrollment succeeded */}
          {enrollSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{enrollSuccessMsg}</span>
              </div>
              <button
                onClick={() => setEnrollSuccessMsg(null)}
                className="text-xs text-emerald-400 hover:text-emerald-200"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Welcome Hero Banner */}
              <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-900/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="max-w-xl relative z-10">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-2">
                    Welcome to James Tech Academy
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display mb-2">
                    Welcome Back, {profile?.full_name || 'Innovator'}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Building computational literacy through practical problem-solving. Review your enrolled cohorts, check curriculum milestones, or explore new tracks.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('curriculum')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Continue Learning</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      <span>Explore New Programs</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enrolled Tracks Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">Active & Enrolled Programs</h2>
                    <p className="text-xs text-slate-400">Programs currently linked to your student profile</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Add Track</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {loadingData ? (
                  <div className="py-12 text-center text-slate-500 text-xs">Loading enrollment records...</div>
                ) : enrollments.length === 0 ? (
                  /* Empty state when user is not enrolled in any program yet */
                  <div className="py-10 px-4 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-display mb-1">
                      No Programs Enrolled Yet
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                      You haven’t enrolled in any technology tracks yet. Select from Scratch, Python, Web Development, or Robotics to begin learning.
                    </p>
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Browse Available Programs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrollments.map((enr) => (
                      <div
                        key={enr.id}
                        className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              REF: {enr.ref_code}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                enr.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {enr.status === 'active' ? 'Active Cohort' : 'Enrollment Confirmed'}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white font-display mb-1">
                            {enr.programs?.title || enr.program_id}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                            {enr.programs?.short_desc || 'Comprehensive hands-on curriculum track.'}
                          </p>
                          <div className="text-[11px] text-slate-400 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span className="capitalize">{enr.format} campus · {enr.schedule}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>{enr.programs?.duration || '8 Weeks'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                          <button
                            onClick={() => {
                              handleSelectTrack(enr.program_id);
                              setActiveTab('curriculum');
                            }}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open Modules</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] text-slate-500">
                            Enrolled: {new Date(enr.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY ENROLLMENTS */}
          {activeTab === 'enrollments' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">My Course Enrollments</h2>
                  <p className="text-xs text-slate-400">Official registration records and cohort status</p>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                >
                  + Enroll in Another Track
                </button>
              </div>

              {enrollments.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white font-display mb-1">No Enrolled Tracks Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                    Pick a track to begin mastering computational thinking, web development, or Python.
                  </p>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer"
                  >
                    Explore Course Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enr) => (
                    <div
                      key={enr.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-amber-400">
                              REF: {enr.ref_code}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-xs text-slate-400 capitalize">
                              {enr.format} Format ({enr.schedule})
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white font-display">
                            {enr.programs?.title || enr.program_id}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                              enr.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {enr.status === 'active' ? 'Active Cohort' : 'Admissions Confirmed'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-500 block text-[11px] mb-0.5">Program Track:</span>
                          <span className="font-medium text-white">{enr.programs?.age_range || 'Ages 7–16'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px] mb-0.5">Duration:</span>
                          <span className="font-medium text-white">{enr.programs?.duration || '8 Weeks'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px] mb-0.5">Learning Status:</span>
                          <span className="font-medium text-emerald-400">Seat Reserved</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => {
                            handleSelectTrack(enr.program_id);
                            setActiveTab('curriculum');
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>View Lesson Modules</span>
                        </button>

                        <a
                          href="mailto:yaikobdiriba22@gmail.com"
                          className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          Contact Mentor
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURRICULUM MODULES & REAL PROGRESS */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Curriculum & Lesson Milestones</h2>
                  <p className="text-xs text-slate-400">Interactive syllabus modules with live completion tracking</p>
                </div>

                {/* Track Selector Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Track:</span>
                  <select
                    value={selectedProgramId}
                    onChange={(e) => handleSelectTrack(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs font-semibold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {availablePrograms.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Progress Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-white">Course Completion Progress</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {completedCount} of {totalLessons} Modules ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Check off modules as you complete them in class or online lab sessions.
                </p>
              </div>

              {/* Lesson Items */}
              <div className="space-y-3">
                {lessons.map((lesson) => {
                  const isDone = Boolean(lessonProgress[lesson.id]);
                  return (
                    <div
                      key={lesson.id}
                      className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                        isDone
                          ? 'bg-emerald-950/10 border-emerald-500/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleLesson(lesson.id, isDone)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-emerald-400 border-emerald-400 text-slate-950'
                            : 'border-slate-700 hover:border-amber-400 text-transparent'
                        }`}
                        title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                            Module {lesson.order_num}
                          </span>
                          <span className="text-slate-700">·</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration_min} mins</span>
                          </span>
                          {lesson.is_free_preview && (
                            <span className="text-[10px] font-semibold text-sky-400 bg-sky-400/10 px-2 py-0.2 rounded">
                              Preview
                            </span>
                          )}
                        </div>
                        <h4
                          className={`text-sm font-bold font-display ${
                            isDone ? 'text-slate-300 line-through' : 'text-white'
                          }`}
                        >
                          {lesson.title}
                        </h4>
                        {lesson.description && (
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: BROWSE ALL PROGRAMS (CATALOG) */}
          {activeTab === 'catalog' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Available Technology Tracks</h2>
                <p className="text-xs text-slate-400">
                  Select any course to reserve your seat or review full curriculum syllabus
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availablePrograms.map((prog) => {
                  const isEnrolled = enrollments.some((e) => e.program_id === prog.id);
                  return (
                    <div
                      key={prog.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
                    >
                      <div>
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                          <img
                            src={prog.image}
                            alt={prog.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-400 border border-white/10">
                            {prog.ageRange}
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-1.5">
                            <span>{prog.difficulty}</span>
                            <span>·</span>
                            <span>{prog.duration}</span>
                          </div>
                          <h3 className="text-base font-bold text-white font-display mb-2">
                            {prog.title}
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed mb-4">
                            {prog.shortDesc}
                          </p>

                          <div className="space-y-1 mb-2">
                            {prog.skillsLearned.slice(0, 3).map((skill) => (
                              <div key={skill} className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        {isEnrolled ? (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Enrolled</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setEnrollModalProgram(prog)}
                            className="flex-1 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                          >
                            Reserve Seat
                          </button>
                        )}

                        <button
                          onClick={() => {
                            handleSelectTrack(prog.id);
                            setActiveTab('curriculum');
                          }}
                          className="px-3.5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                        >
                          Curriculum
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE & ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Student & Account Settings</h2>
                <p className="text-xs text-slate-400">Update personal info and account security</p>
              </div>

              {/* Supabase Connection Status Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">Supabase Project Endpoint</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    https://wxhzbhggavjxiqxxfmvu.supabase.co
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    isConfigured
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {isConfigured ? 'Connected' : 'Dev Mode'}
                </span>
              </div>

              {/* Profile Details Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white font-display mb-4">Personal Information</h3>

                {profileSaveSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Profile successfully updated!</span>
                  </div>
                )}

                {profileSaveError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{profileSaveError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="Nathan Yaikob"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Student Age
                      </label>
                      <select
                        value={editStudentAge}
                        onChange={(e) => setEditStudentAge(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((age) => (
                          <option key={age} value={age}>
                            {age} Years Old
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Parent / Guardian Name
                      </label>
                      <input
                        type="text"
                        value={editGuardianName}
                        onChange={(e) => setEditGuardianName(e.target.value)}
                        placeholder="Yaikob Diriba"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+251 922 067 302"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>

              {/* Password Change Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white font-display mb-4">Update Password</h3>

                {passwordSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Password updated successfully!</span>
                  </div>
                )}

                {passwordError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
        </div>
      </div>

      {/* QUICK ENROLL MODAL */}
      {enrollModalProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                Seat Reservation
              </span>
              <h3 className="text-xl font-bold text-white font-display mt-0.5">
                Enroll in {enrollModalProgram.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Linked to student account: <strong className="text-slate-300">{user?.email}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Learning Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['in-person', 'online'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setEnrollFormat(fmt)}
                      className={`p-2 rounded-xl border text-xs capitalize transition-colors cursor-pointer ${
                        enrollFormat === fmt
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Schedule Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['weekends', 'weekdays', 'flexible'] as const).map((sch) => (
                    <button
                      key={sch}
                      type="button"
                      onClick={() => setEnrollSchedule(sch)}
                      className={`p-2 rounded-xl border text-xs capitalize transition-colors cursor-pointer ${
                        enrollSchedule === sch
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sch}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEnrollModalProgram(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={enrollSubmitting}
                onClick={handleConfirmEnroll}
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md cursor-pointer"
              >
                {enrollSubmitting ? 'Confirming...' : 'Confirm Seat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
