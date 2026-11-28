import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, ExternalLink, X, ZoomIn } from 'lucide-react'
import { useLang } from '../lib/i18n'

// Lightbox gambar layar penuh (navigasi panah / keyboard, Esc untuk tutup).
export function ImageLightbox({ images, index, onClose, onIndex, title }) {
  const { t, tr } = useLang()
  const img = images[index]
  const go = useCallback(step => onIndex((index + step + images.length) % images.length), [index, images.length, onIndex])

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

  if (!img) return null

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="lightbox-panel" onClick={e => e.stopPropagation()}>
        <button className="icon-btn lightbox-close" onClick={onClose} aria-label={t('certs.close')} autoFocus>
          <X size={20} />
        </button>
        <div className="lightbox-media">
          {images.length > 1 && (
            <button className="icon-btn lightbox-nav prev" onClick={() => go(-1)} aria-label={t('certs.prev')}>
              <ChevronLeft size={22} />
            </button>
          )}
          <img key={img.src} src={img.src} alt={tr(img.caption)} />
          {images.length > 1 && (
            <button className="icon-btn lightbox-nav next" onClick={() => go(1)} aria-label={t('certs.next')}>
              <ChevronRight size={22} />
            </button>
          )}
        </div>
        <div className="lightbox-info">
          <div>
            <h3>{title}</h3>
            <p>{tr(img.caption)}</p>
          </div>
          <div className="lightbox-actions">
            <span className="lightbox-count">
              {index + 1} / {images.length}
            </span>
            <a href={img.src} target="_blank" rel="noreferrer" className="btn btn-outline">
              <ExternalLink size={16} /> {t('certs.open')}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Galeri proyek: gambar utama besar + thumbnail. Klik gambar untuk layar penuh.
export function ProjectGallery({ images = [], title }) {
  const { t, tr } = useLang()
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  if (!images.length) return null
  const img = images[active] || images[0]

  return (
    <div className="gallery">
      <button type="button" className="gallery-main" onClick={() => setOpen(true)} aria-label={t('projects.zoom')}>
        <img key={img.src} src={img.src} alt={tr(img.caption)} />
        <span className="gallery-zoom">
          <ZoomIn size={16} /> {t('projects.zoom')}
        </span>
      </button>
      <div className="gallery-caption">
        <span>{tr(img.caption)}</span>
        <span>
          {active + 1} / {images.length}
        </span>
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((im, i) => (
            <button
              key={im.src}
              type="button"
              className={i === active ? 'is-active' : ''}
              onClick={() => setActive(i)}
              aria-label={tr(im.caption)}
            >
              <img src={im.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {open && <ImageLightbox images={images} index={active} onIndex={setActive} onClose={() => setOpen(false)} title={title} />}
    </div>
  )
}
