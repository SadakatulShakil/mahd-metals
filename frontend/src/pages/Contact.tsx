import ContactForm from '../components/ContactForm'

export default function ContactPage() {
  return (
    <main className="pt-20">
      <div className="py-16 bg-steel-950 text-center">
        <h1 className="text-5xl font-black mb-4">Contact <span className="text-gold-400">Us</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Request a quote or get in touch with our global trading team.</p>
      </div>
      <ContactForm />
    </main>
  )
}
