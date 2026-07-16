import {
  BriefcaseBusiness,
  ImagePlus,
  LockKeyhole,
  LogOut,
  Mail,
  Save,
  Settings,
  Trash2,
  Upload,
  UserPlus,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { assetUrl, requestJson, requestUpload } from '../api'

const emptySettings = {
  contactEmail: '',
  contactPhone: '',
  address: '',
  facebookUrl: '',
  linkedinUrl: '',
}

const emptyJob = {
  title: '',
  location: '',
  employmentType: 'Full Time',
  experience: '',
  description: '',
  requirements: '',
  applyEmail: '',
  applyLink: '',
  closingDate: '',
  featured: false,
  active: true,
}

const emptyTeam = {
  name: '',
  designation: '',
  bio: '',
  imageUrl: '',
  linkedinUrl: '',
  sortOrder: 0,
  highlighted: false,
  active: true,
}

const emptyPortfolio = {
  title: '',
  caption: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 0,
  active: true,
}

const emptyAdmin = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  role: 'ADMIN',
  photoUrl: '',
  active: true,
}

const tabs = [
  ['settings', 'Settings', Settings],
  ['portfolio', 'Portfolio', BriefcaseBusiness],
  ['jobs', 'Jobs', BriefcaseBusiness],
  ['team', 'Team', UsersRound],
  ['contacts', 'Contacts', Mail],
  ['admins', 'Admins', UserPlus],
]

const tabTitles = {
  settings: 'Website Settings',
  portfolio: 'Portfolio Details',
  jobs: 'Job Details',
  team: 'Team Profile',
  contacts: 'Contact Messages',
  admins: 'Admin Account',
}

const inputClass = 'admin-input min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500'
const textareaClass = 'admin-input min-h-28 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500'
const isPublishedImageUrl = (url) => /^https?:\/\//i.test(url || '') || /^\/uploads\//i.test(url || '')
const siteUpdateKey = 'codelux_site_data_updated'

