const questions = [
  ['Who can submit a grievance?', 'Citizens with an account can submit a grievance through the portal. Register with your name, email and mobile number, then sign in to begin.'],
  ['What information should I include?', 'Describe the issue clearly, include the district and relevant details, and choose the closest category. You can attach one JPG, PNG or PDF file up to 5 MB.'],
  ['How do I track a grievance?', 'Enter the reference number you received after submission on the Track Grievance page. You can also sign in to see your full grievance history.'],
  ['What do the status updates mean?', 'Submitted means received; Under Review means being assessed; In Progress means action is underway; Resolved means a resolution has been recorded; Reopened means further attention was requested.'],
  ['Can I change a grievance after submitting it?', 'This prototype does not currently support editing the original submission. If you need to add information, use Contact Us and include your reference number.'],
  ['Is the AI suggestion a final decision?', 'No. Any AI generated category or priority is only a suggestion. Review it before submitting; authorized staff make assignment and resolution decisions.'],
]

export default function FAQPage({ onContact }) {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Help centre</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">Frequently asked questions.</h1>
      <p className="mt-4 leading-7 text-slate-600">Quick answers about submitting, tracking and following a grievance.</p>

      <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 shadow-sm">
        {questions.map(([question, answer], index) => (
          <details className="group py-5" key={question} open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-emerald-950">
              {question}<span className="text-xl text-emerald-700 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{answer}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-600">Need more help? <button className="font-semibold text-emerald-700 underline" onClick={onContact}>Contact us</button>.</p>
    </main>
  )
}
