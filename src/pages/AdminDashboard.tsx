import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Shield, Save, Eye, EyeOff, LayoutGrid, LogOut, Cpu, Bot, BarChart3, Activity, Zap, History, FileText, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const toolStats = [
  { name: 'Supabase', calls: 450, color: '#3b82f6' },
  { name: 'WebSearch', calls: 320, color: '#ef4444' },
  { name: 'VectorDB', calls: 580, color: '#10b981' },
  { name: 'ImageGen', calls: 150, color: '#f59e0b' },
  { name: 'APIBridge', calls: 210, color: '#8b5cf6' },
];

export default function AdminDashboard() {
  const { apiKeys, updateApiKeys, logout, isAuthenticated, auditLogs } = useStore();
  const [localGemini, setLocalGemini] = useState(apiKeys.gemini || '');
  const [localOpenAI, setLocalOpenAI] = useState(apiKeys.openai || '');
  const [showKeys, setShowKeys] = useState({ gemini: false, openai: false });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Protect route
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = React.useCallback(() => {
    // Clear sensitive local state
    setLocalGemini('');
    setLocalOpenAI('');
    logout();
    navigate('/');
  }, [logout, navigate]);

  // Inactivity / Security Auto-clear
  React.useEffect(() => {
    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // Automatically log out after 5 minutes of inactivity
      timeoutId = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Start initial timer

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleLogout]);

  const handleSave = () => {
    setSaveStatus('saving');
    updateApiKeys({ gemini: localGemini, openai: localOpenAI });
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
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
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                  <span>Gemini API Key</span>
                  <span className="text-brand-red opacity-50 font-bold">[PROTOCOL:ALPHA]</span>
                </label>
                <div className="relative group cyber-accent-corners text-brand-red">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red/20 to-orange-600/20 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
                  <div className="scanline-overlay"></div>
                  <input
                    type={showKeys.gemini ? "text" : "password"}
                    value={localGemini}
                    onChange={(e) => setLocalGemini(e.target.value)}
                    className="relative w-full bg-black/90 border border-zinc-800/80 rounded-lg pl-4 pr-10 py-3 text-xs font-mono text-brand-red placeholder:text-zinc-800 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/30 transition-all holographic-input z-10"
                    placeholder="ENTER_GEMINI_PROTOCOL_KEY_..."
                  />
                  <button 
                    type="button"
                    onClick={() => setShowKeys(s => ({ ...s, gemini: !s.gemini }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-brand-red p-1 transition-colors z-20"
                  >
                    {showKeys.gemini ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
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
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                  <span>OpenAI API Key</span>
                  <span className="text-emerald-500 opacity-50 font-bold">[PROTOCOL:OMEGA]</span>
                </label>
                <div className="relative group cyber-accent-corners text-emerald-500">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
                  <div className="scanline-overlay"></div>
                  <input
                    type={showKeys.openai ? "text" : "password"}
                    value={localOpenAI}
                    onChange={(e) => setLocalOpenAI(e.target.value)}
                    className="relative w-full bg-black/90 border border-zinc-800/80 rounded-lg pl-4 pr-10 py-3 text-xs font-mono text-emerald-400 placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all holographic-input z-10"
                    placeholder="ENTER_OPENAI_PROTOCOL_KEY_..."
                  />
                  <button 
                    type="button"
                    onClick={() => setShowKeys(s => ({ ...s, openai: !s.openai }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-emerald-400 p-1 transition-colors z-20"
                  >
                    {showKeys.openai ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
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
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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

          <div className="glass-panel p-8 rounded-xl border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="text-brand-red" size={20} />
                  Tool Usage Analytics
                </h3>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Global call frequency per tool instance</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Total Calls</div>
                  <div className="text-lg font-bold text-white tracking-tighter">1,710</div>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Efficiency</div>
                  <div className="text-lg font-bold text-emerald-500 tracking-tighter">94.8%</div>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: '1px solid #27272a', 
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
                    {toolStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-800/50">
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={12} className="text-yellow-500" /> Hot Tool
                </h4>
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                   <div className="text-sm font-bold text-emerald-400">VectorDB Bridge</div>
                   <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">580 calls in last 24h</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={12} className="text-sky-500" /> Performance
                </h4>
                <div className="p-4 rounded-lg bg-sky-500/5 border border-sky-500/10">
                   <div className="text-sm font-bold text-sky-400">High Reliability</div>
                   <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">Zero timeouts detected</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={12} className="text-brand-red" /> Alert Stream
                </h4>
                <div className="p-4 rounded-lg bg-brand-red/5 border border-brand-red/10">
                   <div className="text-sm font-bold text-brand-red/80">API Latency Warning</div>
                   <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">WebSearch responding slow</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <History className="text-brand-red" size={20} />
                <h2 className="text-lg font-bold text-white">System Audit Log</h2>
              </div>
              
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={14} className="text-zinc-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/30 transition-all"
                />
              </div>
            </div>
            
            <div className="glass-panel rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-6 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Timestamp</th>
                    <th className="px-6 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Action</th>
                    <th className="px-6 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Details</th>
                    <th className="px-6 py-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {auditLogs.filter(log => 
                    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    log.details.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-xs text-zinc-600 font-mono italic">
                        {searchTerm ? "No matching records found." : "No temporal security records detected in this interval."}
                      </td>
                    </tr>
                  ) : (
                    auditLogs
                      .filter(log => 
                        log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        log.details.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-zinc-500">{log.timestamp}</td>
                        <td className="px-6 py-4 text-xs font-bold text-zinc-200">{log.action}</td>
                        <td className="px-6 py-4 text-xs text-zinc-400">{log.details}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-tighter ${
                            log.status === 'security' ? 'bg-brand-red/10 text-brand-red border border-brand-red/20' :
                            log.status === 'warning' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                            'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
