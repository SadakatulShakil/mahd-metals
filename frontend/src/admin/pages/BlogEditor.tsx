import { useEffect, useState } from 'react'
import { adminApi } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  category: string | null
  tags: string | null
  author: string
  is_published: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
}

const empty = (): Omit<Post, 'id' | 'slug' | 'created_at'> => ({
  title: '',
  excerpt: '',
  content: '',
  cover_image_url: null,
  category: '',
  tags: '',
  author: 'Saddam Scarp and Metal',
  is_published: false,
  meta_title: '',
  meta_description: '',
})

function makeSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function BlogEditor() {
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState<Partial<Post> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = () => adminApi.get('/api/admin/blog').then(r => setPosts(r.data)).catch(() => {})

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(empty()); setIsNew(true) }
  const openEdit = (p: Post) => { setEditing({ ...p }); setIsNew(false) }
  const close = () => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!editing?.title?.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      if (isNew) {
        await adminApi.post('/api/admin/blog', editing)
        toast.success('Post created')
      } else {
        await adminApi.put(`/api/admin/blog/${(editing as Post).id}`, editing)
        toast.success('Post updated')
      }
      close()
      load()
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const del = async (id: number) => {
    if (!confirm('Delete this post?')) return
    try {
      await adminApi.delete(`/api/admin/blog/${id}`)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const uploadImage = async (file: File) => {
    if (!editing || isNew) { toast.error('Save the post first, then upload an image'); return }
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    try {
      const res = await adminApi.post(`/api/admin/blog/${(editing as Post).id}/image`, fd)
      setEditing(prev => prev ? { ...prev, cover_image_url: res.data.url } : prev)
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Blog</h1>
          <p className="text-gray-400 text-sm mt-0.5">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={15} /> New Post
        </button>
      </div>

      {/* Post list */}
      <div className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No posts yet. Create your first article!</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Title</th>
                <th className="px-6 py-4 text-gray-400 font-medium hidden md:table-cell">Category</th>
                <th className="px-6 py-4 text-gray-400 font-medium hidden md:table-cell">Status</th>
                <th className="px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Date</th>
                <th className="px-6 py-4 text-gray-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-white font-medium max-w-xs truncate">{p.title}</td>
                  <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{p.category || '—'}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.is_published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden lg:table-cell">{formatDate(p.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => del(p.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit drawer */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative ml-auto w-full max-w-2xl bg-[#080d1a] h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <h2 className="text-lg font-bold text-white">{isNew ? 'New Post' : 'Edit Post'}</h2>
              <button onClick={close} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
            </div>

            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Title *</label>
                <input
                  value={editing.title || ''}
                  onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm"
                  placeholder="Post title"
                />
                {editing.title && (
                  <p className="text-gray-600 text-xs mt-1">Slug: {makeSlug(editing.title)}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Category</label>
                  <input
                    value={editing.category || ''}
                    onChange={e => setEditing(p => ({ ...p!, category: e.target.value }))}
                    className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm"
                    placeholder="Industry News"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Author</label>
                  <input
                    value={editing.author || ''}
                    onChange={e => setEditing(p => ({ ...p!, author: e.target.value }))}
                    className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Excerpt</label>
                <textarea
                  value={editing.excerpt || ''}
                  onChange={e => setEditing(p => ({ ...p!, excerpt: e.target.value }))}
                  rows={3}
                  maxLength={500}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none"
                  placeholder="Short description (max 500 chars)"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Content (HTML)</label>
                <textarea
                  value={editing.content || ''}
                  onChange={e => setEditing(p => ({ ...p!, content: e.target.value }))}
                  rows={12}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none font-mono"
                  placeholder="<p>Full article content as HTML...</p>"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Tags (comma separated)</label>
                <input
                  value={editing.tags || ''}
                  onChange={e => setEditing(p => ({ ...p!, tags: e.target.value }))}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm"
                  placeholder="metal, trading, market"
                />
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Cover Image</label>
                {editing.cover_image_url && (
                  <img src={editing.cover_image_url} alt="Cover" className="w-full h-40 object-cover rounded-xl mb-3 border border-white/10" />
                )}
                <label className={`flex items-center gap-2 cursor-pointer bg-[#1a2235] border border-white/10 hover:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-gray-400 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Upload size={14} />
                  {uploading ? 'Uploading...' : isNew ? 'Save post first to upload image' : 'Upload cover image'}
                  {!isNew && <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />}
                </label>
              </div>

              {/* SEO */}
              <div className="border-t border-white/5 pt-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">SEO</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Meta Title</label>
                    <input
                      value={editing.meta_title || ''}
                      onChange={e => setEditing(p => ({ ...p!, meta_title: e.target.value }))}
                      className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Meta Description</label>
                    <textarea
                      value={editing.meta_description || ''}
                      onChange={e => setEditing(p => ({ ...p!, meta_description: e.target.value }))}
                      rows={3}
                      className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Published toggle */}
              <div className="flex items-center justify-between bg-[#1a2235] border border-white/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-white text-sm font-medium">Published</p>
                  <p className="text-gray-500 text-xs">{editing.is_published ? 'Visible to public' : 'Draft — not visible'}</p>
                </div>
                <button
                  onClick={() => setEditing(p => ({ ...p!, is_published: !p!.is_published }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editing.is_published ? 'bg-amber-500' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${editing.is_published ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex gap-3 flex-shrink-0">
              <button onClick={close} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-2.5 rounded-xl text-sm transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold py-2.5 rounded-xl text-sm transition-colors">
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
