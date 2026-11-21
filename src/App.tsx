import { useEffect, useMemo, useRef, useState } from 'react'
import { BrandIcon, type IconKey } from './BrandIcon'
import { GlyphField } from './GlyphField'
import {
  appWorks,
  detectLocale,
  electronicsWorks,
  gameWorks,
  gardenWorks,
  researchWorks,
  storeLocale,
  ui,
  type Locale,
  type LocalizedWork,
} from './i18n'
import './App.css'

type SiteLink = {
  label: string
  href: string
  icon: IconKey
  handle: string
  accent: string
  blurb: Record<Locale, string>
}

type Work = {
  id: string
  title: string
  blurb: string
  href: string
  badge: string
  icon?: string
  mark?: string
  kind?: 'paper' | 'book'
}

type WorkSection = {
  id: string
  title: string
  items: Work[]
}

const links: SiteLink[] = [
  {
    label: 'Bluesky',
    href: 'https://bsky.app/profile/comrade-letrinhan.bsky.social',
    icon: 'bluesky',
    handle: '@comrade-letrinhan',
    accent: '#0085ff',
    blurb: {
      vi: 'Chia sẻ nhanh về nghiên cứu và quan điểm.',
      en: 'Short posts on research and ideas.',
    },
  },
  {
    label: 'X',
    href: 'https://x.com/comrade_lenhan',
    icon: 'x',
    handle: '@comrade_lenhan',
    accent: '#e7e9ea',
    blurb: {
      vi: 'Cập nhật nhanh và thảo luận công khai.',
      en: 'Quick updates and public discussion.',
    },
  },
  {
    label: 'Substack',
    href: 'https://letrinhannotebooks.substack.com/',
    icon: 'substack',
    handle: '@comradeletrinhan',
    accent: '#ff6719',
    blurb: {
      vi: 'Bài viết dài và ghi chú định kỳ.',
      en: 'Essays and periodic notes.',
    },
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@beatsprodbynhan8026',
    icon: 'youtube',
    handle: '@beatsprodbynhan8026',
    accent: '#ff0000',
    blurb: {
      vi: 'Beats và sản xuất nhạc.',
      en: 'Beats and music production.',
    },
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/letrinhan/',
    icon: 'linkedin',
    handle: '/in/letrinhan',
    accent: '#0a66c2',
    blurb: {
      vi: 'Hồ sơ nghề nghiệp, học thuật và dự án.',
      en: 'Work, academia, and projects.',
    },
  },
  {
    label: 'GitHub',
    href: 'https://github.com/letrinhandn',
    icon: 'github',
    handle: '@letrinhandn',
    accent: '#f0f6fc',
    blurb: {
      vi: 'Code công khai về phần mềm và nghiên cứu.',
      en: 'Public software and research code.',
    },
  },
  {
    label: 'itch.io',
    href: 'https://comrade-lenan.itch.io/',
    icon: 'itch',
    handle: 'comrade-lenan',
    accent: '#fa5c5c',
    blurb: {
      vi: 'Game và dự án sáng tạo.',
      en: 'Games and creative projects.',
    },
  },
  {
    label: 'ORCID',
    href: 'https://orcid.org/0009-0004-6075-4119',
    icon: 'orcid',
    handle: '0009-0004-6075-4119',
    accent: '#a6ce39',
    blurb: {
      vi: 'Định danh học thuật và công bố.',
      en: 'Academic identity and publications.',
    },
  },
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?user=L7xNHUAAAAAJ&hl=en',
    icon: 'googlescholar',
    handle: 'L7xNHUAAAAAJ',
    accent: '#4285f4',
    blurb: {
      vi: 'Trích dẫn và danh mục công bố.',
      en: 'Citations and publication list.',
    },
  },
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/profile.php?id=100023079422663',
    icon: 'facebook',
    handle: 'profile',
    accent: '#1877f2',
    blurb: {
      vi: 'Kết nối cá nhân và cộng đồng.',
      en: 'Personal and community updates.',
    },
  },
  {
    label: 'Hugging Face',
    href: 'https://huggingface.co/letrinhan',
    icon: 'huggingface',
    handle: '@letrinhan',
    accent: '#ffd21e',
    blurb: {
      vi: 'Model, dataset và demo AI.',
      en: 'AI models, datasets, and demos.',
    },
  },
  {
    label: 'QuantConnect',
    href: 'https://www.quantconnect.com/u/nhan_1',
    icon: 'quantconnect',
    handle: '@nhan_1',
    accent: '#f5a623',
    blurb: {
      vi: 'Backtest và chiến lược trên LEAN.',
      en: 'LEAN backtests and trading strategies.',
    },
  },
]

