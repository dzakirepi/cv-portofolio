import { useLang } from '../lib/i18n'
import { usePortfolio } from '../lib/portfolio'
import { SocialLinks } from './Icons'

export default function Footer() {
  const { t } = useLang()
  const { profile } = usePortfolio()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name || 'Dzaki Repi Nugroho'}. {t('footer.rights')}
        </p>
        <SocialLinks socials={profile.socials} />
      </div>
    </footer>
  )
}
