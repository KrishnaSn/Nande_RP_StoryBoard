export default function LeftToolbox({
  addNode,
}: any) {
  const items = [
    {
      type: 'scene',
      label: 'Scene Node',
    },

    {
      type: 'dialogue',
      label: 'Dialogue Node',
    },

    {
      type: 'choice',
      label: 'Choice Node',
    },

    {
      type: 'character',
      label: 'Character Node',
    },
  ]

  return (
    <aside className="w-72 border-r border-zinc-800 bg-[#111111] p-5">
      <h1 className="text-3xl font-black text-red-500">
        Story Engine
      </h1>

      <p className="mt-2 text-sm text-zinc-400">
        Cinematic RP Story System
      </p>

      <div className="mt-10 space-y-4">
        {items.map((item) => (
          <button
            key={item.type}
            onClick={() => addNode(item.type)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-left transition-all hover:border-red-500"
          >
            <h3 className="font-bold">
              {item.label}
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Add cinematic story node
            </p>
          </button>
        ))}
      </div>
    </aside>
  )
}