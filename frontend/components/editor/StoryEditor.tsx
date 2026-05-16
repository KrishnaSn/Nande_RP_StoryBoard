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
    loadArcs
  } = useStoryStore()

  const nodes = getNodes()
  const edges = getEdges()

  // Initial load
  useEffect(() => {
    loadArcs()
  }, [loadArcs])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
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
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
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
            <Controls className="!bg-[#0d0d0d] !border-white/10 !fill-white" />
            
            <MiniMap 
              nodeColor={nodeColor}
              nodeStrokeColor={nodeStrokeColor}
              nodeStrokeWidth={3}
              nodeBorderRadius={2}
              maskColor="rgba(0, 0, 0, 0.6)"
              className="!bg-[#0d0d0d] !rounded-xl !border !border-white/10 !m-4 !shadow-2xl !shadow-black/50"
              style={{
                width: 180,
                height: 120
              }}
              zoomable
              pannable
            />

            <Panel position="bottom-right" className="m-4">
               <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex items-center gap-2 shadow-2xl">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Build 2.1.0 Performance</span>
               </div>
            </Panel>

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
