import { useState } from 'react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { ProjectCard, SectionHeader } from '../components/Cards'

const categories = ['erp', 'docs', 'internal', 'campus']

export default function ProjectsPage() {
  const { t } = useLang()
  const { projects } = usePortfolio()
  const [filter, setFilter] = useState('all')

  const list = filter === 'all' ? projects : projects.filter(p => p.category === filter)
  const count = cat => projects.filter(p => p.category === cat).length

  return (
    <section className="section page-top">
      <div className="container">
        <SectionHeader title={t('projects.allTitle')} subtitle={t('projects.allSubtitle')} />
        <div className="filter-chips" role="tablist">
          <button role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>
            {t('certs.all')} <span>{projects.length}</span>
          </button>
          {categories
            .filter(cat => count(cat) > 0)
            .map(cat => (
              <button key={cat} role="tab" aria-selected={filter === cat} className={filter === cat ? 'is-active' : ''} onClick={() => setFilter(cat)}>
                {t(`projects.cat.${cat}`)} <span>{count(cat)}</span>
              </button>
            ))}
        </div>
        <div className="grid grid-3">
          {list.map(p => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
