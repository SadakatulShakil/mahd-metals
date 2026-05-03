const stats = [
  { value: '1.2M+', label: 'Annual Tonnage Traded', sub: 'metric tons' },
  { value: '30+',   label: 'Countries Served',      sub: 'worldwide' },
  { value: '40+',   label: 'Years in Industry',     sub: 'of expertise' },
  { value: '150+',  label: 'Global Partners',       sub: 'and growing' },
]

export default function Stats() {
  return (
    <section className="relative py-0">
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-amber-600/40">
            {stats.map((s, i) => (
              <div key={s.label}
                className={`bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-center py-8 px-4 ${i < 3 ? 'md:border-r border-amber-400/30' : ''}`}>
                <div className="text-4xl md:text-5xl font-black text-[#020617] mb-1">{s.value}</div>
                <div className="text-amber-900 font-semibold text-sm uppercase tracking-wider">{s.label}</div>
                <div className="text-amber-700 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
