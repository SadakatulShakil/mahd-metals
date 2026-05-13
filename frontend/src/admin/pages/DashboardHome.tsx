import { useEffect, useState } from 'react'
import { getSubmissions, getMaterials, getTestimonials } from '../lib/adminApi'
import { Link } from 'react-router-dom'
import { Package, Inbox, Star, ExternalLink } from 'lucide-react'

export default function DashboardHome() {
  const [stats, setStats] = useState({ submissions: 0, unread: 0, materials: 0, testimonials: 0 })

  useEffect(() => {
    Promise.all([getSubmissions(), getMaterials(), getTestimonials()]).then(([s, m, t]) => {
      setStats({
        submissions: s.data.length,
        unread: s.data.filter((x: any) => !x.is_read).length,
        materials: m.data.length,
        testimonials: t.data.length,
      })
    })
  }, [])

  const cards = [
    { label: 'Total Inquiries', value: stats.submissions, sub: `${stats.unread} unread`, icon: Inbox, to: '/admin/inbox', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Materials', value: stats.materials, sub: 'in portfolio', icon: Package, to: '/admin/materials', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Testimonials', value: stats.testimonials, sub: 'client reviews', icon: Star, to: '/admin/testimonials', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  ]

  const quickLinks = [
    { to: '/admin/hero', label: 'Edit Hero Banner' },
    { to: '/admin/about', label: 'Edit About Section' },
    { to: '/admin/stats', label: 'Update Statistics' },
    { to: '/admin/contact-info', label: 'Update Contact Info' },
    { to: '/admin/settings', label: 'Site Settings' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all website content from here</p>
        </div>
        <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 px-4 py-2 rounded-lg transition-all">
          <ExternalLink size={14} /> View Website
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.label} to={c.to}
            className="bg-[#0d1424] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-0.5 group">
            <div className={`inline-flex p-2.5 rounded-xl border mb-4 ${c.color}`}>
              <c.icon size={18} />
            </div>
            <div className="text-3xl font-black text-white mb-1">{c.value}</div>
            <div className="text-sm font-medium text-gray-300">{c.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map(l => (
            <Link key={l.to} to={l.to}
              className="flex items-center gap-2 px-4 py-3 bg-white/3 hover:bg-amber-500/5 hover:border-amber-500/20 border border-white/5 rounded-xl text-sm text-gray-400 hover:text-amber-400 transition-all">
              <ExternalLink size={13} /> {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
