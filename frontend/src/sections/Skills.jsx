import { Code2, Server, Wrench } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { SectionHeader } from '../components/Cards'

const icons = [Code2, Server, Wrench]

export default function Skills() {
  const { t, tr } = useLang()
  const { skills } = usePortfolio()
  if (!skills.length) return null

  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHeader title={t('skills.title')} subtitle={t('skills.subtitle')} />
        <div className="grid grid-3">
          {skills.map((group, i) => {
            const Icon = icons[i % icons.length]
            return (
              <div key={i} className="card skill-card">
                <div className="skill-head">
                  <span className="icon-tile">
                    <Icon size={20} />
                  </span>
                  <h3>{tr(group.category)}</h3>
                </div>
                <div className="tags">
                  {group.items?.map(item => (
                    <span key={item} className="tag tag-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
