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

  it('should add and retrieve custom characters', () => {
    const { addCustomCharacter, getCharacters } = useStoryStore.getState()
    const initialCount = getCharacters().length

    addCustomCharacter('Tommy Vercetti', '#8b5cf6')
    const updatedChars = useStoryStore.getState().getCharacters()
    expect(updatedChars.length).toBe(initialCount + 1)
    expect(updatedChars.some(c => c.name === 'Tommy Vercetti' && c.color === '#8b5cf6')).toBe(true)

    // Should not allow duplicate names
    addCustomCharacter('Tommy Vercetti', '#ef4444')
    expect(useStoryStore.getState().getCharacters().length).toBe(initialCount + 1)
  })

  it('should remove a custom character', () => {
    const { addCustomCharacter, removeCustomCharacter, getCharacters } = useStoryStore.getState()
    addCustomCharacter('Temporary Char', '#f59e0b')
    expect(getCharacters().some(c => c.name === 'Temporary Char')).toBe(true)

    removeCustomCharacter('Temporary Char')
    expect(useStoryStore.getState().getCharacters().some(c => c.name === 'Temporary Char')).toBe(false)
  })

  it('should add a characterScene node for a custom character', () => {
    const { addCustomCharacter, addNode, getNodes } = useStoryStore.getState()
    addCustomCharacter('Arthur Morgan', '#f97316')
    
    addNode('characterScene', { x: 50, y: 50 }, { character: 'Arthur Morgan', color: '#f97316' })
    const nodes = useStoryStore.getState().getNodes()
    const customNode = nodes.find(n => n.data.character === 'Arthur Morgan')
    
    expect(customNode).toBeDefined()
    expect(customNode?.data.color).toBe('#f97316')
  })
})

