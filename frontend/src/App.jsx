import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ErrorState, Loading } from './components/Status'
import { usePortfolio } from './lib/portfolio'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import BlogPage from './pages/BlogPage'
import CertificatesPage from './pages/CertificatesPage'
import ArticlePage from './pages/ArticlePage'
import NotFound from './pages/NotFound'

// Scroll ke section saat URL berisi #hash (mis. /#contact), atau ke atas saat pindah halaman.
function ScrollManager({ ready }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!ready) return
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash, ready])
  return null
}

export default function App() {
  const { loading, error, data, reload } = usePortfolio()
  const ready = !!data

  return (
    <>
      <ScrollManager ready={ready} />
      <Navbar />
      <main className="main">
        {loading && !data ? (
          <Loading />
        ) : error && !data ? (
          <ErrorState onRetry={reload} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<ArticlePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
      <Footer />
    </>
  )
}
