import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, ShieldCheck, Zap } from 'lucide-react'
import { fetchHero } from '../lib/api'

export default function Hero() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchHero().then(r => setData(r.data)).catch(() => {})
  }, [])

  const badge    = data?.badge_text        || 'Trusted in 10+ Countries Worldwide'
  const line1    = data?.headline_line1    || 'Your Global Partner in'
  const line2    = data?.headline_line2    || 'Scrap & Alloy Metals'
  const sub      = data?.subheadline       || 'RE METAL connects the global supply chain with premium ferrous, non-ferrous, and specialty alloy metals — backed by 16+ years of Gulf expertise.'
  const cta1     = data?.cta_primary_text  || 'Request a Quote'
  const cta2     = data?.cta_secondary_text|| 'Explore Materials'
  const bgImage  = data?.bg_image_url      || null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Background image from Cloudinary */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Hero background"
            className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-[#020617]/20 to-[#020617]" />
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-hero-pattern z-[1]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-[1]" />
      <div className="absolute inset-0 opacity-[0.025] z-[1]"
        style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',backgroundSize:'72px 72px'}} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-semibold tracking-wide">{badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
          {line1}<br />
          <span className="text-gradient">{line2}</span>
        </h1>

        <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">{sub}</p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a href="https://wa.me/966057296781"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20">
            WhatsApp Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <Link to="/materials"
            className="flex items-center gap-2 bg-white border border-white/20 text-amber-500 font-semibold hover:bg-amber-50 px-8 py-4 rounded-xl text-base transition-all duration-200">
            {cta2}
          </Link>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-200">
          {[
            { icon: ShieldCheck, text: '16+ Years Experience' },
            { icon: Globe,       text: '10+ Countries Served' },
            { icon: Zap,         text: 'End-to-End Logistics' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm">
              <Icon size={15} className="text-amber-400" /><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#020617] to-transparent z-10" />
    </section>
  )
}
