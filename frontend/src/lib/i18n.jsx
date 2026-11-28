import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Teks antarmuka (UI). Konten portofolio (bio, deskripsi proyek, dll.)
// diatur di backend/content/*.json dengan format { "id": "...", "en": "..." }.
const dict = {
  id: {
    'nav.home': 'Beranda',
    'nav.about': 'Tentang',
    'nav.projects': 'Proyek',
    'nav.skills': 'Keahlian',
    'nav.experience': 'Pengalaman',
    'nav.education': 'Pendidikan',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontak',
    'hero.available': 'Terbuka untuk peluang baru',
    'hero.hello': 'Halo, saya',
    'hero.viewProjects': 'Lihat Proyek Saya',
    'hero.contact': 'Hubungi Saya',
    'hero.scroll': 'Gulir',
    'stats.projects': 'Proyek',
    'stats.articles': 'Artikel',
    'stats.years': 'Tahun Pengalaman',
    'stats.certificates': 'Sertifikat',
    'projects.title': 'Proyek Pilihan',
    'projects.subtitle': 'Beberapa karya yang saya bangun untuk memberi dampak.',
    'projects.viewAll': 'Lihat Semua Proyek',
    'projects.allTitle': 'Semua Proyek',
    'projects.allSubtitle': 'Kumpulan proyek yang pernah saya kerjakan.',
    'projects.demo': 'Demo',
    'projects.code': 'Kode',
    'about.title': 'Tentang Saya',
    'about.subtitle': 'Kenali saya lebih dekat',
    'about.downloadCv': 'Unduh CV',
    'about.journey': 'Perjalanan Saya',
    'skills.title': 'Keahlian',
    'skills.subtitle': 'Teknologi dan tools yang saya gunakan sehari-hari.',
    'resume.title': 'Pengalaman & Pendidikan',
    'resume.subtitle': 'Perjalanan karier dan akademik saya.',
    'resume.experience': 'Pengalaman',
    'resume.education': 'Pendidikan',
    'resume.certificates': 'Sertifikat',
    'resume.viewCert': 'Lihat',
    'blog.title': 'Blog',
    'blog.subtitle': 'Wawasan, tutorial, dan pemikiran.',
    'blog.search': 'Cari artikel...',
    'blog.viewAll': 'Lihat Semua Artikel',
    'blog.empty': 'Artikel tidak ditemukan.',
    'blog.back': 'Kembali ke Blog',
    'contact.title': 'Kontak',
    'contact.subtitle': 'Ayo bekerja sama!',
    'contact.email': 'Email',
    'contact.phone': 'Telepon',
    'contact.location': 'Lokasi',
    'contact.name': 'Nama Kamu',
    'contact.yourEmail': 'Email Kamu',
    'contact.message': 'Pesan Kamu',
    'contact.send': 'Kirim Pesan',
    'contact.sending': 'Mengirim...',
    'contact.success': 'Terima kasih! Pesan kamu sudah terkirim.',
    'contact.error': 'Pesan gagal dikirim. Coba lagi atau hubungi lewat email.',
    'common.loading': 'Memuat...',
    'common.error': 'Gagal memuat data. Pastikan backend sudah berjalan.',
    'common.retry': 'Coba lagi',
    'common.backHome': 'Kembali ke Beranda',
    'common.notFound': 'Halaman tidak ditemukan',
    'footer.rights': 'Hak cipta dilindungi.',
    'theme.toggle': 'Ganti tema',
    'menu.toggle': 'Buka menu'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.education': 'Education',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'hero.available': 'Available for opportunities',
    'hero.hello': "Hello, I'm",
    'hero.viewProjects': 'View My Projects',
    'hero.contact': 'Contact Me',
    'hero.scroll': 'Scroll Down',
    'stats.projects': 'Projects',
    'stats.articles': 'Articles',
    'stats.years': 'Years Experience',
    'stats.certificates': 'Certificates',
    'projects.title': 'Selected Projects',
    'projects.subtitle': 'A showcase of my work in building impactful solutions.',
    'projects.viewAll': 'View All Projects',
    'projects.allTitle': 'All Projects',
    'projects.allSubtitle': "A collection of things I've built.",
    'projects.demo': 'Demo',
    'projects.code': 'Code',
    'about.title': 'About Me',
    'about.subtitle': 'Get to know more about me',
    'about.downloadCv': 'Download CV',
    'about.journey': 'My Journey',
    'skills.title': 'Skills',
    'skills.subtitle': 'Technologies and tools I use every day.',
    'resume.title': 'Experience & Education',
    'resume.subtitle': 'My professional and academic journey.',
    'resume.experience': 'Experience',
    'resume.education': 'Education',
    'resume.certificates': 'Certificates',
    'resume.viewCert': 'View',
    'blog.title': 'Blog',
    'blog.subtitle': 'Insights, tutorials, and thoughts.',
    'blog.search': 'Search article...',
    'blog.viewAll': 'View All Articles',
    'blog.empty': 'No articles found.',
    'blog.back': 'Back to Blog',
    'contact.title': 'Contact',
    'contact.subtitle': "Let's work together!",
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.name': 'Your Name',
    'contact.yourEmail': 'Your Email',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Thank you! Your message has been sent.',
    'contact.error': 'Failed to send. Please try again or reach me by email.',
    'common.loading': 'Loading...',
    'common.error': 'Failed to load data. Make sure the backend is running.',
    'common.retry': 'Try again',
    'common.backHome': 'Back to Home',
    'common.notFound': 'Page not found',
    'footer.rights': 'All rights reserved.',
    'theme.toggle': 'Toggle theme',
    'menu.toggle': 'Open menu'
  }
}

const LangContext = createContext(null)

function initialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'id' || saved === 'en') return saved
  } catch {
    /* localStorage tidak tersedia */
  }
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* abaikan */
    }
  }, [lang])

  const t = useCallback(key => dict[lang][key] ?? key, [lang])

  // tr: ambil teks konten sesuai bahasa. Menerima string biasa atau { id, en }.
  const tr = useCallback(
    value => {
      if (value == null) return ''
      if (typeof value === 'string') return value
      return value[lang] || value.en || value.id || ''
    },
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t, tr }), [lang, t, tr])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext)
