const testimonials = [
  { quote: 'MAHD guarantees the consistent, high-quality alloy supply that keeps our Pune production lines running without interruption.', name: 'Arif Mehta', title: 'Vikra Auto Industries', location: 'Pune, India' },
  { quote: 'Their precise ferroalloy specifications and flawless logistics are critical to our steel quality. A truly reliable global partner.', name: 'Ji-Yeon Park', title: 'HanRiver Steel Co.', location: 'Busan, South Korea' },
  { quote: "MAHD's reliable global scale and transparent trading are essential to our sourcing strategy. They deliver every time.", name: 'Marcus Johnson', title: 'Liberty Foundries Inc.', location: 'Houston, USA' },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-steel-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Client Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Hear directly from our partners across the global supply chain.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-steel-900 border border-white/5 rounded-2xl p-8 hover:border-gold-500/20 transition-all">
              <div className="text-gold-400 text-4xl font-serif mb-4">"</div>
              <p className="text-gray-300 leading-relaxed mb-6 text-sm">{t.quote}</p>
              <div className="border-t border-white/5 pt-4">
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-gold-400 text-sm">{t.title}</div>
                <div className="text-gray-500 text-xs mt-1">{t.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
