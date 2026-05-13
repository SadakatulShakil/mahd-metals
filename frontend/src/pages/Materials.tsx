import PageBanner from '../components/PageBanner'
import Materials from '../components/Materials'

export default function MaterialsPage() {
  return (
    <main>
      <PageBanner page="materials" defaultTitle="Our Materials"
        defaultSubtitle="Premium ferrous, non-ferrous, and specialty alloy metals — sourced and traded globally." />
      <Materials />
    </main>
  )
}