const featuredIds = ['rafetus'] as const

function localizeWork(work: LocalizedWork, locale: Locale): Work {
  return {
    id: work.id,
    title: work.title[locale],
    blurb: work.blurb[locale],
    badge: work.badge[locale],
    href: work.href,
    icon: work.icon,
    mark: work.mark,
    kind: work.kind,
  }
}

function PixelPin() {
  return (
    <svg
      className="work-pin"
      viewBox="0 0 16 16"
      width="20"
      height="20"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect x="5" y="1" width="6" height="6" fill="currentColor" />
      <rect x="2" y="7" width="12" height="2" fill="currentColor" />
      <rect x="7" y="9" width="2" height="6" fill="currentColor" />
    </svg>
  )
}

function PixelPaper() {
  return (
    <svg
      className="work-art"
      viewBox="0 0 16 16"
      width="48"
      height="48"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect x="3" y="1" width="10" height="12" fill="#bc8034" />
      <rect x="2" y="2" width="10" height="12" fill="#8c7a6b" />
      <rect x="1" y="3" width="10" height="12" fill="#d9cab3" />
      <rect x="3" y="5" width="6" height="1" fill="#5e0b15" />
      <rect x="3" y="7" width="6" height="1" fill="#5e0b15" />
      <rect x="3" y="9" width="4" height="1" fill="#5e0b15" />
      <rect x="3" y="11" width="5" height="1" fill="#5e0b15" />
    </svg>
  )
}

function PixelBook() {
  return (
    <svg
      className="work-art"
      viewBox="0 0 16 16"
      width="48"
      height="48"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect x="2" y="2" width="12" height="12" fill="#5e0b15" />
      <rect x="3" y="3" width="9" height="10" fill="#90323d" />
      <rect x="12" y="3" width="1" height="10" fill="#bc8034" />
      <rect x="5" y="5" width="5" height="1" fill="#d9cab3" />
      <rect x="5" y="7" width="5" height="1" fill="#d9cab3" />
      <rect x="5" y="9" width="3" height="1" fill="#d9cab3" />
    </svg>
  )
}

