import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'

interface FAQItem {
  id: number
  question: string
  answer: string
  question_ar: string | null
  answer_ar: string | null
  order: number
  is_active: boolean
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  useEffect(() => {
    api.get('/api/admin/faqs')
      .then(r => {
        const active = (r.data as FAQItem[]).filter(f => f.is_active)
        setFaqs(active)
        if (active.length > 0) setOpen(active[0].id)

        if (active.length > 0) {
          const schema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: active.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }
          const existing = document.getElementById('faq-schema')
          if (existing) existing.remove()
          const script = document.createElement('script')
          script.id = 'faq-schema'
          script.type = 'application/ld+json'
          script.text = JSON.stringify(schema)
          document.head.appendChild(script)
        }
      })
      .catch(() => {})

    return () => { document.getElementById('faq-schema')?.remove() }
  }, [])

  if (faqs.length === 0) return null

  return (
    <section className="py-16 bg-[#020617]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="w-12 h-1 bg-amber-500 rounded-full mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">{t('faq.heading')}</h2>
          <p className="text-gray-400">{t('faq.subheading')}</p>
        </div>

        <div className="space-y-3">
          {faqs.map(faq => {
            const isOpen = open === faq.id
            return (
              <div key={faq.id}
                className={`bg-[#0d1424] border rounded-xl overflow-hidden transition-colors duration-200 ${
                  isOpen ? 'border-amber-500/30' : 'border-white/5 hover:border-white/10'
                }`}>
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-start"
                >
                  <span className={`font-semibold text-sm md:text-base transition-colors ${isOpen ? 'text-amber-400' : 'text-white'}`}>
                    {isAr ? (faq.question_ar || faq.question) : faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 ms-4 text-amber-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-6 pb-5 text-gray-300 text-sm leading-relaxed">{isAr ? (faq.answer_ar || faq.answer) : faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
