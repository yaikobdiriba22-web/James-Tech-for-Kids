import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ADMIN_EMAIL_PRIMARY = 'jamesechsolutionandacademy@gmail.com';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 animate-spin mb-4">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full" />
        </div>
        <p className="text-xs text-slate-400 tracking-wider uppercase font-semibold">
          Verifying Administrator Clearance...
        </p>
      </div>
    );
  }

  // Not signed in -> redirect to login with intended destination
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check if admin role or primary admin email
  const isAdmin =
    profile?.role === 'admin' ||
    user.email === ADMIN_EMAIL_PRIMARY ||
    user.email?.toLowerCase() === ADMIN_EMAIL_PRIMARY.toLowerCase();

  // If authenticated but not an admin, show unauthorized notice
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">Administrator Access Required</h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Your account (<span className="text-amber-400 font-mono">{user.email}</span>) is signed in with student credentials.
              The Admin Console is restricted to Academy Directors and Instructors.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Student Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
