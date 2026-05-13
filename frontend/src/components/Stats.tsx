import { useEffect, useState } from 'react'
import { fetchStats } from '../lib/api'

function StatCard({ value, label, sub, border }: any) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const num    = match?.[1] || value
  const suffix = match?.[2] || ''

  return (
    <div className={`bg-[#0d1424] text-center py-10 px-6 hover:bg-[#111827] transition-colors duration-300 ${border ? 'border-r border-white/[0.04]' : ''}`}>
      <div className="text-4xl md:text-5xl font-black mb-2">
        <span className="text-white">{num}</span>
        <span className="text-amber-400">{suffix}</span>
      </div>
      <div className="text-gray-300 font-semibold text-sm">{label}</div>
      <div className="text-gray-600 text-xs mt-1 uppercase tracking-wider">{sub}</div>
    </div>
  )
}

export default function Stats() {
  const [data, setData] = useState<any>(null)

  useEffect(() => { fetchStats().then(r => setData(r.data)).catch(() => {}) }, [])

  const stats = [
    { value: data?.annual_tonnage    || '1.2M+', label: 'Annual Tonnage Traded', sub: data?.annual_tonnage_sub    || 'metric tons' },
    { value: data?.countries_served  || '10+',   label: 'Countries Served',      sub: data?.countries_served_sub  || 'worldwide' },
    { value: data?.years_in_industry || '10+',   label: 'Years in Industry',     sub: data?.years_in_industry_sub || 'of expertise' },
    { value: data?.global_partners   || '15+',  label: 'Global Partners',       sub: data?.global_partners_sub   || 'and growing' },
  ]

  return (
    <section className="py-16 bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} border={i < 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
