function formatTime(timestamp) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp);
}

export default function LivekitTranscript({ items }) {
  return (
    <section className="flex min-h-[30rem] flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Conversation</p>
          <h2 className="text-lg font-bold tracking-tight text-gray-900">Live Transcript</h2>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {items.length} messages
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            Start the LiveKit session to see user and agent transcripts here.
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl px-4 py-3 ${
                item.speaker === 'assistant' ? 'bg-gray-900 text-white' : 'bg-sky-50 text-slate-900'
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    item.speaker === 'assistant' ? 'text-white/70' : 'text-sky-700'
                  }`}
                >
                  {item.speaker === 'assistant' ? 'AI' : 'You'}
                </span>
                <span
                  className={`text-xs ${item.speaker === 'assistant' ? 'text-white/60' : 'text-slate-500'}`}
                >
                  {formatTime(item.timestamp)}
                </span>
              </div>
              <p className="text-sm leading-6">{item.text}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
