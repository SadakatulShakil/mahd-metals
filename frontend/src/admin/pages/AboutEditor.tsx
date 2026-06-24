import { useEffect, useState, useRef } from 'react'
import { getAbout, updateAbout, uploadAboutImage } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Upload, Save } from 'lucide-react'

export default function AboutEditor() {
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { getAbout().then(r => { setForm(r.data); setLoading(false) }) }, [])

  const save = async () => {
    setSaving(true)
    try { await updateAbout(form); toast.success('About content saved!') }
    catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const res = await uploadAboutImage(file)
      setForm((f: any) => ({ ...f, photo_url: res.data.url }))
      toast.success('Photo uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const set = (name: string) => (e: any) => setForm((f: any) => ({ ...f, [name]: e.target.value }))

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">About Section</h1>
          <p className="text-gray-500 text-sm mt-1">Edit the about us section content and photo</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5">
        {/* Photo */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">About Photo</h2>
          {form.photo_url && (
            <img src={form.photo_url} alt="About" className="w-48 h-36 object-cover rounded-xl mb-4 border border-white/10" />
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 px-4 py-2.5 rounded-xl text-sm transition-all">
            <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>

        {/* Text */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Text Content</h2>
          {[
            ['Section Label', 'section_label'], ['Headline (English)', 'headline'],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
              <input value={form[name] || ''} onChange={set(name)}
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">العنوان بالعربي</label>
            <input value={form['headline_ar'] || ''} onChange={set('headline_ar')}
              className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm text-right"
              dir="rtl" placeholder="مبني على 40 عاماً من الخبرة الخليجية" />
          </div>
          {[
            ['Body Paragraph 1 (English)', 'body_paragraph1'], ['Body Paragraph 2 (English)', 'body_paragraph2'], ['Quote Text (English)', 'quote_text']
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
              <textarea rows={3} value={form[name] || ''} onChange={set(name)}
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm resize-none" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">الفقرة الأولى بالعربي</label>
            <textarea rows={3} value={form['body_paragraph1_ar'] || ''} onChange={set('body_paragraph1_ar')}
              className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm resize-none text-right"
              dir="rtl" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">الفقرة الثانية بالعربي</label>
            <textarea rows={3} value={form['body_paragraph2_ar'] || ''} onChange={set('body_paragraph2_ar')}
              className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm resize-none text-right"
              dir="rtl" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">الاقتباس بالعربي</label>
            <textarea rows={3} value={form['quote_text_ar'] || ''} onChange={set('quote_text_ar')}
              className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm resize-none text-right"
              dir="rtl" />
          </div>
        </div>

        {/* Info Cards */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">Info Cards</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Founded Year', 'founded_year'], ['Headquarters', 'headquarters'],
              ['Operations', 'operations'], ['Specialty', 'specialty']
            ].map(([label, name]) => (
              <div key={name}>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
                <input value={form[name] || ''} onChange={set(name)}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