function SocialLink({ link, locale }: { link: SiteLink; locale: Locale }) {
  return (
    <div className="social-item">
      <a
        className="social-btn"
        href={link.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${link.label}: ${link.handle}`}
        style={{ ['--social-accent' as string]: link.accent }}
      >
        <BrandIcon name={link.icon} />
      </a>
      <div className="social-preview" role="tooltip">
        <div
          className="social-preview-accent"
          style={{ background: link.accent }}
          aria-hidden="true"
        />
        <div className="social-preview-head">
          <span className="social-preview-icon" aria-hidden="true">
            <BrandIcon name={link.icon} />
          </span>
          <div className="social-preview-meta">
            <span className="social-preview-label">{link.label}</span>
            <span className="social-preview-handle">{link.handle}</span>
          </div>
        </div>
        <p className="social-preview-blurb">{link.blurb[locale]}</p>
      </div>
    </div>
  )
}

function WorkVisual({ work }: { work: Work }) {
  if (work.icon) {
    return (
      <img
        className="work-icon"
        src={work.icon}
        alt=""
        width={56}
        height={56}
      />
    )
  }

  if (work.kind === 'book') {
    return (
      <span className="work-mark work-mark-art" aria-hidden="true">
        <PixelBook />
      </span>
    )
  }

  if (work.kind === 'paper') {
    return (
      <span className="work-mark work-mark-art" aria-hidden="true">
        <PixelPaper />
      </span>
    )
  }

  return (
    <span className="work-mark" aria-hidden="true">
      {work.mark ?? work.title.slice(0, 2).toUpperCase()}
    </span>
  )
}

function WorkCard({
  work,
  pinned = false,
  compact = false,
}: {
  work: Work
  pinned?: boolean
  compact?: boolean
}) {
  return (
    <a
      className={`work-link${pinned ? ' is-pinned' : ''}${compact ? ' is-compact' : ''}`}
      href={work.href}
      target="_blank"
      rel="noreferrer noopener"
    >
      <WorkVisual work={work} />
      <span className="work-copy">
        <span className="work-title">{work.title}</span>
        <span className="work-blurb">{work.blurb}</span>
        <span className="work-badge">{work.badge}</span>
      </span>
      {pinned ? <PixelPin /> : null}
    </a>
  )
}

function LangToggle({
  locale,
  onChange,
}: {
  locale: Locale
  onChange: (locale: Locale) => void
}) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-btn${locale === 'vi' ? ' is-active' : ''}`}
        aria-pressed={locale === 'vi'}
        onClick={() => onChange('vi')}
      >
        VI
      </button>
      <button
        type="button"
        className={`lang-btn${locale === 'en' ? ' is-active' : ''}`}
        aria-pressed={locale === 'en'}
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const siteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    storeLocale(locale)
    document.documentElement.lang = locale
    document.title =
      locale === 'vi' ? 'Lê Trí Nhân' : 'Le Tri Nhan'
  }, [locale])

  // Desktop-only cursor spotlight on the burgundy backdrop.
  useEffect(() => {
    const root = siteRef.current
    if (!root) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!fine.matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 100
        const y = (event.clientY / window.innerHeight) * 100
        root.style.setProperty('--mx', `${x.toFixed(2)}%`)
        root.style.setProperty('--my', `${y.toFixed(2)}%`)
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const workSections = useMemo((): WorkSection[] => {
    const garden = gardenWorks.map((work) => localizeWork(work, locale))
    const apps = appWorks.map((work) => localizeWork(work, locale))
    const electronics = electronicsWorks.map((work) =>
      localizeWork(work, locale),
    )
    const games = gameWorks.map((work) => localizeWork(work, locale))
    const research = researchWorks.map((work) => localizeWork(work, locale))
    const catalog = [...apps, ...electronics, ...games, ...research]

    return [
      {
        id: 'featured',
        title: ui.featured[locale],
        items: featuredIds.map((id) => {
          const work = catalog.find((item) => item.id === id)
          if (!work) throw new Error(`Featured work missing: ${id}`)
          return work
        }),
      },
      {
        id: 'garden',
        title: ui.garden[locale],
        items: garden,
      },
      {
        id: 'apps',
        title: ui.apps[locale],
        items: apps,
      },
      {
        id: 'electronics',
        title: ui.electronics[locale],
        items: electronics,
      },
      {
        id: 'games',
        title: ui.games[locale],
        items: games,
      },
      {
        id: 'researches',
        title: ui.research[locale],
        items: research,
      },
    ]
  }, [locale])

  return (
    <div ref={siteRef} className={`site${ready ? ' is-ready' : ''}`}>
      <GlyphField />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <main className="page">
        <header className="identity" aria-label={ui.profile[locale]}>
          <img
            className="avatar"
            src="/avatar.jpg"
            alt={locale === 'vi' ? 'Lê Trí Nhân' : 'Le Tri Nhan'}
            width={112}
            height={112}
          />
          <div className="identity-meta">
            <div className="identity-top">
              <h1 className="name">
                {locale === 'vi' ? 'Lê Trí Nhân' : 'Le Tri Nhan'}
              </h1>
              <LangToggle locale={locale} onChange={setLocale} />
            </div>
            <nav className="social" aria-label={ui.profiles[locale]}>
              {links.map((link) => (
                <SocialLink key={link.label} link={link} locale={locale} />
              ))}
            </nav>
          </div>
        </header>

        <div className="works">
          {workSections.map((section) => (
            <section
              key={section.id}
              className={`work-section${section.id === 'featured' ? ' is-featured' : ' is-rail'}`}
              aria-labelledby={`${section.id}-title`}
            >
              <h2 id={`${section.id}-title`} className="section-label">
                {section.title}
              </h2>
              <ul className="work-list">
                {section.items.map((work) => (
                  <li key={`${section.id}-${work.id}`}>
                    <WorkCard
                      work={work}
                      pinned={section.id === 'featured'}
                      compact={section.id !== 'featured'}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
