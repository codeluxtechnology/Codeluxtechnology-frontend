import {
  ClipboardCheck,
  Code2,
  GraduationCap,
  Hotel,
  LayoutTemplate,
  Palette,
  Pill,
  Rocket,
  SearchCheck,
  ShoppingCart,
  Smartphone,
  TestTubeDiagonal,
  Wrench,
} from 'lucide-react'

const services = [
  ['Website Development', 'Clean, SEO-friendly websites for modern brands.', LayoutTemplate],
  ['E-Commerce Website', 'Online stores built for product discovery and sales.', ShoppingCart],
  ['Custom Software Development', 'Business tools designed around your workflow.', Code2],
  ['Hotel Management Software', 'Room, booking, billing, and operations systems.', Hotel],
  ['Pharmacy Management Software', 'Inventory, billing, stock, and report handling.', Pill],
  ['School & College Management Software', 'Admissions, fees, records, and admin modules.', GraduationCap],
  ['Mobile App Development', 'Responsive mobile experiences for customers and teams.', Smartphone],
  ['UI/UX Design', 'Simple, polished interfaces that are easy to use.', Palette],
  ['Website Maintenance', 'Updates, fixes, backups, and ongoing support.', Wrench],
]

const processSteps = [
  ['Requirement Discussion', 'Understand goals, features, users, and business workflow.', SearchCheck],
  ['Planning', 'Define scope, modules, timeline, and the delivery roadmap.', ClipboardCheck],
  ['UI/UX Design', 'Create clean layouts and simple user journeys before coding.', Palette],
  ['Development', 'Build secure, responsive, and maintainable product features.', Code2],
  ['Testing', 'Check performance, bugs, forms, flows, and responsive behavior.', TestTubeDiagonal],
  ['Deployment', 'Launch the product with a stable and production-ready setup.', Rocket],
  ['Maintenance', 'Improve, update, monitor, and support the product after launch.', Wrench],
]

const Services = () => {
  return (
    <section id="services" className="relative overflow-hidden bg-white">
      <div className="animated-grid absolute inset-0 opacity-35" aria-hidden="true"></div>
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-normal text-blue-700">Services</p>
          <h2 className="text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
            <span className="heading-word">End-to-end digital</span>{' '}
            <span className="heading-word" style={{ '--word-delay': '180ms' }}>solutions</span>
          </h2>
        </div>

        <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, text, Icon]) => (
            <article className="service-pro-card reveal-on-scroll group" key={title}>
              <span className="service-icon-badge">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-black leading-snug text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>

        <div className="process-panel reveal-on-scroll">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-normal text-blue-700">Our Process</p>
              <h3 className="max-w-2xl text-3xl font-black leading-tight tracking-normal text-slate-950">
                <span className="heading-word">From requirement discussion</span>{' '}
                <span className="heading-word" style={{ '--word-delay': '180ms' }}>to maintenance</span>
              </h3>
            </div>
            <p className="max-w-md text-sm font-semibold leading-7 text-slate-600">
              A smooth step-by-step flow that keeps your software project clear, trackable, and launch-ready.
            </p>
          </div>

          <ol className="process-flow">
            {processSteps.map(([step, text, Icon], index) => (
              <li className="process-node reveal-on-scroll" key={step}>
                <span className="process-node-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="process-node-icon">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <strong>{step}</strong>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Services
