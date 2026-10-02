import React, { useState } from 'react';
import { getSupabaseConfigStatus } from '../lib/supabase';
import { AlertTriangle, Key, ExternalLink, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export const SupabaseConfigBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const status = getSupabaseConfigStatus();
  const [expanded, setExpanded] = useState(!compact);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  if (status.isConfigured) {
    return null;
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVar(id);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  return (
    <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs text-amber-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Supabase Authentication Key Required</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-amber-400 hover:text-amber-300 transition-colors p-1"
          aria-label={expanded ? 'Collapse setup instructions' : 'Expand setup instructions'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
        The application is connected to project <code className="text-amber-300 font-mono">wxhzbhggavjxiqxxfmvu</code>, but requires the publishable anon key to process user registration and login.
      </p>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-amber-500/20 space-y-3 animate-in fade-in duration-150">
          {/* Instructions Tabs / Guidance */}
          <div className="space-y-2">
            <span className="font-semibold text-white block text-[11px] uppercase tracking-wider">
              {status.isVercelEnv ? 'How to configure on Vercel:' : 'How to configure locally:'}
            </span>

            {status.isVercelEnv ? (
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>
                  Go to{' '}
                  <a
                    href="https://supabase.com/dashboard/project/wxhzbhggavjxiqxxfmvu/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>Supabase Dashboard → Settings → API</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and copy your <strong className="text-white">anon public key</strong>.
                </li>
                <li>
                  Open your{' '}
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>Vercel Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  → Select <strong>James-Tech-for-Kids</strong> → <strong>Settings</strong> → <strong>Environment Variables</strong>.
                </li>
                <li>
                  Add the variable name:
                  <div className="mt-1 flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-amber-300">
                    <span className="flex-1 truncate">VITE_SUPABASE_PUBLISHABLE_KEY=&lt;your-anon-key&gt;</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('VITE_SUPABASE_PUBLISHABLE_KEY', 'key')}
                      className="text-slate-400 hover:text-white"
                      title="Copy variable name"
                    >
                      {copiedVar === 'key' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
                <li>
                  Trigger a <strong className="text-white">Redeploy</strong> in Vercel to inject the variable into the build bundle.
                </li>
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>
                  Open or create a <code className="text-amber-300 font-mono">.env</code> file in the project root (next to <code>package.json</code>).
                </li>
                <li>
                  Paste your project publishable key:
                  <div className="mt-1 flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-amber-300">
                    <span className="flex-1 truncate">VITE_SUPABASE_PUBLISHABLE_KEY=your_copied_key</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('VITE_SUPABASE_PUBLISHABLE_KEY=your_copied_key', 'local')}
                      className="text-slate-400 hover:text-white"
                      title="Copy configuration line"
                    >
                      {copiedVar === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
                <li>Save the file and restart the development server (<code>npm run dev</code>).</li>
              </ol>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
            <Key className="w-3 h-3 text-amber-400" />
            <span>Target Endpoint: https://wxhzbhggavjxiqxxfmvu.supabase.co</span>
          </div>
        </div>
      )}
    </div>
  );
};
