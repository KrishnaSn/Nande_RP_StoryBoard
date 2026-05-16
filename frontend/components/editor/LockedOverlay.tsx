'use client'

import { useStoryStore } from '../../store/useStoryStore'
import { Lock, User, Info, RefreshCcw } from 'lucide-react'

export default function LockedOverlay() {
  const { lockedBy, userId, loadArcs } = useStoryStore()

  // If nobody locked it, or WE locked it, don't show overlay
  if (!lockedBy || lockedBy === userId) return null

  return (
    <div className="absolute inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0d0d0d] border border-red-500/30 rounded-3xl shadow-2xl p-8 text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/20 border border-red-500/20">
          <Lock size={40} />
        </div>
        
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Workspace Locked</h2>
          <p className="text-xs font-medium text-zinc-400 leading-relaxed uppercase tracking-tighter">
            Another contributor is currently sequenceing this Arc. To prevent data corruption, editing has been disabled for your session.
          </p>
        </div>

        <div className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                <User size={16} />
             </div>
             <div className="text-left">
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Active Editor</p>
               <p className="text-[10px] font-bold text-white uppercase">{lockedBy}</p>
             </div>
           </div>
           
           <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-500">
              <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase">Live</span>
           </div>
        </div>

        <div className="space-y-3 w-full pt-2">
           <button 
             onClick={() => loadArcs()}
             className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
           >
             <RefreshCcw size={16} />
             <span>Check Availability</span>
           </button>
           
           <div className="flex items-center gap-2 justify-center text-zinc-600">
             <Info size={12} />
             <span className="text-[8px] font-bold uppercase tracking-widest">Editing will unlock once they publish changes.</span>
           </div>
        </div>
      </div>
    </div>
  )
}
