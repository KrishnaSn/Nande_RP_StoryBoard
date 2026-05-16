import { create } from 'zustand'
import { temporal } from 'zundo'
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
  applyEdgeChanges 
} from 'reactflow'
import { nanoid } from 'nanoid'

export type StoryNode = Node
export type StoryEdge = Edge

export interface Arc {
  id: string
  title: string
  description: string
  locked_by?: string
  locked_at?: string
}

interface ArcData {
  nodes: StoryNode[]
  edges: StoryEdge[]
}

interface StoryState {
  // Metadata
  arcs: Arc[]
  currentArcId: string
  arcGraphs: Record<string, ArcData>
  selectedNode: StoryNode | null
  hasInitialized: boolean
  isPresenting: boolean
  userId: string
  lockedBy: string | null
  
  // Computed (getters)
  getNodes: () => StoryNode[]
  getEdges: () => StoryEdge[]

  // Actions (LOCAL ONLY)
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setSelectedNode: (node: StoryNode | null) => void
  addNode: (type: string, position?: { x: number, y: number }, initialData?: any) => void
  updateNodeData: (nodeId: string, data: any) => void
  deleteNode: (nodeId: string) => void
  
  // Choice Actions
  addChoiceOption: (nodeId: string) => void
  removeChoiceOption: (nodeId: string, index: number) => void
  
  // Arc Actions (LOCAL + SYNC)
  addArc: (id: string, title: string, description: string) => Promise<void>
  updateArc: (id: string, data: Partial<Arc>) => void
  deleteArc: (id: string) => Promise<void>
  setCurrentArc: (id: string) => void

  // UI Actions
  togglePresentMode: () => void

