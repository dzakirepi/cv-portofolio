import { Link } from 'react-router-dom'
import { ArrowUpRight, Calendar, Clock, Images } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { formatDate } from '../lib/theme'

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-header">
      <div>
        <h2 className="section-title">
          <span className="title-dot" />
          {title}
        </h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function Cover({ src, alt, seed = '' }) {
  if (src) return <img src={src} alt={alt} loading="lazy" />
  const hue = 250 + ([...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % 60)
  return <div className="cover-fallback" style={{ '--hue': hue }} aria-hidden="true" />
}

export function ProjectCard({ project }) {
  const { tr, t } = useLang()
  const cover = project.images?.[0]?.src || project.image
  const count = project.images?.length || 0
  return (
    <Link to={`/projects/${project.slug}`} className="card project-card">
      <div className="card-media">
        <Cover src={cover} alt={project.title} seed={project.title} />
        {project.category && <span className="media-badge">{t(`projects.cat.${project.category}`)}</span>}
        {count > 1 && (
          <span className="media-count">
            <Images size={13} /> {count}
          </span>
        )}
      </div>
      <div className="card-body">
        <h3>{project.title}</h3>
        <p className="clamp-3">{tr(project.synopsis || project.description)}</p>
        <div className="card-footer">
          <div className="tags">
            {(project.tech?.length ? project.tech : project.tags)?.slice(0, 4).map(tag => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <span className="card-more" aria-hidden="true">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ArticleCard({ article }) {
  const { lang } = useLang()
  return (
    <Link to={`/blog/${article.slug}`} className="card article-card">
      <div className="card-media">
        <Cover src={article.cover} alt={article.title} seed={article.slug} />
      </div>
      <div className="card-body">
        <h3>{article.title}</h3>
        <div className="meta">
          <span>
            <Calendar size={13} /> {formatDate(article.date, lang)}
          </span>
          {article.readTime && (
            <span>
              <Clock size={13} /> {article.readTime}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
