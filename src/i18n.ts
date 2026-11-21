export type Locale = 'vi' | 'en'

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
  featured: { vi: 'Nổi bật', en: 'Featured' },
  garden: { vi: 'Digital garden', en: 'Digital garden' },
  apps: { vi: 'Ứng dụng', en: 'Apps' },
  electronics: { vi: 'Điện tử', en: 'Electronics' },
  games: { vi: 'Game', en: 'Games' },
  research: { vi: 'Nghiên cứu', en: 'Research' },
  profile: { vi: 'Hồ sơ', en: 'Profile' },
  profiles: { vi: 'Liên kết', en: 'Profiles' },
  langSwitch: { vi: 'Đổi sang English', en: 'Switch to Tiếng Việt' },
} as const

/** Quarto knowledge vaults — hub links from the personal site */
export const gardenWorks: LocalizedWork[] = [
  {
    id: 'economic-lab',
    title: { vi: 'Economic Lab', en: 'Economic Lab' },
    blurb: {
      vi: 'Bài luận kinh tế học: tăng trưởng, vĩ mô, Solow–Swan',
      en: 'Economic theory essays: growth, macro, Solow–Swan',
    },
    href: 'https://letrinhandn.github.io/economic-lab/',
    icon: '/lab-economic.svg',
    badge: { vi: 'Garden', en: 'Garden' },
  },
  {
    id: 'quant-theory-lab',
    title: { vi: 'Quant Theory Lab', en: 'Quant Theory Lab' },
    blurb: {
      vi: 'Lý thuyết định lượng: notebooks, papers, essays Quarto',
      en: 'Quant finance theory: notebooks, papers, Quarto essays',
    },
    href: 'https://letrinhandn.github.io/quant-theory-lab/',
    icon: '/lab-quant.svg',
    badge: { vi: 'Garden', en: 'Garden' },
  },
  {
    id: 'investment-research-lab',
    title: { vi: 'Investment Research Lab', en: 'Investment Research Lab' },
    blurb: {
      vi: 'Memo, alphas đã pass, báo cáo nghiên cứu đầu tư',
      en: 'Memos, passed alphas, investment research reports',
    },
    href: 'https://letrinhandn.github.io/investment-research-lab/',
    icon: '/lab-investment.svg',
    badge: { vi: 'Garden', en: 'Garden' },
  },
]

export const appWorks: LocalizedWork[] = [
  {
    id: 'rafetus',
    title: { vi: 'Rafetus', en: 'Rafetus' },
    blurb: {
      vi: 'Ứng dụng quản lý tài liệu bằng AI',
      en: 'AI document manager application',
    },
    href: 'https://rafetus.vn',
    icon: '/rafetus-icon.jpg',
    badge: { vi: 'Ứng dụng', en: 'Application' },
  },
  {
    id: 'terminal-trade',
    title: { vi: 'Terminal Trade', en: 'Terminal Trade' },
    blurb: {
      vi: 'Nền tảng giao dịch kiểu Bloomberg Terminal',
      en: 'Bloomberg Terminal inspired trading platform',
    },
    href: 'https://terminal-trade-iota.vercel.app',
    icon: '/terminal-trade-logo.svg',
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
    href: 'https://github.com/letrinhandn/retro-typewriter-cyberdeck',
    icon: '/cyberdeck-icon.jpg',
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
    href: 'https://comrade-lenan.itch.io/ticker',
    icon: '/ticker-icon.jpg',
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
