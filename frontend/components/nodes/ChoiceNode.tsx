'use client'

import { Handle, Position } from 'reactflow'
import { GitBranch, Settings } from 'lucide-react'

export default function ChoiceNode({ id, data, selected }: any) {
  const accentColor = '#f59e0b' // Amber

  return (
    <div 
      className={`node-container w-64 overflow-hidden rounded-xl border transition-all duration-300 ${
        selected ? 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]' : 'border-white/5'
      } bg-[#0d0d0d] shadow-2xl`}
      style={{ 
        borderColor: selected ? accentColor : 'rgba(255,255,255,0.05)',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2 !h-8 !rounded-r-md !border-none !-left-[1px]" 
        style={{ backgroundColor: accentColor }}
      />
      
      <div 
        className="px-3 py-2 flex items-center justify-between border-b border-white/5 bg-amber-500/10"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-white/5 text-amber-500">
            <GitBranch size={12} />
          </div>
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Decision Point</span>
        </div>
        
        <button 
          className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            window.dispatchEvent(new CustomEvent('open-scene-modal', { detail: { nodeId: id } }))
          }}
        >
          <Settings size={12} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-tight">
          {data.title || 'Decision Point'}
        </h3>
        
        <div className="mt-4 space-y-2">
          {data.options?.map((option: string, index: number) => (
            <div
              key={index}
              className="group relative flex items-center justify-between rounded-lg bg-white/5 border border-white/5 p-2 transition-colors hover:bg-white/10"
            >
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter truncate pr-4">
                {option}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={`option-${index}`}
                className="!static !translate-y-0 !w-2 !h-4 !rounded-l-md !border-none !-mr-2"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
