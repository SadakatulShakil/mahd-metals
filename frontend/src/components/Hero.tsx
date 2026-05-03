import { Link } from 'react-router-dom'
import { ArrowRight, Globe, ShieldCheck, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.025]"
        style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',backgroundSize:'72px 72px'}} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-10 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-semibold tracking-wide">Trusted Global Metal Trading Partner</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6 animate-fade-up">
          Your Global Partner<br />
          <span className="text-gradient">in Scrap & Alloys</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{animationDelay:'0.1s'}}>
          MAHD Metals connects the global supply chain with premium ferrous,
          non-ferrous, and specialty alloy metals — backed by 40+ years of Gulf expertise.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-up" style={{animationDelay:'0.2s'}}>
          <Link to="/contact"
            className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20">
            Request a Quote
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/materials"
            className="flex items-center gap-2 glass hover:border-amber-500/30 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-white/5">
            Explore Materials
          </Link>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 animate-fade-up" style={{animationDelay:'0.3s'}}>
          {[
            { icon: ShieldCheck, text: '40+ Years Experience' },
            { icon: Globe, text: '30+ Countries Served' },
            { icon: Zap, text: 'End-to-End Logistics' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm">
              <Icon size={15} className="text-amber-400" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#020617] to-transparent" />
    </section>
  )
}
