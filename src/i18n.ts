export type Locale = 'vi' | 'en'

const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export type LocalizedWork = {
  id: string
  href: string
  icon?: string
  mark?: string
  kind?: 'paper' | 'book'
  title: Record<Locale, string>
  blurb: Record<Locale, string>
  badge: Record<Locale, string>
}

export const ui = {
  home: { vi: 'Trang chủ', en: 'Home' },
  tech: { vi: 'Tech', en: 'Tech' },
  featured: { vi: 'Nổi bật', en: 'Featured' },
  notebooks: { vi: 'Sổ tay', en: 'Notebooks' },
  profile: { vi: 'Hồ sơ', en: 'Profile' },
  profiles: { vi: 'Liên kết', en: 'Profiles' },
  socialSocial: { vi: 'Mạng xã hội', en: 'Social' },
  socialMusic: { vi: 'Âm nhạc', en: 'Music' },
  socialProgramming: { vi: 'Lập trình', en: 'Programming' },
  socialResearch: { vi: 'Nghiên cứu', en: 'Research' },
  socialEconomic: { vi: 'Kinh tế', en: 'Economic' },
  socialPhilosophy: { vi: 'Triết học', en: 'Philosophy' },
  langSwitch: { vi: 'Đổi sang English', en: 'Switch to Tiếng Việt' },
  themeLight: { vi: 'Sáng', en: 'Light' },
  themeDark: { vi: 'Tối', en: 'Dark' },
  themeSwitch: { vi: 'Đổi giao diện', en: 'Toggle theme' },
  menuOpen: { vi: 'Mở menu', en: 'Open menu' },
  menuClose: { vi: 'Đóng menu', en: 'Close menu' },
} as const

export type Theme = 'dark' | 'light'

const THEME_KEY = 'letrinhan-site-theme'

export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY)
    if (value === 'dark' || value === 'light') return value
  } catch {
    /* ignore */
  }
  return null
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore */
  }
}

export function detectTheme(): Theme {
  const stored = readStoredTheme()
  if (stored) return stored
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#5e0b15' : '#f7f1ed')
}

export type NotebookNav = {
  id: string
  href: string
  nav: Record<Locale, string>
  title: Record<Locale, string>
  blurb: Record<Locale, string>
}

/** Local preview ports — keep in sync with `scripts/boot-local.sh` / lab_static_server.py */
export const LOCAL_SITE_BASE: Record<string, string> = {
  'tech-lab': 'http://127.0.0.1:4202/',
  'programming-lab': 'http://127.0.0.1:4202/',
  'economic-lab': 'http://127.0.0.1:4203/',
  'policy-lab': 'http://127.0.0.1:4204/',
  'philosophy-lab': 'http://127.0.0.1:4201/',
  'music-lab': 'http://127.0.0.1:4205/',
  'research-lab': 'http://127.0.0.1:4206/',
  'letrinhan-site': 'http://127.0.0.1:5173/letrinhan-site/',
}

export function isLocalHost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

/**
 * On localhost, rewrite github.io lab/hub URLs to local ports.
 * Boot labs with: `npm run boot` (or `bash scripts/boot-local.sh`).
 */
export function resolveSiteHref(href: string): string {
  if (!href || !isLocalHost()) return href
  try {
    const url = new URL(href, window.location.origin)
    if (!url.hostname.endsWith('github.io')) return href
    const parts = url.pathname.split('/').filter(Boolean)
    const key = parts[0]
    if (!key || !(key in LOCAL_SITE_BASE)) return href
    const base = LOCAL_SITE_BASE[key]
    const rest = parts.slice(1).join('/')
    if (!rest) return base
    return `${base}${rest}${url.pathname.endsWith('/') ? '/' : ''}`
  } catch {
    return href
  }
}

/** Drawer notebook pages */
export const notebookNav: NotebookNav[] = [
  {
    id: 'tech-lab',
    href: 'https://letrinhandn.github.io/tech-lab/',
    nav: { vi: 'Lập trình', en: 'Programming' },
    title: { vi: 'Programming Lab', en: 'Programming Lab' },
    blurb: {
      vi: 'Apps, điện tử và ghi chú lập trình',
      en: 'Apps, hardware, and programming notes',
    },
  },
  {
    id: 'economic-lab',
    href: 'https://letrinhandn.github.io/economic-lab/',
    nav: { vi: 'Kinh tế', en: 'Economics' },
    title: { vi: 'Economic Lab', en: 'Economic Lab' },
    blurb: {
      vi: 'Kinh tế, nghiên cứu đầu tư và lý thuyết định lượng',
      en: 'Economics, investment research, and quantitative theory',
    },
  },
  {
    id: 'research-lab',
    href: 'https://letrinhandn.github.io/research-lab/',
    nav: { vi: 'Nghiên cứu', en: 'Research' },
    title: { vi: 'Research Lab', en: 'Research Lab' },
    blurb: {
      vi: 'Bài hội thảo và ghi chú nghiên cứu',
      en: 'Conference papers and research notes',
    },
  },
  {
    id: 'policy-lab',
    href: 'https://letrinhandn.github.io/policy-lab/',
    nav: { vi: 'Chính sách', en: 'Policy' },
    title: { vi: 'Policy Lab', en: 'Policy Lab' },
    blurb: {
      vi: 'Tiểu luận và ghi chú về chính sách công',
      en: 'Essays and notes on public policy',
    },
  },
  {
    id: 'philosophy-lab',
    href: 'https://letrinhandn.github.io/philosophy-lab/',
    nav: { vi: 'Triết học', en: 'Philosophy' },
    title: { vi: 'Philosophy Lab', en: 'Philosophy Lab' },
    blurb: {
      vi: 'Tiểu luận và ghi chú về triết học',
      en: 'Essays and notes on philosophy',
    },
  },
  {
    id: 'music-lab',
    href: 'https://letrinhandn.github.io/music-lab/',
    nav: { vi: 'Âm nhạc', en: 'Music' },
    title: { vi: 'Music Lab', en: 'Music Lab' },
    blurb: {
      vi: 'Beats, sản xuất nhạc và ghi chú phát hành',
      en: 'Beats, production notes, and release write-ups',
    },
  },
]

