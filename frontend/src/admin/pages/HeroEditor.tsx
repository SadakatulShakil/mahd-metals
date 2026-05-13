import { useEffect, useState, useRef } from 'react'
import { getHero, updateHero, uploadHeroImage } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Upload, Save } from 'lucide-react'

export default function HeroEditor() {
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getHero().then(r => { setForm(r.data); setLoading(false) })
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await updateHero(form)
      toast.success('Hero content saved!')
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadHeroImage(file)
      setForm((f: any) => ({ ...f, bg_image_url: res.data.url }))
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const Field = ({ label, name, textarea = false }: { label: string; name: string; textarea?: boolean }) => (
    <div>
      <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
      {textarea
        ? <textarea rows={3} value={form[name] || ''} onChange={e => setForm((f: any) => ({ ...f, [name]: e.target.value }))}
            className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm resize-none" />
        : <input value={form[name] || ''} onChange={e => setForm((f: any) => ({ ...f, [name]: e.target.value }))}
            className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm" />
      }
    </div>
  )

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Hero Banner</h1>
          <p className="text-gray-500 text-sm mt-1">Edit the main hero section of the homepage</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5">
        {/* Background Image */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">Background Image</h2>
          {form.bg_image_url && (
            <img src={form.bg_image_url} alt="Hero bg"
              className="w-full h-40 object-cover rounded-xl mb-4 border border-white/10" />
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 px-4 py-2.5 rounded-xl text-sm transition-all">
            <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload Background Image'}
          </button>
        </div>

        {/* Text Content */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">Text Content</h2>
          <Field label="Badge Text" name="badge_text" />
          <Field label="Headline Line 1" name="headline_line1" />
          <Field label="Headline Line 2 (gradient)" name="headline_line2" />
          <Field label="Sub-headline" name="subheadline" textarea />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA Button" name="cta_primary_text" />
            <Field label="Secondary CTA Button" name="cta_secondary_text" />
          </div>
        </div>
      </div>
    </div>
  )
}
