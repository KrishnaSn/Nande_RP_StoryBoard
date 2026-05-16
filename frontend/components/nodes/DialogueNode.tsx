import { Handle, Position } from 'reactflow'
import { MessageSquareQuote } from 'lucide-react'

export default function DialogueNode({ data, selected }: any) {
  return (
    <div className={`node-container w-72 overflow-hidden rounded-xl border ${selected ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-white/10'} bg-[#0d0d0d] shadow-2xl transition-all duration-300`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-[#050505] !border-2 !border-blue-500 !rounded-sm hover:!bg-blue-500 transition-colors" 
      />
      
      <div className="node-header bg-blue-500/10 text-blue-400">
        <MessageSquareQuote size={14} />
        <span>Dialogue Node</span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
            {data.character?.[0]}
          </div>
          <h3 className="text-sm font-bold text-white">
            {data.character}
          </h3>
        </div>

        <div className="mt-4 relative">
          <span className="absolute -left-1 -top-2 text-2xl text-white/10 font-serif">"</span>
          <p className="text-xs leading-relaxed text-zinc-300 italic px-2">
            {data.dialogue}
          </p>
          <span className="absolute -right-1 bottom-0 text-2xl text-white/10 font-serif">"</span>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-[#050505] !border-2 !border-blue-500 !rounded-sm hover:!bg-blue-500 transition-colors" 
      />
    </div>
  )
}