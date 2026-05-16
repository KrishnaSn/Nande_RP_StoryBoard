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

interface Episode {
  id: string
  title: string
  description: string
}

interface CharacterAsset {
  id: string
  name: string
  image: string
  role?: string
  personality?: string
}

interface EpisodeData {
  nodes: StoryNode[]
  edges: StoryEdge[]
}

interface StoryState {
  // Metadata
  episodes: Episode[]
  currentEpisodeId: string
  episodeGraphs: Record<string, EpisodeData>
  characterAssets: CharacterAsset[]
  selectedNode: StoryNode | null
  currentLayer: string
  
  // Computed (getters)
  getNodes: () => StoryNode[]
  getEdges: () => StoryEdge[]

  // Actions
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
  
  // Episode Actions
  addEpisode: (id: string, title: string, description: string) => void
  updateEpisode: (id: string, data: Partial<Episode>) => void
  deleteEpisode: (id: string) => void
  setCurrentEpisode: (id: string) => void

  // Character Asset Actions
  addCharacterAsset: (asset: CharacterAsset) => void
  saveCharacterAsset: (asset: CharacterAsset) => Promise<void>
  uploadImage: (file: File) => Promise<string>
  loadCharacters: () => Promise<void>

  // Layer Actions
  setLayer: (layer: string) => void

  // Backend Integration
  loadEpisodes: () => Promise<void>
  saveCurrentEpisode: () => Promise<void>
}

const initialEpisodeId = 'ep-1'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'

export const useStoryStore = create<StoryState>()(
  temporal((set, get) => ({
    episodes: [],
    currentEpisodeId: '',
    episodeGraphs: {},
    characterAssets: [],
    selectedNode: null,
    currentLayer: 'Story Graph',

    loadCharacters: async () => {
      try {
        const res = await fetch(`${API_URL}/characters`)
        if (res.ok) {
          const data = await res.json()
          set({ characterAssets: data })
        }
      } catch (error) {
        console.error('Failed to load characters:', error)
      }
    },

    saveCharacterAsset: async (asset: CharacterAsset) => {
      try {
        const res = await fetch(`${API_URL}/characters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(asset)
        })
        if (res.ok) {
          const newAsset = await res.json()
          set({ characterAssets: [...get().characterAssets, newAsset] })
        }
      } catch (error) {
        console.error('Failed to save character:', error)
      }
    },

    uploadImage: async (file: File) => {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        })

        if (res.ok) {
          const data = await res.json()
          return data.url
        }
        throw new Error('Upload failed')
      } catch (error) {
        console.error('Failed to upload image:', error)
        throw error
      }
    },


    loadEpisodes: async () => {
      try {
        // Load characters first
        await get().loadCharacters()

        const res = await fetch(`${API_URL}/episodes`)
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        
        if (data && data.length > 0) {
          const loadedGraphs: Record<string, EpisodeData> = {}
          const loadedEpisodes = data.map((ep: any) => {
            loadedGraphs[ep.id] = { nodes: ep.nodes || [], edges: ep.edges || [] }
            return { id: ep.id, title: ep.title, description: ep.description }
          })

          set({ 
            episodes: loadedEpisodes, 
            episodeGraphs: loadedGraphs,
            currentEpisodeId: loadedEpisodes[0].id
          })
        } else {
          // If no episodes, create a default one
          const defaultId = 'ep-1'
          set({
            episodes: [{ id: defaultId, title: 'The Prologue', description: 'The beginning.' }],
            episodeGraphs: { [defaultId]: { nodes: [], edges: [] } },
            currentEpisodeId: defaultId
          })
        }
      } catch (error) {
        console.error('Failed to load episodes from backend:', error)
      }
    },

    saveCurrentEpisode: async () => {
      const state = get()
      const currentEp = state.episodes.find(ep => ep.id === state.currentEpisodeId)
      const graph = state.episodeGraphs[state.currentEpisodeId]
      
      if (!currentEp || !graph) return

      try {
        const updateRes = await fetch(`${API_URL}/episodes/${currentEp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes: graph.nodes, edges: graph.edges })
        })

        if (!updateRes.ok && updateRes.status === 404) {
          await fetch(`${API_URL}/episodes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentEp.id, title: currentEp.title, description: currentEp.description })
          })
          await fetch(`${API_URL}/episodes/${currentEp.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nodes: graph.nodes, edges: graph.edges })
          })
        }
      } catch (error) {
        console.error('Failed to save episode:', error)
      }
    },
