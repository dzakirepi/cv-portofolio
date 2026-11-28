import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { ProjectCard, SectionHeader } from '../components/Cards'

export default function Projects() {
  const { t } = useLang()
  const { projects } = usePortfolio()
  const featured = projects.filter(p => p.featured)
  const list = (featured.length ? featured : projects).slice(0, 4)

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeader
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
          action={
            <Link to="/projects" className="link-arrow">
              {t('projects.viewAll')} <ArrowRight size={16} />
            </Link>
          }
        />
        <div className="grid grid-4">
          {list.map(p => (
            <ProjectCard key={p.slug || p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
