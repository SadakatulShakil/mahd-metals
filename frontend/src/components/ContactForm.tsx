import { useState } from 'react'
import { submitContact } from '../lib/api'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitContact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 bg-steel-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">Contact Our Team</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Request a quote or discuss your specific material requirements with our experts.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Let's Talk Business</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Whether you're sourcing premium metals or looking to sell scrap, our team is ready to structure the right deal for your needs.
              </p>
            </div>

            {[
              { icon: Phone, label: 'Phone / WhatsApp', value: '+966 54 666 2697', href: 'tel:+966546662697' },
              { icon: Mail, label: 'Email', value: 'info@mahdmetals.com', href: 'mailto:info@mahdmetals.com' },
              { icon: MapPin, label: 'Address', value: '3469 Al Sarawat District, Al Khomra Area, Jeddah 22525-7891, Saudi Arabia', href: '#' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href}
                className="flex items-start gap-4 group hover:text-gold-400 transition-colors">
                <div className="bg-gold-500/10 border border-gold-500/20 p-3 rounded-xl group-hover:bg-gold-500/20 transition-colors">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-gray-300 group-hover:text-gold-400 transition-colors">{value}</div>
                </div>
              </a>
            ))}

            {/* WhatsApp CTA */}
            <a href="https://wa.me/966546662697" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-4 rounded-xl transition-all hover:scale-105 w-fit">
              <MessageSquare size={20} />
              Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-steel-950 border border-white/5 rounded-2xl p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-steel-900 border border-white/10 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                  placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-steel-900 border border-white/10 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                  placeholder="john@company.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Subject *</label>
              <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                className="w-full bg-steel-900 border border-white/10 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                placeholder="Quote Request — Copper Scrap" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Message</label>
              <textarea rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                className="w-full bg-steel-900 border border-white/10 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors resize-none"
                placeholder="Describe your material requirements, quantities, and destination..." />
            </div>

            <button type="submit" disabled={status === 'loading'}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-steel-950 font-bold py-4 rounded-xl transition-all hover:scale-[1.02] text-lg">
              {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
            </button>

            {status === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm text-center">
                ✅ Message sent! We'll get back to you within 24 hours.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                ❌ Something went wrong. Please email us directly at info@mahdmetals.com
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
