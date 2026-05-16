'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Users, X, Info } from 'lucide-react'

export default function SaveSyncModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      // Auto-close after 4 seconds
      setTimeout(() => setIsOpen(false), 4000)
    }

    window.addEventListener('arc-sync-complete', handleOpen)
    return () => window.removeEventListener('arc-sync-complete', handleOpen)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-32 right-8 z-[120] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#0d0d0d] border border-emerald-500/30 rounded-2xl shadow-2xl p-5 flex items-start gap-4 max-w-sm backdrop-blur-xl">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 size={20} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Changes Published</h3>
            <button onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
            Story data has been synchronized with the cloud. Other players can now see your latest work.
          </p>
          
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
            <Users size={12} className="text-zinc-500" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Live for all contributors</span>
          </div>
        </div>
      </div>
    </div>
  )
}
