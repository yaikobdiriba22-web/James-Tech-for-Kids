import { useAuth } from './AuthContext';

export function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">James Tech</p>
            <h1 className="mt-2 text-4xl font-bold">Learner Dashboard</h1>
            <p className="mt-2 text-slate-400">You are signed in as {user?.email}</p>
          </div>
          <button
            onClick={async () => { await signOut(); window.location.replace('/login'); }}
            className="rounded-xl border border-white/10 px-5 py-3 font-semibold hover:bg-white/5"
          >
            Sign out
          </button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {['My Programs', 'Learning Progress', 'Certificates'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-semibold">{item}</h2>
              <p className="mt-2 text-sm text-slate-400">Ready for your James Tech learning data.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
