import { useEffect, useState } from 'react'
import { BadgeCheck, ChevronLeft, ChevronRight, Clock3, Headset, Puzzle, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import { assetUrl } from '../api'

const reasons = [
  ['Experienced Team', 'Practical planning and clean delivery from real project experience.', UsersRound],
  ['Custom Solutions', 'Software shaped around your workflow, customers, and growth plan.', Puzzle],
  ['On-Time Project Delivery', 'Clear milestones, steady updates, and focused execution.', Clock3],
  ['Data Security', 'Secure access, safer data handling, and reliable deployments.', ShieldCheck],
  ['After-Sales Support', 'Responsive support after launch so your product keeps improving.', Headset],
  ['Modern Stack', 'Fast, responsive, and maintainable technology.', BadgeCheck],
]

const highlights = [
  ['Business First', 'Every feature is connected to a real business outcome.'],
  ['Clean Process', 'Discovery, design, development, testing, and launch.'],
]

const fallbackTeam = [
  {
    id: 'fallback-owner',
    name: 'CODELUX Leadership',
    designation: 'Founder & Owner',
    bio: 'Guiding product strategy, client relationships, and reliable delivery for business software projects.',
    highlighted: true,
  },
]

const leaderPattern = /\b(owner|ceo|chief executive|founder|co-founder|director|leadership)\b/i
const getVisibleCards = () => {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 3
}

const getCarouselMembers = (members, startIndex, count) => {
  if (members.length <= count) return members
  return Array.from({ length: count }, (_, index) => members[(startIndex + index) % members.length])
}

const About = ({ settings, team = [] }) => {
  const visibleTeam = team.length ? team : fallbackTeam
  const leaders = visibleTeam.filter((member) => member.highlighted || leaderPattern.test(member.designation || ''))
  const teamMembers = visibleTeam.filter((member) => !leaders.includes(member))
  const ownerList = leaders.length ? leaders : visibleTeam.slice(0, 1)
  const memberList = leaders.length ? teamMembers : visibleTeam.slice(1)

  return (
    <section id="about" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="animated-grid absolute inset-0 opacity-20" aria-hidden="true"></div>
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" aria-hidden="true"></div>
      <div className="absolute -right-24 bottom-40 h-80 w-80 rounded-full bg-teal-300/10 blur-3xl" aria-hidden="true"></div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
        <div className="reveal-on-scroll relative">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-normal text-blue-300 shadow-lg shadow-blue-950/20">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            About Us
          </p>
          <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            <span className="heading-word heading-word-light">A modern technology</span>{' '}
            <span className="heading-word heading-word-light" style={{ '--word-delay': '160ms' }}>partner for your business</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-9 text-slate-300">
            <strong className="text-white">{settings?.companyName || 'CODELUX Technology'}</strong>{' '}
            {settings?.aboutDescription || 'is an IT company providing Custom Software, Web Development, Mobile App Development, and Business Automation Solutions. Our goal is to create reliable, secure, and modern software for every business.'}
          </p>

        </div>

        <div className="reveal-on-scroll about-feature-shell">
          <div className="about-feature-grid">
            {reasons.map(([reason, text, Icon]) => (
              <div className="about-feature-card reveal-on-scroll" key={reason}>
                <span className="about-feature-icon">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="m-0 font-black text-slate-100">{reason}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="about-delivery-card reveal-on-scroll">
            <span className="about-delivery-pulse" aria-hidden="true"></span>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-300">Delivery Focus</p>
            <strong>Reliable software, polished UI, secure launch.</strong>
            <span>We keep the product simple to use, easy to maintain, and ready to grow with your business.</span>
          </div>

          <div className="about-highlight-strip reveal-on-scroll">
            {highlights.map(([title, text]) => (
              <div className="about-metric-card" key={title}>
                <BadgeCheck className="h-5 w-5 text-teal-300" aria-hidden="true" />
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="team" className="relative overflow-hidden px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <span className="absolute left-[26%] top-16 hidden h-5 w-5 rounded-full border-2 border-teal-300/70 sm:block" aria-hidden="true"></span>
        <span className="absolute right-0 top-10 h-14 w-1 rounded-full bg-gradient-to-b from-blue-500 to-teal-300" aria-hidden="true"></span>
        <div className="reveal-on-scroll mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.38em] text-blue-400">Meet Our Leadership</p>
          <h3 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-6xl">
            <span className="block">The Minds Behind</span>
            <span className="heading-word heading-word-light block">Our Success</span>
          </h3>
          <span className="mx-auto mt-7 block h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-teal-300" aria-hidden="true"></span>
        </div>

        <TeamGroup
          description="Strategic direction, client trust, and company vision."
          members={ownerList}
          title="Owners & CEO"
          variant="leader"
        />

        {memberList.length ? (
          <TeamGroup
            description="The people building, supporting, and delivering CODELUX projects."
            members={memberList}
            title="Team Members"
          />
        ) : null}
      </div>
    </section>
  )
}

const TeamGroup = ({ description, members, title, variant = 'member' }) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(getVisibleCards)
  const totalPages = members.length > visibleCards ? members.length : 1
  const canSlide = totalPages > 1

  useEffect(() => {
    const updateVisibleCards = () => setVisibleCards(getVisibleCards())
    updateVisibleCards()
    window.addEventListener('resize', updateVisibleCards)
    return () => window.removeEventListener('resize', updateVisibleCards)
  }, [])

  useEffect(() => {
    setPageIndex(0)
  }, [members.length, visibleCards])

  useEffect(() => {
    if (!canSlide) return undefined
    const timer = window.setInterval(() => {
      setPageIndex((current) => (current + 1) % totalPages)
    }, 5200)
    return () => window.clearInterval(timer)
  }, [canSlide, totalPages])

  const goToPage = (index) => {
    setPageIndex((index + totalPages) % totalPages)
  }

  return (
  <div className="team-group reveal-on-scroll mx-auto mt-16 w-full max-w-6xl text-center">
    <div className="mx-auto mb-8 flex max-w-2xl flex-col items-center gap-2 text-center">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-300">{title}</p>
      <p className="text-sm leading-7 text-slate-300">{description}</p>
    </div>

    <div className="team-carousel relative mx-auto">
      <div className="overflow-hidden px-2 py-5">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${pageIndex * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, page) => {
            const pageCards = getCarouselMembers(members, page, visibleCards)
            return (
              <div className={`team-page-grid team-page-count-${Math.min(pageCards.length, visibleCards)}`} key={page}>
                {pageCards.map((member, index) => (
                  <TeamCard key={`${member.id}-${page}-${index}`} member={member} variant={variant} />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {canSlide ? (
        <>
          <button
            aria-label={`Previous ${title} profiles`}
            className="team-nav-button team-nav-prev"
            onClick={() => goToPage(pageIndex - 1)}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            aria-label={`Next ${title} profiles`}
            className="team-nav-button team-nav-next"
            onClick={() => goToPage(pageIndex + 1)}
            type="button"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="mt-5 flex items-center justify-center gap-2" aria-label={`${title} profile slides`}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                aria-label={`Show ${title} slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${index === pageIndex ? 'w-9 bg-teal-300' : 'w-2 bg-white/25 hover:bg-white/50'}`}
                key={index}
                onClick={() => goToPage(index)}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  </div>
  )
}

const TeamCard = ({ member, variant }) => (
  <article className={`team-card group mx-auto w-full max-w-[250px] rounded-lg border p-5 text-center shadow-lg transition ${
    variant === 'leader'
      ? 'border-teal-300/25 bg-gradient-to-b from-white/[0.10] to-white/[0.045] shadow-teal-950/30'
      : 'border-white/10 bg-white/[0.055] shadow-slate-950/30'
  }`}>
    <TeamPhoto imageUrl={member.imageUrl} name={member.name} />
    <div className="pt-3">
      <h4 className="team-card-name text-[16px] font-black leading-tight text-white">{member.name}</h4>
      <p className="team-card-meta mt-2 text-[11px] font-black uppercase tracking-[0.14em] text-blue-300">{member.designation}</p>
      {member.bio ? <p className="team-card-meta mx-auto mt-2 line-clamp-2 text-[12px] leading-5 text-slate-300">{member.bio}</p> : null}
      {member.linkedinUrl ? (
        <a
          aria-label={`${member.name} LinkedIn profile`}
          className="team-card-meta mx-auto mt-3 grid h-8 w-8 place-items-center rounded-full border border-teal-300/30 bg-teal-300/10 text-teal-200 no-underline transition hover:border-teal-200 hover:bg-teal-300 hover:text-slate-950"
          href={member.linkedinUrl}
          rel="noreferrer"
          target="_blank"
          title="LinkedIn profile"
        >
          <LinkedInIcon />
        </a>
      ) : null}
    </div>
  </article>
)

const LinkedInIcon = () => (
  <svg className="h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.94 8.98H3.72V20h3.22V8.98ZM5.32 4a1.87 1.87 0 1 0 0 3.74A1.87 1.87 0 0 0 5.32 4Zm8.05 4.98h-3.08V20h3.22v-5.46c0-1.44.27-2.83 2.05-2.83 1.76 0 1.78 1.64 1.78 2.92V20h3.22v-6.05c0-2.97-.64-5.25-4.11-5.25-1.67 0-2.79.91-3.25 1.78h-.04l.21-1.5Z" />
  </svg>
)

const TeamPhoto = ({ imageUrl, name }) => {
  const [failed, setFailed] = useState(false)
  const imageSrc = assetUrl(imageUrl)

  if (imageSrc && !failed) {
    return (
      <div className="team-photo-shell mx-auto h-32 w-32">
        <div className="team-photo h-full w-full overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-xl shadow-blue-950/40 ring-2 ring-teal-300/35">
          <img className="h-full w-full object-contain object-center p-1 transition duration-500 group-hover:scale-105" src={imageSrc} alt={name} onError={() => setFailed(true)} />
        </div>
      </div>
    )
  }

  return (
    <div className="team-photo-shell mx-auto h-32 w-32">
      <div className="team-photo grid h-full w-full place-items-center overflow-hidden rounded-full border-4 border-white/50 bg-white/[0.06] shadow-xl shadow-blue-950/40 ring-2 ring-teal-300/25">
        <UsersRound className="h-12 w-12 text-teal-300" aria-hidden="true" />
      </div>
    </div>
  )
}

export default About
