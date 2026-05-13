import { useEffect, useState } from 'react'
import { fetchTestimonials } from '../lib/api'

export default function Testimonials() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetchTestimonials().then(r => setItems(r.data.filter((t: any) => t.is_active))).catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <section className="py-24 bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label mb-3">Client Testimonials</div>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Hear directly from our partners across the global supply chain.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(t => (
            <div key={t.id} className="bg-[#0d1424] border border-white/5 rounded-2xl p-8 hover:border-amber-500/20 transition-all">
              <div className="text-amber-400 text-4xl font-serif mb-4">"</div>
              <p className="text-gray-300 leading-relaxed mb-6 text-sm">{t.quote}</p>
              <div className="border-t border-white/5 pt-4 flex items-center gap-3">
                {t.photo_url && (
                  <img src={t.photo_url} alt={t.author_name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10" />
                )}
                <div>
                  <div className="font-bold text-white text-sm">{t.author_name}</div>
                  <div className="text-amber-400 text-xs">{t.author_title}</div>
                  {t.author_location && <div className="text-gray-500 text-xs mt-0.5">{t.author_location}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
