import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const materials = [
  { slug: 'copper',         name: 'Copper',          category: 'Non-Ferrous', desc: 'High-grade copper scrap and wire — among the most valuable recyclable metals globally.', accent: 'group-hover:border-orange-500/40', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { slug: 'aluminum',       name: 'Aluminum',         category: 'Non-Ferrous', desc: 'Lightweight alloys and scrap sourced for automotive, aerospace, and construction sectors.', accent: 'group-hover:border-blue-500/40', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { slug: 'steel-iron',     name: 'Steel & Iron',     category: 'Ferrous',     desc: 'HMS 1&2, cast iron, and structural steel for global manufacturing requirements.', accent: 'group-hover:border-gray-500/40', badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  { slug: 'stainless-steel',name: 'Stainless Steel',  category: 'Specialty',   desc: '304, 316 & 430 grade stainless — critical for food processing, medical, and industrial uses.', accent: 'group-hover:border-slate-400/40', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  { slug: 'brass-bronze',   name: 'Brass & Bronze',   category: 'Non-Ferrous', desc: 'Mixed and segregated brass and bronze alloys traded to foundries worldwide.', accent: 'group-hover:border-yellow-500/40', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { slug: 'mixed-metals',   name: 'Mixed Metals',     category: 'Mixed',       desc: 'Processed and unprocessed mixed metal streams from industrial yards and demolition.', accent: 'group-hover:border-purple-500/40', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
]

export default function Materials() {
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
          {materials.map((m, i) => (
            <Link key={m.slug} to={`/materials#${m.slug}`}
              className={`group relative bg-[#0d1424] border border-white/5 ${m.accent} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:bg-[#111827]`}
              style={{animationDelay:`${i*0.05}s`}}>
              <div className="flex items-start justify-between mb-5">
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${m.badge}`}>
                  {m.category}
                </span>
                <ArrowUpRight size={16} className="text-gray-700 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{m.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
              <div className="mt-5 pt-4 border-t border-white/5">
                <span className="text-amber-400 text-xs font-semibold group-hover:underline">Request Quote →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