const AdminPanel = () => {
  const [token, setToken] = useState(() => localStorage.getItem('codelux_admin_token') || '')
  const [authForm, setAuthForm] = useState({ fullName: '', username: 'admin', email: 'rupnar8459@gmail.com', password: '' })
  const [activeTab, setActiveTab] = useState('settings')
  const [message, setMessage] = useState('')
  const [settingsForm, setSettingsForm] = useState(emptySettings)
  const [jobForm, setJobForm] = useState(emptyJob)
  const [teamForm, setTeamForm] = useState(emptyTeam)
  const [portfolioForm, setPortfolioForm] = useState(emptyPortfolio)
  const [adminForm, setAdminForm] = useState(emptyAdmin)
  const [editing, setEditing] = useState({ job: null, team: null, portfolio: null, admin: null })
  const [uploadFile, setUploadFile] = useState(null)
  const [teamPhotoFile, setTeamPhotoFile] = useState(null)
  const [portfolioImageFile, setPortfolioImageFile] = useState(null)
  const [uploadFolder, setUploadFolder] = useState('slider')
  const [data, setData] = useState({ jobs: [], team: [], contacts: [], admins: [], media: [] })
  const [publicSettings, setPublicSettings] = useState(null)

  const isLoggedIn = Boolean(token)
  const counts = useMemo(() => ({
    jobs: data.jobs.length,
    portfolio: data.media.filter((item) => item.mediaType === 'PORTFOLIO').length,
    team: data.team.length,
    contacts: data.contacts.filter((item) => item.status === 'NEW').length,
    admins: data.admins.length,
  }), [data])

  const setField = (setter) => (event) => {
    const { name, type, checked, value } = event.target
    setter((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const notifySiteDataChanged = () => {
    localStorage.setItem(siteUpdateKey, String(Date.now()))
  }

  const loadDashboard = async (currentToken = token) => {
    if (!currentToken) return
    const [settings, jobs, team, contacts, admins, media] = await Promise.all([
      requestJson('/api/admin/settings', { token: currentToken }),
      requestJson('/api/admin/jobs', { token: currentToken }),
      requestJson('/api/admin/team', { token: currentToken }),
      requestJson('/api/admin/contacts', { token: currentToken }),
      requestJson('/api/admin/admins', { token: currentToken }),
      requestJson('/api/admin/media', { token: currentToken }),
    ])
    setSettingsForm({ ...emptySettings, ...settings })
    setData({ jobs, team, contacts, admins, media })
  }

  useEffect(() => {
    if (!token) return
    loadDashboard().catch((error) => {
      setMessage(error.message)
      setToken('')
      localStorage.removeItem('codelux_admin_token')
    })
  }, [token])

  useEffect(() => {
    if (token) return
    let cancelled = false
    requestJson('/api/public/settings')
      .then((settings) => {
        if (!cancelled) setPublicSettings(settings)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    const folderByTab = {
      settings: 'img',
      portfolio: 'portfolio',
      team: teamForm.highlighted ? 'owner' : 'team',
      admins: 'admin',
    }
    if (folderByTab[activeTab]) {
      setUploadFolder(folderByTab[activeTab])
    }
  }, [activeTab, teamForm.highlighted])

  useEffect(() => {
    setUploadFile(null)
    setTeamPhotoFile(null)
    setPortfolioImageFile(null)
  }, [activeTab])

  const submitAuth = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      const result = await requestJson('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: authForm.email, password: authForm.password }),
      })
      localStorage.setItem('codelux_admin_token', result.token)
      setToken(result.token)
      setMessage('Welcome to CODELUX admin.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const logout = async () => {
    localStorage.removeItem('codelux_admin_token')
    setToken('')
  }

  const saveSettings = async (event) => {
    event.preventDefault()
    const result = await requestJson('/api/admin/settings', { method: 'PUT', token, body: JSON.stringify(settingsForm) })
    setSettingsForm({ ...emptySettings, ...result })
    notifySiteDataChanged()
    setMessage('Settings saved.')
  }

  const uploadSelectedImage = async (file = uploadFile, folder = uploadFolder) => {
    if (!file) {
      setMessage('Choose an image first.')
      return null
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    const result = await requestUpload('/api/admin/uploads', formData, token)
    return result.url
  }

  const uploadImage = async () => {
    const imageUrl = await uploadSelectedImage()
    if (!imageUrl) return
    if (activeTab === 'admins') {
      const updatedAdmin = { ...adminForm, photoUrl: imageUrl }
      setAdminForm(updatedAdmin)
      if (editing.admin) {
        await requestJson(`/api/admin/admins/${editing.admin}`, {
          method: 'PUT',
          token,
          body: JSON.stringify({ ...updatedAdmin, password: updatedAdmin.password || null }),
        })
        await loadDashboard()
        setMessage('Admin profile image uploaded to Cloudinary and saved.')
        return
      }
    }
    setMessage('Image uploaded to Cloudinary. Save the admin to publish it.')
  }

  const uploadSettingsImage = async (file, key, label) => {
    const imageUrl = await uploadSelectedImage(file, 'img')
    if (!imageUrl) return
    setSettingsForm((current) => ({ ...current, [key]: imageUrl }))
    setMessage(`${label} uploaded. Save settings to publish it.`)
  }

  const saveJob = async (event) => {
    event.preventDefault()
    const payload = { ...jobForm, closingDate: jobForm.closingDate || null }
    const path = editing.job ? `/api/admin/jobs/${editing.job}` : '/api/admin/jobs'
    const method = editing.job ? 'PUT' : 'POST'
    await requestJson(path, { method, token, body: JSON.stringify(payload) })
    setJobForm(emptyJob)
    setEditing((current) => ({ ...current, job: null }))
    await loadDashboard()
    notifySiteDataChanged()
    setMessage('Job saved.')
  }

  const saveTeam = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      let payload = { ...teamForm, imageUrl: isPublishedImageUrl(teamForm.imageUrl) ? teamForm.imageUrl : '', sortOrder: 0 }
      if (teamPhotoFile) {
        const imageUrl = await uploadSelectedImage(teamPhotoFile, teamForm.highlighted ? 'owner' : 'team')
        if (!imageUrl) return
        payload = { ...payload, imageUrl }
        setTeamForm((current) => ({ ...current, imageUrl }))
      }
      const path = editing.team ? `/api/admin/team/${editing.team}` : '/api/admin/team'
      const method = editing.team ? 'PUT' : 'POST'
      await requestJson(path, { method, token, body: JSON.stringify(payload) })
      setTeamForm(emptyTeam)
      setTeamPhotoFile(null)
      setEditing((current) => ({ ...current, team: null }))
      await loadDashboard()
      notifySiteDataChanged()
      setMessage(payload.imageUrl ? 'Team member saved with profile photo.' : 'Team member saved.')
    } catch (error) {
      setMessage(error.message || 'Team member could not be saved.')
    }
  }

  const savePortfolio = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      let payload = {
        ...portfolioForm,
        mediaType: 'PORTFOLIO',
        imageUrl: isPublishedImageUrl(portfolioForm.imageUrl) ? portfolioForm.imageUrl : '',
        sortOrder: Number(portfolioForm.sortOrder) || 0,
      }
      if (portfolioImageFile) {
        const imageUrl = await uploadSelectedImage(portfolioImageFile, 'portfolio')
        if (!imageUrl) return
        payload = { ...payload, imageUrl }
        setPortfolioForm((current) => ({ ...current, imageUrl }))
      }
      const path = editing.portfolio ? `/api/admin/media/${editing.portfolio}` : '/api/admin/media'
      const method = editing.portfolio ? 'PUT' : 'POST'
      await requestJson(path, { method, token, body: JSON.stringify(payload) })
      setPortfolioForm(emptyPortfolio)
      setPortfolioImageFile(null)
      setEditing((current) => ({ ...current, portfolio: null }))
      await loadDashboard()
      notifySiteDataChanged()
      setMessage(payload.imageUrl ? 'Portfolio item saved with image.' : 'Portfolio item saved.')
    } catch (error) {
      setMessage(error.message || 'Portfolio item could not be saved.')
    }
  }

  const saveAdmin = async (event) => {
    event.preventDefault()
    let payload = editing.admin && !adminForm.password ? { ...adminForm, password: null } : { ...adminForm }
    if (uploadFile) {
      const imageUrl = await uploadSelectedImage()
      if (!imageUrl) return
      payload = { ...payload, photoUrl: imageUrl }
      setAdminForm((current) => ({ ...current, photoUrl: imageUrl }))
    }
    const path = editing.admin ? `/api/admin/admins/${editing.admin}` : '/api/admin/admins'
    const method = editing.admin ? 'PUT' : 'POST'
    const savedAdmin = await requestJson(path, { method, token, body: JSON.stringify(payload) })
    setAdminForm(emptyAdmin)
    setUploadFile(null)
    setEditing((current) => ({ ...current, admin: null }))
    await loadDashboard()
    setMessage(savedAdmin.photoUrl ? 'Admin saved with Cloudinary profile image.' : 'Admin saved.')
  }

  const removeItem = async (path) => {
    await requestJson(path, { method: 'DELETE', token })
    await loadDashboard()
    notifySiteDataChanged()
    setMessage('Deleted.')
  }

  const updateContactStatus = async (id, status) => {
    await requestJson(`/api/admin/contacts/${id}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    })
    await loadDashboard()
  }

  const brandSettings = isLoggedIn ? settingsForm : publicSettings
  const adminCompanyName = brandSettings?.companyName || 'CODELUX'
  const adminLogoSrc = assetUrl(brandSettings?.logoUrl)

  if (!isLoggedIn) {
    return (
      <main className="admin-login-shell min-h-screen bg-slate-950 text-white">
        <div className="animated-grid absolute inset-0 opacity-20" aria-hidden="true"></div>
        <div className="admin-login-glow admin-login-glow-one" aria-hidden="true"></div>
        <div className="admin-login-glow admin-login-glow-two" aria-hidden="true"></div>
        <section className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:grid-cols-[1fr_430px] lg:gap-12 lg:px-8">
          <div className="admin-login-copy">
            <a className="admin-login-brand mb-8 inline-flex items-center gap-4 text-white no-underline" href="/">
              <AdminLogo logoSrc={adminLogoSrc} />
              <span>
                <strong>{adminCompanyName}</strong>
                <small>Admin Control Panel</small>
              </span>
            </a>
            <p className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-black uppercase text-blue-300">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Secure Admin
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-normal sm:text-6xl">
              Manage your website content with confidence.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Manage website images, jobs, owner details, company settings, and contact messages.
            </p>
            <div className="admin-login-points mt-8 grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
              {['Media Uploads', 'Team Profiles', 'Live Website Data'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <form className="admin-login-card rounded-lg border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-slate-950/30" onSubmit={submitAuth}>
            <div className="mb-6 flex items-center gap-4">
              <AdminLogo logoSrc={adminLogoSrc} />
              <div>
                <h2 className="text-xl font-black text-slate-950">Admin Login</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{adminCompanyName}</p>
              </div>
            </div>
            <input className={`${inputClass} mb-3 w-full`} name="email" onChange={setField(setAuthForm)} placeholder="Admin email" required type="email" value={authForm.email} />
            <input className={`${inputClass} mb-4 w-full`} name="password" onChange={setField(setAuthForm)} placeholder="Password" required type="password" value={authForm.password} />
            <button className="admin-primary-button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700" type="submit">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Login
            </button>
            {message ? <p className="mt-4 text-sm font-black text-slate-600">{message}</p> : null}
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-shell min-h-screen bg-slate-100 text-slate-950">
      <header className="admin-header sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <a className="admin-brand text-xl font-black text-slate-950 no-underline" href="/">
            <AdminLogo logoSrc={adminLogoSrc} compact />
            <span>
              <strong>{adminCompanyName}</strong>
              <small>Admin</small>
            </span>
          </a>
          <div className="admin-tabs flex flex-wrap items-center gap-2">
            {tabs.map(([key, label, Icon]) => (
              <button className={`admin-tab inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-black transition ${activeTab === key ? 'is-active bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`} key={key} onClick={() => setActiveTab(key)} type="button">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                {counts[key] ? <span className="admin-tab-count rounded bg-white/20 px-1.5 text-xs">{counts[key]}</span> : null}
              </button>
            ))}
            <button className="admin-logout inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-black text-white" onClick={logout} type="button">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {message ? <p className="admin-message mb-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">{message}</p> : null}

        {activeTab === 'settings' ? (
          <form className="admin-card admin-form admin-settings-form grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2" data-title={tabTitles.settings} onSubmit={saveSettings}>
            {Object.keys(emptySettings).map((key) => (
              key.includes('Description') || key === 'address'
                ? <textarea className={textareaClass} key={key} name={key} onChange={setField(setSettingsForm)} placeholder={key} value={settingsForm[key] || ''}></textarea>
                : <input className={inputClass} key={key} name={key} onChange={setField(setSettingsForm)} placeholder={key} value={settingsForm[key] || ''} />
            ))}
            <SettingsImageUploader
              imageUrl={settingsForm.logoUrl}
              label="Website Logo"
              onUpload={(file) => uploadSettingsImage(file, 'logoUrl', 'Website logo')}
            />
            <SettingsImageUploader
              imageUrl={settingsForm.faviconUrl}
              label="Favicon Icon"
              onUpload={(file) => uploadSettingsImage(file, 'faviconUrl', 'Favicon icon')}
            />
            <button className="admin-primary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-black text-white lg:col-span-2" type="submit">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Settings
            </button>
          </form>
        ) : null}

        {activeTab === 'portfolio' ? (
          <CrudPanel form={(
            <form className="admin-card admin-form admin-portfolio-form grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" data-title={tabTitles.portfolio} onSubmit={savePortfolio}>
              <input className={inputClass} name="title" onChange={setField(setPortfolioForm)} placeholder="Project title" required value={portfolioForm.title || ''} />
              <textarea className={textareaClass} name="caption" onChange={setField(setPortfolioForm)} placeholder="Project description" value={portfolioForm.caption || ''}></textarea>
              <input className={inputClass} name="linkUrl" onChange={setField(setPortfolioForm)} placeholder="Project link URL" value={portfolioForm.linkUrl || ''} />
              <input className={inputClass} min="0" name="sortOrder" onChange={setField(setPortfolioForm)} placeholder="Sort order" type="number" value={portfolioForm.sortOrder ?? 0} />
              <label className="inline-flex items-center gap-2 text-sm font-black"><input checked={portfolioForm.active} name="active" onChange={setField(setPortfolioForm)} type="checkbox" /> Active</label>
              <PortfolioImagePicker
                file={portfolioImageFile}
                imageUrl={portfolioForm.imageUrl}
                onClear={() => {
                  setPortfolioImageFile(null)
                  setPortfolioForm((current) => ({ ...current, imageUrl: '' }))
                }}
                onFile={(file) => {
                  setPortfolioImageFile(file)
                  if (file) {
                    setPortfolioForm((current) => ({ ...current, imageUrl: '' }))
                  }
                }}
              />
              <button className="admin-primary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-black text-white" type="submit"><Save className="h-4 w-4" />Save Portfolio</button>
            </form>
          )} list={data.media.filter((item) => item.mediaType === 'PORTFOLIO').map((item) => (
            <ListRow
              image={item.imageUrl}
              key={item.id}
              onDelete={() => removeItem(`/api/admin/media/${item.id}`)}
              onEdit={() => {
                setPortfolioForm({ ...emptyPortfolio, ...item, sortOrder: item.sortOrder ?? 0 })
                setEditing((current) => ({ ...current, portfolio: item.id }))
              }}
              subtitle={`${item.active ? 'Active' : 'Hidden'} | Sort ${item.sortOrder ?? 0}`}
              title={item.title}
            />
          ))} />
        ) : null}

        {activeTab === 'jobs' ? (
          <CrudPanel form={(
            <form className="admin-card admin-form admin-job-form grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" data-title={tabTitles.jobs} onSubmit={saveJob}>
              {['title', 'location', 'employmentType', 'experience', 'applyEmail', 'applyLink', 'closingDate'].map((key) => <input className={inputClass} key={key} name={key} onChange={setField(setJobForm)} placeholder={key === 'applyLink' ? 'Apply link URL' : key} required={key === 'title'} type={key === 'closingDate' ? 'date' : 'text'} value={jobForm[key] || ''} />)}
              <textarea className={textareaClass} name="description" onChange={setField(setJobForm)} placeholder="Description" value={jobForm.description}></textarea>
              <textarea className={textareaClass} name="requirements" onChange={setField(setJobForm)} placeholder="Requirements" value={jobForm.requirements}></textarea>
              <label className="inline-flex items-center gap-2 text-sm font-black"><input checked={jobForm.featured} name="featured" onChange={setField(setJobForm)} type="checkbox" /> Featured</label>
              <label className="inline-flex items-center gap-2 text-sm font-black"><input checked={jobForm.active} name="active" onChange={setField(setJobForm)} type="checkbox" /> Active</label>
              <button className="admin-primary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-black text-white" type="submit"><Save className="h-4 w-4" />Save Job</button>
            </form>
          )} list={data.jobs.map((item) => (
            <ListRow key={item.id} title={item.title} subtitle={`${item.location || 'Remote'} | ${item.active ? 'Active' : 'Hidden'}`} onDelete={() => removeItem(`/api/admin/jobs/${item.id}`)} onEdit={() => { setJobForm({ ...emptyJob, ...item, closingDate: item.closingDate || '' }); setEditing((current) => ({ ...current, job: item.id })) }} />
          ))} />
        ) : null}

        {activeTab === 'team' ? (
          <CrudPanel form={(
            <form className="admin-card admin-form admin-team-form grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" data-title={tabTitles.team} onSubmit={saveTeam}>
              <input className={inputClass} name="name" onChange={setField(setTeamForm)} placeholder="Name" required value={teamForm.name || ''} />
              <input className={inputClass} list="team-positions" name="designation" onChange={setField(setTeamForm)} placeholder="Position" required value={teamForm.designation || ''} />
              <datalist id="team-positions">
                {['React Developer', 'Full Stack Developer', 'Java Developer', 'Spring Boot Developer', 'UI/UX Designer', 'Project Manager'].map((position) => <option key={position} value={position} />)}
              </datalist>
              <input className={inputClass} name="linkedinUrl" onChange={setField(setTeamForm)} placeholder="LinkedIn URL" value={teamForm.linkedinUrl || ''} />
              <textarea className={textareaClass} name="bio" onChange={setField(setTeamForm)} placeholder="Bio" value={teamForm.bio}></textarea>
              <label className="inline-flex items-center gap-2 text-sm font-black"><input checked={teamForm.highlighted} name="highlighted" onChange={setField(setTeamForm)} type="checkbox" /> CEO / Owner highlight</label>
              <label className="inline-flex items-center gap-2 text-sm font-black"><input checked={teamForm.active} name="active" onChange={setField(setTeamForm)} type="checkbox" /> Active</label>
              <ProfilePhotoPicker
                file={teamPhotoFile}
                imageUrl={teamForm.imageUrl}
                onClear={() => {
                  setTeamPhotoFile(null)
                  setTeamForm((current) => ({ ...current, imageUrl: '' }))
                }}
                onFile={(file) => {
                  setTeamPhotoFile(file)
                  if (file) {
                    setTeamForm((current) => ({ ...current, imageUrl: '' }))
                  }
                }}
              />
              <button className="admin-primary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-black text-white" type="submit"><Save className="h-4 w-4" />Save Team</button>
            </form>
          )} list={data.team.map((item) => (
            <ListRow key={item.id} title={item.name} subtitle={`${item.designation} | ${item.active ? 'Active' : 'Hidden'}`} image={item.imageUrl} onDelete={() => removeItem(`/api/admin/team/${item.id}`)} onEdit={() => { setTeamForm({ ...emptyTeam, ...item, sortOrder: 0 }); setEditing((current) => ({ ...current, team: item.id })) }} />
          ))} />
        ) : null}

        {activeTab === 'contacts' ? (
          <div className="grid gap-3">
            {data.contacts.map((item) => (
              <article className="admin-card rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={item.id}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-xl font-black">{item.subject}</h3>
                    <p className="mt-1 text-sm font-bold text-slate-500">{item.fullName} | {item.email} | {item.phone}</p>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{item.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <select className={inputClass} onChange={(event) => updateContactStatus(item.id, event.target.value)} value={item.status}>
                      {['NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <button className="grid h-11 w-11 place-items-center rounded-lg bg-red-50 text-red-600" onClick={() => removeItem(`/api/admin/contacts/${item.id}`)} type="button"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === 'admins' ? (
          <CrudPanel form={(
            <form className="admin-card admin-form admin-admin-form grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" data-title={tabTitles.admins} onSubmit={saveAdmin}>
              {['fullName', 'username', 'email', 'password'].map((key) => <input className={inputClass} key={key} name={key} onChange={setField(setAdminForm)} placeholder={key} required={!editing.admin} type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} value={adminForm[key] || ''} />)}
              <select className={inputClass} name="role" onChange={setField(setAdminForm)} value={adminForm.role}>
                <option>ADMIN</option>
                <option>SUPER_ADMIN</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm font-black"><input checked={adminForm.active} name="active" onChange={setField(setAdminForm)} type="checkbox" /> Active</label>
              {adminForm.photoUrl ? <img className="h-24 w-24 rounded-lg object-cover" src={assetUrl(adminForm.photoUrl)} alt="" /> : null}
              <ImageUploader folder={uploadFolder} onFile={setUploadFile} onFolder={setUploadFolder} onUpload={uploadImage} />
              <button className="admin-primary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-black text-white" type="submit"><Save className="h-4 w-4" />Save Admin</button>
            </form>
          )} list={data.admins.map((item) => (
            <ListRow key={item.id} title={item.fullName} subtitle={`${item.email} | ${item.role}`} image={item.photoUrl} onDelete={() => removeItem(`/api/admin/admins/${item.id}`)} onEdit={() => { setAdminForm({ ...emptyAdmin, ...item, password: '' }); setEditing((current) => ({ ...current, admin: item.id })) }} />
          ))} />
        ) : null}
      </div>
    </main>
  )
}

const ImageUploader = ({ folder, onFile, onFolder, onUpload }) => (
  <div className="admin-upload-zone grid gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 sm:grid-cols-[1fr_130px_auto]">
    <input className={inputClass} onChange={(event) => onFile(event.target.files?.[0] || null)} type="file" accept="image/*" />
    <input className={inputClass} onChange={(event) => onFolder(event.target.value)} placeholder="folder" value={folder} />
    <button className="admin-dark-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white" onClick={onUpload} type="button">
      <Upload className="h-4 w-4" aria-hidden="true" />
      Upload
    </button>
  </div>
)

const AdminLogo = ({ compact = false, logoSrc }) => {
  const [failed, setFailed] = useState(false)
  const className = `admin-logo ${compact ? 'is-compact' : ''}`

  if (logoSrc && !failed) {
    return (
      <span className={className}>
        <img src={logoSrc} alt="" onError={() => setFailed(true)} />
      </span>
    )
  }

  return (
    <span className={`${className} is-fallback`}>
      CL
    </span>
  )
}

const SettingsImageUploader = ({ imageUrl, label, onUpload }) => {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(imageUrl ? assetUrl(imageUrl) : '')
      return undefined
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, imageUrl])

  useEffect(() => {
    setFailed(false)
  }, [previewUrl])

  const upload = async () => {
    await onUpload(file)
    setFile(null)
  }

  return (
    <div className="admin-upload-zone grid gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 sm:grid-cols-[72px_1fr]">
      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
        {previewUrl && !failed ? (
          <img className="h-full w-full object-contain p-1" src={previewUrl} alt={`${label} preview`} onError={() => setFailed(true)} />
        ) : (
          <ImagePlus className="h-6 w-6 text-slate-400" aria-hidden="true" />
        )}
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-black text-slate-950">{label}</p>
        <p className="text-xs font-bold text-slate-500">{file ? file.name : imageUrl ? 'Current uploaded image' : 'Choose a PNG image'}</p>
        <div className="flex flex-wrap gap-2">
          <input className={inputClass} onChange={(event) => setFile(event.target.files?.[0] || null)} type="file" accept="image/png,image/*" />
          <button className="admin-dark-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white" onClick={upload} type="button">
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

const PortfolioImagePicker = ({ file, imageUrl, onClear, onFile }) => {
  const [previewUrl, setPreviewUrl] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(imageUrl ? assetUrl(imageUrl) : '')
      return undefined
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, imageUrl])

  useEffect(() => {
    setFailed(false)
  }, [previewUrl])

  const hasImage = Boolean(file || imageUrl)

  return (
    <div className="admin-upload-zone grid gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
      <div className="admin-portfolio-preview grid aspect-[16/9] place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
        {previewUrl && !failed ? (
          <img className="h-full w-full object-cover" src={previewUrl} alt="Portfolio preview" onError={() => setFailed(true)} />
        ) : (
          <ImagePlus className="h-8 w-8 text-slate-400" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="admin-dark-button inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white">
          <Upload className="h-4 w-4" aria-hidden="true" />
          Choose Image
          <input className="sr-only" onChange={(event) => onFile(event.target.files?.[0] || null)} type="file" accept="image/*" />
        </label>
        {hasImage ? (
          <button className="min-h-10 rounded-lg bg-red-50 px-4 text-sm font-black text-red-600" onClick={onClear} type="button">
            Remove
          </button>
        ) : null}
      </div>
    </div>
  )
}

const ProfilePhotoPicker = ({ file, imageUrl, onClear, onFile }) => {
  const [previewUrl, setPreviewUrl] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(imageUrl ? assetUrl(imageUrl) : '')
      return undefined
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, imageUrl])

  useEffect(() => {
    setFailed(false)
  }, [previewUrl])

  const hasPhoto = Boolean(file || imageUrl)

  return (
    <div className="admin-upload-zone grid gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 sm:grid-cols-[96px_1fr]">
      <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
        {previewUrl && !failed ? (
          <img className="h-full w-full object-contain object-center p-1" src={previewUrl} alt="Team profile preview" onError={() => setFailed(true)} />
        ) : (
          <ImagePlus className="h-7 w-7 text-slate-400" aria-hidden="true" />
        )}
      </div>
      <div className="grid content-center gap-2">
        <p className="text-sm font-black text-slate-950">Profile Photo</p>
        <p className="text-xs font-bold text-slate-500">{file ? file.name : imageUrl ? 'Current uploaded photo' : 'Choose a team member photo'}</p>
        <div className="flex flex-wrap gap-2">
          <label className="admin-dark-button inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white">
            <Upload className="h-4 w-4" aria-hidden="true" />
            Choose Photo
            <input className="sr-only" onChange={(event) => onFile(event.target.files?.[0] || null)} type="file" accept="image/*" />
          </label>
          {hasPhoto ? (
            <button className="min-h-10 rounded-lg bg-red-50 px-4 text-sm font-black text-red-600" onClick={onClear} type="button">
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const CrudPanel = ({ form, list }) => (
  <div className="admin-crud-panel grid gap-6 xl:grid-cols-[minmax(420px,560px)_minmax(0,1fr)]">
    <div className="admin-form-column">
      {form}
    </div>
    <div className="admin-list-panel grid content-start gap-3">
      {list.length ? list : (
        <div className="admin-empty-state rounded-lg border border-slate-200 bg-white p-5 text-sm font-black text-slate-500">
          <ImagePlus className="h-8 w-8 text-blue-300" aria-hidden="true" />
          <strong>No records yet.</strong>
          <span>Add details using the form on the left.</span>
        </div>
      )}
    </div>
  </div>
)

const ListRow = ({ title, subtitle, image, showImage = true, onEdit, onDelete }) => {
  const [imageFailed, setImageFailed] = useState(false)
  const showUploadedImage = showImage && image && !imageFailed

  return (
  <article className="admin-list-row flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
    {showImage ? (showUploadedImage ? <img className="admin-list-image h-20 w-20 rounded-lg object-cover" src={assetUrl(image)} alt="" onError={() => setImageFailed(true)} /> : <div className="admin-list-image grid h-20 w-20 place-items-center rounded-lg bg-slate-100"><ImagePlus className="h-6 w-6 text-slate-400" /></div>) : null}
    <div className="min-w-0 flex-1">
      <h3 className="truncate text-lg font-black">{title}</h3>
      <p className="mt-1 text-sm font-bold text-slate-500">{subtitle}</p>
    </div>
    <div className="flex gap-2">
      <button className="admin-edit-button min-h-10 rounded-lg bg-blue-50 px-4 text-sm font-black text-blue-700" onClick={onEdit} type="button">Edit</button>
      <button className="admin-delete-button grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-600" onClick={onDelete} type="button"><Trash2 className="h-4 w-4" /></button>
    </div>
  </article>
  )
}

export default AdminPanel
