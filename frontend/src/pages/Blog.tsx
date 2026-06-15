import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import SEO from '../components/SEO'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  category: string | null
  author: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/blog').then(r => setPosts(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO
        title="Blog | Saddam Scarp and Metal"
        description="Industry insights, market updates, and metal trading news from Saddam Scarp and Metal."
        canonical="https://saddamscarpandmetal.com/blog"
      />
      <main className="min-h-screen bg-[#020617] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-semibold tracking-wide">Latest Articles</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Industry news, market updates, and insights from our global metal trading team.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#0d1424] rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-5 bg-white/5 rounded" />
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">📰</div>
              <h2 className="text-2xl font-bold text-white mb-3">Coming Soon</h2>
              <p className="text-gray-400">We're working on our first articles. Check back soon!</p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-amber-500/20 transition-all duration-300"
                >
                  {post.cover_image_url ? (
                    <div className="overflow-hidden h-48">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-amber-500/10 to-amber-900/10 flex items-center justify-center">
                      <span className="text-4xl opacity-30">📰</span>
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-amber-500/20">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5">
                      <span>{post.author}</span>
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