const techPost = (slug: string) =>
  `https://letrinhandn.github.io/tech-lab/posts/${slug}/`
const econPost = (slug: string) =>
  `https://letrinhandn.github.io/economic-lab/posts/${slug}/`
const researchPost = (slug: string) =>
  `https://letrinhandn.github.io/research-lab/posts/${slug}/`
const musicPost = (slug: string) =>
  `https://letrinhandn.github.io/music-lab/posts/${slug}/`

export type SectionId =
  | 'research'
  | 'philosophy'
  | 'economic'
  | 'programming'
  | 'music'

/** Featured posts under each hub section (from the matching lab pages). */
export const sectionFeatures: Record<SectionId, LocalizedWork[]> = {
  research: [
    {
      id: 'vn-crypto-tax-p2p-pricing',
      title: {
        vi: 'Thuế và định giá P2P tài sản mã hóa tại Việt Nam',
        en: 'Crypto-asset tax and P2P pricing in Vietnam',
      },
      blurb: {
        vi: 'Hội thảo khoa học quốc gia — chính sách thuế và thị trường P2P',
        en: 'National conference — tax policy and P2P markets',
      },
      href: researchPost('vn-crypto-tax-p2p-pricing'),
      icon: asset('covers/crypto-tax.jpg'),
      badge: { vi: 'Hội thảo', en: 'Conference' },
    },
    {
      id: 'ecommerce-informal-employment',
      title: {
        vi: 'Thương mại điện tử và việc làm phi chính thức tại Việt Nam',
        en: 'E-commerce and informal employment in Vietnam',
      },
      blurb: {
        vi: 'Hội thảo khoa học quốc gia — kinh tế số và cạnh tranh',
        en: 'National conference — digital economy and competitiveness',
      },
      href: researchPost('ecommerce-informal-employment'),
      icon: asset('covers/ecommerce.jpg'),
      badge: { vi: 'Hội thảo', en: 'Conference' },
    },
  ],
  philosophy: [],
  economic: [
    {
      id: 'solow-swan-tang-truong',
      title: {
        vi: 'Những ghi chép về mô hình tăng trưởng Solow-Swan',
        en: 'Notes on the Solow–Swan growth model',
      },
      blurb: {
        vi: 'Từ Đại suy thoái và Harrod-Domar đến trạng thái dừng và quy tắc vàng',
        en: 'From the Great Depression and Harrod–Domar to steady state and the golden rule',
      },
      href: econPost('solow-swan-tang-truong'),
      icon: asset('covers/solow.jpg'),
      badge: { vi: 'Lý thuyết', en: 'Theory' },
    },
  ],
  programming: [
    {
      id: 'rafetus',
      title: { vi: 'Rafetus', en: 'Rafetus' },
      blurb: {
        vi: 'Ứng dụng quản lý tài liệu tích hợp trí tuệ nhân tạo',
        en: 'AI-powered document management application',
      },
      href: techPost('rafetus'),
      icon: asset('covers/rafetus.jpg'),
      badge: { vi: 'Ứng dụng', en: 'App' },
    },
    {
      id: 'terminal-trade',
      title: { vi: 'Terminal Trade', en: 'Terminal Trade' },
      blurb: {
        vi: 'Ứng dụng nghiên cứu và phân tích thị trường tài chính',
        en: 'Financial market research and analysis app',
      },
      href: techPost('terminal-trade'),
      icon: asset('covers/terminal-trade.png'),
      badge: { vi: 'Ứng dụng', en: 'App' },
    },
    {
      id: 'retro-typewriter-cyberdeck',
      title: {
        vi: 'Retro Typewriter Cyberdeck',
        en: 'Retro Typewriter Cyberdeck',
      },
      blurb: {
        vi: 'Máy tính di động tự lắp ráp dùng Raspberry Pi 5',
        en: 'DIY portable computer built on Raspberry Pi 5',
      },
      href: techPost('retro-typewriter-cyberdeck'),
      icon: asset('covers/cyberdeck.jpg'),
      badge: { vi: 'Phần cứng', en: 'Hardware' },
    },
    {
      id: 'ticker',
      title: { vi: 'TICKER', en: 'TICKER' },
      blurb: {
        vi: 'Trò chơi cờ chứng khoán nhiều người chơi',
        en: 'Multiplayer stock-market board game',
      },
      href: techPost('ticker'),
      icon: asset('covers/ticker.jpg'),
      badge: { vi: 'Game', en: 'Game' },
    },
  ],
  music: [
    {
      id: 'beats-youtube',
      title: { vi: 'Beats on YouTube', en: 'Beats on YouTube' },
      blurb: {
        vi: 'Kênh beats và sản xuất nhạc',
        en: 'Beats and music production channel',
      },
      href: musicPost('beats-youtube'),
      icon: asset('covers/music.jpg'),
      badge: { vi: 'Music', en: 'Music' },
    },
  ],
}

const STORAGE_KEY = 'letrinhan-site-locale'

export function readStoredLocale(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'vi' || value === 'en') return value
  } catch {
    /* ignore */
  }
  return null
}

export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
}

export function detectLocale(): Locale {
  const stored = readStoredLocale()
  if (stored) return stored
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'vi'
  return nav.toLowerCase().startsWith('vi') ? 'vi' : 'en'
}
