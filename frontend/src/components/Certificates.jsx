import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { BadgeCheck, Calendar, ChevronLeft, ChevronRight, ExternalLink, Maximize2, X } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { formatDate } from '../lib/theme'
import FilePreview from './FilePreview'

function certDate(c, tr, lang) {
  return c.period ? tr(c.period) : formatDate(c.date, lang)
}

export function CertificateCard({ cert, onOpen, large = false }) {
  const { t, tr, lang } = useLang()
  return (
    <button type="button" className={`card cert-card ${large ? 'is-large' : ''}`} onClick={onOpen}>
      <div className="cert-thumb">
        <FilePreview src={cert.file} alt={tr(cert.title)} width={480} lazy />
        <span className="cert-zoom" aria-hidden="true">
          <Maximize2 size={16} /> {t('certs.clickHint')}
        </span>
      </div>
      <div className="cert-body">
        <span className="cert-cat">{t(`certs.cat.${cert.category}`)}</span>
        <strong>{tr(cert.title)}</strong>
        <span className="cert-issuer">{cert.issuer}</span>
        {large && cert.note && <span className="cert-note">{tr(cert.note)}</span>}
        <span className="cert-date">
          <Calendar size={13} /> {certDate(cert, tr, lang)}
        </span>
      </div>
    </button>
  )
}

export function CertificateLightbox({ list, index, onClose, onIndex }) {
  const { t, tr, lang } = useLang()
  const cert = list[index]

  const go = useCallback(step => onIndex((index + step + list.length) % list.length), [index, list.length, onIndex])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [go, onClose])

  if (!cert) return null

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={tr(cert.title)} onClick={onClose}>
      <div className="lightbox-panel" onClick={e => e.stopPropagation()}>
        <button className="icon-btn lightbox-close" onClick={onClose} aria-label={t('certs.close')} autoFocus>
          <X size={20} />
        </button>

        <div className="lightbox-media">
          {list.length > 1 && (
            <button className="icon-btn lightbox-nav prev" onClick={() => go(-1)} aria-label={t('certs.prev')}>
              <ChevronLeft size={22} />
            </button>
          )}
          <FilePreview key={cert.slug} src={cert.file} alt={tr(cert.title)} width={1400} />
          {list.length > 1 && (
            <button className="icon-btn lightbox-nav next" onClick={() => go(1)} aria-label={t('certs.next')}>
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        <div className="lightbox-info">
          <div>
            <span className="cert-cat">{t(`certs.cat.${cert.category}`)}</span>
            <h3>{tr(cert.title)}</h3>
            <p>
              {cert.issuer} · {certDate(cert, tr, lang)}
            </p>
            {cert.note && <p className="cert-note">{tr(cert.note)}</p>}
            {cert.credentialId && (
              <p className="cert-cred">
                {t('certs.credential')}: <code>{cert.credentialId}</code>
              </p>
            )}
          </div>
          <div className="lightbox-actions">
            <span className="lightbox-count">
              {index + 1} / {list.length}
            </span>
            {cert.url && (
              <a href={cert.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                <BadgeCheck size={16} /> {t('certs.verify')}
              </a>
            )}
            <a href={cert.file} target="_blank" rel="noreferrer" className="btn btn-outline">
              <ExternalLink size={16} /> {t('certs.open')}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Grid sertifikat + lightbox. Dipakai di beranda dan halaman /certificates.
export function CertificateGrid({ list, large = false, className = 'grid grid-3' }) {
  const [open, setOpen] = useState(null)
  return (
    <>
      <div className={className}>
        {list.map((c, i) => (
          <CertificateCard key={c.slug || i} cert={c} large={large} onOpen={() => setOpen(i)} />
        ))}
      </div>
      {open !== null && <CertificateLightbox list={list} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  )
}