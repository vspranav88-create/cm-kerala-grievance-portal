import TrackCard from '../components/TrackCard.jsx'

export default function HomePage({ user, stats, departments = [], trackProps, setPage, setAuthMode }) {
  const hasActivity = stats.total > 0
  const total = hasActivity ? stats.total : 12480
  const resolved = hasActivity ? stats.resolved : 10934
  const departmentCount = departments.length || stats.departments || 9

  return (
    <main>
      <section className="bg-emerald-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">A direct channel to public service</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">Your concern.<br /><span className="text-lime-300">Our responsibility.</span></h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-emerald-100">Submit a grievance to the Chief Minister’s Office and follow its progress with a reference number.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-lg bg-lime-400 px-5 py-3 font-bold text-emerald-950 shadow hover:bg-lime-300" onClick={() => user ? setPage('submit') : (setAuthMode('register'), setPage('auth'))}>Submit a grievance →</button>
              <button className="rounded-lg border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10" onClick={() => setPage('track')}>Track a grievance</button>
            </div>
            <p className="mt-6 text-sm text-emerald-200">● Transparent updates at every step</p>
          </div>
          <div className="relative flex min-h-72 overflow-hidden rounded-3xl shadow-xl md:min-h-[400px]">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://assets.entrepreneur.com/content/3x2/2000/1721926356-digital-government-public-services-g-1478282793.jpg?format=pjeg&auto=webp"
              alt="A house beside the Kerala backwaters"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/10 to-transparent" />

            <div className="relative mt-auto w-full p-6 md:p-8">
              <div className="max-w-xs rounded-2xl bg-white/95 p-5 text-emerald-950 shadow-xl backdrop-blur-sm">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-lime-100 text-2xl text-emerald-800">
                  ✓
                </div>

                <p className="mt-3 font-bold">Every voice matters</p>
                <p className="mt-1 text-sm text-slate-600">
                  We’ll keep you informed
                </p>
              </div>
            </div>

            <p className="absolute right-5 top-5 rounded-full bg-emerald-950/70 px-3 py-1 text-[10px] font-bold tracking-widest text-white">
              KERALA · PUBLIC SERVICE
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:grid-cols-3 sm:px-8">
        <Stat number={total} label={hasActivity ? 'Grievances received' : 'Sample grievances received'} />
        <Stat number={resolved} label={hasActivity ? 'Resolved' : 'Sample resolved'} />
        <Stat number={departmentCount} label="Departments" />
      </section>
      {!hasActivity && <p className="mx-auto -mt-4 max-w-7xl px-5 pb-4 text-xs text-slate-500 sm:px-8">Sample figures for this prototype. Live totals appear after grievances have been submitted.</p>}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">How it works</p>
        <h2 className="mt-2 text-3xl font-bold text-emerald-950">From concern to resolution.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <Step number="01" title="Tell us what happened" text="Share the issue, location and department. Attach a supporting document if useful." />
          <Step number="02" title="We route it for action" text="Your grievance is reviewed and sent to the responsible department." />
          <Step number="03" title="Follow every update" text="Use your reference number to see the latest status and progress history." />
        </div>
      </section>

      <section className="bg-lime-50 py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Service directory</p><h2 className="mt-2 text-3xl font-bold text-emerald-950">Featured departments</h2></div>
            <button className="font-semibold text-emerald-800 hover:underline" onClick={() => setPage('departments')}>View all departments →</button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {departments.slice(0, 4).map(department => <article className="rounded-xl border border-emerald-900/10 bg-white p-5" key={department._id || department.code}><span className="text-xs font-bold uppercase tracking-widest text-lime-700">{department.code}</span><h3 className="mt-3 font-bold text-emerald-950">{department.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{department.description}</p></article>)}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><TrackCard {...trackProps} setPage={setPage} /></div>
    </main>
  )
}

function Stat({ number, label }) {
  return <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-3xl font-bold text-emerald-900">{Number(number).toLocaleString('en-IN')}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>
}

function Step({ number, title, text }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-6"><span className="text-sm font-bold tracking-widest text-lime-700">{number}</span><h3 className="mt-4 font-bold text-emerald-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>
}
