import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import SEO from '../components/SEO'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  category: string | null
  author: string
  created_at: string
  meta_title: string | null
  meta_description: string | null
}

function formatDate(iso: string, lang = 'en') {
  return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const BackIcon = isAr ? ArrowRight : ArrowLeft
  const [post, setPost] = useState<Post | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    api.get(`/api/blog/${slug}`)
      .then(r => {
        setPost(r.data)
        return api.get('/api/blog')
      })
      .then(r => {
        setRelated((r.data as Post[]).filter(p => p.slug !== slug).slice(0, 3))
      })
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-2/3" />
            <div className="h-64 bg-white/5 rounded-2xl" />
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-white/5 rounded" />)}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen bg-[#020617] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">404</div>
          <h1 className="text-2xl font-bold text-white mb-3">{t('blog.postNotFound')}</h1>
          <p className="text-gray-400 mb-8">{t('blog.postNotFoundDesc')}</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
            <BackIcon size={16} /> {t('blog.backToBlog')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <SEO
        title={post.meta_title || `${post.title} | Saddam Scarp and Metal`}
        description={post.meta_description || post.excerpt || ''}
        canonical={`https://saddamscarpandmetal.com/blog/${post.slug}`}
      />
      <main className="min-h-screen bg-[#020617] pb-20">
        {/* Hero image */}
        {post.cover_image_url ? (
          <div className="relative h-72 md:h-96 w-full overflow-hidden">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-transparent to-[#020617]" />
          </div>
        ) : (
          <div className="h-24" />
        )}

        <div className="max-w-3xl mx-auto px-6 pt-8">
          {/* Back link */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 text-sm font-medium transition-colors mb-8">
            <BackIcon size={15} /> {t('blog.backToBlog')}
          </Link>

          {/* Meta */}
          {post.category && (
            <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-amber-500/20">
              {post.category}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-white/5">
            <span className="font-medium text-gray-300">{post.author}</span>
            <span>·</span>
            <span>{formatDate(post.created_at, i18n.language)}</span>
          </div>

          {/* Content */}
          {post.content ? (
            <div
              className="prose prose-invert prose-amber max-w-none text-gray-300 leading-relaxed
                prose-headings:text-white prose-headings:font-bold
                prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-amber-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-blockquote:border-l-amber-500 prose-blockquote:text-gray-400
                prose-img:rounded-xl prose-img:border prose-img:border-white/10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : post.excerpt ? (
            <p className="text-gray-300 text-lg leading-relaxed">{post.excerpt}</p>
          ) : null}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 mt-20">
            <div className="border-t border-white/5 pt-14">
              <h2 className="text-2xl font-bold text-white mb-8">{t('blog.moreArticles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map(p => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    className="group bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-amber-500/20 transition-all duration-300"
                  >
                    {p.cover_image_url ? (
                      <div className="h-40 overflow-hidden">
                        <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-amber-500/10 to-amber-900/10" />
                    )}
                    <div className="p-5">
                      {p.category && (
                        <span className="text-amber-400 text-xs font-semibold">{p.category} · </span>
                      )}
                      <span className="text-gray-500 text-xs">{formatDate(p.created_at)}</span>
                      <h3 className="text-white font-semibold mt-2 line-clamp-2 group-hover:text-amber-400 transition-colors">{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
