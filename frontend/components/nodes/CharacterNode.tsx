import { Handle, Position } from 'reactflow'
import { User } from 'lucide-react'

export default function CharacterNode({ data, selected }: any) {
  return (
    <div className={`node-container w-72 overflow-hidden rounded-xl border ${selected ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10'} bg-[#0d0d0d] transition-all duration-300`}>
      {/* Handles moved to root level for better connection stability */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-[#050505] !border-2 !border-red-500 !rounded-sm hover:!bg-red-500 transition-colors" 
      />

      <div className="node-header bg-red-500/10 text-red-400">
        <User size={14} />
        <span>Character Identity</span>
      </div>

      <div className="relative">
        <img
          src={data.image}
          className="h-32 w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
      </div>

      <div className="px-4 pb-4 -mt-6 relative z-10">
        <h3 className="text-xl font-black text-white tracking-tight">
          {data.name}
        </h3>
        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
          {data.role}
        </span>

        <div className="mt-3 p-2 rounded-lg bg-white/5 border border-white/5">
          <p className="text-[11px] leading-relaxed text-zinc-400 italic">
            {data.personality}
          </p>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-[#050505] !border-2 !border-red-500 !rounded-sm hover:!bg-red-500 transition-colors" 
      />
    </div>
  )
}