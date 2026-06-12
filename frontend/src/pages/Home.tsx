import SEO from '../components/SEO'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import About from '../components/About'
import Materials from '../components/Materials'
import Testimonials from '../components/Testimonials'
import ContactForm from '../components/ContactForm'

export default function Home() {
  return (
    <main>
      <SEO
        title="Saddam Scarp and Metal | Global Metal Trading"
        description="Global scrap and alloy metal trading. Ferrous, non-ferrous, copper, stainless steel and specialty alloys. Based in Riyadh and Dammam, Saudi Arabia."
        canonical="https://saddamscarpandmetal.com"
      />
      <Hero />
      <Stats />
      <About />
      <Materials />
      <Testimonials />
      <ContactForm />
    </main>
  )
}
