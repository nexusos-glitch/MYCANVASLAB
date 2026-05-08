import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel,
  BackgroundVariant,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from './store';
import { AgentNode } from './components/AgentNode';
import { ToolNode, MemoryNode } from './components/MiscNodes';
import { Bot, Wrench, Database, Plus, Play, Save, Share2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  memory: MemoryNode,
};

function FlowInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNode, addNode } = useStore();
  const navigate = useNavigate();

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Cinematic Header */}
      <header className="h-16 glass-panel border-b border-zinc-800 z-50 flex items-center justify-between px-6 shrink-0 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-red/20 rotate-3">
            <span className="font-bold text-xl text-white tracking-tighter italic">C</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white leading-tight">MyCanvasLab</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">System Operational.v1.2.4</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-800 transition-colors text-xs font-medium text-zinc-300">
            <Save size={14} /> <span>Autosaved</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-800 transition-colors text-xs font-medium text-zinc-300">
            <Share2 size={14} /> <span>Deploy</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-brand-red hover:bg-brand-red/90 transition-all text-xs font-bold text-white shadow-lg shadow-brand-red/20 active:scale-95">
            <Play size={14} fill="white" /> <span>EXECUTE</span>
          </button>
          <div className="w-px h-6 bg-zinc-800 mx-2" />
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Hardware Sidebar */}
        <aside className="w-16 h-full glass-panel border-r border-zinc-800 z-40 flex flex-col items-center py-6 gap-6">
           <SidebarItem icon={<Plus size={20} />} label="Add" onClick={() => addNode('agent', { x: 500, y: 300 })} />
           <div className="w-8 h-px bg-zinc-800" />
           <SidebarItem icon={<Bot size={20} />} label="Agent" onClick={() => addNode('agent', { x: 500, y: 300 })} />
           <SidebarItem icon={<Wrench size={20} />} label="Tool" onClick={() => addNode('tool', { x: 500, y: 300 })} />
           <SidebarItem icon={<Database size={20} />} label="Memory" onClick={() => addNode('memory', { x: 500, y: 300 })} />
           
           <div className="flex-1" />
           <div className="w-8 h-px bg-zinc-800" />
           <SidebarItem icon={<Shield size={20} />} label="Admin" onClick={() => navigate('/admin/login')} />
        </aside>

        <main className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background variant={BackgroundVariant.Dots} gap={30} size={1} color="#27272a" />
            <Controls className="!glass-panel !border-zinc-800" />
            <Panel position="bottom-right" className="glass-panel p-4 rounded-lg border border-zinc-800 mb-4 mr-4">
               <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Canvas Diagnostics</div>
               <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-zinc-400">Nodes: {nodes.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-sky-500" />
                    <span className="text-zinc-400">Edges: {edges.length}</span>
                  </div>
               </div>
            </Panel>
          </ReactFlow>
        </main>

        {/* Property Inspector */}
        <AnimatePresence>
          <motion.aside 
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="w-80 h-full glass-panel border-l border-zinc-800 z-40 p-6 overflow-y-auto"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Inspector_v1.0</h3>
                <h2 className="text-xl font-bold mt-1 text-white">Node Properties</h2>
              </div>

              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800 border-dashed text-center">
                 <p className="text-xs text-zinc-500 font-medium">Select a node to inspect parameters</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono text-zinc-500">System Logs</label>
                  <div className="bg-black p-3 rounded border border-zinc-800 h-48 font-mono text-[10px] text-emerald-500/80 overflow-y-auto scrollbar-hide">
                    <p>[09:24:01] Initializing neural bridge...</p>
                    <p>[09:24:02] Establishing RPC connection to node-agent-1...</p>
                    <p>[09:24:04] Authentication handshake success.</p>
                    <p className="animate-pulse">_</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group relative w-10 h-10 flex items-center justify-center rounded-lg border border-transparent hover:border-zinc-700 hover:bg-zinc-800/50 transition-all active:scale-95"
      title={label}
    >
      <div className="text-zinc-500 group-hover:text-brand-red transition-colors">
        {icon}
      </div>
      <div className="absolute left-14 invisible group-hover:visible glass-panel px-2 py-1 rounded text-[10px] uppercase font-mono tracking-wider whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}
