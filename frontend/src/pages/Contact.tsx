import SEO from '../components/SEO'
import PageBanner from '../components/PageBanner'
import ContactForm from '../components/ContactForm'
import FAQ from '../components/FAQ'

export default function ContactPage() {
  return (
    <main>
      <SEO
        title="Contact Us | Saddam Scarp and Metal"
        description="Get in touch with Saddam Scarp and Metal. Request a quote or discuss your metal trading requirements. Based in Riyadh and Dammam, Saudi Arabia."
        canonical="https://saddamscarpandmetal.com/contact"
      />
      <PageBanner page="contact" defaultTitle="Contact Us"
        defaultSubtitle="Request a quote or get in touch with our global trading team." />
      <FAQ />
      <ContactForm />
    </main>
  )
}
