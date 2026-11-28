import { useEffect, useRef, useState } from 'react'
import { FileText } from 'lucide-react'

const isPdf = src => /\.pdf($|[?#])/i.test(src || '')

// pdf.js dimuat hanya saat ada PDF yang perlu ditampilkan (tidak memperberat halaman awal).
let pdfjsPromise
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(
      ([pdfjs, worker]) => {
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default
        return pdfjs
      }
    )
  }
  return pdfjsPromise
}

// Menggambar halaman pertama PDF ke <canvas>.
function PdfCanvas({ src, width, alt }) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let task
    loadPdfjs()
      .then(pdfjs => {
        task = pdfjs.getDocument({ url: src })
        return task.promise
      })
      .then(pdf => pdf.getPage(1))
      .then(page => {
        if (cancelled) return
        const base = page.getViewport({ scale: 1 })
        const scale = (width * Math.min(window.devicePixelRatio || 1, 2)) / base.width
        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        canvas.width = viewport.width
        canvas.height = viewport.height
        return page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Gagal menampilkan PDF:', src, err)
          setFailed(true)
        }
      })
    return () => {
      cancelled = true
      task?.destroy()
    }
  }, [src, width])

  if (failed) {
    return (
      <div className="file-fallback">
        <FileText size={36} />
        <span>PDF</span>
      </div>
    )
  }
  return <canvas ref={canvasRef} className="file-canvas" role="img" aria-label={alt} />
}

// Menampilkan gambar (jpg/png/webp) atau halaman pertama PDF.
// lazy: PDF baru digambar saat terlihat di layar.
export default function FilePreview({ src, alt = '', width = 640, lazy = false }) {
  const holderRef = useRef(null)
  const [visible, setVisible] = useState(!lazy)

  useEffect(() => {
    if (visible || !holderRef.current) return
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(holderRef.current)
    return () => io.disconnect()
  }, [visible])

  if (!isPdf(src)) return <img src={src} alt={alt} loading={lazy ? 'lazy' : 'eager'} />

  return (
    <div ref={holderRef} className="file-holder">
      {visible ? <PdfCanvas src={src} width={width} alt={alt} /> : <div className="file-loading" />}
    </div>
  )
}
