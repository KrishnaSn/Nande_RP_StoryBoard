'use client'

import { Plus, User, Clapperboard, GitBranch } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'
import { useReactFlow } from 'reactflow'

export default function LeftToolbox() {
  const { addNode, isPresenting } = useStoryStore()
  const { project } = useReactFlow()
  
  const characters = [
    { name: 'RedParasite', color: '#ef4444' },
    { name: 'AJ', color: '#3b82f6' },
    { name: 'Chitty', color: '#60a5fa' },
    { name: 'Sanju', color: '#10b981' },
    { name: 'PR Hashtag', color: '#facc15' },
    { name: 'Obito', color: '#8b5cf6' },
    { name: 'Gabbar Singh', color: '#f97316' },
    { name: 'Krishna', color: '#06b6d4' },
  ]

  const handleAddCharacterNode = (char: { name: string, color: string }) => {
    const center = project({
      x: (window.innerWidth / 2) - 300,
      y: (window.innerHeight / 2) - 100
    })
    addNode('characterScene', center, { 
      character: char.name, 
      color: char.color,
      title: `${char.name}'s Scene` 
    })
  }

  const handleAddChoiceNode = () => {
    const center = project({
      x: (window.innerWidth / 2) - 300,
      y: (window.innerHeight / 2) - 100
    })
    addNode('choice', center, { 
      character: 'System', 
      color: '#ec4899',
      title: 'Decision Point' 
    })
  }

  return (
    <aside className={`w-64 border-r border-white/5 bg-[#0d0d0d] flex flex-col z-20 relative transition-all duration-500 ${isPresenting ? '-translate-x-full opacity-0 invisible' : 'translate-x-0 opacity-100 visible'}`}>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
        {/* Node Creation Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-zinc-500">
            <Plus size={14} />
            <h2 className="text-[10px] font-bold uppercase tracking-widest">
              Create Arc Elements
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Characters */}
            <div className="grid grid-cols-2 gap-2">
              {characters.map((char) => (
                <button
                  key={char.name}
                  onClick={() => handleAddCharacterNode(char)}
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all text-center"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${char.color}20`, color: char.color, border: `1px solid ${char.color}40` }}
                  >
                    <User size={20} />
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-tighter truncate w-full">
                    {char.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Utility Nodes */}
            <div className="pt-4 border-t border-white/5">
               <button
                  onClick={handleAddChoiceNode}
                  className="w-full group flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all"
                >
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                    <GitBranch size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-white uppercase">Decision Point</p>
                    <p className="text-[8px] text-zinc-500 uppercase font-medium">Create a choice branch</p>
                  </div>
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Workspace Optimized</span>
        </div>
      </div>
    </aside>
  )
}
