'use client'

import { useState } from 'react'
import { Save, Play, Share2, Sparkles, Settings, Loader2, Check } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'

export default function TopBar() {
  const { saveCurrentEpisode, episodes, currentEpisodeId } = useStoryStore()
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowCheck] = useState(false)

  const currentEp = episodes.find(ep => ep.id === currentEpisodeId)

  const handleSave = async () => {
    setIsSaving(true)
    await saveCurrentEpisode()
    setIsSaving(false)
    setShowCheck(true)
    setTimeout(() => setShowCheck(false), 2000)
  }

  return (
    <header className="h-14 border-b border-white/5 bg-[#0d0d0d] flex items-center justify-between px-6 z-20 relative">
      <div className="ui-tag">[GLOBAL_TOP_NAV]</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
            <span className="text-white font-black text-lg italic">N</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Nande <span className="text-zinc-500 font-medium">StoryBoard</span>
          </h1>
        </div>
        
        <div className="h-4 w-px bg-white/10" />
        
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
            Project:
          </span>
          <span className="text-xs font-medium text-zinc-300">
            {currentEp?.title || 'Loading...'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : showSuccess ? <Check size={16} className="text-emerald-500" /> : <Save size={16} />}
          <span>{isSaving ? 'Saving...' : showSuccess ? 'Saved' : 'Save'}</span>
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium">
          <Sparkles size={16} />
          <span>AI Assist</span>
        </button>

        <div className="h-4 w-px bg-white/10 mx-2" />

        <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
          <Play size={18} fill="currentColor" />
        </button>
        
        <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
          <Share2 size={18} />
        </button>
        
        <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}