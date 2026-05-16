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

import { useStoryStore } from '../../store/useStoryStore'
import CharacterSceneNode from '../nodes/CharacterSceneNode'
import ChoiceNode from '../nodes/ChoiceNode'
import LeftToolbox from '../panels/LeftToolbox'
import TopBar from '../panels/TopBar'
import ArcTimeline from '../timeline/ArcTimeline'
import SceneModal from './SceneModal'
import ContextMenu from './ContextMenu'
import SaveSyncModal from './SaveSyncModal'
import LockedOverlay from './LockedOverlay'

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
    currentArcId,
    acquireLock,
    lockedBy,
    userId
  } = useStoryStore()

  const nodes = getNodes()
  const edges = getEdges()

  // LOCKING LOGIC: Attempt to lock when user interacts
  const handleInteraction = useCallback(async () => {
    if (currentArcId && (!lockedBy || lockedBy !== userId)) {
      await acquireLock(currentArcId)
    }
  }, [currentArcId, lockedBy, userId, acquireLock])

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If locked by someone else, block all hotkeys
      if (lockedBy && lockedBy !== userId) return

      // DELETE Key (Only Delete, not Backspace)
      if (e.key === 'Delete') {
        const selectedNodes = nodes.filter(n => n.selected)
        if (selectedNodes.length > 0 && !['INPUT', 'TEXTAREA'].includes((document.activeElement as any).tagName)) {
           if (confirm(`Delete ${selectedNodes.length} node(s)?`)) {
             handleInteraction()
             selectedNodes.forEach(n => deleteNode(n.id))
           }
        }
      }
      
      // UNDO (Ctrl+Z)
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault()
        handleInteraction()
        const { undo } = (useStoryStore as any).temporal.getState()
        undo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, deleteNode, lockedBy, userId, handleInteraction])

  // Initial load & Polling for Locks/Sync
  useEffect(() => {
    loadArcs()
    // Poll for lock status and others' changes every 8 seconds
    const interval = setInterval(() => {
      // Only refresh if we haven't locked it ourselves (to avoid overwriting local changes)
      if (!lockedBy || lockedBy !== userId) {
        loadArcs()
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [loadArcs, lockedBy, userId])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault()
      if (lockedBy && lockedBy !== userId) return
      
      await handleInteraction()

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
    [addNode, lockedBy, userId, handleInteraction]
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
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <LeftToolbox />
        
        <main className="flex-1 relative bg-[#050505]" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(c) => { if(!lockedBy || lockedBy === userId) { handleInteraction(); onNodesChange(c); } }}
            onEdgesChange={(c) => { if(!lockedBy || lockedBy === userId) { handleInteraction(); onEdgesChange(c); } }}
            onConnect={(c) => { if(!lockedBy || lockedBy === userId) { handleInteraction(); onConnect(c); } }}
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
            <Controls className="!bg-[#0d0d0d] !border-white/10 !shadow-2xl shadow-black/50 overflow-hidden !rounded-lg" />
            
            <MiniMap 
              nodeColor={nodeColor}
              nodeStrokeColor={nodeStrokeColor}
              nodeStrokeWidth={3}
              nodeBorderRadius={2}
              maskColor="rgba(0, 0, 0, 0.6)"
              className={`!bg-[#0d0d0d] !rounded-xl !border !border-white/10 !m-4 !shadow-2xl !shadow-black/50 transition-all duration-500 ${isPresenting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              style={{
                width: 180,
                height: 120
              }}
              zoomable
              pannable
            />

            <Panel position="bottom-right" className="m-4">
               <div className={`px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex items-center gap-2 shadow-2xl transition-all duration-500 ${isPresenting ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Build 2.2.0 Locked-Sync</span>
               </div>
            </Panel>

            {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
          </ReactFlow>
          
          <LockedOverlay />
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
