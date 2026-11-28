import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { ProjectCard, SectionHeader } from '../components/Cards'

export default function ProjectsPage() {
  const { t } = useLang()
  const { projects } = usePortfolio()
  return (
    <section className="section page-top">
      <div className="container">
        <SectionHeader title={t('projects.allTitle')} subtitle={t('projects.allSubtitle')} />
        <div className="grid grid-3">
          {projects.map(p => (
            <ProjectCard key={p.slug || p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
