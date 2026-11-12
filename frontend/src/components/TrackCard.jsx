function prettyDate(date) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TrackCard({ trackId, setTrackId, onSubmit, tracked, busy, setPage }) {
  return (
    <section className="grid gap-8 rounded-2xl bg-emerald-900 p-6 text-white shadow-lg md:grid-cols-2 md:p-10">
      <div className="self-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-300">Already submitted?</p>
        <h2 className="text-3xl font-bold">Your update is one lookup away.</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-emerald-100">Enter your reference number to see the latest status and action history.</p>
      </div>

      <div className="rounded-xl bg-white p-5 text-slate-800 md:p-6">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onSubmit}>
          <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Reference number</span>
            <input className="rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" required value={trackId} onChange={e => setTrackId(e.target.value.toUpperCase())} placeholder="e.g. CMK2026-100001" />
          </label>
          <button className="rounded-lg bg-lime-400 px-5 py-3 text-sm font-bold text-emerald-950 hover:bg-lime-300 disabled:opacity-60" disabled={busy}>
            {busy ? 'Searching…' : 'Check status'}
          </button>
        </form>

        {tracked && (
          <div className="mt-5 border-t border-slate-200 pt-5">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{tracked.status}</span>
            <h3 className="mt-3 font-bold">{tracked.subject}</h3>
            <p className="mt-1 text-xs text-slate-500">{tracked.refId} · {tracked.district} · {tracked.department}</p>
            <ol className="mt-4 space-y-4 border-l border-emerald-200 pl-4">
              {tracked.history?.map((item, index) => (
                <li className="relative text-sm" key={index}>
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-700 ring-4 ring-white" />
                  <b className="text-slate-800">{item.action}</b>
                  <small className="mt-1 block text-slate-500">{prettyDate(item.at)}</small>
                </li>
              ))}
            </ol>
            {setPage && <button className="mt-4 text-sm font-semibold text-emerald-800 hover:underline" onClick={() => setPage('auth')}>Sign in to view full details →</button>}
          </div>
        )}
      </div>
    </section>
  )
}
