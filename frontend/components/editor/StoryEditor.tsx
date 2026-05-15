'use client'

import { useCallback, useState } from 'react'

import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow'

import 'reactflow/dist/style.css'

import '../styles/storyflow.css'

import SceneNode from '../nodes/SceneNode'
import DialogueNode from '../nodes/DialogueNode'
import ChoiceNode from '../nodes/ChoiceNode'
import CharacterNode from '../nodes/CharacterNode'

import LeftToolbox from '../panels/LeftToolbox'
import RightInspector from '../panels/RightInspector'
import EpisodeTimeline from '../timeline/EpisodeTimeline'

const nodeTypes = {
  scene: SceneNode,
  dialogue: DialogueNode,
  choice: ChoiceNode,
  character: CharacterNode,
}

const initialNodes = [
  {
    id: '1',
    type: 'scene',
    position: {
      x: 200,
      y: 200,
    },

    data: {
      title: 'Michael Returns',
      description:
        'Michael returns after prison.',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',

      characters: ['Michael', 'Tony'],
    },
  },
]

const initialEdges = []

export default function StoryEditor() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes)

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges)

  const [selectedNode, setSelectedNode] =
    useState<any>(null)

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: {
              stroke: '#ef4444',
              strokeWidth: 3,
            },
          },
          eds
        )
      ),
    [setEdges]
  )

  const addNode = (type: string) => {
    const id = `${nodes.length + 1}`

    let nodeData: any = {}

    if (type === 'scene') {
      nodeData = {
        title: 'New Scene',
        description:
          'Scene description...',
        image:
          'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',

        characters: ['Michael'],
      }
    }

    if (type === 'dialogue') {
      nodeData = {
        character: 'Michael',
        dialogue:
          'We need to finish this tonight.',
      }
    }

    if (type === 'choice') {
      nodeData = {
        question: 'Trust Tony?',
        options: ['YES', 'NO'],
      }
    }

    if (type === 'character') {
      nodeData = {
        name: 'Tony',
        role: 'Gang Leader',
        personality:
          'Aggressive and unpredictable.',

        image:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
      }
    }

    const newNode = {
      id,
      type,
      position: {
        x: Math.random() * 800,
        y: Math.random() * 600,
      },

      data: nodeData,
    }

    setNodes((nds) => [...nds, newNode])
  }

  return (
    <div className="flex h-screen bg-[#090909] text-white">
      <LeftToolbox addNode={addNode} />

      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) =>
              setSelectedNode(node)
            }
            fitView
          >
            <Background gap={30} />
            <Controls />

            <MiniMap
              style={{
                backgroundColor: '#111',
              }}
              nodeColor="#ef4444"
            />
          </ReactFlow>
        </div>

        <EpisodeTimeline />
      </div>

      <RightInspector
        selectedNode={selectedNode}
      />
    </div>
  )
}