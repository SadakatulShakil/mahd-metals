import { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { fetchTestimonials } from '../lib/api'

export default function Testimonials() {
  const [items, setItems]     = useState<any[]>([])
  const [index, setIndex]     = useState(0)
  const timerRef              = useRef<ReturnType<typeof setInterval> | null>(null)
  const { t, i18n }           = useTranslation()
  const isRTL                 = i18n.language === 'ar'

  useEffect(() => {
    fetchTestimonials().then(r => setItems(r.data.filter((t: any) => t.is_active))).catch(() => {})
  }, [])

  const perPage  = typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1
  const maxIndex = Math.max(0, items.length - perPage)

  const next = useCallback(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), [maxIndex])
  const prev = useCallback(() => setIndex(i => (i <= 0 ? maxIndex : i - 1)), [maxIndex])

  useEffect(() => {
    if (items.length <= perPage) return
    timerRef.current = setInterval(next, 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [items.length, perPage, next])

  const pause  = () => { if (timerRef.current) clearInterval(timerRef.current) }
  const resume = () => {
    if (items.length <= perPage) return
    timerRef.current = setInterval(next, 4000)
  }

  if (items.length === 0) return null

  const slideWidth = 100 / perPage
  // In RTL, carousel slides are laid out right-to-left, so we translate positively
  const translateX = isRTL
    ? `translateX(${index * slideWidth}%)`
    : `translateX(-${index * slideWidth}%)`

  return (
    <section className="py-24 bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label mb-3">{t('testimonials.sectionLabel')}</div>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            {t('testimonials.heading')} <span className="text-gradient">{t('testimonials.headingGradient')}</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            {t('testimonials.subheading')}
          </p>
        </div>

        <div className="relative" onMouseEnter={pause} onMouseLeave={resume}>
          {items.length > perPage && (
            <>
              {/* In RTL: left button = next, right button = prev */}
              <button onClick={isRTL ? next : prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#0d1424] border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 p-2 rounded-xl transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={isRTL ? prev : next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#0d1424] border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 p-2 rounded-xl transition-all">
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: translateX }}>
              {items.map(testimonial => (
                <div key={testimonial.id}
                  className="shrink-0 px-3"
                  style={{ width: `${slideWidth}%` }}>
                  <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-8 hover:border-amber-500/20 transition-all h-full">
                    <div className="text-amber-400 text-4xl font-serif mb-4">"</div>
                    <p className="text-gray-300 leading-relaxed mb-6 text-sm">{testimonial.quote}</p>
                    <div className="border-t border-white/5 pt-4 flex items-center gap-3">
                      {testimonial.photo_url && (
                        <img src={testimonial.photo_url} alt={testimonial.author_name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      )}
                      <div>
                        <div className="font-bold text-white text-sm">{testimonial.author_name}</div>
                        <div className="text-amber-400 text-xs">{testimonial.author_title}</div>
                        {testimonial.author_location && <div className="text-gray-500 text-xs mt-0.5">{testimonial.author_location}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {items.length > perPage && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === index ? 'bg-amber-400 w-5' : 'bg-white/20 hover:bg-white/40'
                  }`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
