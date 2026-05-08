import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Shield, Save, Eye, EyeOff, LayoutGrid, LogOut, Cpu, Bot } from 'lucide-react';

export default function AdminDashboard() {
  const { apiKeys, updateApiKeys, logout, isAuthenticated } = useStore();
  const [localGemini, setLocalGemini] = useState(apiKeys.gemini || '');
  const [localOpenAI, setLocalOpenAI] = useState(apiKeys.openai || '');
  const [showKeys, setShowKeys] = useState({ gemini: false, openai: false });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const navigate = useNavigate();

  // Protect route
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSave = () => {
    setSaveStatus('saving');
    updateApiKeys({ gemini: localGemini, openai: localOpenAI });
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="h-16 glass-panel border-b border-zinc-800 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-brand-red" size={20} />
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white">Central Intelligence HQ</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <LayoutGrid size={14} /> View Canvas
          </button>
          <div className="w-px h-4 bg-zinc-800" />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-medium text-brand-red/80 hover:text-brand-red transition-colors"
          >
            <LogOut size={14} /> Terminate Session
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-12 space-y-12">
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Neural API Sync</h2>
            <p className="text-zinc-500 text-sm">Configure your large language model provider credentials safely. Keys are stored in the temporary session environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gemini Config */}
            <div className="glass-panel p-6 rounded-xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-red/10 rounded-lg border border-brand-red/20 text-brand-red">
                    <Cpu size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Google Gemini</h3>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Multi-modal AI</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowKeys(s => ({ ...s, gemini: !s.gemini }))}
                  className="text-zinc-600 hover:text-zinc-400"
                >
                  {showKeys.gemini ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">API Secret Key</label>
                <input
                  type={showKeys.gemini ? "text" : "password"}
                  value={localGemini}
                  onChange={(e) => setLocalGemini(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-xs font-mono text-emerald-500 focus:outline-none focus:border-brand-red/30"
                  placeholder="AIzaSy..."
                />
              </div>
            </div>

            {/* OpenAI Config */}
            <div className="glass-panel p-6 rounded-xl border border-zinc-800 space-y-4 shadow-[0_0_40px_rgba(34,197,94,0.02)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">OpenAI GPT</h3>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">GPT-4o Engine</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowKeys(s => ({ ...s, openai: !s.openai }))}
                  className="text-zinc-600 hover:text-zinc-400"
                >
                  {showKeys.openai ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">sk_live_secret</label>
                <input
                  type={showKeys.openai ? "text" : "password"}
                  value={localOpenAI}
                  onChange={(e) => setLocalOpenAI(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-xs font-mono text-emerald-500 focus:outline-none focus:border-brand-red/30"
                  placeholder="sk-..."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2 bg-white text-black font-bold text-xs rounded-lg flex items-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {saveStatus === 'idle' && <><Save size={14} /> Commit Changes</>}
              {saveStatus === 'saving' && <><div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Synchronizing...</>}
              {saveStatus === 'saved' && <><Save size={14} /> Config Secured</>}
            </button>
          </div>
        </section>

        <section className="pt-12 border-t border-zinc-800/50">
           <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-1">System Health</h2>
            <p className="text-zinc-500 text-xs font-mono">Real-time diagnostics from Nexus OS nodes.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Neural Throughput', val: '94.2 MB/s', color: 'emerald' },
              { label: 'Token Latency', val: '12ms', color: 'emerald' },
              { label: 'Agent Uptime', val: '99.99%', color: 'sky' },
              { label: 'Security Level', val: 'MAXIMUM', color: 'brand-red' },
            ].map((stat) => (
              <div key={stat.label} className="glass-panel p-4 rounded-lg border border-zinc-800/80">
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-2">{stat.label}</div>
                <div className={`text-sm font-mono font-bold tracking-tight text-${stat.color === 'brand-red' ? 'brand-red' : stat.color + '-400'}`}>
                  {stat.val}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
