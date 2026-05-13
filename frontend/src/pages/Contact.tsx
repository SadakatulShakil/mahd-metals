import PageBanner from '../components/PageBanner'
import ContactForm from '../components/ContactForm'

export default function ContactPage() {
  return (
    <main>
      <PageBanner page="contact" defaultTitle="Contact Us"
        defaultSubtitle="Request a quote or get in touch with our global trading team." />
      <ContactForm />
    </main>
  )
}
