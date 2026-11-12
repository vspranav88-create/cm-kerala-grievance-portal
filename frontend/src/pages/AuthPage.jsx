import Field from '../components/Field.jsx'

export default function AuthPage({ authMode, setAuthMode, auth, setAuth, onSubmit, busy }) {
  const inputClass = 'rounded-lg border border-slate-300 px-3 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100'

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-2 sm:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Your voice belongs here</p>
        <h1 className="mt-3 max-w-lg text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">{authMode === 'register' ? 'Let’s get you connected.' : 'Welcome back.'}</h1>
        <p className="mt-4 max-w-md leading-7 text-slate-600">Access your grievance dashboard, receive updates and stay connected with the process.</p>
        <div className="mt-8 rounded-xl bg-lime-100 p-4 text-sm text-emerald-950">🔒 Your information is used to process your grievance.</div>
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8" onSubmit={onSubmit}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Citizen access</p>
        <h2 className="mb-6 mt-2 text-2xl font-bold text-emerald-950">{authMode === 'register' ? 'Create an account' : 'Sign in'}</h2>
        {authMode === 'register' && <>
          <Field label="Full name"><input className={inputClass} required value={auth.name} onChange={e => setAuth({ ...auth, name: e.target.value })} placeholder="Your name" /></Field>
          <div className="mt-4"><Field label="Mobile number"><input className={inputClass} required inputMode="numeric" maxLength="10" value={auth.mobile} onChange={e => setAuth({ ...auth, mobile: e.target.value })} placeholder="10-digit mobile number" /></Field></div>
        </>}
        <div className="mt-4"><Field label="Email address"><input className={inputClass} required type="email" value={auth.email} onChange={e => setAuth({ ...auth, email: e.target.value })} placeholder="name@example.com" /></Field></div>
        <div className="mt-4"><Field label="Password"><input className={inputClass} required type="password" minLength="6" value={auth.password} onChange={e => setAuth({ ...auth, password: e.target.value })} placeholder="At least 6 characters" /></Field></div>
        <button className="mt-6 w-full rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={busy}>{busy ? 'Please wait…' : authMode === 'register' ? 'Create account' : 'Sign in'} →</button>
        <p className="mt-5 text-center text-sm text-slate-500">{authMode === 'register' ? 'Already registered?' : 'New to the portal?'} <button className="font-semibold text-emerald-700 hover:underline" type="button" onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}>{authMode === 'register' ? 'Sign in' : 'Create an account'}</button></p>
      </form>
    </main>
  )
}
