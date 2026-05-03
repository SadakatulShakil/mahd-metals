import { CheckCircle2 } from 'lucide-react'

const capabilities = [
  'Precise sourcing of ferrous & non-ferrous materials',
  'Global trading network across 30+ countries',
  'End-to-end logistics and compliance management',
  'Specialty alloy and ferroalloy expertise',
  'Transparent, trust-based long-term partnerships',
  'Deep Gulf & Middle East regional authority',
]

export default function About() {
  return (
    <section id="about" className="py-28 bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label mb-3">About Us</div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              Built on 40 Years of<br />
              <span className="text-gradient">Gulf Expertise</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              MAHD Metals International is founded by <strong className="text-white">Mohammad Hamad Al Bahar</strong> (Kuwait)
              and <strong className="text-white">Bandar Mohammad Al Ghamdi</strong> (Saudi Arabia) — a cross-border
              partnership built on deep regional knowledge and trusted networks developed over four decades.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              From major construction and industrial projects to banking and international trade,
              our founders bring unmatched credibility to every deal — connecting sellers and buyers
              across the global metal supply chain with speed and reliability.
            </p>
            <div className="space-y-3">
              {capabilities.map(c => (
                <div key={c} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                  <span className="text-gray-400 text-sm">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-px bg-gradient-to-br from-amber-500/20 via-transparent to-transparent rounded-2xl blur-sm" />
            <div className="relative glass rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Founded',       value: 'Est. 1984' },
                  { label: 'Headquarters',  value: 'Jeddah, KSA' },
                  { label: 'Operations',    value: 'Gulf & Global' },
                  { label: 'Specialty',     value: 'Alloys & Scrap' },
                ].map(item => (
                  <div key={item.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <div className="text-amber-400 text-[10px] uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-white font-bold text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
                <p className="text-amber-200/70 text-sm leading-relaxed italic">
                  "Leveraging more than 40 years of hands-on experience in the Gulf and Middle East's
                  key sectors — from construction and industrial projects to banking and trade."
                </p>
                <div className="mt-3 text-amber-400 text-xs font-semibold">— MAHD Metals Founding Principles</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
