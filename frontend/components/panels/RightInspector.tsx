'use client'

import { Info, Settings2, FileText, Database, Trash2, Plus } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'

export default function RightInspector() {
  const { selectedNode, updateNodeData, deleteNode } = useStoryStore()

  const handleDataChange = (key: string, value: any) => {
    if (!selectedNode) return
    updateNodeData(selectedNode.id, { [key]: value })
  }

  return (
    <aside className="w-80 border-l border-white/5 bg-[#0d0d0d] flex flex-col z-20 relative">
      <div className="ui-tag">[PROPERTY_INSPECTOR]</div>
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Settings2 size={16} className="text-red-500" />
          <h2 className="text-sm font-bold text-white tracking-tight uppercase">
            Node Inspector
          </h2>
        </div>
        {selectedNode && (
          <button 
            onClick={() => deleteNode(selectedNode.id)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {!selectedNode ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4 text-zinc-600">
            <Info size={24} />
          </div>
          <h3 className="text-sm font-bold text-zinc-400">No Selection</h3>
          <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
            Select a node from the story graph to view and edit its properties.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Database size={14} className="text-zinc-500" />
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Identity & Type
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                  Reference ID
                </label>
                <div className="rounded-lg bg-white/5 border border-white/5 p-2 text-xs font-mono text-zinc-300">
                  {selectedNode.id}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                  Entity Type
                </label>
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-xs font-bold text-red-400 capitalize">
                  {selectedNode.type} Node
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={14} className="text-zinc-500" />
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Properties
              </h3>
            </div>
            
            <div className="space-y-4">
              {selectedNode.type === 'scene' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                      Scene Title
                    </label>
                    <input 
                      type="text"
                      value={selectedNode.data.title}
                      onChange={(e) => handleDataChange('title', e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                      Description
                    </label>
                    <textarea 
                      value={selectedNode.data.description}
                      onChange={(e) => handleDataChange('description', e.target.value)}
                      className="w-full h-20 bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'dialogue' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                      Character Name
                    </label>
                    <input 
                      type="text"
                      value={selectedNode.data.character}
                      onChange={(e) => handleDataChange('character', e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                      Dialogue Text
                    </label>
                    <textarea 
                      value={selectedNode.data.dialogue}
                      onChange={(e) => handleDataChange('dialogue', e.target.value)}
                      className="w-full h-24 bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'character' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                      Name
                    </label>
                    <input 
                      type="text"
                      value={selectedNode.data.name}
                      onChange={(e) => handleDataChange('name', e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                      Role
                    </label>
                    <input 
                      type="text"
                      value={selectedNode.data.role}
                      onChange={(e) => handleDataChange('role', e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'choice' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">
                      Question
                    </label>
                    <input 
                      type="text"
                      value={selectedNode.data.question}
                      onChange={(e) => handleDataChange('question', e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">
                        Branching Options
                      </label>
                      <button 
                        onClick={() => useStoryStore.getState().addChoiceOption(selectedNode.id)}
                        className="p-1 rounded-md bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedNode.data.options?.map((option: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...selectedNode.data.options]
                              newOptions[index] = e.target.value
                              handleDataChange('options', newOptions)
                            }}
                            className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
                          />
                          <button 
                            onClick={() => useStoryStore.getState().removeChoiceOption(selectedNode.id, index)}
                            className="p-2 text-zinc-500 hover:text-red-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <section>
            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">
              Director Notes
            </label>
            <textarea
              className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-zinc-300 outline-none focus:border-red-500/50 transition-colors placeholder:text-zinc-700"
              placeholder="Add internal notes for this scene..."
            />
          </section>
        </div>
      )}

      <div className="p-4 border-t border-white/5 bg-black/20 text-center">
        <button className="w-full py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">
          View History
        </button>
      </div>
    </aside>
  )
}