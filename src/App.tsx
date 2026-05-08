/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FlowCanvas from './FlowCanvas';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [bootText, setBootText] = useState('Initializing Terminal...');

  useEffect(() => {
    const sequence = [
      { text: 'Loading Neural Kernels...', delay: 800 },
      { text: 'Synchronizing Canvas Environment...', delay: 1600 },
      { text: 'Establising RPC Bridge...', delay: 2400 },
      { text: 'MyCanvasLab v1.2.4 Ready', delay: 3000 },
    ];

    sequence.forEach((item, index) => {
      setTimeout(() => {
        setBootText(item.text);
        if (index === sequence.length - 1) {
          setTimeout(() => setBooting(false), 800);
        }
      }, item.delay);
    });
  }, []);

  return (
    <div className="w-full h-screen bg-black select-none">
      <AnimatePresence mode="wait">
        {booting ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: 'circIn' }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-64 h-1 bg-zinc-900 rounded-full overflow-hidden mb-8">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.5, ease: 'easeInOut' }}
                className="h-full bg-brand-red shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              />
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-brand-red rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                <span className="font-bold text-3xl text-white italic">C</span>
              </div>
              <motion.p 
                key={bootText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500"
              >
                {bootText}
              </motion.p>
            </div>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between text-[8px] font-mono text-zinc-800 uppercase tracking-widest">
              <span>Secure Shell Encrypted</span>
              <span>Nexus Operating System 2.0</span>
              <span>© 2026 MyCanvasLab Ops.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <FlowCanvas />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
