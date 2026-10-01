import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const isLogin = mode === 'login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (isLogin) {
      window.location.replace('/dashboard');
    } else if (result.data.session) {
      window.location.replace('/dashboard');
    } else {
      setMessage('Account created. Check your email to confirm your account, then sign in.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">James Tech</p>
          <h1 className="text-3xl font-bold">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-slate-400">
            {isLogin ? 'Sign in to access your learner dashboard.' : 'Join James Tech and start learning.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-amber-400"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-amber-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-amber-400"
          />

          {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          {message && <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-amber-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => window.location.replace(isLogin ? '/signup' : '/login')}
          className="mt-6 w-full text-sm text-slate-400 hover:text-white"
        >
          {isLogin ? 'New to James Tech? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
