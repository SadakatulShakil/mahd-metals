import { useEffect, useState } from 'react'
import { fetchAbout } from '../lib/api'
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
  const [data, setData] = useState<any>(null)

  useEffect(() => { fetchAbout().then(r => setData(r.data)).catch(() => {}) }, [])

  return (
    <section id="about" className="py-28 bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label mb-3">{data?.section_label || 'About Us'}</div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              <span className="text-gradient">{data?.headline || 'Built on 40 Years of Gulf Expertise'}</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              {data?.body_paragraph1 || 'MAHD Metals International is founded by Mohammad Hamad Al Bahar (Kuwait) and Bandar Mohammad Al Ghamdi (Saudi Arabia).'}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              {data?.body_paragraph2 || 'From major construction and industrial projects to banking and international trade, our founders bring unmatched credibility to every deal.'}
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
            <div className="relative glass rounded-2xl overflow-hidden">
              {/* About photo from Cloudinary */}
              {data?.photo_url && (
                <img src={data.photo_url} alt="About MAHD Metals"
                  className="w-full h-56 object-cover border-b border-white/5" />
              )}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    ['Founded',      data?.founded_year  || 'Est. 1984'],
                    ['Headquarters', data?.headquarters  || 'Jeddah, KSA'],
                    ['Operations',   data?.operations    || 'Gulf & Global'],
                    ['Specialty',    data?.specialty     || 'Alloys & Scrap'],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                      <div className="text-amber-400 text-[10px] uppercase tracking-widest mb-1">{label}</div>
                      <div className="text-white font-bold text-sm">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
                  <p className="text-amber-200/70 text-sm leading-relaxed italic">
                    "{data?.quote_text || 'Leveraging more than 40 years of hands-on experience in the Gulf and Middle East\'s key sectors.'}"
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
