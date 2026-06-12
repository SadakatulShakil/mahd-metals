import { useEffect, useState } from 'react'
import { getContactInfo, updateContactInfo } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function ContactInfoEditor() {
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { getContactInfo().then(r => { setForm(r.data); setLoading(false) }) }, [])

  const save = async () => {
    setSaving(true)
    try { await updateContactInfo(form); toast.success('Contact info saved!') }
    catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const set = (name: string) => (e: any) => setForm((f: any) => ({ ...f, [name]: e.target.value }))

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  const fields = [
    ['Phone', 'phone'], ['WhatsApp Number', 'whatsapp'],
    ['Alternative Phone Label', 'phone_alternative_label'], ['Alternative Phone Number', 'phone_alternative'],
    ['Email', 'email'], ['Address Line 1', 'address_line1'],
    ['Address Line 2', 'address_line2'], ['City', 'city'],
    ['Postal Code', 'postal_code'], ['Country', 'country'],
  ]

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Contact Info</h1>
          <p className="text-gray-500 text-sm mt-1">Update phone, email, address and WhatsApp</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          {fields.map(([label, name]) => (
            <div key={name}>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
              <input value={form[name] || ''} onChange={set(name)}
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
