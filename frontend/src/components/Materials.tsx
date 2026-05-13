import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { fetchMaterials } from '../lib/api'

const categoryStyle: Record<string, string> = {
  'Non-Ferrous': 'bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:border-orange-500/40',
  'Ferrous':     'bg-gray-500/10 text-gray-400 border-gray-500/20 group-hover:border-gray-500/40',
  'Specialty':   'bg-slate-500/10 text-slate-400 border-slate-500/20 group-hover:border-slate-500/40',
  'Mixed':       'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40',
}

const hoverBorder: Record<string, string> = {
  'Non-Ferrous': 'group-hover:border-orange-500/40',
  'Ferrous':     'group-hover:border-gray-500/40',
  'Specialty':   'group-hover:border-slate-400/40',
  'Mixed':       'group-hover:border-purple-500/40',
}

export default function Materials() {
  const [materials, setMaterials] = useState<any[]>([])

  useEffect(() => {
    fetchMaterials().then(r => setMaterials(r.data)).catch(() => {})
  }, [])

  return (
    <section id="materials" className="py-28 bg-[#080d1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="section-label mb-3">What We Trade</div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Materials<br /><span className="text-gradient">Portfolio</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            From industrial yards to global markets — high-grade metals handled with precision and traded at scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map(m => (
            <Link key={m.slug} to={`/materials#${m.slug}`}
              className={`group relative bg-[#0d1424] border border-white/5 ${hoverBorder[m.category] || 'group-hover:border-amber-500/40'} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:bg-[#111827]`}>
              {/* Material image */}
              {m.image_url && (
                <div className="w-full h-36 mb-4 rounded-xl overflow-hidden border border-white/5">
                  <img src={m.image_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex items-start justify-between mb-5">
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${categoryStyle[m.category] || 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {m.category}
                </span>
                <ArrowUpRight size={16} className="text-gray-700 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{m.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{m.description}</p>
              <div className="mt-5 pt-4 border-t border-white/5">
                <span className="text-amber-400 text-xs font-semibold group-hover:underline">Request Quote →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/materials"
            className="inline-flex items-center gap-2 border border-amber-500/30 hover:border-amber-400 text-amber-400 hover:text-amber-300 px-8 py-3 rounded-xl transition-all hover:bg-amber-500/5">
            View Full Portfolio <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
