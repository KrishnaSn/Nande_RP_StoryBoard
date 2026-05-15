import { Handle, Position } from 'reactflow'

export default function CharacterNode({ data }: any) {
  return (
    <div className="w-72 overflow-hidden rounded-2xl border border-purple-500/30 bg-[#16101d]">
      <Handle type="target" position={Position.Left} />

      <img
        src={data.image}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">
          CHARACTER
        </span>

        <h3 className="mt-4 text-2xl font-black text-white">
          {data.name}
        </h3>

        <p className="mt-3 text-sm text-zinc-400">
          {data.role}
        </p>

        <div className="mt-4 rounded-xl bg-black/30 p-3 text-xs text-zinc-400">
          {data.personality}
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  )
}