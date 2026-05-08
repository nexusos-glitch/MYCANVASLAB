import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot, Cpu, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export const AgentNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "w-64 glass-panel rounded-lg overflow-hidden transition-all duration-300",
      selected ? "border-brand-red ring-1 ring-brand-red/50 node-glow scale-[1.02]" : "border-zinc-800"
    )}>
      <div className="bg-zinc-800/80 px-3 py-2 flex items-center justify-between border-b border-zinc-700/50">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-brand-red/10 rounded border border-brand-red/20">
            <Bot size={14} className="text-brand-red" />
          </div>
          <span className="text-[11px] font-mono font-medium tracking-tight uppercase text-zinc-400">AI Agent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          <span className="text-[9px] font-mono text-brand-red/80 uppercase">Active</span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Instance ID</label>
          <div className="text-sm font-medium text-white">{data.label}</div>
        </div>
        
        <div className="flex items-center gap-4 py-1">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-1">
              <Cpu size={10} /> Model
            </label>
            <div className="text-[11px] text-zinc-300 font-mono">{data.model || 'GEMINI-PRO'}</div>
          </div>
          <div className="space-y-1 border-l border-zinc-800 pl-4">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-1">
              <Activity size={10} /> Latency
            </label>
            <div className="text-[11px] text-zinc-300 font-mono">24ms</div>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 bg-black/20 border-t border-zinc-800/50 flex justify-between items-center text-[10px] font-mono text-zinc-500 italic">
        <span>Ready for prompt...</span>
        <Zap size={10} className="text-yellow-500/50" />
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-brand-red !border-none" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-brand-red !border-none" />
    </div>
  );
});

AgentNode.displayName = 'AgentNode';
