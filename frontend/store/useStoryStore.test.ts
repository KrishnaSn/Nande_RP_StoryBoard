import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStoryStore } from '../store/useStoryStore'

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: () => 'test-id'
}))

describe('StoryStore (Arc Edition)', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { getState } = useStoryStore
    getState().arcs = [{ id: 'arc-1', title: 'The Prologue', description: 'The beginning.' }]
    getState().currentArcId = 'arc-1'
    getState().arcGraphs = { 'arc-1': { nodes: [], edges: [] } }
    getState().selectedNode = null
  })

  it('should initialize with a default arc', () => {
    const { arcs, currentArcId } = useStoryStore.getState()
    expect(arcs.length).toBe(1)
    expect(currentArcId).toBe('arc-1')
  })

  it('should add a new arc', async () => {
    const { addArc } = useStoryStore.getState()
    
    // Mock fetch for the save
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    await addArc('arc-2', 'New Arc', 'Description')
    
    const { arcs, currentArcId } = useStoryStore.getState()
    expect(arcs.length).toBe(2)
    expect(currentArcId).toBe('arc-2')
    expect(arcs[1].title).toBe('New Arc')
  })

  it('should add a characterScene node to the current arc', () => {
    const { addNode } = useStoryStore.getState()
    
    addNode('characterScene', { x: 0, y: 0 }, { character: 'RedParasite', color: '#ef4444' })
    
    const nodes = useStoryStore.getState().getNodes()
    expect(nodes.length).toBe(1)
    expect(nodes[0].type).toBe('characterScene')
    expect(nodes[0].data.character).toBe('RedParasite')
  })

  it('should update node data correctly', () => {
    const { addNode, updateNodeData } = useStoryStore.getState()
    
    addNode('characterScene', { x: 0, y: 0 }, { character: 'Chitty' })
    const nodes = useStoryStore.getState().getNodes()
    const nodeId = nodes[0].id

    updateNodeData(nodeId, { title: 'Updated Title' })
    
    const updatedNodes = useStoryStore.getState().getNodes()
    expect(updatedNodes[0].data.title).toBe('Updated Title')
  })

  it('should delete an arc and its graph', async () => {
    const { addArc, deleteArc } = useStoryStore.getState()
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    await addArc('arc-delete', 'To Delete', 'Desc')
    expect(useStoryStore.getState().arcs.length).toBe(2)

    await deleteArc('arc-delete')
    const state = useStoryStore.getState()
    expect(state.arcs.length).toBe(1)
    expect(state.arcGraphs['arc-delete']).toBeUndefined()
  })
})
