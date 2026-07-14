import { AnimatePresence, motion } from 'framer-motion'
import { HomeIcon, Info, Layers3, Mail, Menu, ShieldCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { assetUrl, requestJson } from './api'
import About from './Page/About'
import AdminPanel from './Page/AdminPanel'
import Careers from './Page/Careers'
import Contact from './Page/Contact'
import Home from './Page/Home'
import Portfolio from './Page/Portfolio'
import Services from './Page/Services'

const navItems = [
  { label: 'Home', href: '#home', Icon: HomeIcon },
  { label: 'About', href: '#about', Icon: Info },
  { label: 'Services', href: '#services', Icon: Layers3 },
  { label: 'Contact', href: '#contact', Icon: Mail },
]

const siteUpdateKey = 'codelux_site_data_updated'

const App = () => {
  const [siteData, setSiteData] = useState({ settings: null, media: [], jobs: [], team: [] })
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState('#home')

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return

    let cancelled = false
    const loadSiteData = () => Promise.all([
      requestJson('/api/public/settings').catch(() => null),
      requestJson('/api/public/media').catch(() => []),
      requestJson('/api/public/jobs').catch(() => []),
      requestJson('/api/public/team').catch(() => []),
    ]).then(([settings, media, jobs, team]) => {
      if (cancelled) return
      setSiteData({ settings, media, jobs, team })
    })

    const refreshVisiblePage = () => {
      if (document.visibilityState === 'visible') {
        loadSiteData()
      }
    }

    const refreshFromAdminUpdate = (event) => {
      if (event.key === siteUpdateKey) {
        loadSiteData()
      }
    }

    loadSiteData()
    const refreshTimer = window.setInterval(refreshVisiblePage, 10000)
    window.addEventListener('focus', loadSiteData)
    document.addEventListener('visibilitychange', refreshVisiblePage)
    window.addEventListener('storage', refreshFromAdminUpdate)

    return () => {
      cancelled = true
      window.clearInterval(refreshTimer)
      window.removeEventListener('focus', loadSiteData)
      document.removeEventListener('visibilitychange', refreshVisiblePage)
      window.removeEventListener('storage', refreshFromAdminUpdate)
    }
  }, [])

  useEffect(() => {
    const faviconHref = assetUrl(siteData.settings?.faviconUrl)
    if (!faviconHref) return

    let favicon = document.querySelector('link[rel~="icon"]')
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.appendChild(favicon)
    }
    favicon.href = faviconHref
    favicon.removeAttribute('type')
  }, [siteData.settings?.faviconUrl])

  useEffect(() => {
    const updateHeaderState = () => {
      setScrolled(window.scrollY > 12)

      const current = navItems.reduce((active, item) => {
        const section = document.getElementById(item.href.slice(1))
        if (!section) return active
        const distance = Math.abs(section.getBoundingClientRect().top - 120)
        if (!active || distance < active.distance) return { href: item.href, distance }
        return active
      }, null)

      if (current?.href) setActiveHref(current.href)
    }

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })
    window.addEventListener('resize', updateHeaderState)
    return () => {
      window.removeEventListener('scroll', updateHeaderState)
      window.removeEventListener('resize', updateHeaderState)
    }
  }, [])

  if (window.location.pathname.startsWith('/admin')) {
    return <AdminPanel />
  }

  const companyName = siteData.settings?.companyName || 'CODELUX'
  const logoSrc = assetUrl(siteData.settings?.logoUrl)

  const goToSection = (event, href) => {
    event.preventDefault()
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveHref(href)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header-inner">
          <motion.a
            className="brand-link"
            href="#home"
            aria-label="Code Lux Technology Home"
            onClick={(event) => goToSection(event, '#home')}
            whileTap={{ scale: 0.96 }}
          >
            <LogoMark logoSrc={logoSrc} />
            <span className="brand-text">
              <strong className="brand-name-gradient">Code Lux Technology</strong>
              <small>Technology</small>
            </span>
          </motion.a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                className={`nav-link ${activeHref === item.href ? 'is-active' : ''}`}
                href={item.href}
                key={item.href}
                onClick={(event) => goToSection(event, item.href)}
              >
                <item.Icon aria-hidden="true" />
                {item.label}
              </a>
            ))}
          </nav>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="mobile-nav-inner">
                {navItems.map((item) => (
                  <a
                    className={`nav-link ${activeHref === item.href ? 'is-active' : ''}`}
                    href={item.href}
                    key={item.href}
                    onClick={(event) => goToSection(event, item.href)}
                  >
                    <item.Icon aria-hidden="true" />
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <main>
        <Home settings={siteData.settings} media={siteData.media} />
        <About settings={siteData.settings} team={siteData.team} />
        <Services />
        <Portfolio media={siteData.media} />
        <Careers jobs={siteData.jobs} />
        <Contact settings={siteData.settings} />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <a className="flex w-fit items-center gap-3 text-slate-950 no-underline" href="#home" aria-label={`${companyName} Home`}>
            <LogoMark logoSrc={logoSrc} footer />
            <span>
              <strong className="block text-base font-black leading-tight tracking-normal">{companyName}</strong>
              <small className="block text-xs font-semibold leading-tight text-slate-500">Technology</small>
            </span>
          </a>

          <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Footer navigation">
            {[...navItems, { label: 'Privacy Policy', href: '#privacy' }].map((item) => (
              <a className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 no-underline hover:text-blue-700" href={item.href} key={item.href}>
                {'Icon' in item ? <item.Icon className="h-4 w-4" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

const LogoMark = ({ logoSrc, footer = false }) => {
  const [failed, setFailed] = useState(false)
  const className = `brand-logo-wrap ${footer ? 'footer-logo' : ''}`

  if (logoSrc && !failed) {
    return (
      <span className={className}>
        <img src={logoSrc} alt="" onError={() => setFailed(true)} />
      </span>
    )
  }

  return (
    <span className={`${className} default`}>
      CL
    </span>
  )
}

export default App
