import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Wrench, Database, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

export const ToolNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "w-56 glass-panel rounded-lg overflow-hidden transition-all duration-300",
      selected ? "border-sky-500 ring-1 ring-sky-500/50 scale-[1.02]" : "border-zinc-800"
    )}>
      <div className="bg-zinc-800/80 px-3 py-2 flex items-center justify-between border-b border-zinc-700/50">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-sky-500/10 rounded border border-sky-500/20">
            <Wrench size={14} className="text-sky-400" />
          </div>
          <span className="text-[11px] font-mono font-medium tracking-tight uppercase text-zinc-400">Function Tool</span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="text-xs font-medium text-zinc-100">{data.label}</div>
        <div className="mt-2 text-[10px] text-zinc-500 font-mono leading-relaxed truncate">
          GET https://api.supabase.co/v1/...
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-sky-500 !border-none" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-sky-500 !border-none" />
    </div>
  );
});

export const MemoryNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "w-48 glass-panel rounded-lg overflow-hidden transition-all duration-300 border-dashed border-2",
      selected ? "border-emerald-500 ring-1 ring-emerald-500/50 scale-[1.02]" : "border-zinc-800/50"
    )}>
      <div className="px-3 py-3 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-full">
          <Database size={16} className="text-emerald-500" />
        </div>
        <div>
          <div className="text-xs font-semibold text-zinc-100">Long-term Memory</div>
          <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">Vector Storage</div>
        </div>
      </div>
      
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-emerald-500 !border-none" />
    </div>
  );
});

ToolNode.displayName = 'ToolNode';
MemoryNode.displayName = 'MemoryNode';
