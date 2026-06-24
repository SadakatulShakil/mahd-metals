import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import PageBanner from '../components/PageBanner'
import Materials from '../components/Materials'

export default function MaterialsPage() {
  const { t } = useTranslation()
  return (
    <main>
      <SEO
        title="Our Materials | Saddam Scarp and Metal"
        description="We trade ferrous metals, non-ferrous metals, copper, stainless steel 304/316/430, specialty alloys and mixed metals globally from Saudi Arabia."
        canonical="https://saddamscarpandmetal.com/materials"
      />
      <PageBanner page="materials"
        defaultTitle={t('pages.materials.title')}
        defaultSubtitle={t('pages.materials.subtitle')} />
      <Materials />
    </main>
  )
}
