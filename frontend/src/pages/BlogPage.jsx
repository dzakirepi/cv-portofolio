import { useState } from 'react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { ArticleCard, SectionHeader } from '../components/Cards'
import { SearchBox } from '../sections/Blog'
import { filterArticles } from '../lib/articles'

export default function BlogPage() {
  const { t } = useLang()
  const { articles } = usePortfolio()
  const [q, setQ] = useState('')
  const list = filterArticles(articles, q)

  return (
    <section className="section page-top">
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
      </div>
    </section>
  )
}
