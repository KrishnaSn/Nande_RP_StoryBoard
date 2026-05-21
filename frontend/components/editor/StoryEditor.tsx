'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Maximize2 } from 'lucide-react'

import { useStoryStore } from '../../store/useStoryStore'
import CharacterSceneNode from '../nodes/CharacterSceneNode'
import ChoiceNode from '../nodes/ChoiceNode'
import LeftToolbox from '../panels/LeftToolbox'
import TopBar from '../panels/TopBar'
import ArcTimeline from '../timeline/ArcTimeline'
import SceneModal from './SceneModal'
import ContextMenu from './ContextMenu'
import SaveSyncModal from './SaveSyncModal'
import DeviceGuard from './DeviceGuard'

const nodeTypes = {
  characterScene: CharacterSceneNode,
  choice: ChoiceNode,
}

function FlowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState<any>(null)
  
  const { 
    getNodes, 
    getEdges,
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    setSelectedNode,
    addNode,
    loadArcs,
    deleteNode,
    isPresenting,
    togglePresentMode,
    currentArcId
  } = useStoryStore()

  const nodes = getNodes()
  const edges = getEdges()

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // DELETE Key (Only Delete, not Backspace)
      if (e.key === 'Delete') {
        const selectedNodes = nodes.filter(n => n.selected)
        if (selectedNodes.length > 0 && !['INPUT', 'TEXTAREA'].includes((document.activeElement as any).tagName)) {
           if (confirm(`Delete ${selectedNodes.length} node(s)?`)) {
             selectedNodes.forEach(n => deleteNode(n.id))
           }
        }
      }
      
      // UNDO (Ctrl+Z)
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault()
        const { undo } = (useStoryStore as any).temporal.getState()
        undo()
      }

      // ESC to exit Present Mode
      if (e.key === 'Escape' && isPresenting) {
        togglePresentMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, deleteNode, isPresenting, togglePresentMode])

  // Initial load and Sync Polling
  useEffect(() => {
    loadArcs()
    
    const interval = setInterval(() => {
      loadArcs()
    }, 8000)

    return () => clearInterval(interval)
  }, [loadArcs])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (typeof type === 'undefined' || !type) return

      const charDataRaw = event.dataTransfer.getData('application/character-data')
      const initialData = charDataRaw ? JSON.parse(charDataRaw) : {}

      const position = {
        x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
        y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
      }
      
      addNode(type, position, initialData)
    },
    [addNode]
  )

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault()
      const pane = reactFlowWrapper.current?.getBoundingClientRect()
      if (!pane) return

      setMenu({
        id: node.id,
        top: event.clientY - pane.top,
        left: event.clientX - pane.left,
        type: 'node'
      })
    },
    [setMenu]
  )

  const onEdgeContextMenu = useCallback(
    (event: any, edge: any) => {
      event.preventDefault()
      const pane = reactFlowWrapper.current?.getBoundingClientRect()
      if (!pane) return

      setMenu({
        id: edge.id,
        top: event.clientY - pane.top,
        left: event.clientX - pane.left,
        type: 'edge'
      })
    },
    [setMenu]
  )

  const onPaneClick = useCallback(() => setMenu(null), [setMenu])

  const nodeColor = (node: any) => {
    return node.data?.color || '#ef4444'
  }

  const nodeStrokeColor = (node: any) => {
    return node.data?.color || '#ef4444'
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white selection:bg-red-500/30">
      <DeviceGuard />
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <LeftToolbox />
        
        <main className="flex-1 relative bg-[#050505]" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            defaultEdgeOptions={{
              animated: true,
              style: { strokeWidth: 2.5 }
            }}
          >
            <Background color="#1a1a1a" gap={20} size={1} />
            <Controls className={`!bg-[#0d0d0d] !border-white/10 !shadow-2xl shadow-black/50 overflow-hidden !rounded-lg transition-all duration-500 ${isPresenting ? '!bottom-6 !left-6' : '!bottom-10 !left-10'}`} />
            
            <MiniMap 
              nodeColor={nodeColor}
              nodeStrokeColor={nodeStrokeColor}
              nodeStrokeWidth={3}
              nodeBorderRadius={2}
              maskColor="rgba(0, 0, 0, 0.6)"
              className={`!bg-[#0d0d0d] !rounded-xl !border !border-white/10 !m-8 !shadow-2xl !shadow-black/50 transition-all duration-500 ${isPresenting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
              style={{
                width: 180,
                height: 120
              }}
              zoomable
              pannable
            />

            <Panel position="bottom-right" className="m-8">
               <div className={`px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex items-center gap-2 shadow-2xl transition-all duration-500 ${isPresenting ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Build 2.2.1 Multi-User</span>
               </div>
            </Panel>

            {isPresenting && (
              <Panel position="top-right" className="!m-4">
                <button 
                  onClick={togglePresentMode}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase shadow-2xl hover:bg-zinc-200 transition-all animate-in fade-in slide-in-from-top-4 duration-500"
                >
                  <Maximize2 size={16} />
                  <span>Exit Present Arc</span>
                </button>
              </Panel>
            )}

            {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
          </ReactFlow>
          
        </main>
      </div>

      <ArcTimeline />
      <SceneModal />
      <SaveSyncModal />
    </div>
  )
}

export default function StoryEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  )
}
