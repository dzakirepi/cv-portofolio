import { Link } from 'react-router-dom'
import { useLang } from '../lib/i18n'

export default function NotFound() {
  const { t } = useLang()
  return (
    <section className="status-screen page-top">
      <h1 className="gradient-text big-404">404</h1>
      <p>{t('common.notFound')}</p>
      <Link to="/" className="btn btn-primary">
        {t('common.backHome')}
      </Link>
    </section>
  )
}
