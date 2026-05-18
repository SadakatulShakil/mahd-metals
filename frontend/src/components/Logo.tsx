import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBranding } from '../lib/api'

let cachedBranding: any = null

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const [branding, setBranding] = useState<any>(cachedBranding)

  useEffect(() => {
    if (!cachedBranding) {
      fetchBranding().then(r => {
        cachedBranding = r.data
        setBranding(r.data)
      }).catch(() => {})
    }
  }, [])

  const sizeClass  = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-xl'
  const imgHeight  = size === 'lg' ? 'h-10' : size === 'sm' ? 'h-6' : 'h-8'
  const primary    = branding?.logo_text_primary   || 'SADDAM'
  const secondary  = branding?.logo_text_secondary || ' Scrap and Metal'

  return (
    <Link to="/" className="flex items-center gap-2.5">
      {/* Image logo (if set) */}
      {branding?.logo_image_url && (
        <img
          src={branding.logo_image_url}
          alt={primary + secondary}
          className={`${imgHeight} w-auto object-contain`}
        />
      )}
      {/* Text logo — always shown */}
      <span className={`font-black tracking-tight ${sizeClass}`}>
        <span className="text-amber-400">{primary}</span>
        <span className="text-white">{secondary}</span>
      </span>
    </Link>
  )
}
