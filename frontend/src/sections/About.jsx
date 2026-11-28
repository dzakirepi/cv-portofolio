import { Download } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { SectionHeader } from '../components/Cards'

export default function About() {
  const { t, tr } = useLang()
  const { profile, experience, education } = usePortfolio()

  // "My Journey": gabungan pendidikan & pengalaman, diurutkan dari yang terlama.
  const journey = [
    ...education.map(e => ({ start: e.start, period: tr(e.period), title: tr(e.degree), place: e.school })),
    ...experience.map(e => ({ start: e.start, period: tr(e.period), title: tr(e.role), place: e.company }))
  ].sort((a, b) => String(a.start || a.period).localeCompare(String(b.start || b.period)))

  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="about-photo">
          <div className="about-photo-glow" aria-hidden="true" />
          {profile.photo && <img src={profile.photo} alt={profile.name} loading="lazy" />}
        </div>

        <div className="about-content">
          <SectionHeader title={t('about.title')} subtitle={t('about.subtitle')} />
          <p className="about-text">{tr(profile.about)}</p>
          {profile.aboutTags?.length > 0 && (
            <div className="tags">
              {profile.aboutTags.map(tag => (
                <span key={tag} className="tag tag-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {profile.cv && (
            <a href={profile.cv} className="btn btn-primary" download>
              {t('about.downloadCv')} <Download size={17} />
            </a>
          )}
        </div>

        {journey.length > 0 && (
          <div className="journey">
            <h3>{t('about.journey')}</h3>
            <ol className="timeline">
              {journey.map((j, i) => (
                <li key={i}>
                  <span className="timeline-period">{j.period}</span>
                  <strong>{j.title}</strong>
                  <span className="timeline-place">{j.place}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
