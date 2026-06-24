import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import PageBanner from '../components/PageBanner'
import About from '../components/About'
import Stats from '../components/Stats'

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <main>
      <SEO
        title="About Us | Saddam Scarp and Metal"
        description="Founded in 2015 by Mohammad Saddam Al Bahar. Over 10 years of metal trading expertise serving 10+ countries worldwide from Riyadh and Dammam, Saudi Arabia."
        canonical="https://saddamscarpandmetal.com/about"
      />
      <PageBanner page="about"
        defaultTitle={t('pages.about.title')}
        defaultSubtitle={t('pages.about.subtitle')} />
      <Stats />
      <About />
    </main>
  )
}
