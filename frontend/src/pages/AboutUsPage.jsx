const objectives = [
  ['Accessible support', 'Make it simple for residents to bring public service issues to the appropriate office.'],
  ['Clear accountability', 'Record review, department action and status updates so progress can be followed.'],
  ['Timely action', 'Route each grievance to the department best placed to investigate and respond.'],
]

export default function AboutUsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">About the initiative</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">A public service that listens.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">A demonstration portal for making grievance handling easier to follow—from first submission through department action.</p>

      <section className="mt-10 grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[100px_1fr] md:p-9">
        <span className="text-4xl font-bold text-lime-600">01</span>
        <div><h2 className="text-2xl font-bold text-emerald-950">Purpose</h2><p className="mt-3 leading-7 text-slate-600">This portal gives citizens a clear way to submit a grievance, receive a reference number and follow its progress. It models how a Chief Minister’s Office can review concerns and route them to the responsible department.</p></div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl bg-emerald-900 p-7 text-white"><p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">Our vision</p><h2 className="mt-4 text-2xl font-bold">Public services that earn trust.</h2><p className="mt-3 leading-7 text-emerald-100">A responsive grievance process where people can raise concerns and understand what happens next.</p></article>
        <article className="rounded-2xl bg-lime-100 p-7 text-emerald-950"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Our mission</p><h2 className="mt-4 text-2xl font-bold">Listen, route, resolve.</h2><p className="mt-3 leading-7 text-emerald-900/80">Support a consistent process for reviewing citizen concerns, assigning action and communicating progress.</p></article>
      </div>

      <section className="mt-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Objectives</p>
        <h2 className="mt-3 text-3xl font-bold text-emerald-950">Built around meaningful follow-through.</h2>
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
          {objectives.map(([title, description], index) => <article className="grid gap-3 py-5 sm:grid-cols-[60px_1fr]" key={title}><span className="font-bold text-lime-700">0{index + 1}</span><div><h3 className="font-bold text-emerald-950">{title}</h3><p className="mt-1 leading-6 text-slate-600">{description}</p></div></article>)}
        </div>
        <p className="mt-6 text-xs text-slate-500">This is a recruitment prototype and is not an official Government of Kerala service.</p>
      </section>
    </main>
  )
}
