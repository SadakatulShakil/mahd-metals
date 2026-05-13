import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location])

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/about',     label: 'About' },
    { to: '/materials', label: 'Materials' },
    { to: '/contact',   label: 'Contact' },
  ]

  return (
    <>
      {/* Permanent top gradient so links are always readable over hero/banner images */}
      <div className="fixed top-0 inset-x-0 h-24 bg-gradient-to-b from-[#020617]/80 to-transparent z-40 pointer-events-none" />

      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#020617]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/30'
          : ''
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === l.to
                    ? 'text-amber-400'
                    : 'text-gray-200 hover:text-white'
                }`}>
                {l.label}
              </Link>
            ))}
            <Link to="/contact"
              className="bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20">
              Get a Quote
            </Link>
          </div>
          <button className="md:hidden text-white hover:text-amber-400 transition-colors p-1"
            onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-[#020617]/98 backdrop-blur-xl border-t border-white/[0.06] px-6 py-6 space-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`block py-3 text-base font-medium border-b border-white/[0.04] transition-colors ${
                  location.pathname === l.to ? 'text-amber-400' : 'text-gray-200'
                }`}>
                {l.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link to="/contact"
                className="block bg-amber-500 text-[#020617] font-bold text-center py-3 rounded-xl text-sm">
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
