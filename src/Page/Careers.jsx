import { BriefcaseBusiness, CalendarDays, MapPin, Send } from 'lucide-react'

const getApplyHref = (link) => {
  const trimmedLink = link?.trim()
  if (!trimmedLink) return '#contact'
  if (/^(https?:|mailto:|tel:|#)/i.test(trimmedLink)) return trimmedLink
  return `https://${trimmedLink}`
}

const Careers = ({ jobs = [] }) => {
  const visibleJobs = jobs.filter((job) => job?.active !== false && job?.title)

  if (!visibleJobs.length) return null

  return (
    <section id="jobs" className="relative overflow-hidden bg-white">
      <div className="animated-grid absolute inset-0 opacity-30" aria-hidden="true"></div>
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-normal text-blue-700">Jobs</p>
          <h2 className="text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
            <span className="heading-word">Career openings</span>{' '}
            <span className="heading-word" style={{ '--word-delay': '180ms' }}>at CODELUX</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {visibleJobs.map((job) => {
            const applyHref = getApplyHref(job.applyLink)
            const opensNewTab = applyHref !== '#contact' && !applyHref.startsWith('#')

            return (
              <article className="soft-lift reveal-on-scroll rounded-lg border border-slate-200 bg-white/95 p-6 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10" key={job.id || job.title}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-black leading-tight text-slate-950">{job.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[job.location, job.employmentType, job.experience].filter(Boolean).map((item) => (
                        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-600" key={item}>
                          {item === job.location ? <MapPin className="h-3.5 w-3.5 text-blue-700" aria-hidden="true" /> : <BriefcaseBusiness className="h-3.5 w-3.5 text-blue-700" aria-hidden="true" />}
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  {job.closingDate ? (
                    <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {job.closingDate}
                    </span>
                  ) : null}
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">{job.description}</p>
                {job.requirements ? <p className="mt-3 text-sm leading-7 text-slate-500">{job.requirements}</p> : null}
                <a
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-black text-white no-underline transition hover:-translate-y-0.5 hover:bg-blue-700"
                  href={applyHref}
                  rel={opensNewTab ? 'noreferrer' : undefined}
                  target={opensNewTab ? '_blank' : undefined}
                >
                  Apply Now
                  <Send className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Careers
