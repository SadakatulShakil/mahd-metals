import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import PageBanner from '../components/PageBanner'
import ContactForm from '../components/ContactForm'
import FAQ from '../components/FAQ'

export default function ContactPage() {
  const { t } = useTranslation()
  return (
    <main>
      <SEO
        title="Contact Us | Saddam Scarp and Metal"
        description="Get in touch with Saddam Scarp and Metal. Request a quote or discuss your metal trading requirements. Based in Riyadh and Dammam, Saudi Arabia."
        canonical="https://saddamscarpandmetal.com/contact"
      />
      <PageBanner page="contact"
        defaultTitle={t('pages.contact.title')}
        defaultSubtitle={t('pages.contact.subtitle')} />
      <FAQ />
      <ContactForm />
    </main>
  )
}
