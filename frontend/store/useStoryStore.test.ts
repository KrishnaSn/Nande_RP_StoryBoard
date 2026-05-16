import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStoryStore } from '../store/useStoryStore'

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: () => 'test-id'
}))

describe('StoryStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { getState } = useStoryStore
    getState().episodes = [{ id: 'ep-1', title: 'The Prologue', description: 'The beginning.' }]
    getState().currentEpisodeId = 'ep-1'
    getState().episodeGraphs = { 'ep-1': { nodes: [], edges: [] } }
    getState().characterAssets = []
    getState().currentLayer = 'Story Graph'
    getState().hasInitialized = true
  })

  it('should initialize with a default episode', () => {
    const { episodes, currentEpisodeId } = useStoryStore.getState()
    expect(episodes.length).toBe(1)
    expect(currentEpisodeId).toBe('ep-1')
  })

  it('should add a new episode', async () => {
    const { addEpisode } = useStoryStore.getState()
    
    // Mock fetch for the proactive save
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    await addEpisode('ep-2', 'New Episode', 'Description')
    
    const { episodes, currentEpisodeId } = useStoryStore.getState()
    expect(episodes.length).toBe(2)
    expect(currentEpisodeId).toBe('ep-2')
    expect(episodes[1].title).toBe('New Episode')
  })

  it('should add a node to the current episode', () => {
    const { addNode } = useStoryStore.getState()
    
    addNode('scene', { x: 0, y: 0 })
    
    const nodes = useStoryStore.getState().getNodes()
    expect(nodes.length).toBe(1)
    expect(nodes[0].type).toBe('scene')
  })

  it('should switch layers correctly', () => {
    const { setLayer } = useStoryStore.getState()
    
    setLayer('Logic Layer')
    expect(useStoryStore.getState().currentLayer).toBe('Logic Layer')
  })

  it('should filter nodes based on current layer', () => {
    const { addNode, setLayer } = useStoryStore.getState()
    
    addNode('scene', { x: 0, y: 0 })
    addNode('choice', { x: 10, y: 10 })
    
    setLayer('Logic Layer') // Should only show choice/dialogue
    const logicNodes = useStoryStore.getState().getNodes()
    expect(logicNodes.length).toBe(1)
    expect(logicNodes[0].type).toBe('choice')
    
    setLayer('Cinematic Path') // Should only show scene/dialogue
    const cinematicNodes = useStoryStore.getState().getNodes()
    expect(cinematicNodes.length).toBe(1)
    expect(cinematicNodes[0].type).toBe('scene')
  })

  it('should delete a character asset and its associated nodes', async () => {
    const { saveCharacterAsset, addNode, deleteCharacterAsset } = useStoryStore.getState()
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({ 
      ok: true, 
      json: () => Promise.resolve({ id: 'char-1', name: 'Test', image: 'test.jpg' }) 
    })

    // Add character asset
    await saveCharacterAsset({ id: 'char-1', name: 'Test', image: 'test.jpg' })
    
    // Add a node for this character
    addNode('character', { x: 0, y: 0 }, { name: 'Test' })
    
    let state = useStoryStore.getState()
    expect(state.characterAssets.length).toBe(1)
    expect(state.getNodes().length).toBe(1)

    // Delete character
    await deleteCharacterAsset('char-1')
    
    state = useStoryStore.getState()
    expect(state.characterAssets.length).toBe(0)
    expect(state.getNodes().length).toBe(0)
  })
})
