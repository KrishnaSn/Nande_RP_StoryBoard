import { Handle, Position } from 'reactflow'
import { GitBranch } from 'lucide-react'

export default function ChoiceNode({ data, selected }: any) {
  return (
    <div className={`node-container w-64 overflow-hidden rounded-xl border ${selected ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'border-white/10'} bg-[#0d0d0d] shadow-2xl transition-all duration-300`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-[#050505] !border-2 !border-amber-500 !rounded-sm hover:!bg-amber-500 transition-colors" 
      />
      
      <div className="node-header bg-amber-500/10 text-amber-400">
        <GitBranch size={14} />
        <span>Choice Node</span>
      </div>

      <div className="p-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Decision Point
        </h3>
        <p className="mt-2 text-sm font-bold text-white">
          {data.question}
        </p>

        <div className="mt-4 space-y-2">
          {data.options?.map((option: string, index: number) => (
            <div
              key={index}
              className="group relative flex items-center justify-between rounded-lg bg-white/5 border border-white/5 p-2 transition-colors hover:bg-white/10"
            >
              <span className="text-[10px] font-medium text-zinc-300">
                {option}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={`option-${index}`}
                className="!static !translate-y-0 !w-3 !h-3 !bg-[#050505] !border-2 !border-amber-500 !rounded-sm hover:!bg-amber-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}