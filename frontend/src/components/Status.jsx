import { RotateCw } from 'lucide-react'
import { useLang } from '../lib/i18n'

export function Loading() {
  const { t } = useLang()
  return (
    <div className="status-screen">
      <div className="spinner" />
      <p>{t('common.loading')}</p>
    </div>
  )
}

export function ErrorState({ onRetry }) {
  const { t } = useLang()
  return (
    <div className="status-screen">
      <p>{t('common.error')}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          <RotateCw size={16} /> {t('common.retry')}
        </button>
      )}
    </div>
  )
}
