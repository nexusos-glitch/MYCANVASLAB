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

export interface AppState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSelectedNode: (nodeId: string | null) => void;
  addNode: (type: NodeType, position: { x: number, y: number }) => void;
  updateNodeData: (nodeId: string, data: any) => void;
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

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setSelectedNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  addNode: (type: NodeType, position: { x: number, y: number }) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position,
      data: { 
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${get().nodes.length + 1}`,
        status: 'idle'
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId: string, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
}));
