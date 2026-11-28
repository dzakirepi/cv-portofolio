import { Link } from 'react-router-dom'
import { ArrowUpRight, Calendar, Clock } from 'lucide-react'
import { GithubIcon } from './Icons'
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
  return (
    <article className="card project-card">
      <div className="card-media">
        <Cover src={project.image} alt={project.title} seed={project.title} />
      </div>
      <div className="card-body">
        <h3>{project.title}</h3>
        <p>{tr(project.description)}</p>
        <div className="card-footer">
          <div className="tags">
            {project.tags?.map(tag => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="card-links">
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" aria-label={`${t('projects.code')} ${project.title}`}>
                <GithubIcon width={16} height={16} />
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" aria-label={`${t('projects.demo')} ${project.title}`}>
                <ArrowUpRight size={17} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
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
