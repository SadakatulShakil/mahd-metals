import { useEffect, useState } from 'react'
import { fetchContactInfo, submitContact } from '../lib/api'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'

export default function ContactForm() {
  const [info, setInfo] = useState<any>(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  useEffect(() => { fetchContactInfo().then(r => setInfo(r.data)).catch(() => {}) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading')
    try { await submitContact(form); setStatus('success'); setForm({ name:'', email:'', subject:'', message:'' }) }
    catch { setStatus('error') }
  }

  const phone             = info?.phone                  || '+966 54 666 2697'
  const phoneAlt          = info?.phone_alternative       || ''
  const phoneAltLabel     = info?.phone_alternative_label || 'Alternative'
  const email    = info?.email         || 'info@mahdmetals.com'
  const whatsapp = info?.whatsapp      || '966546662697'
  const address  = info
    ? `${info.address_line1}, ${info.address_line2}, ${info.city} ${info.postal_code}, ${info.country}`
    : '3469 Al Sarawat District, Al Khomra Area, Jeddah 22525-7891, Saudi Arabia'

  return (
    <section id="contact" className="py-24 bg-[#080d1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label mb-3">Get In Touch</div>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">Contact Our <span className="text-gradient">Team</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">Request a quote or discuss your specific material requirements with our experts.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Let's Talk Business</h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-8">
                Whether you're sourcing premium metals or looking to sell scrap, our team is ready to structure the right deal for your needs.
              </p>
            </div>
            {[
              { icon: Phone,  label: 'Phone / WhatsApp', value: phone,   href: `tel:${phone}` },
              ...(phoneAlt ? [{ icon: Phone, label: phoneAltLabel, value: phoneAlt, href: `tel:${info?.phone_alternative}` }] : []),
              { icon: Mail,   label: 'Email',            value: email,   href: `mailto:${email}` },
              { icon: MapPin, label: 'Address',          value: address, href: '#' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href}
                className="flex items-start gap-4 group hover:text-amber-400 transition-colors">
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                  <Icon size={20} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-gray-300 group-hover:text-amber-400 transition-colors text-sm">{value}</div>
                </div>
              </a>
            ))}
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-4 rounded-xl transition-all hover:scale-105 w-fit text-sm">
              <MessageSquare size={18} /> Chat on WhatsApp
            </a>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#0d1424] border border-white/5 rounded-2xl p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[['Your Name *', 'name', 'text', 'John Smith'], ['Email Address *', 'email', 'email', 'john@company.com']].map(([label, name, type, placeholder]) => (
                <div key={name}>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
                  <input required type={type} value={(form as any)[name]}
                    onChange={e => setForm({...form, [name]: e.target.value})}
                    placeholder={placeholder}
                    className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Subject *</label>
              <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                placeholder="Quote Request — Copper Scrap"
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Message</label>
              <textarea rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                placeholder="Describe your material requirements, quantities, and destination..."
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm resize-none" />
            </div>
            <button type="submit" disabled={status === 'loading'}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold py-4 rounded-xl transition-all hover:scale-[1.02] text-sm">
              {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
            </button>
            {status === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm text-center">
                ✅ Message sent! We'll get back to you within 24 hours.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                ❌ Something went wrong. Please email us directly at {email}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
