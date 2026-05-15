import { Handle, Position } from 'reactflow'

export default function DialogueNode({ data }: any) {
  return (
    <div className="w-72 rounded-2xl border border-blue-500/30 bg-[#111827] p-5">
      <Handle type="target" position={Position.Left} />

      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
        DIALOGUE
      </span>

      <h3 className="mt-4 text-xl font-black text-white">
        {data.character}
      </h3>

      <p className="mt-4 text-zinc-300 italic">
        "{data.dialogue}"
      </p>

      <Handle type="source" position={Position.Right} />
    </div>
  )
}