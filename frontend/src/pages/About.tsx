import PageBanner from '../components/PageBanner'
import About from '../components/About'
import Stats from '../components/Stats'

export default function AboutPage() {
  return (
    <main>
      <PageBanner page="about" defaultTitle="About MAHD Metals"
        defaultSubtitle="A partnership built on 40 years of Gulf expertise and global trust." />
      <Stats />
      <About />
    </main>
  )
}
