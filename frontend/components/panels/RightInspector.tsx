export default function RightInspector({
  selectedNode,
}: any) {
  return (
    <aside className="w-80 border-l border-zinc-800 bg-[#111111] p-5">
      <h2 className="text-2xl font-black">
        Inspector
      </h2>

      {!selectedNode ? (
        <p className="mt-5 text-zinc-500">
          Select a node to inspect.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm text-zinc-500">
              Node ID
            </label>

            <div className="mt-2 rounded-xl bg-zinc-900 p-3">
              {selectedNode.id}
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-500">
              Node Type
            </label>

            <div className="mt-2 rounded-xl bg-zinc-900 p-3">
              {selectedNode.type}
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-500">
              Story Notes
            </label>

            <textarea
              className="mt-2 h-40 w-full rounded-xl border border-zinc-700 bg-black p-4 outline-none"
              placeholder="Director notes..."
            />
          </div>
        </div>
      )}
    </aside>
  )
}