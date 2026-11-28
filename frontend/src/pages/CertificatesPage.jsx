import { useState } from 'react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { SectionHeader } from '../components/Cards'
import { CertificateGrid } from '../components/Certificates'
import { byDateDesc } from '../lib/sort'

const categories = ['certification', 'course', 'event', 'organization']

export default function CertificatesPage() {
  const { t } = useLang()
  const { certificates } = usePortfolio()
  const [filter, setFilter] = useState('all')

  const sorted = [...certificates].sort(byDateDesc)
  const list = filter === 'all' ? sorted : sorted.filter(c => c.category === filter)
  const count = cat => certificates.filter(c => c.category === cat).length

  return (
    <section className="section page-top">
      <div className="container">
        <SectionHeader title={t('certs.title')} subtitle={t('certs.subtitle')} />
        <div className="filter-chips" role="tablist">
          <button role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>
            {t('certs.all')} <span>{certificates.length}</span>
          </button>
          {categories
            .filter(cat => count(cat) > 0)
            .map(cat => (
              <button key={cat} role="tab" aria-selected={filter === cat} className={filter === cat ? 'is-active' : ''} onClick={() => setFilter(cat)}>
                {t(`certs.cat.${cat}`)} <span>{count(cat)}</span>
              </button>
            ))}
        </div>
        <CertificateGrid key={filter} list={list} />
      </div>
    </section>
  )
}
