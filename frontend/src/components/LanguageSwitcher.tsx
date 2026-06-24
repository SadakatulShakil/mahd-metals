import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const toggle = () => setLanguage(isAr ? 'en' : 'ar')

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      className="flex items-center gap-1 text-sm font-semibold text-gray-200 hover:text-amber-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-amber-500/30 leading-none"
    >
      {isAr ? 'EN' : 'عربي'}
    </button>
  )
}
