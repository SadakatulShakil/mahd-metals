import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, MapPin, Package, Layers, PhoneCall, Mail, ArrowUpRight } from 'lucide-react'
import { api } from '../lib/api'

interface Material {
  id: number
  slug: string
  name: string
  category: string
  description: string | null
  image_url: string | null
  is_active: boolean
  full_description: string | null
  specifications: string | null
  applications: string | null
  origin_countries: string | null
  min_order: string | null
  packaging: string | null
  meta_title: string | null
  meta_description: string | null
  seo_title: string | null
  seo_description: string | null
}

interface ContactInfo {
  phone: string
  email: string
  whatsapp: string
}

const WHATSAPP = 'https://wa.me/966057296781'

const categoryColors: Record<string, string> = {
  'Non-Ferrous': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Ferrous':     'bg-gray-500/10 text-gray-300 border-gray-500/20',
  'Specialty':   'bg-slate-500/10 text-slate-300 border-slate-500/20',
  'Mixed':       'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

const hoverBorder: Record<string, string> = {
  'Non-Ferrous': 'group-hover:border-orange-500/40',
  'Ferrous':     'group-hover:border-gray-500/40',
  'Specialty':   'group-hover:border-slate-400/40',
  'Mixed':       'group-hover:border-purple-500/40',
}

function parseSpecs(raw: string | null): { key: string; value: string }[] {
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

export default function MaterialDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [material, setMaterial] = useState<Material | null>(null)
  const [related, setRelated] = useState<Material[]>([])
  const [contact, setContact] = useState<ContactInfo | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    setMaterial(null)

    api.get(`/api/materials/${slug}`)
      .then(async r => {
        setMaterial(r.data)
        try {
          const [allRes, contactRes] = await Promise.all([
            api.get('/api/materials/'),
            api.get('/api/admin/contact-info'),
          ])
          setRelated((allRes.data as Material[]).filter(m => m.slug !== slug).slice(0, 3))
          setContact(contactRes.data)
        } catch {}
      })
      .catch(err => { if (err.response?.status === 404) setNotFound(true) })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-72 bg-white/5 rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-white/5 rounded" />)}
              </div>
              <div className="h-56 bg-white/5 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !material) {
    return (
      <main className="min-h-screen bg-[#020617] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-black text-white/10 mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-3">Material Not Found</h1>
          <p className="text-gray-400 mb-8">This material doesn't exist or has been removed.</p>
          <Link to="/materials" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Materials
          </Link>
        </div>
      </main>
    )
  }

  const specs = parseSpecs(material.specifications)
  const applications = material.applications
    ? material.applications.split(',').map(a => a.trim()).filter(Boolean)
    : []
  const seoTitle = material.meta_title || material.seo_title || `${material.name} | Saddam Scarp and Metal`
  const seoDesc = material.meta_description || material.seo_description || material.description || ''
  const phone = contact?.phone || '+966 57 296 781'
  const email = contact?.email || 'info@saddamscarpandmetal.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: material.name,
    description: material.description || '',
    image: material.image_url || undefined,
    brand: { '@type': 'Brand', name: 'Saddam Scarp and Metal' },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Saddam Scarp and Metal' },
    },
  }

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`https://saddamscarpandmetal.com/materials/${material.slug}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="min-h-screen bg-[#020617] pb-20">
        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          {material.image_url && (
            <img
              src={material.image_url}
              alt={material.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-[#020617]/40 to-[#020617]" />
          <div className="absolute inset-0 flex flex-col justify-end max-w-6xl mx-auto px-6 pb-10">
            <Link to="/materials" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 text-sm mb-4 transition-colors w-fit">
              <ArrowLeft size={14} /> Back to Materials
            </Link>
            <span className={`inline-flex items-center self-start text-[11px] font-semibold px-3 py-1 rounded-full border mb-3 ${categoryColors[material.category] || 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
              {material.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{material.name}</h1>
            {material.description && (
              <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed">{material.description}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-5">
              <Link to="/contact"
                className="bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:scale-105">
                Request a Quote
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto px-6 mt-12">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Left column */}
            <div className="md:col-span-2 space-y-10">
              {/* Full description */}
              {material.full_description && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">About This Material</h2>
                  <div className="space-y-4">
                    {material.full_description.split('\n').filter(Boolean).map((para, i) => (
                      <p key={i} className="text-gray-300 leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {applications.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Key Applications</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {applications.map(app => (
                      <li key={app} className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Origin */}
              {material.origin_countries && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-amber-400" /> Origin & Sourcing
                  </h2>
                  <p className="text-gray-300">{material.origin_countries}</p>
                </div>
              )}
            </div>

            {/* Right column — sticky info card */}
            <div>
              <div className="sticky top-24 bg-[#0d1424] border border-white/10 rounded-2xl p-6 space-y-5">
                <span className={`inline-flex text-[11px] font-semibold px-3 py-1 rounded-full border ${categoryColors[material.category] || 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {material.category}
                </span>

                <div className="space-y-3 border-t border-white/5 pt-4">
                  {material.min_order && (
                    <div className="flex items-start gap-3">
                      <Layers size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Minimum Order</p>
                        <p className="text-white text-sm font-medium">{material.min_order}</p>
                      </div>
                    </div>
                  )}
                  {material.packaging && (
                    <div className="flex items-start gap-3">
                      <Package size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Packaging</p>
                        <p className="text-white text-sm font-medium">{material.packaging}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 border-t border-white/5 pt-4">
                  <Link to="/contact"
                    className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold py-3 rounded-xl text-sm transition-colors">
                    Request a Quote
                  </Link>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 font-semibold py-3 rounded-xl text-sm transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp Us
                  </a>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-2">
                  <a href={`tel:${phone}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                    <PhoneCall size={13} className="text-amber-400" /> {phone}
                  </a>
                  <a href={`mailto:${email}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                    <Mail size={13} className="text-amber-400" /> {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications table */}
          {specs.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-1 bg-amber-500 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Technical Specifications</h2>
              </div>
              <div className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-6 py-4 text-left text-gray-400 font-medium uppercase tracking-wider text-xs w-1/3">Property</th>
                      <th className="px-6 py-4 text-left text-gray-400 font-medium uppercase tracking-wider text-xs">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr key={i} className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                        <td className="px-6 py-4 text-gray-400 font-medium">{spec.key}</td>
                        <td className="px-6 py-4 text-white">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Related materials */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-white/5 pt-14">
              <h2 className="text-2xl font-bold text-white mb-8">Other Materials We Trade</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map(m => (
                  <Link
                    key={m.slug}
                    to={`/materials/${m.slug}`}
                    className={`group bg-[#0d1424] border border-white/5 ${hoverBorder[m.category] || 'group-hover:border-amber-500/40'} rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40`}
                  >
                    {m.image_url && (
                      <div className="w-full h-28 mb-4 rounded-xl overflow-hidden border border-white/5">
                        <img src={m.image_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${categoryColors[m.category] || 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {m.category}
                      </span>
                      <ArrowUpRight size={14} className="text-gray-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <h3 className="text-white font-bold mb-1">{m.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{m.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
