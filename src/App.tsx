import { useEffect, useMemo, useRef, useState } from 'react'
import { BrandIcon, type IconKey } from './BrandIcon'
import { GlyphField } from './GlyphField'
import {
  appWorks,
  applyTheme,
  detectLocale,
  detectTheme,
  electronicsWorks,
  gameWorks,
  notebookNav,
  researchWorks,
  storeLocale,
  storeTheme,
  ui,
  type Locale,
  type LocalizedWork,
  type Theme,
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
  {
    label: 'CrunchDAO',
    href: 'https://hub.crunchdao.com/users/comradelenan',
    icon: 'crunchdao',
    handle: '@comradelenan',
    accent: '#e8e8e8',
    blurb: {
      vi: 'Cuộc thi dữ liệu và mô hình trên CrunchDAO.',
      en: 'Data competitions and models on CrunchDAO.',
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
  const next = locale === 'vi' ? 'en' : 'vi'
  return (
    <button
      type="button"
      className="header-chip"
      aria-label={ui.langSwitch[locale]}
      title={ui.langSwitch[locale]}
      onClick={() => onChange(next)}
    >
      {locale === 'vi' ? 'VI' : 'EN'}
    </button>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="square"
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 7 7 0 1 0 20.5 14.2Z" />
    </svg>
  )
}

function ThemeToggle({
  theme,
  locale,
  onChange,
}: {
  theme: Theme
  locale: Locale
  onChange: (theme: Theme) => void
}) {
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      className="header-chip is-icon"
      aria-label={ui.themeSwitch[locale]}
      title={ui.themeSwitch[locale]}
      aria-pressed={theme === 'dark'}
      onClick={() => onChange(next)}
    >
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const [theme, setTheme] = useState<Theme>(() => detectTheme())
  const siteRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    storeTheme(theme)
    applyTheme(theme)
  }, [theme])

  // Drive --p from scroll so logo scale + nav gap shrink in lockstep.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const RANGE = 120
    let frame = 0
    const sync = () => {
      frame = 0
      const p = Math.min(1, Math.max(0, window.scrollY / RANGE))
      header.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(sync)
    }
    // pageshow covers bfcache Back from labs (Finance/Tech/…)
    const onPageShow = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sync)
    }
    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('resize', onPageShow)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('resize', onPageShow)
    }
  }, [])

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
    <div
      ref={siteRef}
      className={`site${ready ? ' is-ready' : ''}`}
      data-theme={theme}
    >
      <GlyphField />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <header ref={headerRef} className="site-header" style={{ ['--p' as string]: 0 }}>
        <div className="site-header-bar">
          <nav className="site-nav site-nav-left" aria-label={ui.notebooks[locale]}>
            <a
              className="site-nav-link"
              href={notebookNav[0].href}
              title={notebookNav[0].title[locale]}
            >
              {notebookNav[0].nav[locale]}
            </a>
            <a
              className="site-nav-link"
              href={notebookNav[1].href}
              title={notebookNav[1].title[locale]}
            >
              {notebookNav[1].nav[locale]}
            </a>
          </nav>

          <div className="site-logo-slot" aria-hidden="true" />
          <a
            className="site-logo"
            href={`${import.meta.env.BASE_URL}`}
            aria-label={ui.home[locale]}
            title={ui.home[locale]}
          >
            <img
              className="hero-avatar"
              src={`${import.meta.env.BASE_URL}avatar.jpg`}
              alt={locale === 'vi' ? 'Lê Trí Nhân' : 'Le Tri Nhan'}
              width={148}
              height={148}
            />
          </a>

          <nav className="site-nav site-nav-right" aria-label={ui.notebooks[locale]}>
            <a
              className="site-nav-link"
              href={notebookNav[2].href}
              title={notebookNav[2].title[locale]}
            >
              {notebookNav[2].nav[locale]}
            </a>
            <a
              className="site-nav-link"
              href={notebookNav[3].href}
              title={notebookNav[3].title[locale]}
            >
              {notebookNav[3].nav[locale]}
            </a>
          </nav>
        </div>
        <div className="site-controls">
          <ThemeToggle theme={theme} locale={locale} onChange={setTheme} />
          <LangToggle locale={locale} onChange={setLocale} />
        </div>
      </header>

      <div className="shell">
        <main className="page">
          <header className="hero" aria-label={ui.profile[locale]}>
            <h1 className="hero-name">
              {locale === 'vi' ? 'Lê Trí Nhân' : 'Le Tri Nhan'}
            </h1>
            <nav className="social" aria-label={ui.profiles[locale]}>
              {links.map((link) => (
                <SocialLink key={link.label} link={link} locale={locale} />
              ))}
            </nav>
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
    </div>
  )
}
