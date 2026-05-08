import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore, NodeType } from './store';
import { AgentNode } from './components/AgentNode';
import { ToolNode, MemoryNode } from './components/MiscNodes';
import { Bot, Wrench, Database, Plus, Play, Save, Share2, Shield, X, Undo2, Redo2, Layers, Search, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  memory: MemoryNode,
};

const templates = [
  {
    type: 'tool' as NodeType,
    label: 'Data Fetcher',
    icon: <Search size={16} />,
    description: 'Pre-configured HTTP GET node',
    data: { action: 'Fetch', endpoint: 'https://api.example.com/data', method: 'GET', label: 'Data Fetcher' }
  },
  {
    type: 'agent' as NodeType,
    label: 'Text Summarizer',
    icon: <FileText size={16} />,
    description: 'AI Agent optimized for summaries',
    data: { label: 'Text Summarizer', model: 'gemini-1.5-pro', role: 'Summarizer' }
  },
  {
    type: 'agent' as NodeType,
    label: 'Image Generator',
    icon: <ImageIcon size={16} />,
    description: 'Multi-modal creativity agent',
    data: { label: 'Image Generator', model: 'gemini-1.5-flash', role: 'Artist' }
  },
];

function FlowInner() {
  const { 
    nodes, edges, 
    onNodesChange, onEdgesChange, onConnect, 
    setSelectedNode, selectedNodeId, 
    updateNodeData, addNode,
    undo, redo, undoStack, redoStack
  } = useStore();
  const navigate = useNavigate();
  const { screenToFlowPosition } = useReactFlow();
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const selectedNode = useMemo(() => 
    nodes.find(n => n.id === selectedNodeId),
  [nodes, selectedNodeId]);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onDragStart = (event: React.DragEvent, templateIndex: number) => {
    event.dataTransfer.setData('application/reactflow-template', templateIndex.toString());
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const templateIndexStr = event.dataTransfer.getData('application/reactflow-template');
      if (!templateIndexStr) return;

      const templateIndex = parseInt(templateIndexStr);
      const template = templates[templateIndex];

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Use the updated store addNode that accepts data
      addNode(template.type, position, template.data);
    },
    [screenToFlowPosition, addNode]
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Cinematic Header */}
      <header className="h-16 glass-panel border-b border-zinc-800 z-50 flex items-center justify-between px-6 shrink-0 shadow-2xl">
        <div 
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-red/20 rotate-3 transition-transform hover:scale-105 active:scale-95">
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
           <SidebarItem icon={<Layers size={20} />} label="Library" onClick={() => setShowLibrary(!showLibrary)} active={showLibrary} />
           <SidebarItem icon={<Bot size={20} />} label="Agent" onClick={() => addNode('agent', { x: 500, y: 300 })} />
           <SidebarItem icon={<Wrench size={20} />} label="Tool" onClick={() => addNode('tool', { x: 500, y: 300 })} />
           <SidebarItem icon={<Database size={20} />} label="Memory" onClick={() => addNode('memory', { x: 500, y: 300 })} />
           
           <div className="flex-1" />
           <div className="w-8 h-px bg-zinc-800" />
           <SidebarItem icon={<Shield size={20} />} label="Admin" onClick={() => navigate('/admin/login')} />
        </aside>

        {/* Node Library Panel */}
        <AnimatePresence>
          {showLibrary && (
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-72 h-full glass-panel border-r border-zinc-800 z-30 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Resource_Hub</h3>
                  <h2 className="text-xl font-bold mt-1 text-white">Node Library</h2>
                </div>
                <button 
                  onClick={() => setShowLibrary(false)}
                  className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-500"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {templates.map((template, idx) => (
                  <div 
                    key={idx}
                    draggable
                    onDragStart={(e) => onDragStart(e, idx)}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-brand-red group-hover:text-white transition-colors text-zinc-400">
                        {template.icon}
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-red transition-colors">{template.label}</h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono italic">{template.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[8px] uppercase tracking-tighter text-zinc-600 font-bold px-1.5 py-0.5 rounded border border-zinc-800">{template.type}</span>
                      <span className="text-[8px] text-zinc-700 font-mono">DRAG_TO_CANVAS</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg bg-brand-red/5 border border-brand-red/20">
                <p className="text-[10px] text-brand-red/80 font-mono leading-relaxed">
                   [ALPHA_NOTICE] Drag templates directly onto the viewport to initialize complex neural connections instantly.
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

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
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Panel position="top-left" className="flex flex-col gap-2 scale-90 origin-top-left ml-2">
              <button 
                onClick={undo} 
                disabled={undoStack.length === 0}
                className="w-10 h-10 glass-panel border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button 
                onClick={redo} 
                disabled={redoStack.length === 0}
                className="w-10 h-10 glass-panel border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </button>
            </Panel>

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
          {selectedNodeId && (
            <motion.aside 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 h-full glass-panel border-l border-zinc-800 z-40 p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Inspector_v1.0</h3>
                    <h2 className="text-xl font-bold mt-1 text-white">Node Properties</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                {selectedNode ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-mono text-zinc-500">Identifier</label>
                        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-400">
                          {selectedNode.id}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-mono text-zinc-500">Node Label</label>
                        <input 
                          type="text"
                          value={selectedNode.data.label || ''}
                          onChange={(e) => updateNodeData(selectedNodeId, { label: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-red/50 transition-colors"
                        />
                      </div>

                      {selectedNode.type === 'agent' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-zinc-500">Compute Model</label>
                            <select 
                              value={selectedNode.data.model || 'gemini-1.5-pro'}
                              onChange={(e) => updateNodeData(selectedNodeId, { model: e.target.value })}
                              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-red/50 transition-colors"
                            >
                              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                              <option value="gpt-4o">GPT-4o</option>
                              <option value="claude-3-opus">Claude 3 Opus</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-zinc-500">Neural Role</label>
                            <input 
                              type="text"
                              value={selectedNode.data.role || ''}
                              onChange={(e) => updateNodeData(selectedNodeId, { role: e.target.value })}
                              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-red/50 transition-colors"
                              placeholder="e.g. Architect, Research, Writer"
                            />
                          </div>
                        </>
                      )}

                      {selectedNode.type === 'tool' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-zinc-500">Action Type</label>
                            <input 
                              type="text"
                              value={selectedNode.data.action || ''}
                              onChange={(e) => updateNodeData(selectedNodeId, { action: e.target.value })}
                              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-red/50 transition-colors"
                              placeholder="e.g. Search, Fetch, Send"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-zinc-500">API Endpoint</label>
                            <input 
                              type="text"
                              value={selectedNode.data.endpoint || ''}
                              onChange={(e) => updateNodeData(selectedNodeId, { endpoint: e.target.value })}
                              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-red/50 transition-colors"
                              placeholder="https://api.example.com/v1/..."
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono text-zinc-500">HTTP Method</label>
                            <select 
                              value={selectedNode.data.method || 'GET'}
                              onChange={(e) => updateNodeData(selectedNodeId, { method: e.target.value })}
                              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-red/50 transition-colors"
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                              <option value="PUT">PUT</option>
                              <option value="DELETE">DELETE</option>
                              <option value="PATCH">PATCH</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-mono text-zinc-500">Execution Logs</label>
                        <div className="bg-black p-3 rounded border border-zinc-800 h-48 font-mono text-[10px] text-emerald-500/80 overflow-y-auto scrollbar-hide">
                          <p>[{new Date().toLocaleTimeString()}] Monitoring node integrity...</p>
                          <p>[{new Date().toLocaleTimeString()}] Ready for sync.</p>
                          <p className="animate-pulse">_</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-800 border-dashed text-center">
                    <p className="text-xs text-zinc-500 font-medium">Node data corrupted or not found.</p>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative w-10 h-10 flex items-center justify-center rounded-lg border transition-all active:scale-95 ${active ? 'border-brand-red/50 bg-brand-red/10 text-brand-red shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-transparent text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800/50'}`}
      title={label}
    >
      <div className={active ? 'text-brand-red' : 'group-hover:text-brand-red transition-colors'}>
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
