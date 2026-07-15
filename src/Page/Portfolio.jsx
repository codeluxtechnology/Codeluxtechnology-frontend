import { ArrowUpRight, Building2, PanelsTopLeft, Store } from 'lucide-react'
import { assetUrl } from '../api'

const fallbackItems = [
  {
    id: 'business-website',
    title: 'Business Website',
    caption: 'Company websites, service pages, and lead-focused landing pages.',
    Icon: PanelsTopLeft,
  },
  {
    id: 'management-software',
    title: 'Management Software',
    caption: 'Custom systems for hotels, pharmacies, schools, and colleges.',
    Icon: Building2,
  },
  {
    id: 'online-store',
    title: 'Online Store',
    caption: 'Product catalogs, checkout flows, and customer-ready e-commerce.',
    Icon: Store,
  },
]

const Portfolio = ({ media = [] }) => {
  const portfolioItems = media.filter((item) => item.mediaType === 'PORTFOLIO' && item.active)
  const items = portfolioItems.length ? portfolioItems : fallbackItems

  return (
    <section id="portfolio" className="relative overflow-hidden bg-slate-50">
      <div className="animated-sweep absolute inset-y-0 left-0 w-full opacity-80 blur-3xl" aria-hidden="true"></div>
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-black uppercase tracking-normal text-blue-700">Portfolio</p>
            <h2 className="text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
              <span className="heading-word">Custom</span>{' '}
              <span className="heading-word" style={{ '--word-delay': '180ms' }}>solutions we build</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            Real client-ready work, custom software, storefronts, dashboards, and websites managed from the admin panel.
          </p>
        </div>

        <div className="relative mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <PortfolioCard item={item} key={item.id || item.title} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const PortfolioCard = ({ item, index }) => {
  const imageSrc = assetUrl(item.imageUrl)
  const Icon = item.Icon || [PanelsTopLeft, Building2, Store][index % 3]
  const content = (
    <article className="soft-lift reveal-on-scroll group relative min-h-[300px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10">
      <div className="relative h-40 overflow-hidden bg-slate-950">
        {imageSrc ? (
          <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={imageSrc} alt={item.title} />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#2563eb_0%,#020617_42%,#0f172a_100%)]">
            <Icon className="h-12 w-12 text-cyan-200" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" aria-hidden="true"></div>
        <span className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1 text-xs font-black uppercase text-slate-950 shadow-sm">
          Project
        </span>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-xl font-black leading-tight text-slate-950">{item.title}</h3>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-950 text-white transition group-hover:bg-blue-700">
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{item.caption}</p>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-black text-blue-700">CODELUX Technology</span>
          <span className="h-2 w-10 rounded-full bg-gradient-to-r from-blue-700 to-teal-300" aria-hidden="true"></span>
        </div>
      </div>
    </article>
  )

  if (!item.linkUrl) return content

  return (
    <a className="block text-inherit no-underline" href={item.linkUrl} rel="noreferrer" target="_blank">
      {content}
    </a>
  )
}

export default Portfolio
