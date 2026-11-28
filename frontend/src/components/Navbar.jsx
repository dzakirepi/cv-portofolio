import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { useTheme } from '../lib/theme'
import { usePortfolio } from '../lib/portfolio'

const sections = ['home', 'about', 'projects', 'skills', 'experience', 'education', 'blog', 'contact']

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const { theme, toggle } = useTheme()
  const { profile } = usePortfolio()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sectionActive, setActive] = useState('home')
  const active =
    pathname === '/' ? sectionActive : pathname.startsWith('/blog') ? 'blog' : pathname.startsWith('/projects') ? 'projects' : ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Tandai menu aktif sesuai section yang sedang terlihat (khusus beranda).
  useEffect(() => {
    if (pathname !== '/') return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    const timer = setTimeout(() => {
      sections.forEach(id => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 300)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const brand = profile.brand || 'DZAKI'

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          {brand}
          <span className="brand-dot">.</span>
        </Link>

        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main">
          {sections.map(id => (
            <Link
              key={id}
              to={id === 'home' ? '/' : `/#${id}`}
              className={active === id ? 'is-active' : ''}
              onClick={() => setOpen(false)}
            >
              {t(`nav.${id}`)}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="lang-switch" role="group" aria-label="Language">
            <button className={lang === 'id' ? 'is-active' : ''} onClick={() => setLang('id')}>
              ID
            </button>
            <span>|</span>
            <button className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>
              EN
            </button>
          </div>
          <button className="icon-btn ghost" onClick={toggle} aria-label={t('theme.toggle')}>
            {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button className="icon-btn ghost menu-btn" onClick={() => setOpen(o => !o)} aria-label={t('menu.toggle')} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
