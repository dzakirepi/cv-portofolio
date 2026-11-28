import { useState } from 'react'
import { CheckCircle2, AlertCircle, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { sendContactMessage } from '../lib/api'
import { SectionHeader } from '../components/Cards'
import { SocialLinks } from '../components/Icons'

const empty = { name: '', email: '', message: '', website: '' }

export default function Contact() {
  const { t } = useLang()
  const { profile } = usePortfolio()
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      await sendContactMessage(form)
      setStatus('success')
      setForm(empty)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.message || '')
    }
  }

  const info = [
    { icon: Mail, label: t('contact.email'), value: profile.email, href: profile.email && `mailto:${profile.email}` },
    { icon: Phone, label: t('contact.phone'), value: profile.phone, href: profile.phone && `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: t('contact.location'), value: profile.location }
  ].filter(i => i.value)

  return (
    <section className="section" id="contact">
      <div className="container contact-grid">
        <div>
          <SectionHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
          <ul className="contact-info">
            {info.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <span className="icon-tile">
                  <Icon size={19} />
                </span>
                <div>
                  <span>{label}</span>
                  {href ? <a href={href}>{value}</a> : <strong>{value}</strong>}
                </div>
              </li>
            ))}
          </ul>
          <SocialLinks socials={profile.socials} />
        </div>

        <form className="card contact-form" onSubmit={submit}>
          <input name="name" value={form.name} onChange={update} placeholder={t('contact.name')} required maxLength={100} aria-label={t('contact.name')} />
          <input name="email" type="email" value={form.email} onChange={update} placeholder={t('contact.yourEmail')} required aria-label={t('contact.yourEmail')} />
          <textarea name="message" value={form.message} onChange={update} placeholder={t('contact.message')} required rows={6} maxLength={5000} aria-label={t('contact.message')} />
          {/* Honeypot anti-spam: disembunyikan dari pengunjung */}
          <input name="website" value={form.website} onChange={update} className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="form-footer">
            <div className="form-status" role="status">
              {status === 'success' && (
                <span className="ok">
                  <CheckCircle2 size={16} /> {t('contact.success')}
                </span>
              )}
              {status === 'error' && (
                <span className="err">
                  <AlertCircle size={16} /> {errorMsg || t('contact.error')}
                </span>
              )}
            </div>
            <button className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? t('contact.sending') : t('contact.send')} <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
