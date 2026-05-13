import { useEffect, useState, useRef } from 'react'
import { adminApi } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Save, Upload } from 'lucide-react'

export default function BrandingEditor() {
  const [form, setForm]           = useState<any>({})
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    adminApi.get('/api/admin/branding').then(r => { setForm(r.data); setLoading(false) })
  }, [])

  const save = async () => {
    setSaving(true)
    try { await adminApi.put('/api/admin/branding', form); toast.success('Branding saved!') }
    catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    try {
      const res = await adminApi.post('/api/admin/branding/logo', fd)
      setForm((f: any) => ({ ...f, logo_image_url: res.data.url }))
      toast.success('Logo uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const set = (name: string) => (e: any) => setForm((f: any) => ({ ...f, [name]: e.target.value }))

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Branding</h1>
          <p className="text-gray-500 text-sm mt-1">Logo, company name, tagline and footer text</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5">

        {/* Logo preview — shows BOTH image and text side by side */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">Logo Preview</h2>
          <div className="flex items-center gap-6 p-4 bg-[#020617] rounded-xl border border-white/5 mb-5">
            {form.logo_image_url && (
              <img src={form.logo_image_url} alt="Logo"
                className="h-10 w-auto object-contain" />
            )}
            <div className="text-2xl font-black">
              <span className="text-amber-400">{form.logo_text_primary || 'MAHD'}</span>
              <span className="text-white">{form.logo_text_secondary || ' Metals'}</span>
            </div>
          </div>

          <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
          <button onClick={() => logoRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 px-4 py-2.5 rounded-xl text-sm transition-all">
            <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Logo Image'}
          </button>
          {form.logo_image_url && (
            <button onClick={() => setForm((f: any) => ({ ...f, logo_image_url: null }))}
              className="block mt-2 text-xs text-red-400 hover:text-red-300 transition-colors">
              Remove logo image
            </button>
          )}
        </div>

        {/* Text logo */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Text Logo</h2>
          <div className="grid grid-cols-2 gap-4">
            {[['Primary Text (gold)', 'logo_text_primary'], ['Secondary Text (white)', 'logo_text_secondary']].map(([label, name]) => (
              <div key={name}>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
                <input value={form[name] || ''} onChange={set(name)}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer content */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Footer Content</h2>
          {[
            ['Company Tagline', 'company_tagline'],
            ['Copyright Text', 'footer_copyright'],
            ['Footer Locations', 'footer_locations'],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
              <input value={form[name as string] || ''} onChange={set(name as string)}
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
            </div>
          ))}
        </div>

        {/* Developer credit */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-1">Developer Credit</h2>
          <p className="text-xs text-gray-500 mb-4">Shown in the footer as "Developed by [name]"</p>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Developer Name</label>
          <input
            value={form.developer_name || ''}
            onChange={set('developer_name')}
            placeholder="e.g. John Doe"
            className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm"
          />
        </div>

      </div>
    </div>
  )
}
