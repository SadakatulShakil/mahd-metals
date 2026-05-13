import { useEffect, useState, useRef } from 'react'
import { adminApi } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Save, Upload } from 'lucide-react'

const pages = [
  { key: 'about',     label: 'About Page' },
  { key: 'materials', label: 'Materials Page' },
  { key: 'contact',   label: 'Contact Page' },
]

function BannerCard({ page, label }: { page: string; label: string }) {
  const [form, setForm]           = useState<any>({})
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    adminApi.get(`/api/admin/banners/${page}`).then(r => { setForm(r.data); setLoading(false) })
  }, [page])

  const save = async () => {
    setSaving(true)
    try { await adminApi.put(`/api/admin/banners/${page}`, form); toast.success(`${label} saved!`) }
    catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    try {
      const res = await adminApi.post(`/api/admin/banners/${page}/image`, fd)
      setForm((f: any) => ({ ...f, image_url: res.data.url }))
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const set = (name: string) => (e: any) => setForm((f: any) => ({ ...f, [name]: e.target.value }))

  if (loading) return <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 text-gray-500 text-sm">Loading...</div>

  return (
    <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-white">{label}</h2>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-4 py-2 rounded-xl text-xs transition-all">
          <Save size={13} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Image preview + upload */}
      {form.image_url && (
        <img src={form.image_url} alt={label}
          className="w-full h-32 object-cover rounded-xl mb-4 border border-white/10" />
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        className="flex items-center gap-2 border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 px-4 py-2 rounded-xl text-xs transition-all mb-4 w-fit">
        <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload Banner Image'}
      </button>

      <div className="space-y-3">
        {[['Title', 'title'], ['Subtitle', 'subtitle']].map(([lbl, name]) => (
          <div key={name}>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">{lbl}</label>
            <input value={form[name] || ''} onChange={set(name)}
              className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm" />
          </div>
        ))}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Min Height</label>
          <select value={form.min_height || '320px'} onChange={set('min_height')}
            className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm">
            {['240px','320px','400px','480px'].map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function BannersEditor() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Page Banners</h1>
        <p className="text-gray-500 text-sm mt-1">Edit hero banners for About, Materials and Contact pages</p>
      </div>
      <div className="space-y-5">
        {pages.map(p => <BannerCard key={p.key} page={p.key} label={p.label} />)}
      </div>
    </div>
  )
}
