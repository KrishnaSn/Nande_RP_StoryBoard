export default function EpisodeTimeline() {
  const episodes = [
    'EP1',
    'EP2',
    'EP3',
    'EP4',
  ]

  return (
    <div className="h-28 border-t border-zinc-800 bg-[#111111] px-6 py-4">
      <h3 className="text-sm font-bold text-zinc-400">
        Episode Timeline
      </h3>

      <div className="mt-4 flex gap-4 overflow-x-auto">
        {episodes.map((ep) => (
          <div
            key={ep}
            className="min-w-[140px] rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4"
          >
            <h4 className="font-bold">
              {ep}
            </h4>

            <p className="mt-1 text-xs text-zinc-500">
              Story Arc
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}