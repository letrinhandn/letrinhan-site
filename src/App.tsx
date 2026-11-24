import { useEffect, useMemo, useRef, useState } from 'react'
import { BrandIcon, type IconKey } from './BrandIcon'
import { GlyphField } from './GlyphField'
import {
  applyTheme,
  detectLocale,
  detectTheme,
  isLocalHost,
  notebookNav,
  resolveSiteHref,
  sectionFeatures,
  storeLocale,
  storeTheme,
  ui,
  type Locale,
  type LocalizedWork,
  type SectionId,
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

type SocialGroup = {
  id: SectionId
  title: { readonly vi: string; readonly en: string }
  links: SiteLink[]
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

const heroLinks: SiteLink[] = [
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
]

const socialGroups: SocialGroup[] = [
  {
    id: 'research',
    title: ui.socialResearch,
    links: [
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
    ],
  },
  {
    id: 'philosophy',
    title: ui.socialPhilosophy,
    links: [],
  },
  {
    id: 'economic',
    title: ui.socialEconomic,
    links: [
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
      {
        label: 'Numerai',
        href: 'https://signals.numer.ai/comrade_letrinhan',
        icon: 'numerai',
        handle: '@comrade_letrinhan',
        accent: '#7c3aed',
        blurb: {
          vi: 'Numerai Signals — mô hình dự đoán thị trường.',
          en: 'Numerai Signals — market prediction models.',
        },
      },
      {
        label: 'WorldQuant BRAIN',
        href: 'https://platform.worldquantbrain.com/profile/public/NL70332',
        icon: 'worldquant',
        handle: 'NL70332',
        accent: '#00c2ff',
        blurb: {
          vi: 'Hồ sơ WorldQuant BRAIN công khai.',
          en: 'Public WorldQuant BRAIN profile.',
        },
      },
    ],
  },
  {
    id: 'programming',
    title: ui.socialProgramming,
    links: [
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
    ],
  },
  {
    id: 'music',
    title: ui.socialMusic,
    links: [
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
    ],
  },
]

function localizeWork(work: LocalizedWork, locale: Locale): Work {
  return {
    id: work.id,
    title: work.title[locale],
    blurb: work.blurb[locale],
    badge: work.badge[locale],
    href: resolveSiteHref(work.href),
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
  const external =
    /^https?:\/\//i.test(work.href) &&
    !/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/i.test(work.href)
  return (
    <a
      className={`work-link${pinned ? ' is-pinned' : ''}${compact ? ' is-compact' : ''}`}
      href={work.href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
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
      {/* Current language — matches visible copy (VI ↔ EN) */}
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

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="square" d="M6 6l12 12M18 6L6 18" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="square" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const [theme, setTheme] = useState<Theme>(() => detectTheme())
  const siteRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuOpenRef = useRef(false)

  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

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

  // Close drawer on Escape; lock page scroll while open
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // Drive --p from scroll so logo scale shrinks in lockstep.
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
      if (menuOpenRef.current) setMenuOpen(false)
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

  // Desktop-only cursor spotlight — throttled to avoid layout thrash.
  useEffect(() => {
    const root = siteRef.current
    if (!root) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!fine.matches) return

    let frame = 0
    let last = 0
    const onMove = (event: PointerEvent) => {
      const now = performance.now()
      if (now - last < 50) return
      last = now
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 100
        const y = (event.clientY / window.innerHeight) * 100
        root.style.setProperty('--mx', `${x.toFixed(1)}%`)
        root.style.setProperty('--my', `${y.toFixed(1)}%`)
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const featuresBySection = useMemo(() => {
    const map = {} as Record<SectionId, Work[]>
    for (const id of Object.keys(sectionFeatures) as SectionId[]) {
      map[id] = sectionFeatures[id].map((work) => localizeWork(work, locale))
    }
    return map
  }, [locale])

  const gated = !isLocalHost()

  useEffect(() => {
    document.documentElement.classList.toggle('is-gated', gated)
    return () => {
      document.documentElement.classList.remove('is-gated')
    }
  }, [gated])

  return (
    <div
      ref={siteRef}
      className={`site${ready ? ' is-ready' : ''}${gated ? ' is-gated' : ''}`}
      data-theme={theme}
      {...(gated ? ({ inert: true } as object) : null)}
    >
      <GlyphField />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <header ref={headerRef} className="site-header" style={{ ['--p' as string]: 0 }}>
        <div className="site-header-bar">
          <button
            type="button"
            className="header-chip is-icon site-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="site-drawer"
            aria-label={menuOpen ? ui.menuClose[locale] : ui.menuOpen[locale]}
            title={menuOpen ? ui.menuClose[locale] : ui.menuOpen[locale]}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} />
          </button>

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

          <div className="site-controls">
            <ThemeToggle theme={theme} locale={locale} onChange={setTheme} />
            <LangToggle locale={locale} onChange={setLocale} />
          </div>
        </div>
      </header>

      <div
        className={`site-drawer-layer${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="site-drawer-backdrop"
          tabIndex={menuOpen ? 0 : -1}
          aria-label={ui.menuClose[locale]}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          id="site-drawer"
          className="site-drawer"
          aria-label={ui.notebooks[locale]}
          {...(!menuOpen ? ({ inert: true } as object) : null)}
        >
          <p className="site-drawer-label">{ui.notebooks[locale]}</p>
          {notebookNav.map((item) => {
            const href = resolveSiteHref(item.href)
            const external =
              /^https?:\/\//i.test(href) &&
              !/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/i.test(href)
            return (
              <a
                key={item.id}
                className="site-drawer-link"
                href={href}
                title={item.title[locale]}
                tabIndex={menuOpen ? 0 : -1}
                {...(external || !isLocalHost()
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                onClick={() => setMenuOpen(false)}
              >
                {item.nav[locale]}
              </a>
            )
          })}
        </nav>
      </div>

      <div className="shell">
        <main className="page">
          <header className="hero" aria-label={ui.profile[locale]}>
            <h1 className="hero-name">
              {locale === 'vi' ? 'Lê Trí Nhân' : 'Le Tri Nhan'}
            </h1>
            <nav className="social hero-social" aria-label={ui.socialSocial[locale]}>
              {heroLinks.map((link) => (
                <SocialLink key={link.label} link={link} locale={locale} />
              ))}
            </nav>
          </header>

          <div className="social-groups" aria-label={ui.profiles[locale]}>
            {socialGroups.map((group) => (
              <section
                key={group.id}
                className="social-group"
                aria-labelledby={`social-${group.id}-title`}
              >
                <div className="social-group-head">
                  <h2 id={`social-${group.id}-title`} className="section-label">
                    {group.title[locale]}
                  </h2>
                  {group.links.length > 0 ? (
                    <nav className="social" aria-label={group.title[locale]}>
                      {group.links.map((link) => (
                        <SocialLink
                          key={link.label}
                          link={link}
                          locale={locale}
                        />
                      ))}
                    </nav>
                  ) : null}
                </div>
                {featuresBySection[group.id].length > 0 ? (
                  <ul className="work-list feature-grid">
                    {featuresBySection[group.id].map((work) => (
                      <li key={work.id}>
                        <WorkCard work={work} pinned compact />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
