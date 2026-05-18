import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Code2, Facebook, Instagram, Linkedin } from 'lucide-react'
import { fetchContactInfo, fetchBranding } from '../lib/api'
import Logo from './Logo'

export default function Footer() {
  const [info, setInfo]         = useState<any>(null)
  const [branding, setBranding] = useState<any>(null)

  useEffect(() => {
    fetchContactInfo().then(r => setInfo(r.data)).catch(() => {})
    fetchBranding().then(r => setBranding(r.data)).catch(() => {})
  }, [])

  const phone     = info?.phone                || '+966 54 666 2697'
  const email     = info?.email                || 'info@mahdmetals.com'
  const tagline   = branding?.company_tagline  || 'Your global partner in scrap and alloy metal trading.'
  const copyright = branding?.footer_copyright || '© 2026 Saddam Scrap and Metal. All rights reserved.'
  const locations = branding?.footer_locations || 'Jeddah · Kuwait · Global'
  const developer   = branding?.developer_name   || null
  const facebook    = branding?.facebook_url     || null
  const instagram   = branding?.instagram_url    || null
  const linkedin    = branding?.linkedin_url     || null

  return (
    <footer className="bg-[#020617] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4"><Logo size="md" /></div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">{tagline}</p>
            <div className="space-y-2">
              {[
                { icon: Phone, text: phone, href: `tel:${phone}` },
                { icon: Mail,  text: email, href: `mailto:${email}` },
              ].map(({ icon: Icon, text, href }) => (
                <a key={text} href={href}
                  className="flex items-center gap-2 text-gray-500 hover:text-amber-400 text-sm transition-colors">
                  <Icon size={13} /><span>{text}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Navigation</div>
            <div className="space-y-2.5">
              {[['/', 'Home'], ['/about', 'About Us'], ['/materials', 'Materials'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to}
                  className="block text-gray-500 hover:text-amber-400 text-sm transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Location</div>
            <div className="flex items-start gap-2 text-gray-500 text-sm leading-relaxed">
              <MapPin size={13} className="text-amber-400 mt-0.5 shrink-0" />
              <span>
                {info?.address_line1 || '3469 Al Sarawat District'}<br />
                {info?.address_line2 || 'Al Khomra Area'}<br />
                {info?.city || 'Jeddah'} {info?.postal_code || '22525-7891'}<br />
                {info?.country || 'Saudi Arabia'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-gray-600 text-xs">{copyright}</div>
          <div className="text-gray-600 text-xs">{locations}</div>
          {(facebook || instagram || linkedin) && (
            <div className="flex items-center gap-3">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-amber-400 transition-colors">
                  <Facebook size={15} />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-amber-400 transition-colors">
                  <Instagram size={15} />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-amber-400 transition-colors">
                  <Linkedin size={15} />
                </a>
              )}
            </div>
          )}
          {developer && (
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Code2 size={11} className="text-amber-500/60" />
              <span>Developed by <span className="text-amber-500/80 font-medium">{developer}</span></span>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
