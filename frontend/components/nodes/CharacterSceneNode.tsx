'use client'

import { Handle, Position } from 'reactflow'
import { User, Settings } from 'lucide-react'

export default function CharacterSceneNode({ id, data, selected }: any) {
  const charColor = data.color || '#ef4444'

  return (
    <div 
      className={`node-container w-64 overflow-hidden rounded-xl border transition-all duration-300 ${
        selected ? 'shadow-[0_0_25px_-5px_rgba(255,255,255,0.1)]' : 'border-white/5'
      } bg-[#0d0d0d] shadow-2xl`}
      style={{ 
        borderColor: selected ? charColor : 'rgba(255,255,255,0.05)',
        boxShadow: selected ? `0 0 20px -5px ${charColor}40` : ''
      }}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2 !h-8 !rounded-r-md !border-none !-left-[1px]" 
        style={{ backgroundColor: charColor }}
      />
      
      <div 
        className="px-3 py-2 flex items-center justify-between border-b border-white/5"
        style={{ backgroundColor: `${charColor}10` }}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-white/5" style={{ color: charColor }}>
            <User size={12} />
          </div>
          <span className="text-[9px] font-black text-white uppercase tracking-widest">{data.character}</span>
        </div>
        
        <button 
          className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            // Dispatch custom event to open modal
            window.dispatchEvent(new CustomEvent('open-scene-modal', { detail: { nodeId: id } }))
          }}
        >
          <Settings size={12} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-tight line-clamp-2">
          {data.title || 'Untitled Scene'}
        </h3>
        <p className="mt-2 text-[9px] text-zinc-500 font-medium uppercase tracking-tighter line-clamp-1">
          {data.description ? data.description.substring(0, 30) + '...' : 'No description set'}
        </p>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2 !h-8 !rounded-l-md !border-none !-right-[1px]" 
        style={{ backgroundColor: charColor }}
      />
    </div>
  )
}
