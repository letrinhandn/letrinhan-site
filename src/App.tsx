import { useEffect, useMemo, useState } from 'react'
import { BrandIcon, type IconKey } from './BrandIcon'
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

const tickerItems = [
  { label: 'Tech Lab', value: 'Apps · Hardware' },
  { label: 'Economic Lab', value: 'Growth · Solow' },
  { label: 'Quant Theory', value: 'Models · Signals' },
  { label: 'Finance Lab', value: 'Research notes' },
  { label: 'Rafetus', value: 'AI docs' },
  { label: 'Terminal Trade', value: 'Live desk' },
  { label: 'TICKER', value: 'Board game' },
  { label: 'CrunchDAO', value: '@comradelenan' },
]

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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
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

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5.5A2.5 2.5 0 0 0 5.5 10H8M16 5h2.5A2.5 2.5 0 0 1 18.5 10H16" />
      <path d="M12 11v3M9 20h6M10 17h4v3h-4v-3Z" />
    </svg>
  )
}

function SocialLink({ link, locale }: { link: SiteLink; locale: Locale }) {
  return (
    <a
      className="social-btn"
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${link.label}: ${link.handle}`}
      title={`${link.label} · ${link.handle}`}
      style={{ ['--social-accent' as string]: link.accent }}
    >
      <BrandIcon name={link.icon} />
      <span className="social-btn-tip">
        <strong>{link.label}</strong>
        <span>{link.handle}</span>
        <em>{link.blurb[locale]}</em>
      </span>
    </a>
  )
}

function WorkVisual({ work }: { work: Work }) {
  if (work.icon) {
    return (
      <div className="work-media">
        <img className="work-icon" src={work.icon} alt="" width={640} height={360} />
        <div className="work-media-veil" aria-hidden="true" />
      </div>
    )
  }

  const mark = work.mark ?? work.title.slice(0, 2).toUpperCase()
  return (
    <div className="work-media is-fallback" aria-hidden="true">
      <span className="work-mark">{mark}</span>
      <div className="work-media-veil" />
    </div>
  )
}

function WorkCard({
  work,
  featured = false,
  locale,
}: {
  work: Work
  featured?: boolean
  locale: Locale
}) {
  return (
    <a
      className={`work-card${featured ? ' is-featured' : ''}`}
      href={work.href}
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="work-card-top">
        <span className={`work-status${featured ? ' is-live' : ''}`}>
          {featured ? ui.live[locale] : work.badge}
        </span>
        <span className="work-meta">
          <TrophyIcon />
          <span>{work.badge}</span>
        </span>
      </div>
      <h3 className="work-title">{work.title}</h3>
      <WorkVisual work={work} />
      <p className="work-blurb">{work.blurb}</p>
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
      className="chip"
      aria-label={ui.langSwitch[locale]}
      title={ui.langSwitch[locale]}
      onClick={() => onChange(next)}
    >
      {locale === 'vi' ? 'VI' : 'EN'}
    </button>
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
      className="chip is-icon"
      aria-label={ui.themeSwitch[locale]}
      title={ui.themeSwitch[locale]}
      aria-pressed={theme === 'dark'}
      onClick={() => onChange(next)}
    >
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

function Ticker() {
  const loop = [...tickerItems, ...tickerItems]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {loop.map((item, index) => (
          <span className="ticker-item" key={`${item.label}-${index}`}>
            <span className="ticker-sep" />
            <span className="ticker-value">{item.value}</span>
            <span className="ticker-label">From {item.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const [theme, setTheme] = useState<Theme>(() => detectTheme())
  const [navOpen, setNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    storeLocale(locale)
    document.documentElement.lang = locale
    document.title = locale === 'vi' ? 'Lê Trí Nhân' : 'Le Tri Nhan'
  }, [locale])

  useEffect(() => {
    storeTheme(theme)
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  useEffect(() => {
    const ids = ['overview', 'featured', 'apps', 'electronics', 'games', 'researches']
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [locale])

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
      { id: 'apps', title: ui.apps[locale], items: apps },
      { id: 'electronics', title: ui.electronics[locale], items: electronics },
      { id: 'games', title: ui.games[locale], items: games },
      { id: 'researches', title: ui.research[locale], items: research },
    ]
  }, [locale])

  const displayName = locale === 'vi' ? 'Lê Trí Nhân' : 'Le Tri Nhan'
  const sectionNav = [
    { id: 'overview', label: ui.overview[locale] },
    ...workSections.map((section) => ({ id: section.id, label: section.title })),
  ]

  return (
    <div className={`site${ready ? ' is-ready' : ''}`} data-theme={theme}>
      <Ticker />

      <div className="frame">
        <aside className={`sidebar${navOpen ? ' is-open' : ''}`}>
          <div className="sidebar-brand">
            <a className="brand-link" href={`${import.meta.env.BASE_URL}`} onClick={() => setNavOpen(false)}>
              <img
                className="brand-avatar"
                src={`${import.meta.env.BASE_URL}avatar.jpg`}
                alt=""
                width={40}
                height={40}
              />
              <span className="brand-copy">
                <strong>{displayName}</strong>
                <span>Hub</span>
              </span>
            </a>
          </div>

          <nav className="side-nav" aria-label={ui.notebooks[locale]}>
            <p className="side-label">{ui.labs[locale]}</p>
            {notebookNav.map((item) => (
              <a
                key={item.id}
                className="side-link"
                href={item.href}
                title={item.title[locale]}
              >
                <span className="side-dot" aria-hidden="true" />
                <span>{item.nav[locale]}</span>
              </a>
            ))}

            <p className="side-label">{ui.works[locale]}</p>
            {sectionNav.map((item) => (
              <a
                key={item.id}
                className={`side-link${activeSection === item.id ? ' is-active' : ''}`}
                href={`#${item.id}`}
                onClick={() => setNavOpen(false)}
              >
                <span className="side-dot" aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="sidebar-foot">
            <ThemeToggle theme={theme} locale={locale} onChange={setTheme} />
            <LangToggle locale={locale} onChange={setLocale} />
          </div>
        </aside>

        {navOpen ? (
          <button
            type="button"
            className="nav-scrim"
            aria-label={ui.closeMenu[locale]}
            onClick={() => setNavOpen(false)}
          />
        ) : null}

        <div className="main-column">
          <header className="topbar">
            <button
              type="button"
              className="menu-btn"
              aria-label={navOpen ? ui.closeMenu[locale] : ui.menu[locale]}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((open) => !open)}
            >
              <MenuIcon open={navOpen} />
            </button>
            <p className="topbar-title">{ui.overview[locale]}</p>
            <div className="topbar-controls">
              <ThemeToggle theme={theme} locale={locale} onChange={setTheme} />
              <LangToggle locale={locale} onChange={setLocale} />
            </div>
          </header>

          <main className="page">
            <section className="panel profile-panel" id="overview" aria-label={ui.profile[locale]}>
              <div className="profile-head">
                <img
                  className="profile-avatar"
                  src={`${import.meta.env.BASE_URL}avatar.jpg`}
                  alt={displayName}
                  width={72}
                  height={72}
                />
                <div className="profile-text">
                  <p className="eyebrow">{ui.profile[locale]}</p>
                  <h1>{displayName}</h1>
                  <p className="profile-handle">@comradelenan</p>
                </div>
              </div>
              <nav className="social" aria-label={ui.profiles[locale]}>
                {links.map((link) => (
                  <SocialLink key={link.label} link={link} locale={locale} />
                ))}
              </nav>
            </section>

            <div className="works">
              {workSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className={`work-section${section.id === 'featured' ? ' is-featured' : ''}`}
                  aria-labelledby={`${section.id}-title`}
                >
                  <div className="section-head">
                    <h2 id={`${section.id}-title`}>{section.title}</h2>
                    <span className="section-count">{section.items.length}</span>
                  </div>
                  <div className={`work-grid${section.id === 'featured' ? ' is-featured' : ''}`}>
                    {section.items.map((work) => (
                      <WorkCard
                        key={`${section.id}-${work.id}`}
                        work={work}
                        featured={section.id === 'featured'}
                        locale={locale}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <footer className="site-footer">
              <div className="footer-brand">
                <span className="footer-mark" aria-hidden="true" />
                <strong>{displayName}</strong>
              </div>
              <div className="footer-social">
                {links.slice(0, 4).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={link.label}
                  >
                    <BrandIcon name={link.icon} />
                  </a>
                ))}
              </div>
              <p className="footer-copy">
                © {new Date().getFullYear()} {displayName}
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}
