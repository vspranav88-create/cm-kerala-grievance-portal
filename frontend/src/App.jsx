import { useEffect, useState } from 'react'
import api from './api.js'
import HomePage from './pages/HomePage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import TrackPage from './pages/TrackPage.jsx'
import SubmitPage from './pages/SubmitPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import HowItWorksPage from './pages/HowItWorksPage.jsx'
import DepartmentsPage from './pages/DepartmentsPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import FAQPage from './pages/FAQPage.jsx'

const emptyAuth = { name: '', email: '', mobile: '', password: '' }
const emptyGrievance = { district: '', category: '', subject: '', description: '', priority: 'Medium' }

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('cmk-user') || 'null'))
  const [page, setPage] = useState(user ? 'dashboard' : 'home')
  const [authMode, setAuthMode] = useState('login')
  const [auth, setAuth] = useState(emptyAuth)
  const [meta, setMeta] = useState({ districts: [], categories: [] })
  const [departments, setDepartments] = useState([])
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, departments: 0 })
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [trackId, setTrackId] = useState('')
  const [tracked, setTracked] = useState(null)
  const [form, setForm] = useState(emptyGrievance)
  const [attachment, setAttachment] = useState(null)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [contactFeedback, setContactFeedback] = useState('')

  useEffect(() => {
    api.get('/meta').then(({ data }) => {
      setMeta(data)
      setForm(old => ({ ...old, district: old.district || data.districts[0] || '', category: old.category || data.categories[0] || '' }))
    }).catch(() => {})
    api.get('/public-stats').then(({ data }) => setStats(data)).catch(() => {})
    api.get('/departments').then(({ data }) => setDepartments(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (user) refreshList()
  }, [user])

  async function refreshList() {
    try {
      const { data } = await api.get('/grievances')
      setItems(Array.isArray(data) ? data : data.grievances || [])
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not load grievances')
    }
  }

  function saveSession(data) {
    localStorage.setItem('cmk-token', data.token)
    localStorage.setItem('cmk-user', JSON.stringify(data.user))
    setUser(data.user)
    setPage('dashboard')
    setMessage(`Welcome, ${data.user.name}`)
  }

  async function submitAuth(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login'
      const { data } = await api.post(endpoint, auth)
      saveSession(data)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not connect to the server')
    } finally {
      setBusy(false)
    }
  }

  function signOut() {
    localStorage.removeItem('cmk-token')
    localStorage.removeItem('cmk-user')
    setUser(null)
    setItems([])
    setSelected(null)
    setPage('home')
    setMessage('You have signed out')
  }

  async function track(event) {
    event.preventDefault()
    setBusy(true)
    setTracked(null)
    setMessage('')
    try {
      const { data } = await api.get(`/grievances/track/${encodeURIComponent(trackId.trim())}`)
      setTracked(data)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not look up that reference number')
    } finally {
      setBusy(false)
    }
  }

  async function analyze() {
    setBusy(true)
    setMessage('')
    try {
      const { data } = await api.post('/ai/analyze', { description: form.description, district: form.district })
      setAiSuggestion(data)
      setForm(old => ({ ...old, category: data.category, priority: data.priority }))
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not generate a suggestion')
    } finally {
      setBusy(false)
    }
  }

  async function submitGrievance(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const body = new FormData()
      Object.entries(form).forEach(([key, value]) => body.append(key, value))
      if (attachment) body.append('attachment', attachment)
      if (aiSuggestion) body.append('aiSuggestion', JSON.stringify(aiSuggestion))
      const { data } = await api.post('/grievances', body, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMessage(`Your grievance was submitted. Reference: ${data.refId}`)
      setForm(old => ({ ...old, subject: '', description: '' }))
      setAttachment(null)
      setAiSuggestion(null)
      setPage('dashboard')
      refreshList()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not submit grievance')
    } finally {
      setBusy(false)
    }
  }

  async function openDetails(item) {
    try {
      const { data } = await api.get(`/grievances/${item._id}`)
      setSelected(data)
      setPage('details')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not open this grievance')
    }
  }

  async function updateStatus(id, status) {
    setBusy(true)
    try {
      await api.put(`/grievances/${id}/status`, { status, remark: 'Updated through the portal dashboard' })
      await refreshList()
      const { data } = await api.get(`/grievances/${id}`)
      setSelected(data)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update status')
    } finally {
      setBusy(false)
    }
  }

  async function assignGrievance(id, assignment) {
    setBusy(true)
    try {
      const { data } = await api.put(`/grievances/${id}/assign`, assignment)
      setSelected(data)
      await refreshList()
      setMessage('Grievance forwarded to the department')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not forward grievance')
    } finally {
      setBusy(false)
    }
  }

  async function submitContact(form) {
    setBusy(true)
    setContactFeedback('')
    try {
      const { data } = await api.post('/contact', form)
      setContactFeedback(data.message || 'Your enquiry has been saved.')
      return true
    } catch (error) {
      setContactFeedback(error.response?.data?.message || 'Could not save your enquiry. Please try again.')
      return false
    } finally {
      setBusy(false)
    }
  }

  const trackProps = { trackId, setTrackId, onSubmit: track, tracked, busy }
  const navLinkClass = 'rounded px-1 py-2 text-[10px] text-[#4e5952] transition-colors hover:text-[#224c39] sm:text-[11px] lg:text-xs'
  const navCtaClass = 'rounded bg-[#234b39] px-3 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-[#173b2b] sm:text-[11px] lg:text-xs'

  return <div className="min-h-screen bg-stone-50 font-sans text-slate-800">
    {/* //header */}
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-col items-start gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <button className="flex shrink-0 items-center gap-3 rounded bg-transparent text-left text-emerald-950" onClick={() => setPage(user ? 'dashboard' : 'home')}>
          <span className="rounded-lg bg-emerald-900 px-2 py-2 text-xs font-bold tracking-wide text-lime-100">കേരളം</span>
          <span><b className="block text-base font-extrabold">CM Kerala</b><small className="mt-0.5 block text-[10px] uppercase tracking-wider text-slate-500">Public Grievance Portal</small></span>
        </button>
        <nav className="flex w-full flex-wrap items-center justify-start gap-x-2 gap-y-1 sm:w-auto sm:justify-end lg:gap-x-3">
          <button className={navLinkClass} onClick={() => setPage('home')}>Home</button>
          <button className={navLinkClass} onClick={() => setPage('about')}>About Us</button>
          <button className={navLinkClass} onClick={() => setPage('how-it-works')}>How It Works</button>
          <button className={navLinkClass} onClick={() => setPage('departments')}>Departments</button>
          <button className={navLinkClass} onClick={() => setPage('faq')}>FAQ</button>
          <button className={navLinkClass} onClick={() => { setTracked(null); setPage('track') }}>Track a grievance</button>
          <button className={navLinkClass} onClick={() => { setContactFeedback(''); setPage('contact') }}>Contact Us</button>
          {user ? <><button className={navLinkClass} onClick={() => setPage('dashboard')}>Dashboard</button><button className={navCtaClass} onClick={signOut}>Sign out</button></>
            : <><button className={navLinkClass} onClick={() => { setAuthMode('login'); setPage('auth') }}>Sign in</button><button className={navCtaClass} onClick={() => { setAuthMode('register'); setPage('auth') }}>Register</button></>}
        </nav>
      </div>
    </header>

    {message && <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-lg border-l-4 border-lime-600 bg-lime-50 px-4 py-3 text-sm text-emerald-950" role="status"><span>{message}</span><button className="ml-4 text-xl text-emerald-800" onClick={() => setMessage('')} aria-label="Dismiss">×</button></div>}

    {page === 'home' && <HomePage user={user} stats={stats} departments={departments} trackProps={trackProps} setPage={setPage} setAuthMode={setAuthMode} />}
    {page === 'about' && <AboutUsPage />}
    {page === 'how-it-works' && <HowItWorksPage />}
    {page === 'departments' && <DepartmentsPage departments={departments} />}
    {page === 'contact' && <ContactUsPage onSubmit={submitContact} busy={busy} feedback={contactFeedback} />}
    {page === 'faq' && <FAQPage onContact={() => { setContactFeedback(''); setPage('contact') }} />}
    {page === 'auth' && <AuthPage authMode={authMode} setAuthMode={setAuthMode} auth={auth} setAuth={setAuth} onSubmit={submitAuth} busy={busy} />}
    {page === 'track' && <TrackPage trackProps={{ ...trackProps, setPage }} />}
    {page === 'submit' && user?.role === 'citizen' && <SubmitPage meta={meta} form={form} setForm={setForm} attachment={attachment} setAttachment={setAttachment} aiSuggestion={aiSuggestion} busy={busy} analyze={analyze} onSubmit={submitGrievance} />}
    {page === 'dashboard' && user && <DashboardPage user={user} items={items} setPage={setPage} onOpen={openDetails} />}
    {page === 'details' && selected && user && <DetailsPage selected={selected} user={user} departments={departments} setPage={setPage} updateStatus={updateStatus} assignGrievance={assignGrievance} busy={busy} setMessage={setMessage} refresh={() => openDetails({ _id: selected._id })} />}

    <footer className="mt-16 border-t border-emerald-900/10 bg-white px-5 py-8 text-sm text-slate-500 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><b className="block text-emerald-950">CM Kerala</b><span>Public Grievance Portal</span></div>
        <p>A recruitment prototype. Not an official Government of Kerala service.</p>
        <span>© 2026 · Public accountability</span>
      </div>
    </footer>
  </div>
}

export default App
