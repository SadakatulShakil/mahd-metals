import { useEffect, useState } from 'react'
import { getStats, updateStats } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

const fields = [
  { label: 'Annual Tonnage', value: 'annual_tonnage', sub: 'annual_tonnage_sub' },
  { label: 'Countries Served', value: 'countries_served', sub: 'countries_served_sub' },
  { label: 'Years in Industry', value: 'years_in_industry', sub: 'years_in_industry_sub' },
  { label: 'Global Partners', value: 'global_partners', sub: 'global_partners_sub' },
]

export default function StatsEditor() {
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { getStats().then(r => { setForm(r.data); setLoading(false) }) }, [])

  const save = async () => {
    setSaving(true)
    try { await updateStats(form); toast.success('Stats saved!') }
    catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const set = (name: string) => (e: any) => setForm((f: any) => ({ ...f, [name]: e.target.value }))

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Statistics</h1>
          <p className="text-gray-500 text-sm mt-1">Update the impact numbers shown on the homepage</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.value} className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">{f.label}</h3>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Value</label>
              <input value={form[f.value] || ''} onChange={set(f.value)}
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Sub-label</label>
              <input value={form[f.sub] || ''} onChange={set(f.sub)}
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
