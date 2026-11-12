export default function Field({ label, children, wide = false }) {
  return (
    <label className={`flex flex-col gap-2 text-sm font-medium text-slate-700 ${wide ? 'md:col-span-2' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}
