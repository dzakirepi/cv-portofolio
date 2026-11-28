import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { ArticleCard, SectionHeader } from '../components/Cards'
import { filterArticles } from '../lib/articles'

export function SearchBox({ value, onChange }) {
  const { t } = useLang()
  return (
    <label className="search-box">
      <input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={t('blog.search')} />
      <Search size={16} />
    </label>
  )
}

export default function Blog() {
  const { t } = useLang()
  const { articles } = usePortfolio()
  const [q, setQ] = useState('')
  const list = filterArticles(articles, q).slice(0, 3)

  if (!articles.length) return null

  return (
    <section className="section" id="blog">
      <div className="container">
        <SectionHeader title={t('blog.title')} subtitle={t('blog.subtitle')} action={<SearchBox value={q} onChange={setQ} />} />
        {list.length ? (
          <div className="grid grid-3">
            {list.map(a => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        ) : (
          <p className="empty">{t('blog.empty')}</p>
        )}
        <div className="center">
          <Link to="/blog" className="btn btn-outline">
            {t('blog.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
