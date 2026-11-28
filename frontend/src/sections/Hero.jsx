import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Folder, Mail, Trophy, Users } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'

export default function Hero() {
  const { t, tr } = useLang()
  const { profile, projects, articles, certificates } = usePortfolio()
  const s = profile.stats || {}

  // Angka statistik bisa diatur manual di profile.json → "stats".
  // Jika kosong, dihitung otomatis dari jumlah data.
  const stats = [
    { icon: Folder, value: s.projects || projects.length, label: t('stats.projects') },
    { icon: FileText, value: s.articles || articles.length, label: t('stats.articles') },
    { icon: Users, value: s.years || '1+', label: t('stats.years') },
    { icon: Trophy, value: s.certificates || certificates.length, label: t('stats.certificates') }
  ]

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-content">
          {profile.available !== false && (
            <span className="badge-available">
              <span className="pulse-dot" />
              {t('hero.available')}
            </span>
          )}
          <h1 className="hero-title">
            <span className="hero-hello">{t('hero.hello')}</span>
            <span className="gradient-text">{profile.name}</span>
          </h1>
          <p className="hero-role">{tr(profile.role)}</p>
          <p className="hero-tagline">{tr(profile.tagline)}</p>

          <div className="hero-actions">
            <Link to="/#projects" className="btn btn-primary">
              {t('hero.viewProjects')} <ArrowRight size={17} />
            </Link>
            <Link to="/#contact" className="btn btn-outline">
              {t('hero.contact')} <Mail size={17} />
            </Link>
          </div>

          <ul className="stats">
            {stats.map(({ icon: Icon, value, label }) => (
              <li key={label}>
                <Icon className="stat-icon" size={24} />
                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual">
          <div className="hero-rings" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero-glow" aria-hidden="true" />
          {profile.photo && <img className="hero-photo" src={profile.photo} alt={profile.name} />}
        </div>
      </div>

      <Link to="/#projects" className="scroll-down" aria-label={t('hero.scroll')}>
        <span className="mouse">
          <span />
        </span>
        {t('hero.scroll')}
      </Link>
    </section>
  )
}
