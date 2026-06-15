import { NavLink, useNavigate } from 'react-router-dom'
import { clearToken } from '../lib/auth'
import {
  LayoutDashboard, Image, Info, BarChart2, Package,
  Star, Phone, Inbox, Settings, LogOut, Palette, Layout,
  BookOpen, HelpCircle
} from 'lucide-react'

const links = [
  { to: '/admin',               label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/branding',      label: 'Branding',     icon: Palette },
  { to: '/admin/hero',          label: 'Hero Banner',  icon: Image },
  { to: '/admin/banners',       label: 'Page Banners', icon: Layout },
  { to: '/admin/about',         label: 'About',        icon: Info },
  { to: '/admin/about-bullets', label: 'About Bullets', icon: Info },
  { to: '/admin/stats',         label: 'Stats',        icon: BarChart2 },
  { to: '/admin/materials',     label: 'Materials',    icon: Package },
  { to: '/admin/testimonials',  label: 'Testimonials', icon: Star },
  { to: '/admin/contact-info',  label: 'Contact Info', icon: Phone },
  { to: '/admin/blog',          label: 'Blog',         icon: BookOpen },
  { to: '/admin/faq',           label: 'FAQ',          icon: HelpCircle },
  { to: '/admin/inbox',         label: 'Inbox',        icon: Inbox },
  { to: '/admin/settings',      label: 'Site Settings',icon: Settings },
]

export default function AdminNav() {
  const navigate = useNavigate()
  const logout = () => { clearToken(); navigate('/admin/login') }

  return (
    <aside className="w-60 min-h-screen bg-[#080d1a] border-r border-white/5 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <div className="text-lg font-black">
          <span className="text-amber-400">SADDAM</span>
          <span className="text-white"> Admin</span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">Content Management</div>
      </div>

      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }>
            <Icon size={15} />{label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
