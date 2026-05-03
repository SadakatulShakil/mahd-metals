import Hero from '../components/Hero'
import Stats from '../components/Stats'
import About from '../components/About'
import Materials from '../components/Materials'
import Testimonials from '../components/Testimonials'
import ContactForm from '../components/ContactForm'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Materials />
      <Testimonials />
      <ContactForm />
    </main>
  )
}
