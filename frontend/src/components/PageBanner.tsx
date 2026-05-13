import { useEffect, useState } from 'react'
import { fetchBanner } from '../lib/api'

interface Props {
  page: string
  defaultTitle: string
  defaultSubtitle?: string
}

export default function PageBanner({ page, defaultTitle, defaultSubtitle }: Props) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchBanner(page).then(r => setData(r.data)).catch(() => {})
  }, [page])

  const title    = data?.title     || defaultTitle
  const subtitle = data?.subtitle  || defaultSubtitle || ''
  const bgImage  = data?.image_url || null
  const minH     = data?.min_height || '320px'

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden bg-[#020617] pt-16"
      style={{ minHeight: minH }}
    >
      {/* Background image */}
      {bgImage && (
        <div className="absolute inset-0">
          <img src={bgImage} alt={title}
            className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-transparent to-[#020617]" />
        </div>
      )}

      {/* Subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.04),transparent_70%)]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />

      <div className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
          <span className="text-gradient">{title}</span>
        </h1>

        {subtitle && (
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed drop-shadow-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#020617] to-transparent" />
    </div>
  )
}
