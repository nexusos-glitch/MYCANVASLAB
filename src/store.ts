import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

export type NodeType = 'agent' | 'tool' | 'memory' | 'trigger';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: 'info' | 'warning' | 'security';
}

export interface AppState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  isAuthenticated: boolean;
  apiKeys: {
    gemini?: string;
    openai?: string;
  };
  auditLogs: AuditLog[];
  undoStack: { nodes: Node[]; edges: Edge[] }[];
  redoStack: { nodes: Node[]; edges: Edge[] }[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSelectedNode: (nodeId: string | null) => void;
  addNode: (type: NodeType, position: { x: number, y: number }, data?: any) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateApiKeys: (keys: { gemini?: string; openai?: string }) => void;
  addAuditLog: (action: string, details: string, status: AuditLog['status']) => void;
}

export const useStore = create<AppState>((set, get) => ({
  nodes: [
    {
      id: 'node-1',
      type: 'agent',
      position: { x: 250, y: 50 },
      data: { label: 'Primary AI Agent', model: 'gemini-1.5-pro', role: 'Architect' },
    },
  ],
  edges: [],
  selectedNodeId: null,
  isAuthenticated: false,
  apiKeys: {
    gemini: '',
    openai: '',
  },
  auditLogs: [],
  undoStack: [],
  redoStack: [],

  takeSnapshot: () => {
    const { nodes, edges, undoStack } = get();
    // Only save if different from last snapshot
    if (undoStack.length > 0) {
      const last = undoStack[undoStack.length - 1];
      if (JSON.stringify(last.nodes) === JSON.stringify(nodes) && JSON.stringify(last.edges) === JSON.stringify(edges)) {
        return;
      }
    }
    set({
      undoStack: [...undoStack, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }].slice(-50),
      redoStack: [],
    });
  },

  undo: () => {
    const { nodes, edges, undoStack, redoStack } = get();
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      undoStack: newUndoStack,
      redoStack: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...redoStack].slice(0, 50),
    });
  },

  redo: () => {
    const { nodes, edges, undoStack, redoStack } = get();
    if (redoStack.length === 0) return;

    const next = redoStack[0];
    const newRedoStack = redoStack.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      redoStack: newRedoStack,
      undoStack: [...undoStack, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }].slice(-50),
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    // Only snapshot on "end" of drag or specific changes to avoid excessive snapshots
    const isSignificant = changes.some(c => c.type === 'remove' || (c.type === 'position' && !c.dragging));
    if (isSignificant) get().takeSnapshot();

    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    if (changes.some(c => c.type === 'remove')) get().takeSnapshot();
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    get().takeSnapshot();
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setSelectedNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  addNode: (type: NodeType, position: { x: number, y: number }, data?: any) => {
    get().takeSnapshot();
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position,
      data: { 
        label: data?.label || `${type.charAt(0).toUpperCase() + type.slice(1)} ${get().nodes.length + 1}`,
        status: 'idle',
        ...data
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId: string, data: any) => {
    // For property updates, we might want to take a snapshot before the change
    // but often it's better to snapshot on change end.
    // For now, let's snapshot before the change if it's the first in a series.
    // Simplifying: snapshot on every update for now, maybe throttle later.
    get().takeSnapshot();
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },

  addAuditLog: (action, details, status) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
      status,
    };
    set({ auditLogs: [newLog, ...get().auditLogs].slice(0, 50) });
  },

  login: (email, pass) => {
    if (email === 'mycanvas@utubemail.com' && pass === 'admin123') {
      set({ isAuthenticated: true });
      get().addAuditLog('User Login', `Session started for ${email}`, 'security');
      return true;
    }
    get().addAuditLog('Login Failed', `Unauthorized attempt from ${email}`, 'security');
    return false;
  },

  logout: () => {
    get().addAuditLog('User Logout', 'System session terminated by user', 'info');
    set({ isAuthenticated: false });
  },

  updateApiKeys: (keys) => {
    get().addAuditLog('API Update', 'Credentials modified in vault', 'warning');
    set({ apiKeys: { ...get().apiKeys, ...keys } });
  },
}));
