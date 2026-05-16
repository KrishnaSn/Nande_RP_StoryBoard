import { Handle, Position } from 'reactflow'
import { Clapperboard } from 'lucide-react'

export default function SceneNode({ data, selected }: any) {
  return (
    <div className={`node-container w-80 overflow-hidden rounded-xl border ${selected ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-white/10'} bg-[#0d0d0d] shadow-2xl transition-all duration-300`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-[#050505] !border-2 !border-emerald-500 !rounded-sm hover:!bg-emerald-500 transition-colors" 
      />
      
      <div className="node-header bg-emerald-500/10 text-emerald-400">
        <Clapperboard size={14} />
        <span>Scene Node</span>
      </div>

      <div className="relative bg-black/40">
        <img
          src={data.image}
          className="h-40 w-full object-contain opacity-80"
          onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop' }}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white tracking-tight">
          {data.title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          {data.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {data.characters?.map((char: string) => (
            <span
              key={char}
              className="rounded-md bg-zinc-800/50 border border-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300"
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-[#050505] !border-2 !border-emerald-500 !rounded-sm hover:!bg-emerald-500 transition-colors" 
      />
    </div>
  )
}