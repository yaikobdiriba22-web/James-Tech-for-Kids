/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './auth/AuthPage';
import { AdminRoute } from './components/AdminRoute';

import { Language } from './data/i18n';

const Layout: React.FC<{
  currentLang: Language;
  onSelectLang: (l: Language) => void;
  children: React.ReactNode;
}> = ({ currentLang, onSelectLang, children }) => {
  const location = useLocation();
  const isAuthOrDashboard =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/signup') ||
    location.pathname.startsWith('/auth') ||
    location.pathname.startsWith('/forgot-password') ||
    location.pathname.startsWith('/reset-password') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans flex flex-col justify-between">
      {!isAuthOrDashboard && (
        <Navbar
          currentLang={currentLang}
          onSelectLang={onSelectLang}
        />
      )}

      <main className="flex-1">{children}</main>

      {!isAuthOrDashboard && <Footer />}
    </div>
  );
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout currentLang={currentLang} onSelectLang={setCurrentLang}>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<HomePage currentLang={currentLang} />} />

            {/* Public Programs Catalog */}
            <Route path="/programs" element={<ProgramsPage />} />

            {/* Public Contact Page */}
            <Route path="/contact" element={<ContactPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Student Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Console */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
