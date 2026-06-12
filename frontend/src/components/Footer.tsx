import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Code2 } from 'lucide-react'
import { fetchContactInfo, fetchBranding } from '../lib/api'
import Logo from './Logo'

const IconFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const IconLinkedin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default function Footer() {
  const [info, setInfo]         = useState<any>(null)
  const [branding, setBranding] = useState<any>(null)

  useEffect(() => {
    fetchContactInfo().then(r => setInfo(r.data)).catch(() => {})
    fetchBranding().then(r => setBranding(r.data)).catch(() => {})
  }, [])

  const phone     = info?.phone                || '+966 54 666 2697'
  const altPhone  = info?.phone_alternative    || null
  const altLabel  = info?.phone_alternative_label || 'Alternative'
  const email     = info?.email                || 'info@mahdmetals.com'
  const tagline   = branding?.company_tagline  || 'Your global partner in scrap and alloy metal trading.'
  const copyright = branding?.footer_copyright || '© 2026 Saddam Scrap and Metal. All rights reserved.'
  const locations = branding?.footer_locations || 'Jeddah · Kuwait · Global'
  const developer = branding?.developer_name   || null
  const fbUrl     = branding?.facebook_url     || '#'
  const igUrl     = branding?.instagram_url    || '#'
  const liUrl     = branding?.linkedin_url     || '#'

  return (
    <footer className="bg-[#020617] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4"><Logo size="md" /></div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">{tagline}</p>
            <div className="space-y-2">
              {[
                { icon: Phone, text: phone,    href: `tel:${phone}` },
                ...(altPhone ? [{ icon: Phone, text: altPhone, href: `tel:${altPhone}` }] : []),
                { icon: Mail,  text: email,    href: `mailto:${email}` },
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
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-xs">{copyright}</div>
          <div className="text-gray-600 text-xs">{locations}</div>

          {/* Social icons — always visible, URLs from admin panel */}
          <div className="flex items-center gap-4">
            <a href={fbUrl} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-amber-400 transition-colors" aria-label="Facebook">
              <IconFacebook />
            </a>
            <a href={igUrl} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-amber-400 transition-colors" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a href={liUrl} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-amber-400 transition-colors" aria-label="LinkedIn">
              <IconLinkedin />
            </a>
          </div>

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
