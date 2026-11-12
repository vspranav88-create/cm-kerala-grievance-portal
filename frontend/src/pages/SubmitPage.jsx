import Field from '../components/Field.jsx'

const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100'

export default function SubmitPage({ meta, form, setForm, attachment, setAttachment, aiSuggestion, busy, analyze, onSubmit }) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">New submission</p><h1 className="mt-3 text-4xl font-bold text-emerald-950">Tell us what happened</h1><p className="mt-3 text-slate-600">Share the details so we can send your grievance to the right place.</p></div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="District"><select className={inputClass} required value={form.district} onChange={event => setForm({ ...form, district: event.target.value })}>{meta.districts.map(item => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Category"><select className={inputClass} required value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{meta.categories.map(item => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Subject" wide><input className={inputClass} required maxLength="160" value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} placeholder="Briefly describe the issue" /></Field>
          <Field label="Description" wide><textarea className={inputClass} required minLength="20" rows="6" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="Include the location, dates and what action you are requesting. At least 20 characters." /></Field>
        </div>

        <div className="mt-6 flex flex-wrap items-end gap-4">
          <button className="rounded-lg border border-emerald-800 px-4 py-3 font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50" type="button" onClick={analyze} disabled={busy || form.description.length < 20}>✦ Suggest category &amp; priority</button>
          <Field label="Priority"><select className={inputClass} value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></Field>
         
        </div>

        {aiSuggestion && <div className="mt-5 rounded-xl border-l-4 border-lime-500 bg-lime-50 p-4"><b className="text-emerald-950">AI suggestion for your review</b><p className="mt-2 text-sm font-semibold text-emerald-800">{aiSuggestion.category} · {aiSuggestion.priority} priority</p><p className="mt-2 text-sm leading-6 text-slate-600">{aiSuggestion.summary}</p><small className="mt-2 block text-slate-500">{aiSuggestion.note || 'Please review the suggestion; you remain in control of your submission.'}</small></div>}

        <p className="mt-5 text-xs leading-5 text-slate-500">Your grievance is visible to you and authorized staff. Please do not include passwords or financial account details.</p>
        <button className="mt-5 rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={busy}>{busy ? 'Submitting…' : 'Submit grievance'} →</button>
      </form>
    </main>
  )
}
