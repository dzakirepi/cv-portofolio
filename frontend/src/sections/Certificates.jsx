import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { SectionHeader } from '../components/Cards'
import { CertificateGrid } from '../components/Certificates'
import { byDateDesc } from '../lib/sort'

export default function Certificates() {
  const { t } = useLang()
  const { certificates } = usePortfolio()
  if (!certificates.length) return null

  const featured = certificates.filter(c => c.featured)
  const list = (featured.length ? featured : [...certificates].sort(byDateDesc)).slice(0, 3)

  return (
    <section className="section" id="certificates">
      <div className="container">
        <SectionHeader
          title={t('certs.title')}
          subtitle={t('certs.subtitle')}
          action={
            <Link to="/certificates" className="link-arrow">
              {t('certs.viewAll')} ({certificates.length}) <ArrowRight size={16} />
            </Link>
          }
        />
        <CertificateGrid list={list} large />
      </div>
    </section>
  )
}