  // Backend Synchronization (MANUAL ONLY)
  loadArcs: () => Promise<void>
  saveCurrentArc: () => Promise<void>
  acquireLock: (arcId: string) => Promise<boolean>
  releaseLock: (arcId: string) => Promise<void>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Get or generate persistent User ID
const getUserId = () => {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('nande_user_id')
  if (!id) {
    id = `user-${nanoid(5)}`
    localStorage.setItem('nande_user_id', id)
  }
  return id
}

export const useStoryStore = create<StoryState>()(
  temporal((set, get) => ({
    arcs: [],
    currentArcId: '',
    arcGraphs: {},
    selectedNode: null,
    hasInitialized: false,
    isPresenting: false,
    userId: getUserId(),
    lockedBy: null,

    loadArcs: async () => {
      try {
        const res = await fetch(`${API_URL}/arcs`)
        if (!res.ok) throw new Error(`Backend fetch failed with status: ${res.status}`)
        const data = await res.json()
        
        if (data && data.length > 0) {
          const loadedGraphs: Record<string, ArcData> = {}
          const loadedArcs = data.map((ep: any) => {
            loadedGraphs[ep.id] = { 
              nodes: typeof ep.nodes === 'string' ? JSON.parse(ep.nodes) : (ep.nodes || []), 
              edges: typeof ep.edges === 'string' ? JSON.parse(ep.edges) : (ep.edges || []) 
            }
            return { 
              id: ep.id, 
              title: ep.title, 
              description: ep.description,
              locked_by: ep.locked_by,
              locked_at: ep.locked_at
            }
          })

          const currentId = get().currentArcId || loadedArcs[0].id
          const activeArc = loadedArcs.find((a: Arc) => a.id === currentId)

          set({ 
            arcs: loadedArcs, 
            arcGraphs: loadedGraphs,
            hasInitialized: true,
            currentArcId: currentId,
            lockedBy: activeArc?.locked_by || null
          })
          console.log('📦 StoryBoard: Arcs synchronized from cloud.')
        } else if (!get().hasInitialized) {
          const defaultId = `ep-initial`
          const defaultArc = { id: defaultId, title: 'The Prologue', description: 'The beginning of your story.' }
          set({
            arcs: [defaultArc],
            arcGraphs: { [defaultId]: { nodes: [], edges: [] } },
            currentArcId: defaultId,
            hasInitialized: true
          })
          fetch(`${API_URL}/arcs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(defaultArc)
          })
        }
      } catch (error) {
        console.error('❌ StoryBoard: Cloud sync failed. Working in local mode.', error)
      }
    },

    acquireLock: async (arcId: string) => {
       try {
         const res = await fetch(`${API_URL}/arcs/${arcId}/lock`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ user_id: get().userId })
         })
         const data = await res.json()
         if (data.status === 'acquired') {
           set({ lockedBy: get().userId })
           return true
         } else {
           set({ lockedBy: data.locked_by })
           return false
         }
       } catch (error) {
         console.error('Lock acquisition failed:', error)
         return false
       }
    },

    releaseLock: async (arcId: string) => {
       try {
         await fetch(`${API_URL}/arcs/${arcId}/unlock`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ user_id: get().userId })
         })
         set({ lockedBy: null })
       } catch (error) {
         console.error('Lock release failed:', error)
       }
    },

    saveCurrentArc: async () => {
      const state = get()
      const currentArc = state.arcs.find(arc => arc.id === state.currentArcId)
      const graph = state.arcGraphs[state.currentArcId]
      
      if (!currentArc || !graph) return

      try {
        console.log(`📡 StoryBoard: Publishing Arc "${currentArc.title}"...`)
        
        const optimizedNodes = graph.nodes.map(n => ({
          ...n,
          meta: { 
            character: n.data.character,
            type: n.type,
            length: n.data.description?.length || 0,
            has_branches: (n.data.options?.length || 0) > 0
          }
        }))

        const payload = { 
          nodes: optimizedNodes, 
          edges: graph.edges,
          title: currentArc.title,
          description: currentArc.description
        }

        let updateRes = await fetch(`${API_URL}/arcs/${currentArc.id}?user_id=${state.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        // CRITICAL FALLBACK: If Arc doesn't exist on server, create it first
        if (updateRes.status === 404) {
          console.warn('⚠️ Arc not found on server, attempting to re-create...')
          await fetch(`${API_URL}/arcs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentArc.id, title: currentArc.title, description: currentArc.description })
          })
          // Retry the update
          updateRes = await fetch(`${API_URL}/arcs/${currentArc.id}?user_id=${state.userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        }

        if (updateRes.ok) {
          console.log('✅ StoryBoard: Publish complete.')
          set({ lastLocalEdit: 0 })
          get().loadArcs()
          window.dispatchEvent(new CustomEvent('arc-sync-complete'))
        } else if (updateRes.status === 423) {
           alert("Sync Locked: Another contributor is currently editing this Arc.")
           get().loadArcs()
        } else {
           const errText = await updateRes.text()
           alert(`Sync Failed: Server returned error ${updateRes.status}. Check console for details.`)
           console.error('Server error:', errText)
        }
      } catch (error) {
        console.error('❌ StoryBoard: Publish failed.', error)
        alert('Network Error: Could not connect to the cloud. Please check your internet.')
      }
    },

    addArc: async (id: string, title: string, description: string) => {
      const newArc = { id, title, description }
      set({ 
        arcs: [...get().arcs, newArc],
        arcGraphs: { ...get().arcGraphs, [id]: { nodes: [], edges: [] } },
        currentArcId: id
      })
      fetch(`${API_URL}/arcs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArc)
      }).catch(console.error)
    },

    updateArc: (id: string, data: Partial<Arc>) => {
      set({ arcs: get().arcs.map(arc => arc.id === id ? { ...arc, ...data } : arc) })
    },

    deleteArc: async (id: string) => {
      const { arcs, currentArcId, arcGraphs } = get()
      const newArcs = arcs.filter(arc => arc.id !== id)
      
      const newGraphs = { ...arcGraphs }
      delete newGraphs[id]

      set({ 
        arcs: newArcs, 
        arcGraphs: newGraphs, 
        currentArcId: currentArcId === id ? (newArcs[0]?.id || '') : currentArcId 
      })
      fetch(`${API_URL}/arcs/${id}`, { method: 'DELETE' }).catch(console.error)
    },

    setCurrentArc: (id: string) => {
      const arc = get().arcs.find(a => a.id === id)
      set({ currentArcId: id, selectedNode: null, lockedBy: arc?.locked_by || null })
    },

    togglePresentMode: () => {
      set({ isPresenting: !get().isPresenting })
    },

    // GRAPH ENGINE (100% LOCAL FOR SPEED)
    getNodes: () => {
      const state = get()
      return state.arcGraphs[state.currentArcId]?.nodes || []
    },

    getEdges: () => {
      const state = get()
      return state.arcGraphs[state.currentArcId]?.edges || []
    },

    onNodesChange: (changes: NodeChange[]) => {
      const { currentArcId, arcGraphs } = get()
      const currentGraph = arcGraphs[currentArcId]
      if (!currentGraph) return

      set({
        arcGraphs: {
          ...arcGraphs,
          [currentArcId]: {
            ...currentGraph,
            nodes: applyNodeChanges(changes, currentGraph.nodes),
          }
        }
      })
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      const { currentArcId, arcGraphs } = get()
      const currentGraph = arcGraphs[currentArcId]
      if (!currentGraph) return

      set({
        arcGraphs: {
          ...arcGraphs,
          [currentArcId]: {
            ...currentGraph,
            edges: applyEdgeChanges(changes, currentGraph.edges),
          }
        }
      })
    },

    onConnect: (connection: Connection) => {
      const { currentArcId, arcGraphs } = get()
      const currentGraph = arcGraphs[currentArcId]
      if (!currentGraph) return

      const sourceNode = currentGraph.nodes.find(n => n.id === connection.source)
      const edgeColor = sourceNode?.data?.color || '#ef4444'

      set({
        arcGraphs: {
          ...arcGraphs,
          [currentArcId]: {
            ...currentGraph,
            edges: addEdge(
              { ...connection, animated: true, style: { stroke: edgeColor, strokeWidth: 2.5 } }, 
              currentGraph.edges
            ),
          }
        }
      })
    },

    setSelectedNode: (node: StoryNode | null) => {
      set({ selectedNode: node })
    },

    addNode: (type: string, position?: { x: number, y: number }, initialData?: any) => {
      const { currentArcId, arcGraphs } = get()
      if (!currentArcId || !arcGraphs[currentArcId]) return

      const currentGraph = arcGraphs[currentArcId]
      const id = `${type}-${nanoid(5)}`
      
      const newNode: StoryNode = {
        id,
        type: type === 'choice' ? 'choice' : 'characterScene',
        position: position || { x: 100, y: 100 },
        data: { 
          character: initialData?.character || 'System',
          color: initialData?.color || '#ffffff',
          title: type === 'choice' ? 'Decision Point' : 'New Scene',
          description: '',
          options: type === 'choice' ? ['Option A', 'Option B'] : undefined,
          ...initialData
        },
      }

      set({
        arcGraphs: {
          ...arcGraphs,
          [currentArcId]: {
            ...currentGraph,
            nodes: [...currentGraph.nodes, newNode],
          }
        }
      })
    },

    updateNodeData: (nodeId: string, data: any) => {
      const { currentArcId, arcGraphs } = get()
      const currentGraph = arcGraphs[currentArcId]
      if (!currentGraph) return

      set({
        arcGraphs: {
          ...arcGraphs,
          [currentArcId]: {
            ...currentGraph,
            nodes: currentGraph.nodes.map((node) => 
              node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
            ),
          }
        }
      })
    },

    deleteNode: (nodeId: string) => {
      const { currentArcId, arcGraphs } = get()
      const currentGraph = arcGraphs[currentArcId]
      if (!currentGraph) return

      set({
        arcGraphs: {
          ...arcGraphs,
          [currentArcId]: {
            nodes: currentGraph.nodes.filter((node) => node.id !== nodeId),
            edges: currentGraph.edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId
            ),
          }
        },
        selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
      })
    },

    addChoiceOption: (nodeId: string) => {
      const { currentArcId, arcGraphs } = get()
      const currentGraph = arcGraphs[currentArcId]
      if (!currentGraph) return
      
      set({
        arcGraphs: {
          ...arcGraphs,
          [currentArcId]: {
            ...currentGraph,
            nodes: currentGraph.nodes.map((node) => {
              if (node.id === nodeId) {
                const options = [...(node.data.options || []), `New Option ${(node.data.options?.length || 0) + 1}`]
                return { ...node, data: { ...node.data, options } }
              }
              return node
            }),
          }
        }
      })
    },

    removeChoiceOption: (nodeId: string, index: number) => {
      const { currentArcId, arcGraphs } = get()
      const currentGraph = arcGraphs[currentArcId]
      if (!currentGraph) return
      
      const newNodes = currentGraph.nodes.map((node) => {
        if (node.id === nodeId) {
          const options = (node.data.options || []).filter((_: any, i: number) => i !== index)
          return { ...node, data: { ...node.data, options } }
        }
        return node
      })
      
      set({
        arcGraphs: {
          ...arcGraphs,
          [currentArcId]: {
            nodes: newNodes,
            edges: currentGraph.edges.filter(edge => !(edge.source === nodeId && edge.sourceHandle === `option-${index}`))
          }
        }
      })
    }
  }))
)
