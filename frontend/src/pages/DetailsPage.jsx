import { useEffect, useState } from 'react'
import OfficerReport from '../components/OfficerReport.jsx'

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

export default function DetailsPage({ selected, user, departments = [], setPage, updateStatus, assignGrievance, busy, setMessage, refresh }) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <button className="font-semibold text-emerald-800 hover:underline" onClick={() => setPage('dashboard')}>← Back to dashboard</button>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">{selected.refId}</p><h1 className="mt-2 text-3xl font-bold text-emerald-950">{selected.subject}</h1><p className="mt-2 text-slate-500">{selected.district} · {selected.category}</p></div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyle(selected.status)}`}>{selected.status}</span>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-emerald-950">Grievance details</h2>
          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">{selected.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5 text-sm">
            <Info label="Priority" value={selected.priority} />
            <Info label="Department" value={selected.department?.name || 'Not yet assigned'} />
            <Info label="Submitted" value={prettyDate(selected.createdAt)} />
            <Info label="Due date" value={selected.dueDate ? prettyDate(selected.dueDate) : 'To be determined'} />
          </div>
          {selected.actionReport?.text && <div className="mt-5 rounded-xl bg-lime-50 p-4"><b className="text-emerald-950">Department action report</b><p className="mt-2 text-sm leading-6 text-slate-600">{selected.actionReport.text}</p></div>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-emerald-950">Progress history</h2>
          <ol className="mt-5 space-y-5 border-l border-emerald-200 pl-5">
            {(selected.history || []).map((item, index) => <li className="relative" key={index}><span className="absolute -left-[25px] top-1 h-3 w-3 rounded-full bg-emerald-700 ring-4 ring-white"/><b className="text-sm text-emerald-950">{item.action}</b><p className="mt-1 text-sm text-slate-600">{item.remark}</p><small className="mt-1 block text-slate-500">{prettyDate(item.at)}</small></li>)}
          </ol>
        </section>
      </div>

      {user.role === 'cmo' && <section className="mt-6 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div><h2 className="text-xl font-bold text-emerald-950">Update status</h2><select className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-3" value={selected.status} onChange={event => updateStatus(selected._id, event.target.value)}><option>Submitted</option><option>Under Review</option><option>In Progress</option><option>Resolved</option><option>Reopened</option></select><p className="mt-2 text-xs text-slate-500">Status changes are recorded in the grievance history.</p></div>
        <CmoAssignment key={selected._id} selected={selected} departments={departments} assignGrievance={assignGrievance} busy={busy}/>
      </section>}

      {user.role === 'officer' && <OfficerReport id={selected._id} setMessage={setMessage} refresh={refresh} />}
    </main>
  )
}

function Info({ label, value }) {
  return <div><small className="block text-slate-500">{label}</small><b className="mt-1 block text-emerald-950">{value}</b></div>
}

function CmoAssignment({ selected, departments, assignGrievance, busy }) {
  const [departmentId, setDepartmentId] = useState(selected.department?._id || '')
  const [remark, setRemark] = useState('')

  useEffect(() => setDepartmentId(selected.department?._id || ''), [selected._id, selected.department?._id])

  async function handleAssign(event) {
    event.preventDefault()
    await assignGrievance(selected._id, { departmentId, remark })
    setRemark('')
  }

  return (
    <form className="border-t border-slate-200 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0" onSubmit={handleAssign}>
      <h2 className="text-xl font-bold text-emerald-950">Forward to a department</h2>
      <label className="mt-4 block text-sm font-medium text-slate-700">Department
        <select className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3" required value={departmentId} onChange={event => setDepartmentId(event.target.value)}>
          <option value="">Choose a department</option>
          {departments.map(department => <option value={department._id} key={department._id}>{department.name}</option>)}
        </select>
      </label>
      <label className="mt-4 block text-sm font-medium text-slate-700">Note for the department
        <textarea className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3" rows="3" value={remark} onChange={event => setRemark(event.target.value)} placeholder="Add instructions or context" />
      </label>
      <button className="mt-4 rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={busy || !departmentId}>{busy ? 'Forwarding…' : 'Forward grievance'}</button>
    </form>
  )
}
