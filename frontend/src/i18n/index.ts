import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'

const saved = localStorage.getItem('mahd-lang') || 'en'

// Apply dir/lang synchronously before first render to prevent flash
document.documentElement.lang = saved
document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: saved,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function setLanguage(lang: 'en' | 'ar') {
  i18n.changeLanguage(lang)
  localStorage.setItem('mahd-lang', lang)
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export default i18n
