export default function DepartmentsPage({ departments = [] }) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Public service directory</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">Departments ready to help.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">Sample departments that may receive grievances through this demonstration portal.</p>

      {departments.length ? (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map(department => (
            <article className="flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" key={department._id || department.code}>
              <span className="w-fit rounded-full bg-lime-100 px-3 py-1 text-xs font-bold tracking-wide text-emerald-900">{department.code}</span>
              <h2 className="mt-4 text-lg font-bold text-emerald-950">{department.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{department.description || 'Responsible for public services and related concerns.'}</p>
              <span className="mt-auto pt-4 text-xs font-semibold text-emerald-700">{department.category || 'Public service'}</span>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-9 rounded-2xl bg-white p-8 text-center shadow-sm"><h2 className="font-bold text-emerald-950">Department directory is loading</h2><p className="mt-2 text-sm text-slate-500">Please try again shortly.</p></div>
      )}
    </main>
  )
}
