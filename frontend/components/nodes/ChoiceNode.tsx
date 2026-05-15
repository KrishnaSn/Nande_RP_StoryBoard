import { Handle, Position } from 'reactflow'

export default function ChoiceNode({ data }: any) {
  return (
    <div className="w-64 rounded-2xl border border-yellow-500/30 bg-[#1a1608] p-5">
      <Handle type="target" position={Position.Left} />

      <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
        CHOICE
      </span>

      <h3 className="mt-4 text-xl font-black text-white">
        {data.question}
      </h3>

      <div className="mt-5 space-y-2">
        {data.options?.map((option: string) => (
          <div
            key={option}
            className="rounded-xl bg-black/30 p-3 text-sm"
          >
            {option}
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="a"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
      />
    </div>
  )
}