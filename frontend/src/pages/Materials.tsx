import SEO from '../components/SEO'
import PageBanner from '../components/PageBanner'
import Materials from '../components/Materials'

export default function MaterialsPage() {
  return (
    <main>
      <SEO
        title="Our Materials | Saddam Scarp and Metal"
        description="We trade ferrous metals, non-ferrous metals, copper, stainless steel 304/316/430, specialty alloys and mixed metals globally from Saudi Arabia."
        canonical="https://saddamscarpandmetal.com/materials"
      />
      <PageBanner page="materials" defaultTitle="Our Materials"
        defaultSubtitle="Premium ferrous, non-ferrous, and specialty alloy metals — sourced and traded globally." />
      <Materials />
    </main>
  )
}
