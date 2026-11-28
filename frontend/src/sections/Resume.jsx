import { Award, Briefcase, ExternalLink, GraduationCap } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { SectionHeader } from '../components/Cards'

function Column({ id, icon: Icon, title, items }) {
  return (
    <div className="card resume-col" id={id}>
      <div className="skill-head">
        <span className="icon-tile">
          <Icon size={20} />
        </span>
        <h3>{title}</h3>
      </div>
      <ol className="timeline">
        {items.map((it, i) => (
          <li key={i}>
            <span className="timeline-period">{it.period}</span>
            <strong>{it.title}</strong>
            <span className="timeline-place">{it.place}</span>
            {it.description && <p>{it.description}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Resume() {
  const { t, tr } = useLang()
  const { experience, education, certificates } = usePortfolio()

  return (
    <section className="section">
      <div className="container">
        <SectionHeader title={t('resume.title')} subtitle={t('resume.subtitle')} />
        <div className="grid grid-2">
          <Column
            id="experience"
            icon={Briefcase}
            title={t('resume.experience')}
            items={experience.map(e => ({ period: tr(e.period), title: tr(e.role), place: e.company, description: tr(e.description) }))}
          />
          <Column
            id="education"
            icon={GraduationCap}
            title={t('resume.education')}
            items={education.map(e => ({ period: tr(e.period), title: tr(e.degree), place: e.school, description: tr(e.description) }))}
          />
        </div>

        {certificates.length > 0 && (
          <div className="certificates">
            <h3 className="sub-title">
              <Award size={20} /> {t('resume.certificates')}
            </h3>
            <div className="grid grid-3">
              {certificates.map((c, i) => (
                <div key={i} className="card cert-card">
                  <div>
                    <strong>{c.title}</strong>
                    <span>{[c.issuer, c.year].filter(Boolean).join(' · ')}</span>
                  </div>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noreferrer" className="link-arrow">
                      {t('resume.viewCert')} <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
