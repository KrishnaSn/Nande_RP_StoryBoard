'use client'

import { useState } from 'react'
import { Plus, Clapperboard, ChevronRight, Settings, X, Save } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'
import { nanoid } from 'nanoid'

export default function ArcTimeline() {
  const { arcs, currentArcId, setCurrentArc, addArc, deleteArc, updateArc, isPresenting } = useStoryStore()
  const [showNewArcModal, setShowNewArcModal] = useState(false)
  const [newArcData, setNewArcData] = useState({ title: '', description: '' })
  const [editingArc, setEditingArc] = useState<string | null>(null)

  const handleCreateArc = async () => {
    if (!newArcData.title) return
    const id = `arc-${nanoid(5)}`
    await addArc(id, newArcData.title, newArcData.description)
    setShowNewArcModal(false)
    setNewArcData({ title: '', description: '' })
  }

  const handleUpdateArc = (id: string) => {
    updateArc(id, newArcData)
    setEditingArc(null)
    setNewArcData({ title: '', description: '' })
  }

  return (
    <>
      <div className={`h-24 border-t border-white/5 bg-[#0d0d0d] flex items-center px-6 gap-6 z-20 relative overflow-hidden transition-all duration-500 ${isPresenting ? 'translate-y-full opacity-0 invisible' : 'translate-y-0 opacity-100 visible'}`}>
        
        <div className="flex items-center gap-3 pr-6 border-r border-white/5">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
            <Clapperboard size={18} />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Arc Timeline</h2>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Sequence Editor</p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {arcs.map((arc) => (
            <div
              key={arc.id}
              onClick={() => setCurrentArc(arc.id)}
              className={`group relative flex-shrink-0 min-w-[200px] h-14 rounded-xl border transition-all cursor-pointer flex items-center px-4 gap-3 ${
                currentArcId === arc.id 
                  ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/5' 
                  : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${currentArcId === arc.id ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`} />
              <div className="flex-1 min-w-0">
                <h3 className={`text-[10px] font-bold truncate uppercase tracking-tight ${currentArcId === arc.id ? 'text-white' : 'text-zinc-400'}`}>
                  {arc.title}
                </h3>
                <p className="text-[8px] text-zinc-600 truncate font-medium uppercase">{arc.description || 'No description'}</p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Delete this Arc? All nodes will be lost.')) deleteArc(arc.id)
                  }}
                  className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setShowNewArcModal(true)}
            className="flex-shrink-0 h-14 w-14 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-zinc-500 hover:border-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="pl-6 border-l border-white/5">
          <button 
            onClick={() => setShowNewArcModal(true)}
            className="bg-white text-black text-[10px] font-black uppercase px-4 py-2 rounded-lg hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
          >
            + New Arc
          </button>
        </div>
      </div>

      {/* New Arc Modal - MOVED OUTSIDE parent div to escape CSS Transform containing block */}
      {showNewArcModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowNewArcModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <Plus className="text-red-500" />
              Initialize New Arc
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Arc Title</label>
                <input 
                  type="text" 
                  value={newArcData.title}
                  onChange={(e) => setNewArcData({ ...newArcData, title: e.target.value })}
                  placeholder="e.g. The Great Heist"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Summary</label>
                <textarea 
                  value={newArcData.description}
                  onChange={(e) => setNewArcData({ ...newArcData, description: e.target.value })}
                  placeholder="What happens in this arc?"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white h-24 resize-none focus:outline-none focus:border-red-500/50"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowNewArcModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase text-zinc-500 hover:bg-white/5 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handleCreateArc}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  <span>Create Arc</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
