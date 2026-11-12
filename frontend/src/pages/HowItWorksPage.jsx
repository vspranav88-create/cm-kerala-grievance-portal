const steps = [
  ['Submit your grievance', 'Choose a district and category, describe the issue and attach a supporting file if useful. You receive a unique reference number after submission.'],
  ['CMO review', 'The Chief Minister’s Office reviews the grievance, checks its details and decides which department should handle it.'],
  ['Department assignment', 'The grievance is forwarded to the relevant department for investigation and action. Its status and updates are recorded.'],
  ['Action and resolution', 'The department reports its action. The CMO reviews the report and updates the outcome so the citizen can follow progress.'],
]

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">The grievance journey</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">Every step, made clearer.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">From submitting a concern to seeing the outcome, the process keeps a visible record of progress.</p>

      <div className="mt-10 space-y-4">
        {steps.map(([title, description], index) => (
          <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[64px_1fr] sm:p-8" key={title}>
            <span className="text-3xl font-bold text-lime-600">0{index + 1}</span>
            <div><h2 className="text-xl font-bold text-emerald-950">{title}</h2><p className="mt-2 max-w-3xl leading-7 text-slate-600">{description}</p></div>
          </article>
        ))}
      </div>

      <aside className="mt-8 rounded-2xl bg-lime-100 p-6 text-emerald-950"><b>Keep your reference number</b><p className="mt-2 text-sm leading-6">Use it any time on the Track Grievance page to view the latest public status and action history.</p></aside>
    </main>
  )
}
