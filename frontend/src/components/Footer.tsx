import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="text-2xl font-black mb-4">
              <span className="text-amber-400">MAHD</span>
              <span className="text-white"> Metals</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              Your global partner in scrap and alloy metal trading. Connecting supply chains across 30+ countries with 40+ years of proven expertise.
            </p>
            <div className="space-y-2">
              {[
                { icon: Phone, text: '+966 54 666 2697', href: 'tel:+966546662697' },
                { icon: Mail, text: 'info@mahdmetals.com', href: 'mailto:info@mahdmetals.com' },
              ].map(({ icon: Icon, text, href }) => (
                <a key={text} href={href} className="flex items-center gap-2 text-gray-500 hover:text-amber-400 text-sm transition-colors">
                  <Icon size={13} />
                  <span>{text}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Navigation</div>
            <div className="space-y-2.5">
              {[['/', 'Home'], ['/about', 'About Us'], ['/materials', 'Materials'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-gray-500 hover:text-amber-400 text-sm transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Location</div>
            <div className="flex items-start gap-2 text-gray-500 text-sm leading-relaxed">
              <MapPin size={13} className="text-amber-400 mt-0.5 shrink-0" />
              <span>3469 Al Sarawat District<br />Al Khomra Area<br />Jeddah 22525-7891<br />Saudi Arabia</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-xs">© 2026 MAHD Metals International. All rights reserved.</div>
          <div className="flex items-center gap-6 text-gray-600 text-xs">
            <span>Jeddah · Kuwait · Global</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
