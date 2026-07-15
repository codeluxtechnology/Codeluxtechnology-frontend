import { ArrowRight, Bot, Cloud, Code2, Globe2, MessageCircle, MonitorSmartphone, Palette, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { assetUrl } from '../api'
import heroImage from '../assets/hero.png'
import './Home.css'

const dashboardCards = [
  ['Web Applications', 'Modern portals and SaaS dashboards', MonitorSmartphone],
  ['Mobile Applications', 'Responsive apps for every screen', Globe2],
  ['Business Automation', 'Smarter workflows and operations', Bot],
  ['Custom Software', 'Reliable systems built around you', Code2],
  ['UI/UX Design', 'Clear journeys and polished products', Palette],
  ['Secure Cloud Solutions', 'Protected cloud delivery', Cloud],
]

const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const Home = ({ settings, media = [] }) => {
  const slides = useMemo(() => media.filter((item) => item.mediaType === 'HERO_SLIDE'), [media])
  const [slideIndex, setSlideIndex] = useState(0)
  const currentSlide = slides[slideIndex % Math.max(slides.length, 1)]
  const heroSrc = assetUrl(currentSlide?.imageUrl || settings?.heroImageUrl) || heroImage
  const logoSrc = assetUrl(settings?.logoUrl)
  const tagline = settings?.tagline || 'Custom Software | Web | Mobile | Automation'

  useEffect(() => {
    if (slides.length < 2) return undefined
    const timer = window.setInterval(() => setSlideIndex((index) => (index + 1) % slides.length), 4200)
    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <section className="home-hero" id="home">
      <div className="home-grid-bg" aria-hidden="true"></div>
      <div className="home-glow home-glow-one" aria-hidden="true"></div>
      <div className="home-glow home-glow-two" aria-hidden="true"></div>
      <span className="floating-shape shape-one" aria-hidden="true"></span>
      <span className="floating-shape shape-two" aria-hidden="true"></span>
      <span className="floating-shape shape-three" aria-hidden="true"></span>

      <div className="home-container hero-layout">
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={stagger}>
          <motion.p className="hero-kicker" variants={reveal}>
            <Sparkles aria-hidden="true" />
            {tagline}
          </motion.p>
          <motion.h1 className="hero-title" variants={reveal}>
            Transforming Ideas into <span>Digital Solutions</span>
          </motion.h1>
          <motion.p className="hero-description" variants={reveal}>
            Code Lux Technology builds reliable, secure and modern digital solutions that help businesses grow,
            automate operations and create a strong digital presence.
          </motion.p>
          <motion.div className="hero-actions" variants={reveal}>
            <button className="home-button home-button-primary" onClick={() => scrollToSection('contact')} type="button">
              <span>Get Free Quote</span>
              <ArrowRight aria-hidden="true" />
            </button>
            <button className="home-button home-button-light" onClick={() => scrollToSection('contact')} type="button">
              <MessageCircle aria-hidden="true" />
              <span>Contact Us</span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="dashboard-preview-wrap"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.18 }}
        >
          <DashboardPreview heroSrc={heroSrc} logoSrc={logoSrc} slideCount={slides.length} slideIndex={slideIndex} />
        </motion.div>
      </div>
    </section>
  )
}

const DashboardPreview = ({ heroSrc, logoSrc, slideCount, slideIndex }) => (
  <motion.div
    className="dashboard-preview"
    whileHover={{ rotateX: 2.5, rotateY: -3.5, y: -8 }}
    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
  >
    <div className="browser-dots" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div className="tech-illustration" aria-hidden="true">
      <img className="tech-hero-image" src={heroSrc} alt="" />
      <motion.div
        className={`tech-logo-badge ${logoSrc ? '' : 'tech-logo-fallback'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.55 }}
      >
        {logoSrc ? <img src={logoSrc} alt="" /> : <span>CL</span>}
      </motion.div>
      <span className="tech-layer tech-layer-top"></span>
      <span className="tech-layer tech-layer-middle"></span>
      <span className="tech-layer tech-layer-bottom"></span>
      <span className="tech-pulse"></span>
    </div>

    {slideCount > 1 ? (
      <div className="hero-slide-dots" aria-hidden="true">
        {Array.from({ length: slideCount }).map((_, index) => (
          <span className={index === slideIndex ? 'active' : ''} key={index}></span>
        ))}
      </div>
    ) : null}

    <div className="dashboard-card-grid">
      {dashboardCards.map(([title, text, Icon]) => (
        <motion.article className="dashboard-mini-card" key={title} whileHover={{ y: -6, scale: 1.02 }}>
          <Icon aria-hidden="true" />
          <strong>{title}</strong>
          <span>{text}</span>
        </motion.article>
      ))}
    </div>
  </motion.div>
)

export default Home
