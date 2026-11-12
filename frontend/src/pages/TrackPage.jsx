import TrackCard from '../components/TrackCard.jsx'

export default function TrackPage({ trackProps }) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Grievance status</p><h1 className="mt-3 text-4xl font-bold text-emerald-950">Track your grievance</h1><p className="mt-3 text-slate-600">Enter the reference number you received after submitting your grievance.</p></div>
      <TrackCard {...trackProps} />
    </main>
  )
}
