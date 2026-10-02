import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';

export const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  const toggleMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  return (
    <div className="relative">
      {/* Mode Switcher Header if visited directly on /auth */}
      <div className="pt-6 pb-2 flex justify-center">
        <div className="inline-flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => toggleMode('login')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'login' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => toggleMode('signup')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'signup' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>
      </div>

      {mode === 'login' ? <LoginPage /> : <SignUpPage />}
    </div>
  );
};

export default AuthPage;