// ... (getNodes and other methods)
    deleteEpisode: (id: string) => {
      const { episodes, currentEpisodeId, episodeGraphs } = get()
      const newEpisodes = episodes.filter(ep => ep.id !== id)
      
      const newGraphs = { ...episodeGraphs }
      delete newGraphs[id]

      let newCurrentId = currentEpisodeId
      if (currentEpisodeId === id) {
        newCurrentId = newEpisodes.length > 0 ? newEpisodes[0].id : ''
      }

      set({ 
        episodes: newEpisodes, 
        episodeGraphs: newGraphs, 
        currentEpisodeId: newCurrentId 
      })
      
      // Note: Ideally we should call the backend to delete as well
      fetch(`${API_URL}/episodes/${id}`, { method: 'DELETE' }).catch(console.error)
    },

    getNodes: () => {
      const state = get()
      const nodes = state.episodeGraphs[state.currentEpisodeId]?.nodes || []
      
      if (state.currentLayer === 'Logic Layer') {
        return nodes.filter(n => n.type === 'choice' || n.type === 'dialogue')
      }
      if (state.currentLayer === 'Cinematic Path') {
        return nodes.filter(n => n.type === 'scene' || n.type === 'dialogue')
      }
      if (state.currentLayer === 'Director Notes') {
        return nodes.filter(n => n.type === 'character' || n.type === 'scene')
      }
      
      return nodes
    },

    getEdges: () => {
      const state = get()
      const allEdges = state.episodeGraphs[state.currentEpisodeId]?.edges || []
      const visibleNodes = state.getNodes()
      const visibleNodeIds = new Set(visibleNodes.map(n => n.id))
      
      return allEdges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
    },

    onNodesChange: (changes: NodeChange[]) => {
      const { currentEpisodeId, episodeGraphs, saveCurrentEpisode } = get()
      const currentGraph = episodeGraphs[currentEpisodeId]
      if (!currentGraph) return

      set({
        episodeGraphs: {
          ...episodeGraphs,
          [currentEpisodeId]: {
            ...currentGraph,
            nodes: applyNodeChanges(changes, currentGraph.nodes),
          }
        }
      })
      
      // Auto-save on movement/changes
      saveCurrentEpisode()
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      const { currentEpisodeId, episodeGraphs, saveCurrentEpisode } = get()
      const currentGraph = episodeGraphs[currentEpisodeId]
      if (!currentGraph) return

      set({
        episodeGraphs: {
          ...episodeGraphs,
          [currentEpisodeId]: {
            ...currentGraph,
            edges: applyEdgeChanges(changes, currentGraph.edges),
          }
        }
      })

      saveCurrentEpisode()
    },

    onConnect: (connection: Connection) => {
      const { currentEpisodeId, episodeGraphs, saveCurrentEpisode } = get()
      const currentGraph = episodeGraphs[currentEpisodeId]
      if (!currentGraph) return

      set({
        episodeGraphs: {
          ...episodeGraphs,
          [currentEpisodeId]: {
            ...currentGraph,
            edges: addEdge(
              { 
                ...connection, 
                animated: true, 
                style: { stroke: '#ef4444', strokeWidth: 2.5 } 
              }, 
              currentGraph.edges
            ),
          }
        }
      })

      saveCurrentEpisode()
    },

    setSelectedNode: (node: StoryNode | null) => {
      set({ selectedNode: node })
    },

    addNode: (type: string, position?: { x: number, y: number }, initialData?: any) => {
      const { currentEpisodeId, episodeGraphs, currentLayer } = get()
      
      if (!currentEpisodeId || !episodeGraphs[currentEpisodeId]) {
        console.error('Cannot add node: No active episode selected.')
        return
      }

      const currentGraph = episodeGraphs[currentEpisodeId]
      const id = `${type}-${nanoid(5)}`
      
      // Auto-switch layer if adding invisible node
      if (currentLayer !== 'Story Graph') {
        let isVisible = false
        if (currentLayer === 'Logic Layer' && (type === 'choice' || type === 'dialogue')) isVisible = true
        if (currentLayer === 'Cinematic Path' && (type === 'scene' || type === 'dialogue')) isVisible = true
        if (currentLayer === 'Director Notes' && (type === 'character' || type === 'scene')) isVisible = true
        
        if (!isVisible) {
          set({ currentLayer: 'Story Graph' })
        }
      }

      let nodeData: any = initialData || {}
      
      if (!initialData) {
        if (type === 'scene') {
          nodeData = { title: 'New Scene', description: 'Scene description...', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop', characters: [] }
        } else if (type === 'dialogue') {
          nodeData = { character: 'New Character', dialogue: 'Dialogue line...' }
        } else if (type === 'choice') {
          nodeData = { question: 'Make a choice?', options: ['Option A', 'Option B'] }
        } else if (type === 'character') {
          nodeData = { name: 'New Character', role: 'Unknown Role', personality: 'Character traits...', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1200&auto=format&fit=crop' }
        }
      }

      const newNode: StoryNode = {
        id,
        type,
        position: position || { x: 100, y: 100 },
        data: nodeData,
      }

      set({
        episodeGraphs: {
          ...episodeGraphs,
          [currentEpisodeId]: {
            ...currentGraph,
            nodes: [...currentGraph.nodes, newNode],
          }
        }
      })
    },

    updateNodeData: (nodeId: string, data: any) => {
      const { currentEpisodeId, episodeGraphs } = get()
      const currentGraph = episodeGraphs[currentEpisodeId]
      const updatedNode = currentGraph.nodes.find(n => n.id === nodeId)
      
      if (!updatedNode) return

      let newNodes = currentGraph.nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } }
        }
        if (updatedNode.type === 'character' && data.name) {
          if (node.type === 'dialogue' && node.data.character === updatedNode.data.name) {
            return { ...node, data: { ...node.data, character: data.name } }
          }
        }
        return node
      })

      set({
        episodeGraphs: {
          ...episodeGraphs,
          [currentEpisodeId]: {
            ...currentGraph,
            nodes: newNodes,
          }
        }
      })
      
      if (get().selectedNode?.id === nodeId) {
        set({ selectedNode: newNodes.find(n => n.id === nodeId) || null })
      }
    },

    addChoiceOption: (nodeId: string) => {
      const { currentEpisodeId, episodeGraphs } = get()
      const currentGraph = episodeGraphs[currentEpisodeId]
      
      const newNodes = currentGraph.nodes.map((node) => {
        if (node.id === nodeId && node.type === 'choice') {
          const options = [...(node.data.options || []), `New Option ${node.data.options.length + 1}`]
          return { ...node, data: { ...node.data, options } }
        }
        return node
      })

      set({
        episodeGraphs: {
          ...episodeGraphs,
          [currentEpisodeId]: {
            ...currentGraph,
            nodes: newNodes,
          }
        }
      })
      
      if (get().selectedNode?.id === nodeId) {
        set({ selectedNode: newNodes.find(n => n.id === nodeId) || null })
      }
    },

    removeChoiceOption: (nodeId: string, index: number) => {
      const { currentEpisodeId, episodeGraphs } = get()
      const currentGraph = episodeGraphs[currentEpisodeId]
      
      const newNodes = currentGraph.nodes.map((node) => {
        if (node.id === nodeId && node.type === 'choice') {
          const options = node.data.options.filter((_: any, i: number) => i !== index)
          return { ...node, data: { ...node.data, options } }
        }
        return node
      })
      
      const newEdges = currentGraph.edges.filter(edge => {
        return !(edge.source === nodeId && edge.sourceHandle === `option-${index}`)
      })

      set({
        episodeGraphs: {
          ...episodeGraphs,
          [currentEpisodeId]: {
            nodes: newNodes,
            edges: newEdges,
          }
        }
      })
      
      if (get().selectedNode?.id === nodeId) {
        set({ selectedNode: newNodes.find(n => n.id === nodeId) || null })
      }
    },

    deleteNode: (nodeId: string) => {
      const { currentEpisodeId, episodeGraphs } = get()
      const currentGraph = episodeGraphs[currentEpisodeId]

      set({
        episodeGraphs: {
          ...episodeGraphs,
          [currentEpisodeId]: {
            nodes: currentGraph.nodes.filter((node) => node.id !== nodeId),
            edges: currentGraph.edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId
            ),
          }
        },
        selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
      })
    },

    addEpisode: (id: string, title: string, description: string) => {
      const newEp = { id, title, description }
      
      set({ 
        episodes: [...get().episodes, newEp],
        episodeGraphs: {
          ...get().episodeGraphs,
          [id]: { nodes: [], edges: [] }
        },
        currentEpisodeId: id
      })
    },

    updateEpisode: (id: string, data: Partial<Episode>) => {
      set({
        episodes: get().episodes.map(ep => ep.id === id ? { ...ep, ...data } : ep)
      })
    },

    setCurrentEpisode: (id: string) => {
      set({ currentEpisodeId: id, selectedNode: null })
    },

    addCharacterAsset: (asset: CharacterAsset) => {
      set({ characterAssets: [...get().characterAssets, asset] })
    },

    setLayer: (layer: string) => {
      set({ currentLayer: layer })
    }
  }))
)


