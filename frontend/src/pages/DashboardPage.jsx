function prettyDate(date) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusStyle(status) {
  if (status === 'Resolved') return 'bg-green-100 text-green-800'
  if (status === 'In Progress') return 'bg-blue-100 text-blue-800'
  if (status === 'Under Review') return 'bg-amber-100 text-amber-800'
  if (status === 'Reopened') return 'bg-orange-100 text-orange-800'
  return 'bg-slate-100 text-slate-700'
}

export default function DashboardPage({ user, items, setPage, onOpen }) {
  const isStaff = user.role !== 'citizen'
  const greeting = user.role === 'cmo' ? 'Chief Minister’s Office' : user.role === 'officer' ? 'Department workspace' : 'My grievances'
  const resolvedCount = items.filter(item => item.status === 'Resolved').length

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{user.role} portal</p><h1 className="mt-2 text-4xl font-bold text-emerald-950">{greeting}</h1><p className="mt-2 text-slate-600">{user.name} · {user.email}</p></div>
        {user.role === 'citizen' && <button className="rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-700" onClick={() => setPage('submit')}>Submit a grievance →</button>}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard number={items.length} label={isStaff ? 'Grievances in this workspace' : 'Your submissions'} />
        <SummaryCard number={resolvedCount} label="Resolved" />
        <SummaryCard number={items.length - resolvedCount} label="Open" />
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-emerald-950">No grievances yet</h2>
          <p className="mt-2 text-sm text-slate-500">When a grievance is submitted or assigned, it will appear here.</p>
          {user.role === 'citizen' && <button className="mt-5 rounded-lg bg-lime-300 px-5 py-3 font-semibold text-emerald-950" onClick={() => setPage('submit')}>Start a submission</button>}
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map(item => (
            <button className="grid w-full gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:grid-cols-[1fr_auto] sm:items-center" key={item._id} onClick={() => onOpen(item)}>
              <div><span className="text-xs font-bold tracking-wider text-emerald-700">{item.refId}</span><h3 className="mt-2 font-bold text-emerald-950">{item.subject}</h3><p className="mt-1 text-sm text-slate-500">{item.district} · {item.category}</p></div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(item.status)}`}>{item.status}</span><small className="text-slate-500">{prettyDate(item.createdAt)}</small></div>
            </button>
          ))}
        </div>
      )}
    </main>
  )
}

function SummaryCard({ number, label }) {
  return <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-3xl font-bold text-emerald-900">{number}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>
}
