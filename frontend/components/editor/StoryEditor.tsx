'use client'

import { useRef, useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow'
import useKeypress from 'react-use-keypress'

import 'reactflow/dist/style.css'
import '../styles/storyflow.css'

import SceneNode from '../nodes/SceneNode'
import DialogueNode from '../nodes/DialogueNode'
import ChoiceNode from '../nodes/ChoiceNode'
import CharacterNode from '../nodes/CharacterNode'

import TopBar from '../panels/TopBar'
import LeftToolbox from '../panels/LeftToolbox'
import RightInspector from '../panels/RightInspector'
import EpisodeTimeline from '../timeline/EpisodeTimeline'

import { useStoryStore } from '../../store/useStoryStore'

const nodeTypes = {
  scene: SceneNode,
  dialogue: DialogueNode,
  choice: ChoiceNode,
  character: CharacterNode,
}
function FlowEditor() {
  const reactFlowWrapper = useRef<any>(null)
  const { 
    getNodes, 
    getEdges,
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    setSelectedNode,
    selectedNode,
    deleteNode,
    addNode,
    loadEpisodes,
    loadCharacters
  } = useStoryStore()

  const nodes = getNodes()
  const edges = getEdges()

  // Initial load and Real-time Polling
  useEffect(() => {
    // Initial load
    loadEpisodes()
    loadCharacters()
    
    // Set up polling interval (every 5 seconds)
    const interval = setInterval(() => {
      loadEpisodes()
      loadCharacters()
    }, 5000)

    return () => clearInterval(interval)
  }, [loadEpisodes, loadCharacters])

  const { project } = useReactFlow()
  const temporal = useStoryStore.temporal
  const { undo, redo } = temporal.getState()

  // Drag & Drop Handling
  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')
      const characterDataStr = event.dataTransfer.getData('application/character-data')

      if (!type) return

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const initialData = characterDataStr ? JSON.parse(characterDataStr) : null
      addNode(type, position, initialData)
    },
    [project, addNode]
  )

  // Keyboard Shortcuts
  useKeypress(['Delete', 'Backspace'], (event: any) => {
    // Prevent deletion if the user is typing in an input or textarea
    const activeElement = document.activeElement
    const isTyping = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA'

    if (selectedNode && !isTyping) {
      deleteNode(selectedNode.id)
    }
  })

  useKeypress(['z', 'Z'], (event: any) => {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
      undo()
    } else if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      redo()
    }
  })

  const nodeColor = (node: any) => {
    switch (node.type) {
      case 'scene': return '#10b981'
      case 'dialogue': return '#3b82f6'
      case 'choice': return '#f59e0b'
      case 'character': return '#ef4444'
      default: return '#27272a'
    }
  }

  const nodeStrokeColor = (node: any) => {
    switch (node.type) {
      case 'scene': return '#059669'
      case 'dialogue': return '#2563eb'
      case 'choice': return '#d97706'
      case 'character': return '#dc2626'
      default: return '#3f3f46'
    }
  }

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      <div className="ui-tag">[GRAPH_WORKSPACE]</div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background />
        <Controls />
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
      </ReactFlow>
    </div>
  )
}

export default function StoryEditor() {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-[#050505] text-white selection:bg-red-500/30">
        <TopBar />
        
        <div className="flex flex-1 overflow-hidden">
          <LeftToolbox />

          <main className="flex-1 relative flex flex-col overflow-hidden">
            <FlowEditor />
            <EpisodeTimeline />
            <div className="absolute bottom-36 right-6 z-30 pointer-events-none">
               <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Build 1.1.0 Stable</span>
               </div>
            </div>
          </main>

          <RightInspector />
        </div>
      </div>
    </ReactFlowProvider>
  )
}