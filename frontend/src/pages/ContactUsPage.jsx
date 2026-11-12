import { useState } from 'react'
import Field from '../components/Field.jsx'

const initialForm = { name: '', email: '', subject: '', message: '' }
const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100'

export default function ContactUsPage({ onSubmit, busy, feedback }) {
  const [form, setForm] = useState(initialForm)

  async function submit(event) {
    event.preventDefault()
    const saved = await onSubmit(form)
    if (saved) setForm(initialForm)
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Contact us</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">How can we help?</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">Send a question or feedback about using this demonstration portal.</p>

      <div className="mt-9 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-2xl bg-emerald-900 p-7 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">A quick note</p>
          <h2 className="mt-4 text-2xl font-bold">For grievance updates, use your reference number.</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-100">This form is for portal enquiries. It does not submit a public grievance or replace the tracking page.</p>
          <p className="mt-6 border-t border-white/20 pt-4 text-sm leading-6 text-emerald-100">Enquiries are saved for the portal team. Please don’t include passwords or bank details.</p>
        </aside>

        <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={submit}>
          <Field label="Name"><input className={inputClass} required maxLength="120" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></Field>
          <Field label="Email"><input className={inputClass} required type="email" maxLength="160" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" /></Field>
          <Field label="Subject"><input className={inputClass} required maxLength="160" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What is your enquiry about?" /></Field>
          <Field label="Message"><textarea className={inputClass} required maxLength="3000" rows="6" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your message" /></Field>
          {feedback && <p className="rounded-lg bg-lime-50 p-3 text-sm text-emerald-900" role="status">{feedback}</p>}
          <button className="w-fit rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={busy}>{busy ? 'Sending…' : 'Send enquiry'} →</button>
        </form>
      </div>
    </main>
  )
}
