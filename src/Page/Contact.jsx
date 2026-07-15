import { Building2, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import { requestJson } from '../api'

const defaultSettings = {
  companyName: 'CODELUX Technology',
  contactPhone: '7276138721',
  contactEmail: 'codeluxtechnology@gmail.com',
  address: 'CIDCO, Chhatrapati Sambhajinagar, Maharashtra',
}

const Contact = ({ settings }) => {
  const site = { ...defaultSettings, ...settings }
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const contactRows = useMemo(() => [
    ['Company Name', site.companyName, Building2],
    ['Mobile', site.contactPhone, Phone],
    ['Email', site.contactEmail, Mail],
    ['Office Address', site.address, MapPin],
  ], [site.address, site.companyName, site.contactEmail, site.contactPhone])
  const mapQuery = site.address || defaultSettings.address
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submitContact = async (event) => {
    event.preventDefault()
    setStatus('Sending...')
    try {
      await requestJson('/api/public/contacts', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' })
      setStatus('Message sent successfully.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <section id="contact" className="contact-section relative overflow-hidden bg-slate-950 text-white">
      <div className="animated-grid absolute inset-0 opacity-20" aria-hidden="true"></div>
      <div className="contact-bg-glow contact-bg-glow-one" aria-hidden="true"></div>
      <div className="contact-bg-glow contact-bg-glow-two" aria-hidden="true"></div>
      <div className="contact-layout-shell mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div className="reveal-on-scroll">
          <p className="contact-kicker mb-4 text-xs font-black uppercase tracking-normal text-blue-400">Contact</p>
          <h2 className="contact-title text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            <span className="heading-word heading-word-light">Let's discuss your</span>{' '}
            <span className="heading-word heading-word-light" style={{ '--word-delay': '180ms' }}>project</span>
          </h2>
          <p className="contact-lead mt-4 max-w-xl text-lg leading-8 text-slate-300">
            Contact CODELUX Technology for a free quote, website plan, or custom software idea.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-black text-white no-underline transition hover:-translate-y-0.5 hover:bg-blue-500" href={`tel:${site.contactPhone || ''}`}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Now
            </a>
            <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 text-sm font-black text-white no-underline transition hover:-translate-y-0.5 hover:bg-white/15" href={`mailto:${site.contactEmail || ''}`}>
              Send Email
              <Send className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <form className="contact-form-card reveal-on-scroll mt-6 rounded-lg border border-white/10 bg-white p-4 text-slate-950 shadow-2xl shadow-slate-950/20" onSubmit={submitContact}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="min-h-12 rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-blue-500" name="fullName" onChange={updateField} placeholder="Full name" required value={form.fullName} />
              <input className="min-h-12 rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-blue-500" name="email" onChange={updateField} placeholder="Email" required type="email" value={form.email} />
              <input className="min-h-12 rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-blue-500" name="phone" onChange={updateField} placeholder="Phone" value={form.phone} />
              <input className="min-h-12 rounded-lg border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-blue-500" name="subject" onChange={updateField} placeholder="Subject" required value={form.subject} />
            </div>
            <textarea className="mt-3 min-h-32 w-full resize-y rounded-lg border border-slate-200 p-4 text-sm font-semibold outline-none focus:border-blue-500" name="message" onChange={updateField} placeholder="Message" required value={form.message}></textarea>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-800" type="submit">
                Send Message
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
              {status ? <p className="m-0 text-sm font-black text-slate-600">{status}</p> : null}
            </div>
          </form>
        </div>

        <div className="contact-side space-y-4">
          <address className="contact-info-card reveal-on-scroll rounded-lg border border-white/10 bg-white p-3 not-italic shadow-2xl shadow-slate-950/20">
            {contactRows.map(([label, value, Icon]) => (
              <p className="grid gap-1 border-b border-slate-100 px-4 py-4 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-4" key={label}>
                <span className="inline-flex items-center gap-2 text-sm font-black text-slate-500">
                  <Icon className="h-4 w-4 text-blue-700" aria-hidden="true" />
                  {label}
                </span>
                <strong className="break-words text-base font-black text-slate-950">{value}</strong>
              </p>
            ))}
          </address>

          <div className="contact-map-card reveal-on-scroll overflow-hidden rounded-lg border border-white/10 bg-white p-3 shadow-2xl shadow-slate-950/20">
            <div className="mb-3 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 inline-flex items-center gap-2 text-sm font-black text-slate-950">
                  <MapPin className="h-4 w-4 text-blue-700" aria-hidden="true" />
                  Company Location
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{mapQuery}</p>
              </div>
              <a
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-black text-white no-underline transition hover:-translate-y-0.5 hover:bg-blue-800"
                href={mapOpenUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open Map
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <iframe
              className="contact-map-frame h-44 w-full rounded-lg border-0 grayscale-[15%] sm:h-52"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapEmbedUrl}
              title="CODELUX Technology location map"
            ></iframe>
            
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
