import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Lock, Mail, Key, ChevronRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-red/10 border border-brand-red/20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <Lock className="text-brand-red" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Terminal</h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] mt-2">Authentication Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] items-center gap-2 flex uppercase font-mono text-zinc-500 tracking-wider">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red/50 transition-colors"
              placeholder="admin@mycanvaslab.ai"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] items-center gap-2 flex uppercase font-mono text-zinc-500 tracking-wider">
              <Key size={12} /> Access Secret
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red/50 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-brand-red text-[10px] font-mono text-center uppercase"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-brand-red/20"
          >
            Authenticate <ChevronRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors"
          >
            ← Return to Canvas
          </button>
        </div>
      </motion.div>
    </div>
  );
}
