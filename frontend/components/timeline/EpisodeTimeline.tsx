'use client'

import { useState } from 'react'
import { Plus, Clapperboard, ChevronRight, Settings, X, Save } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'
import { nanoid } from 'nanoid'

export default function EpisodeTimeline() {
  const { episodes, currentEpisodeId, setCurrentEpisode, addEpisode, updateEpisode, deleteEpisode } = useStoryStore()
  const [showModal, setShowModal] = useState(false)
  const [editingEp, setEditingEp] = useState<any>(null)
  
  const [formData, setFormData] = useState({ title: '', description: '' })

  const handleOpenNew = () => {
    setFormData({ title: '', description: '' })
    setEditingEp(null)
    setShowModal(true)
  }

  const handleOpenEdit = (ep: any, e: any) => {
    e.stopPropagation()
    setFormData({ title: ep.title, description: ep.description })
    setEditingEp(ep)
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!formData.title) return
    
    if (editingEp) {
      updateEpisode(editingEp.id, formData)
    } else {
      addEpisode(`ep-${nanoid(5)}`, formData.title, formData.description)
    }
    setShowModal(false)
  }

  return (
    <div className="h-32 border-t border-white/5 bg-[#0d0d0d] px-6 py-4 flex flex-col z-20 relative">
      <div className="ui-tag">[STORY_TIMELINE]</div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clapperboard size={14} className="text-red-500" />
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Episode Timeline
          </h3>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
        >
          <Plus size={12} />
          <span>New Episode</span>
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            onClick={() => setCurrentEpisode(ep.id)}
            className={`min-w-[180px] group relative rounded-xl border p-3 text-left transition-all ${
              currentEpisodeId === ep.id 
                ? 'bg-red-500/10 border-red-500/50' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className={`text-xs font-bold tracking-tight ${
                currentEpisodeId === ep.id ? 'text-red-400' : 'text-zinc-300'
              }`}>
                {ep.title}
              </h4>
              <div className="flex items-center gap-1">
                <Settings 
                  size={12} 
                  className="text-zinc-600 hover:text-white cursor-pointer transition-colors" 
                  onClick={(e) => handleOpenEdit(ep, e)}
                />
                <ChevronRight size={12} className={currentEpisodeId === ep.id ? 'text-red-500' : 'text-zinc-600'} />
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 line-clamp-1">
              {ep.description}
            </p>
            
            {currentEpisodeId === ep.id && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-500 rounded-full blur-[2px]" />
            )}
          </button>
        ))}
      </div>

      {/* Episode Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingEp ? 'Edit Episode' : 'New Episode'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Title</label>
                <input 
                  type="text"
                  autoFocus
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Big Heist"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the main arc of this episode..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-red-500/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-black/40 flex justify-between items-center">
              {editingEp && (
                <button 
                  onClick={() => {
                    if (confirm('Delete this episode? This cannot be undone.')) {
                      deleteEpisode(editingEp.id)
                      setShowModal(false)
                    }
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest"
                >
                  Delete Episode
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  <Save size={16} />
                  <span>{editingEp ? 'Save Changes' : 'Create Episode'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}