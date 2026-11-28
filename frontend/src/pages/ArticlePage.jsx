import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { getArticle } from '../lib/api'
import { useLang } from '../lib/i18n'
import { formatDate } from '../lib/theme'
import { Loading } from '../components/Status'
import NotFound from './NotFound'

export default function ArticlePage() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  // result menyimpan slug yang sudah dimuat, jadi status "loading" cukup dihitung.
  const [result, setResult] = useState({ slug: null, article: null })

  useEffect(() => {
    let cancelled = false
    getArticle(slug)
      .then(article => {
        if (cancelled) return
        setResult({ slug, article })
        document.title = `${article.title} — Blog`
      })
      .catch(() => !cancelled && setResult({ slug, article: null }))
    return () => {
      cancelled = true
    }
  }, [slug])

  if (result.slug !== slug) return <Loading />
  const { article } = result
  if (!article) return <NotFound />

  return (
    <article className="section page-top">
      <div className="container article">
        <Link to="/blog" className="link-arrow back">
          <ArrowLeft size={16} /> {t('blog.back')}
        </Link>
        <h1>{article.title}</h1>
        <div className="meta">
          <span>
            <Calendar size={14} /> {formatDate(article.date, lang)}
          </span>
          {article.readTime && (
            <span>
              <Clock size={14} /> {article.readTime}
            </span>
          )}
        </div>
        {article.cover && <img className="article-cover" src={article.cover} alt="" />}
        <div className="prose">
          <Markdown>{article.content}</Markdown>
        </div>
      </div>
    </article>
  )
}
