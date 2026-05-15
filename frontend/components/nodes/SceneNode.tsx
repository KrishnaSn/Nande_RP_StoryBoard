import { Handle, Position } from 'reactflow'

export default function SceneNode({ data }: any) {
  return (
    <div className="w-80 overflow-hidden rounded-2xl border border-zinc-700 bg-[#181818]">
      <Handle type="target" position={Position.Left} />

      <img
        src={data.image}
        className="h-44 w-full object-cover"
      />

      <div className="p-5">
        <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">
          SCENE
        </span>

        <h3 className="mt-4 text-2xl font-black text-white">
          {data.title}
        </h3>

        <p className="mt-3 text-sm text-zinc-400">
          {data.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {data.characters?.map((char: string) => (
            <span
              key={char}
              className="rounded-full bg-zinc-800 px-3 py-1 text-xs"
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  )
}