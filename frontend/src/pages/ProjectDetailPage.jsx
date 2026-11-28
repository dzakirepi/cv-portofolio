import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Code2, ExternalLink, Info, Layers } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { ProjectGallery } from '../components/Gallery'
import { GithubIcon } from '../components/Icons'
import NotFound from './NotFound'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { t, tr } = useLang()
  const { projects } = usePortfolio()
  const index = projects.findIndex(p => p.slug === slug)
  const project = projects[index]

  useEffect(() => {
    if (project) document.title = `${project.title} — Portfolio`
  }, [project])

  if (!project) return <NotFound />

  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const paragraphs = tr(project.overview).split(/\n\s*\n/).filter(Boolean)

  return (
    <article className="section page-top">
      <div className="container project-detail">
        <Link to="/projects" className="link-arrow back">
          <ArrowLeft size={16} /> {t('projects.back')}
        </Link>

        <header className="project-head">
          <span className="cert-cat">{t(`projects.cat.${project.category}`)}</span>
          <h1>{project.title}</h1>
          <p className="project-lead">{tr(project.synopsis)}</p>
          <div className="tags">
            {project.tags?.map(tag => (
              <span key={tag} className="tag tag-lg">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <ProjectGallery images={project.images} title={project.title} />
        {project.mockup && (
          <p className="mockup-note">
            <Info size={15} /> {t('projects.mockupNote')}
          </p>
        )}

        <div className="project-body">
          <div className="project-main">
            <h2 className="sub-title">
              <Layers size={20} /> {t('projects.overview')}
            </h2>
            <div className="prose">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {project.features?.length > 0 && (
              <>
                <h2 className="sub-title">
                  <CheckCircle2 size={20} /> {t('projects.features')}
                </h2>
                <ul className="feature-list">
                  {project.features.map((f, i) => (
                    <li key={i}>
                      <CheckCircle2 size={18} />
                      <span>{tr(f)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="card project-info">
            <h3>{t('projects.info')}</h3>
            <dl>
              <dt>
                <Layers size={15} /> {t('projects.category')}
              </dt>
              <dd>{t(`projects.cat.${project.category}`)}</dd>
              {project.context && (
                <>
                  <dt>
                    <Building2 size={15} /> {t('projects.context')}
                  </dt>
                  <dd>{tr(project.context)}</dd>
                </>
              )}
              {project.tech?.length > 0 && (
                <>
                  <dt>
                    <Code2 size={15} /> {t('projects.tech')}
                  </dt>
                  <dd className="tags">
                    {project.tech.map(x => (
                      <span key={x} className="tag">
                        {x}
                      </span>
                    ))}
                  </dd>
                </>
              )}
            </dl>
            {(project.demo || project.repo) && (
              <div className="project-links">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <ExternalLink size={16} /> {t('projects.demo')}
                  </a>
                )}
                {project.repo && (
                  <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-outline">
                    <GithubIcon width={16} height={16} /> {t('projects.code')}
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>

        {projects.length > 1 && (
          <nav className="project-pager">
            <Link to={`/projects/${prev.slug}`} className="card">
              <span>
                <ArrowLeft size={15} /> {t('projects.prev')}
              </span>
              <strong>{prev.title}</strong>
            </Link>
            <Link to={`/projects/${next.slug}`} className="card is-next">
              <span>
                {t('projects.next')} <ArrowRight size={15} />
              </span>
              <strong>{next.title}</strong>
            </Link>
          </nav>
        )}
      </div>
    </article>
  )
}
