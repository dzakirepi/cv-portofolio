import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Code2,
  ExternalLink,
  FolderGit2,
  FileText,
  Briefcase,
  Award
} from 'lucide-react'
import { getPortfolio } from '../../services/api'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

function imageUrl(value) {
  if (!value) return ''
  if (value.startsWith('http')) return value
  return `${BACKEND_URL}${value.startsWith('/') ? '' : '/'}${value}`
}

export default function Home() {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPortfolio()
      .then(result => {
        if (result?.success) {
          setPortfolio(result.data)
        } else if (result && typeof result === 'object') {
          setPortfolio(result)
        }
      })
      .catch(error => {
        console.error('Gagal mengambil portfolio:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  const profile = portfolio?.profile?.[0] || {}
  const projects = portfolio?.projects || []
  const skills = portfolio?.skills || []
  const experiences = portfolio?.experience || []
  const education = portfolio?.education || []
  const certificates = portfolio?.certificates || []
  const articles = portfolio?.articles || []
  const socialLinks = portfolio?.social_links || []

  const name = profile.full_name || profile.name || 'Dzaki Repi Nugroho'
  const title = profile.title || profile.profession || 'Software Developer'
  const bio =
    profile.bio ||
    'I build digital solutions through clean code, thoughtful design, and modern technology.'
  const photo = imageUrl(profile.photo_url || profile.photo || profile.image)

  if (loading) {
    return <div className="page-loading">Loading portfolio...</div>
  }

  return (
    <main className="portfolio-main">
      {/* HERO */}
      <section className="hero container" id="home">
        <div className="hero-content">
          <div className="availability">
            <span className="status-dot" />
            <span>Available for opportunities</span>
          </div>

          <p className="hero-greeting">Hello, I&apos;m</p>

          <h1 className="hero-name">{name}</h1>

          <h2 className="hero-role">{title}</h2>

          <p className="hero-description">{bio}</p>

          <div className="hero-actions">
            <a href="#projects" className="button-primary">
              <span>View My Projects</span>
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="button-outline">
              <span>Contact Me</span>
              <Mail size={16} />
            </a>
          </div>

          {socialLinks.length > 0 && (
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={social.id || index}
                  href={social.url || social.link || '#'}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{social.name || social.platform || 'Social'}</span>
                  <ExternalLink size={13} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="hero-visual">
          <div className="hero-glow" />
          <div className="hero-photo">
            {photo ? (
              <img src={photo} alt={name} />
            ) : (
              <div className="photo-placeholder">
                <Code2 size={32} />
                <span>DZAKI REPI NUGROHO</span>
                <strong>Software Developer</strong>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats container" aria-label="Statistics">
        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <FolderGit2 size={18} />
          </div>
          <div>
            <strong>{projects.length}+</strong>
            <span>Projects</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--blue">
            <FileText size={18} />
          </div>
          <div>
            <strong>{articles.length > 0 ? `${articles.length}+` : `${skills.length}+`}</strong>
            <span>{articles.length > 0 ? 'Articles' : 'Skills'}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--violet">
            <Briefcase size={18} />
          </div>
          <div>
            <strong>{experiences.length}+</strong>
            <span>Experiences</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--amber">
            <Award size={18} />
          </div>
          <div>
            <strong>{certificates.length}+</strong>
            <span>Certificates</span>
          </div>
        </div>
      </section>

      {/* 01 / SELECTED PROJECTS */}
      <section className="section container" id="projects">
        <div className="section-top">
          <div>
            <span className="eyebrow">• Selected Projects</span>
            <h2>Selected <span>Projects.</span></h2>
            <p>A showcase of my work in building impactful solutions.</p>
          </div>
          <a href="/projects" className="text-link">
            <span>View All Projects</span>
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="project-grid-4">
          {projects.slice(0, 4).map((project, index) => (
            <article className="project-card" key={project.id || index}>
              <div className="project-image">
                {project.image_url || project.image ? (
                  <img
                    src={imageUrl(project.image_url || project.image)}
                    alt={project.title || project.name}
                  />
                ) : (
                  <div className="project-fallback">
                    <Code2 size={28} />
                  </div>
                )}
              </div>
              <div className="project-info">
                <h3>{project.title || project.name || `Project 0${index + 1}`}</h3>
                <p>{project.description || project.summary || ''}</p>
                <div className="project-footer">
                  <span className="project-stack">
                    {project.tech_stack || project.stack || 'Golang • React'}
                  </span>
                  <a
                    href={project.project_url || project.link || '#projects'}
                    target={project.project_url || project.link ? '_blank' : undefined}
                    rel={project.project_url || project.link ? 'noreferrer' : undefined}
                    aria-label={`Open ${project.title || project.name}`}
                  >
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 02 / SKILLS */}
      <section className="section container" id="skills">
        <span className="eyebrow">• My Toolkit</span>
        <h2>Technologies I <span>work with.</span></h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div className="skill-item" key={skill.id || index}>
              <span>0{index + 1}</span>
              <strong>{skill.name || skill.title}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* 03 / ABOUT & JOURNEY */}
      <section className="section container" id="about">
        <div className="about-journey-grid">
          <div className="about-box">
            <span className="eyebrow">• About Me</span>
            <h2>Get to know <span>more about me.</span></h2>
            <p className="about-copy">{bio}</p>
            <div className="hero-actions">
              <a href="#contact" className="button-primary">
                <span>Get In Touch</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="journey-box" id="experience">
            <h3>My Journey</h3>
            <div className="journey-list">
              {experiences.map((item, index) => (
                <article className="journey-item" key={`exp-${item.id || index}`}>
                  <small>{item.period || item.date || 'Experience'}</small>
                  <strong>{item.position || item.title}</strong>
                  <p>{item.company || item.organization}</p>
                </article>
              ))}

              <div id="education">
                {education.map((item, index) => (
                  <article className="journey-item" key={`edu-${item.id || index}`}>
                    <small>{item.period || item.year || 'Education'}</small>
                    <strong>{item.degree || item.title}</strong>
                    <p>{item.institution || item.school}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 / CERTIFICATES */}
      <section className="section container" id="certificates">
        <span className="eyebrow">• Achievements</span>
        <h2>Certificates & <span>Recognition.</span></h2>
        <div className="simple-grid">
          {certificates.map((item, index) => (
            <article className="simple-card" key={item.id || index}>
              <strong>{item.title || item.name}</strong>
              <p>{item.issuer || item.organization}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 05 / BLOG */}
      <section className="section container" id="blog">
        <div className="section-top">
          <div>
            <span className="eyebrow">• Blog</span>
            <h2>Insights, tutorials, <span>and thoughts.</span></h2>
          </div>
          <a href="/blog" className="text-link">
            <span>View All Articles</span>
            <ArrowRight size={15} />
          </a>
        </div>
        <div className="simple-grid">
          {articles.slice(0, 3).map((item, index) => (
            <article className="simple-card" key={item.id || index}>
              <small>{item.published_at || item.date || ''}</small>
              <h3>{item.title || item.name}</h3>
              <p>{item.excerpt || item.summary || item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 06 / CONTACT */}
      <section className="contact-cta container" id="contact">
        <span className="eyebrow">• Contact</span>
        <h2>Let&apos;s work together!</h2>
        <p>Have a project in mind? Let&apos;s create something meaningful together.</p>
        <a href="/contact" className="button-primary">
          <span>Send Message</span>
          <ArrowRight size={16} />
        </a>
      </section>
    </main>
  )
}