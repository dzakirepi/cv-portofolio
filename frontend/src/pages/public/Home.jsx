
import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Mail,
  Code2,
  ExternalLink
} from 'lucide-react'
import { getPortfolio } from '../../services/api'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

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
        if (result.success) setPortfolio(result.data)
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
  const bio = profile.bio || 'I build thoughtful digital experiences through clean code, creative design, and technology.'
  const photo = imageUrl(profile.photo_url || profile.photo || profile.image)

  if (loading) {
    return <div className="page-loading">Loading portfolio...</div>
  }

  return (
    <main>
      <section className="hero container" id="home">
        <div className="hero-content">
          <div className="availability">
            <span /> Available for opportunities
          </div>

          <p className="hero-greeting">Hello, I'm</p>

          <h1>
            {name.split(' ').slice(0, -1).join(' ')}<br />
            <span>{name.split(' ').slice(-1).join('')}</span>
          </h1>

          <h2>{title}</h2>

          <p className="hero-description">{bio}</p>

          <div className="hero-actions">
            <a href="#projects" className="button-primary">
              View My Projects <ArrowUpRight size={17} />
            </a>
            <a href="#contact" className="button-outline">
              Contact Me <Mail size={17} />
            </a>
          </div>

          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={social.id || index}
                href={social.url || social.link || '#'}
                target="_blank"
                rel="noreferrer"
              >
                {social.name || social.platform || 'Social'}
                <ExternalLink size={13} />
              </a>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo">
            {photo ? (
              <img src={photo} alt={name} />
            ) : (
              <div className="photo-placeholder">
                <span>YOUR PHOTO</span>
                <strong>DRN</strong>
              </div>
            )}
          </div>
          <div className="photo-caption">
            <Code2 size={20} />
            <div>
              <small>PASSIONATE ABOUT</small>
              <strong>Building Digital Solutions</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="stats container">
        <div><strong>{projects.length}+</strong><span>Projects</span></div>
        <div><strong>{skills.length}+</strong><span>Skills</span></div>
        <div><strong>{experiences.length}+</strong><span>Experiences</span></div>
        <div><strong>{certificates.length}+</strong><span>Certificates</span></div>
      </section>

      <section className="section container" id="projects">
        <div className="section-top">
          <div>
            <span className="eyebrow">01 / MY WORK</span>
            <h2>Selected <span>Projects.</span></h2>
            <p>A showcase of my work in building impactful solutions.</p>
          </div>
          <a href="/projects" className="text-link">
            View All Projects <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="project-grid">
          {projects.slice(0, 6).map((project, index) => (
            <article className="project-card" key={project.id || index}>
              <div className="project-image">
                {project.image_url || project.image ? (
                  <img
                    src={imageUrl(project.image_url || project.image)}
                    alt={project.title || project.name}
                  />
                ) : (
                  <Code2 size={38} />
                )}
              </div>
              <div className="project-info">
                <span className="project-number">
                  PROJECT 0{index + 1}
                </span>
                <h3>{project.title || project.name}</h3>
                <p>{project.description || project.summary}</p>
                <a href={project.project_url || project.link || '#'} target="_blank" rel="noreferrer">
                  Explore Project <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section container" id="skills">
        <span className="eyebrow">02 / MY TOOLKIT</span>
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

      <section className="section container" id="experience">
        <span className="eyebrow">03 / MY JOURNEY</span>
        <h2>Experience & <span>Education.</span></h2>
        <div className="journey-grid">
          <div>
            <h3>Experience</h3>
            {experiences.map((item, index) => (
              <article className="journey-item" key={item.id || index}>
                <strong>{item.position || item.title}</strong>
                <p>{item.company || item.organization}</p>
                <small>{item.period || item.date || ''}</small>
              </article>
            ))}
          </div>
          <div>
            <h3>Education</h3>
            {education.map((item, index) => (
              <article className="journey-item" key={item.id || index}>
                <strong>{item.degree || item.title}</strong>
                <p>{item.institution || item.school}</p>
                <small>{item.period || item.year || ''}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container" id="certificates">
        <span className="eyebrow">04 / ACHIEVEMENTS</span>
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

      <section className="section container" id="blog">
        <div className="section-top">
          <div>
            <span className="eyebrow">05 / LATEST STORIES</span>
            <h2>From my <span>Blog.</span></h2>
          </div>
          <a href="/blog" className="text-link">View Articles <ArrowUpRight size={16}/></a>
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

      <section className="contact-cta container" id="contact">
        <span className="eyebrow">06 / LET'S CONNECT</span>
        <h2>Have a project in mind?</h2>
        <p>Let's create something meaningful together.</p>
        <a href="/contact" className="button-primary">
          Get In Touch <ArrowUpRight size={17}/>
        </a>
      </section>
    </main>
  )
}
