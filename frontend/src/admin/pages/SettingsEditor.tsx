import { useEffect, useState } from 'react'
import { getSiteSettings, updateSiteSettings } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function SettingsEditor() {
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { getSiteSettings().then(r => { setForm(r.data); setLoading(false) }) }, [])

  const save = async () => {
    setSaving(true)
    try { await updateSiteSettings(form); toast.success('Settings saved!') }
    catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const set = (name: string) => (e: any) => setForm((f: any) => ({ ...f, [name]: e.target.value }))

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Company name, SEO meta tags, footer text</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 space-y-5">
        {[
          ['Company Name', 'company_name', false],
          ['Tagline', 'tagline', false],
          ['Footer Text', 'footer_text', false],
          ['Meta Title (SEO)', 'meta_title', false],
          ['Meta Description (SEO)', 'meta_description', true],
        ].map(([label, name, ta]) => (
          <div key={name as string}>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label as string}</label>
            {ta
              ? <textarea rows={3} value={form[name as string] || ''} onChange={set(name as string)}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm resize-none" />
              : <input value={form[name as string] || ''} onChange={set(name as string)}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm" />
            }
          </div>
        ))}
      </div>
    </div>
  )
}
