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
  notebooks: { vi: 'Notebooks', en: 'Notebooks' },
  apps: { vi: 'Ứng dụng', en: 'Apps' },
  electronics: { vi: 'Điện tử', en: 'Electronics' },
  games: { vi: 'Game', en: 'Games' },
  research: { vi: 'Nghiên cứu', en: 'Research' },
  profile: { vi: 'Hồ sơ', en: 'Profile' },
  profiles: { vi: 'Liên kết', en: 'Profiles' },
  langSwitch: { vi: 'Đổi sang English', en: 'Switch to Tiếng Việt' },
  themeLight: { vi: 'Sáng', en: 'Light' },
  themeDark: { vi: 'Tối', en: 'Dark' },
  themeSwitch: { vi: 'Đổi giao diện', en: 'Toggle theme' },
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

/** Local preview ports — keep in sync with `quarto preview` / Vite boot */
export const LOCAL_SITE_BASE: Record<string, string> = {
  'tech-lab': 'http://127.0.0.1:4202/',
  'economic-lab': 'http://127.0.0.1:4203/',
  'policy-lab': 'http://127.0.0.1:4204/',
  'philosophy-lab': 'http://127.0.0.1:4201/',
  'letrinhan-site': 'http://127.0.0.1:5173/letrinhan-site/',
}

export function isLocalHost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

/** Rewrite github.io lab/hub URLs to local preview ports when running locally. */
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

/** Top-nav notebook pages — Tech | Economics | avatar(root) | Policy | Philosophy */
export const notebookNav: NotebookNav[] = [
  {
    id: 'tech-lab',
    href: 'https://letrinhandn.github.io/tech-lab/',
    nav: { vi: 'Tech', en: 'Tech' },
    title: { vi: 'Tech Lab', en: 'Tech Lab' },
    blurb: {
      vi: 'Apps, điện tử và ghi chú xây dựng hệ thống',
      en: 'Apps, electronics, and build notes',
    },
  },
  {
    id: 'economic-lab',
    href: 'https://letrinhandn.github.io/economic-lab/',
    nav: { vi: 'Economics', en: 'Economics' },
    title: { vi: 'Economic Lab', en: 'Economic Lab' },
    blurb: {
      vi: 'Kinh tế, nghiên cứu đầu tư và lý thuyết định lượng',
      en: 'Economics, investment research, and quantitative theory',
    },
  },
  {
    id: 'policy-lab',
    href: 'https://letrinhandn.github.io/policy-lab/',
    nav: { vi: 'Policy', en: 'Policy' },
    title: { vi: 'Policy Lab', en: 'Policy Lab' },
    blurb: {
      vi: 'Tiểu luận và ghi chú về chính sách công',
      en: 'Essays and notes on public policy',
    },
  },
  {
    id: 'philosophy-lab',
    href: 'https://letrinhandn.github.io/philosophy-lab/',
    nav: { vi: 'Philosophy', en: 'Philosophy' },
    title: { vi: 'Philosophy Lab', en: 'Philosophy Lab' },
    blurb: {
      vi: 'Tiểu luận và ghi chú về triết học',
      en: 'Essays and notes on philosophy',
    },
  },
]

/** Quarto knowledge vaults — hub cards if needed */
export const gardenWorks: LocalizedWork[] = notebookNav.map((item) => ({
  id: item.id,
  title: item.title,
  blurb: item.blurb,
  href: item.href,
  icon: asset(
    item.id === 'tech-lab'
      ? 'lab-quant.svg'
      : item.id === 'economic-lab'
        ? 'lab-economic.svg'
        : item.id === 'policy-lab'
          ? 'lab-economic.svg'
          : 'lab-investment.svg', // philosophy
  ),
  badge: { vi: 'Notebook', en: 'Notebook' },
}))

const techPost = (slug: string) =>
  `https://letrinhandn.github.io/tech-lab/posts/${slug}/`

