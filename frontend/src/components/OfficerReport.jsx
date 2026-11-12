import { useState } from 'react'
import api from '../api.js'
import Field from './Field.jsx'

export default function OfficerReport({ id, setMessage, refresh }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      await api.post(`/grievances/${id}/action-report`, { text })
      setMessage('Action report sent to the CMO for review')
      setText('')
      refresh()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not send report')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={submit}>
      <h2 className="mb-4 text-xl font-bold text-emerald-950">Submit an action report</h2>
      <Field label="Action taken">
        <textarea className="rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" required minLength="10" rows="4" value={text} onChange={e => setText(e.target.value)} placeholder="Describe the investigation and action taken" />
      </Field>
      <button className="mt-4 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={busy}>{busy ? 'Sending…' : 'Send to CMO'}</button>
    </form>
  )
}
