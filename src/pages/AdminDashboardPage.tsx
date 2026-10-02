import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  supabase,
  isSupabaseConfigured,
  DbEnrollment,
  DbProfile,
  DbProgram,
  DbContactMessage,
} from '../lib/supabase';
import {
  Users,
  GraduationCap,
  MessageSquare,
  BookOpen,
  Settings,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  ExternalLink,
  RefreshCw,
  Mail,
  Phone,
  Shield,
  Download,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface ExtendedEnrollment extends DbEnrollment {
  student_profile?: DbProfile;
}

export const AdminDashboardPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'enrollments' | 'students' | 'programs' | 'inquiries' | 'settings'>('enrollments');

  // Data states
  const [enrollments, setEnrollments] = useState<ExtendedEnrollment[]>([]);
  const [students, setStudents] = useState<DbProfile[]>([]);
  const [programs, setPrograms] = useState<DbProgram[]>([]);
  const [inquiries, setInquiries] = useState<DbContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected item modal
  const [selectedEnrollment, setSelectedEnrollment] = useState<ExtendedEnrollment | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all admin data
  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Fallback demo state if key missing
        setEnrollments([]);
        setStudents([]);
        setPrograms([]);
        setInquiries([]);
        setLoading(false);
        return;
      }

      // 1. Fetch all enrollments with program data
      const { data: enrollData, error: enrollErr } = await supabase
        .from('enrollments')
        .select('*, programs(*)')
        .order('created_at', { ascending: false });

      if (enrollErr) {
        console.warn('Could not fetch enrollments:', enrollErr.message);
      }

      // 2. Fetch all student profiles
      const { data: profilesData, error: profilesErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesErr) {
        console.warn('Could not fetch profiles:', profilesErr.message);
      }

      // 3. Fetch programs
      const { data: programsData, error: programsErr } = await supabase
        .from('programs')
        .select('*')
        .order('order_index', { ascending: true });

      if (programsErr) {
        console.warn('Could not fetch programs:', programsErr.message);
      }

      // 4. Fetch contact messages
      const { data: messagesData, error: messagesErr } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesErr) {
        console.warn('Could not fetch contact messages:', messagesErr.message);
      }

      // Pair enrollment with student profile
      const profilesMap = new Map((profilesData || []).map((p: DbProfile) => [p.id, p]));
      const enrichedEnrollments: ExtendedEnrollment[] = (enrollData || []).map((e: DbEnrollment) => ({
        ...e,
        student_profile: profilesMap.get(e.user_id),
      }));

      setEnrollments(enrichedEnrollments);
      setStudents(profilesData || []);
      setPrograms(programsData || []);
      setInquiries(messagesData || []);
    } catch (err: unknown) {
      console.error('Failed to load admin data:', err);
      showNotification('Failed to synchronize admin data from database.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Update enrollment status
  const handleUpdateEnrollmentStatus = async (id: string, newStatus: 'pending' | 'active' | 'completed' | 'cancelled') => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setEnrollments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedEnrollment?.id === id) {
        setSelectedEnrollment((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      showNotification(`Enrollment status updated to "${newStatus}".`);
    } catch (err: unknown) {
      showNotification((err as Error)?.message || 'Failed to update enrollment status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle user role
  const handleToggleUserRole = async (profileId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'student' : 'admin';
    setActionLoading(profileId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: nextRole, updated_at: new Date().toISOString() })
        .eq('id', profileId);

      if (error) throw error;

      setStudents((prev) =>
        prev.map((s) => (s.id === profileId ? { ...s, role: nextRole as 'student' | 'admin' } : s))
      );
      showNotification(`User role updated to ${nextRole.toUpperCase()}`);
    } catch (err: unknown) {
      showNotification((err as Error)?.message || 'Failed to update user role', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Update message status
  const handleUpdateMessageStatus = async (id: string, newStatus: 'new' | 'reviewed' | 'resolved') => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setInquiries((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
      showNotification(`Inquiry marked as ${newStatus}.`);
    } catch (err: unknown) {
      showNotification((err as Error)?.message || 'Failed to update message status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Export roster to CSV
  const handleExportCSV = () => {
    const headers = ['Ref Code', 'Student Name', 'Email', 'Phone', 'Program', 'Format', 'Schedule', 'Status', 'Date'];
    const rows = enrollments.map((e) => [
      e.ref_code,
      `"${e.student_profile?.full_name || 'N/A'}"`,
      e.student_profile?.email || 'N/A',
      e.student_profile?.phone || 'N/A',
      `"${e.programs?.title || 'Track'}"`,
      e.format,
      e.schedule,
      e.status,
      new Date(e.created_at).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `james_tech_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Enrollment roster exported successfully.');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Filtered lists
  const filteredEnrollments = enrollments.filter((e) => {
    const matchesSearch =
      e.ref_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.student_profile?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.student_profile?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.programs?.title || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredStudents = students.filter((s) => {
    return (
      (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone || '').includes(searchTerm)
    );
  });

  const filteredInquiries = inquiries.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Metrics
  const pendingCount = enrollments.filter((e) => e.status === 'pending').length;
  const activeCount = enrollments.filter((e) => e.status === 'active').length;
  const newInquiriesCount = inquiries.filter((m) => m.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 font-display shadow-md">
                JT
              </div>
              <span className="text-lg font-bold text-white font-display hidden sm:inline">
                James <span className="text-amber-400">Tech</span>
              </span>
            </Link>

            <span className="text-slate-700 hidden sm:inline">/</span>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Console</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs text-slate-400 hover:text-white transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>Student View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            <div className="h-4 w-px bg-slate-800 hidden md:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold font-display">
                AD
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  {profile?.full_name || 'Academy Director'}
                </span>
                <span className="text-[10px] text-amber-400 block leading-tight font-mono truncate max-w-[150px]">
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Floating Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Active Cohort Seats
              </span>
              <span className="text-2xl font-extrabold text-white font-display mt-1 block">
                {activeCount}
              </span>
              <span className="text-[11px] text-slate-500">Across 5 specialized tracks</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Pending Approvals
              </span>
              <span className="text-2xl font-extrabold text-amber-400 font-display mt-1 block">
                {pendingCount}
              </span>
              <span className="text-[11px] text-slate-500">Awaiting confirmation</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Registered Students
              </span>
              <span className="text-2xl font-extrabold text-white font-display mt-1 block">
                {students.length}
              </span>
              <span className="text-[11px] text-slate-500">Ages 7–16 enrolled</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                New Inquiries
              </span>
              <span className="text-2xl font-extrabold text-white font-display mt-1 block">
                {newInquiriesCount}
              </span>
              <span className="text-[11px] text-slate-500">Contact submissions</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          {/* Tabs */}
          <div className="inline-flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => { setActiveTab('enrollments'); setStatusFilter('all'); }}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'enrollments'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Enrollments ({enrollments.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('students'); setStatusFilter('all'); }}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Students & Guardians ({students.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('programs'); setStatusFilter('all'); }}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'programs'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum Tracks ({programs.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('inquiries'); setStatusFilter('all'); }}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System & RLS</span>
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {activeTab !== 'settings' && (
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {activeTab === 'enrollments' && (
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ENROLLMENTS */}
        {/* ========================================================================= */}
        {activeTab === 'enrollments' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Status Filter Sub-Bar */}
            <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter by status:</span>
                {(['all', 'pending', 'active', 'completed', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                      statusFilter === st
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <span className="text-slate-500 text-[11px]">
                Showing {filteredEnrollments.length} of {enrollments.length} enrollments
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mb-3" />
                <span>Loading academy enrollments...</span>
              </div>
            ) : filteredEnrollments.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No enrollments match your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Student & Guardian</th>
                      <th className="py-3 px-4">Program Track</th>
                      <th className="py-3 px-4">Format / Schedule</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredEnrollments.map((enr) => (
                      <tr key={enr.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          {enr.ref_code}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">
                            {enr.student_profile?.full_name || 'Anonymous Student'}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {enr.student_profile?.email || 'No email registered'}
                          </span>
                          {enr.student_profile?.guardian_name && (
                            <span className="text-[10px] text-slate-500 block">
                              Guardian: {enr.student_profile.guardian_name} ({enr.student_profile.phone || 'No phone'})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-white block">
                            {enr.programs?.title || 'James Tech Track'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {enr.programs?.duration || '12 Weeks'} · {enr.programs?.age_range || 'Ages 7–16'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 capitalize">
                          <span className="block text-slate-200">
                            {enr.format}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {enr.schedule}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              enr.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : enr.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : enr.status === 'completed'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {enr.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                            {enr.status === 'pending' && <Clock className="w-3 h-3" />}
                            {enr.status === 'completed' && <GraduationCap className="w-3 h-3" />}
                            {enr.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                            <span>{enr.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          {enr.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateEnrollmentStatus(enr.id, 'active')}
                              disabled={actionLoading === enr.id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {enr.status === 'active' && (
                            <button
                              onClick={() => handleUpdateEnrollmentStatus(enr.id, 'completed')}
                              disabled={actionLoading === enr.id}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-[10px] transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedEnrollment(enr)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: STUDENTS & GUARDIANS */}
        {/* ========================================================================= */}
        {activeTab === 'students' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Registered Academy Accounts ({filteredStudents.length})
              </span>
              <span className="text-slate-500 text-[11px]">
                Full student & guardian contact directory
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Loading accounts...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No user profiles found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Age / Guardian</th>
                      <th className="py-3 px-4">Phone / WhatsApp</th>
                      <th className="py-3 px-4">Access Role</th>
                      <th className="py-3 px-4 text-right">Role Management</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                              {st.full_name ? st.full_name.charAt(0) : 'S'}
                            </div>
                            <span>{st.full_name || 'Registered Learner'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {st.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-white block">
                            {st.student_age ? `${st.student_age} Years Old` : 'Age Unspecified'}
                          </span>
                          {st.guardian_name && (
                            <span className="text-[10px] text-slate-400 block">
                              Guardian: {st.guardian_name}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {st.phone ? (
                            <a
                              href={`https://wa.me/${st.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{st.phone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-600">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              st.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {st.role === 'admin' && <Shield className="w-3 h-3 text-amber-400" />}
                            <span>{st.role}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleUserRole(st.id, st.role)}
                            disabled={actionLoading === st.id}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              st.role === 'admin'
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                            }`}
                          >
                            {st.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CURRICULUM TRACKS */}
        {/* ========================================================================= */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                      {prog.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        prog.is_published
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {prog.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display mt-1">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {prog.short_desc}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800">
                    <span>{prog.age_range}</span>
                    <span>•</span>
                    <span>{prog.duration}</span>
                    <span>•</span>
                    <span className="capitalize">{prog.difficulty}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/programs"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    <span>View Public Syllabus</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INQUIRIES & MESSAGES */}
        {/* ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Admission & Consultation Inquiries ({filteredInquiries.length})
              </span>
              <span className="text-slate-500 text-[11px]">
                Submitted via Contact form
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Loading messages...
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {filteredInquiries.map((inq) => (
                  <div key={inq.id} className="p-5 hover:bg-slate-800/30 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{inq.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inq.status === 'new'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : inq.status === 'reviewed'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <span className="text-xs text-amber-400 font-mono block mt-0.5">
                          {inq.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${inq.email}?subject=Re: James Tech Academy - ${encodeURIComponent(inq.subject)}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>Reply via Email</span>
                        </a>

                        <button
                          onClick={() => handleUpdateMessageStatus(inq.id, inq.status === 'resolved' ? 'reviewed' : 'resolved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-colors"
                        >
                          {inq.status === 'resolved' ? 'Mark In Review' : 'Mark Resolved'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white block mb-1">
                        Subject: {inq.subject}
                      </span>
                      <p>{inq.message}</p>
                    </div>

                    <span className="text-[10px] text-slate-500 block">
                      Submitted on: {new Date(inq.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SYSTEM & SUPABASE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Administrator Credentials
                  </h3>
                  <span className="text-xs text-slate-400">
                    Designated academy director account
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Primary Admin Email:
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    jamesechsolutionandacademy@gmail.com
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Director Phone Hotline:
                  </span>
                  <span className="font-mono text-slate-200">
                    +251 922 067 302
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Active Session:
                  </span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Signed in as Administrator ({user?.email})</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Supabase Database & RLS
                  </h3>
                  <span className="text-xs text-slate-400">
                    Cloud database instance reference
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Supabase Project Reference:
                  </span>
                  <span className="font-mono text-slate-200">
                    wxhzbhggavjxiqxxfmvu
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Target Endpoint:
                  </span>
                  <span className="font-mono text-slate-400 break-all text-[11px]">
                    https://wxhzbhggavjxiqxxfmvu.supabase.co
                  </span>
                </div>

                <div className="pt-2">
                  <a
                    href="https://supabase.com/dashboard/project/wxhzbhggavjxiqxxfmvu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <span>Open Supabase Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Detail Modal */}
        {selectedEnrollment && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                    Enrollment Dossier · {selectedEnrollment.ref_code}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display mt-0.5">
                    {selectedEnrollment.programs?.title || 'Program Track'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEnrollment(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Student</span>
                    <span className="font-bold text-white">{selectedEnrollment.student_profile?.full_name || 'N/A'}</span>
                    <span className="text-slate-400 text-[11px] block">{selectedEnrollment.student_profile?.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Guardian</span>
                    <span className="font-bold text-white">{selectedEnrollment.student_profile?.guardian_name || 'Not provided'}</span>
                    <span className="text-slate-400 text-[11px] block">{selectedEnrollment.student_profile?.phone || 'No phone'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Learning Format</span>
                    <span className="font-bold text-amber-300 capitalize">{selectedEnrollment.format}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">Schedule</span>
                    <span className="font-bold text-amber-300 capitalize">{selectedEnrollment.schedule}</span>
                  </div>
                </div>

                {selectedEnrollment.notes && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block mb-1">Parent Notes</span>
                    <p className="text-slate-300">{selectedEnrollment.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Change Status:</span>
                  {(['pending', 'active', 'completed', 'cancelled'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateEnrollmentStatus(selectedEnrollment.id, s)}
                      className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold capitalize transition-colors ${
                        selectedEnrollment.status === s
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedEnrollment(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default AdminDashboardPage;