export const appWorks: LocalizedWork[] = [
  {
    id: 'rafetus',
    title: { vi: 'Rafetus', en: 'Rafetus' },
    blurb: {
      vi: 'Ứng dụng quản lý tài liệu bằng AI',
      en: 'AI document manager application',
    },
    href: techPost('rafetus'),
    icon: asset('rafetus-icon.jpg'),
    badge: { vi: 'Ứng dụng', en: 'Application' },
  },
  {
    id: 'terminal-trade',
    title: { vi: 'Terminal Trade', en: 'Terminal Trade' },
    blurb: {
      vi: 'Nền tảng giao dịch kiểu Bloomberg Terminal',
      en: 'Bloomberg Terminal inspired trading platform',
    },
    href: techPost('terminal-trade'),
    icon: asset('terminal-trade-logo.svg'),
    badge: { vi: 'Ứng dụng', en: 'Application' },
  },
]

export const electronicsWorks: LocalizedWork[] = [
  {
    id: 'retro-typewriter-cyberdeck',
    title: {
      vi: 'Retro Typewriter Cyberdeck',
      en: 'Retro Typewriter Cyberdeck',
    },
    blurb: {
      vi: 'Cyberdeck máy đánh chữ cổ điển',
      en: 'Classic typewriter cyberdeck',
    },
    href: techPost('retro-typewriter-cyberdeck'),
    icon: asset('cyberdeck-icon.jpg'),
    badge: { vi: 'Phần cứng', en: 'Hardware' },
  },
]

export const gameWorks: LocalizedWork[] = [
  {
    id: 'ticker',
    title: { vi: 'TICKER', en: 'TICKER' },
    blurb: {
      vi: 'Game board đa người chơi về thị trường chứng khoán',
      en: 'Multiplayer stock market board game',
    },
    href: techPost('ticker'),
    icon: asset('ticker-icon.jpg'),
    badge: { vi: 'Game', en: 'Game' },
  },
]

export const researchWorks: LocalizedWork[] = [
  {
    id: 'vn-crypto-tax-p2p-pricing',
    title: {
      vi: 'Khơi thông nguồn lực tài chính từ thị trường tài sản mã hóa tại Việt Nam: Chính sách thuế và phản ứng định giá trên thị trường giao dịch ngang hàng',
      en: 'Mobilising financial resources from crypto-asset markets in Vietnam: Tax policy and pricing responses on peer-to-peer markets',
    },
    blurb: {
      vi: 'Hội thảo Khoa học Quốc gia: Khơi thông và sử dụng hiệu quả các nguồn lực cho phát triển kinh tế trong kỷ nguyên mới của Việt Nam',
      en: 'National Scientific Conference: Mobilising and using resources for economic development in Vietnam’s new era',
    },
    href: 'https://www.researchgate.net/publication/415322921_Khoi_thong_nguon_luc_tai_chinh_tu_thi_truong_tai_san_ma_hoa_tai_Viet_Nam_Chinh_sach_thue_va_phan_ung_dinh_gia_tren_thi_truong_giao_dich_ngang_hang',
    badge: { vi: '2026: Bài hội thảo', en: '2026: Conference paper' },
    kind: 'paper',
  },
  {
    id: 'ecommerce-informal-employment',
    title: {
      vi: 'Tác động của phát triển thương mại điện tử đến tỷ lệ lao động có việc làm phi chính thức tại Việt Nam',
      en: 'The impact of e-commerce development on informal employment rates in Vietnam',
    },
    blurb: {
      vi: 'Hội thảo Khoa học Quốc gia: Phát triển kinh tế số và nâng cao năng lực cạnh tranh của nền kinh tế',
      en: 'National Scientific Conference: Digital economy development and competitiveness',
    },
    href: 'https://www.researchgate.net/publication/415164795_Tac_dong_cua_phat_trien_thuong_mai_dien_tu_den_ty_le_lao_dong_co_viec_lam_phi_chinh_thuc_tai_Viet_Nam',
    badge: { vi: '2026: Bài hội thảo', en: '2026: Conference paper' },
    kind: 'paper',
  },
]

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
