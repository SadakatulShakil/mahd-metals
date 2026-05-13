import { useEffect, useState } from 'react'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

const empty = { quote: '', author_name: '', author_title: '', author_location: '', is_active: true, sort_order: 0 }

export default function TestimonialsEditor() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const load = () => getTestimonials().then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      if (editing.id) await updateTestimonial(editing.id, editing)
      else await createTestimonial(editing)
      toast.success('Saved!'); setEditing(null); load()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete?')) return
    await deleteTestimonial(id); toast.success('Deleted'); load()
  }

  const set = (name: string) => (e: any) => setEditing((t: any) => ({ ...t, [name]: e.target.value }))

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage client testimonials</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-5 py-2.5 rounded-xl text-sm">
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-300 text-sm italic mb-2">"{item.quote}"</p>
              <div className="text-amber-400 text-xs font-semibold">{item.author_name}</div>
              <div className="text-gray-500 text-xs">{item.author_title} · {item.author_location}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(item)} className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"><Pencil size={14} /></button>
              <button onClick={() => remove(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[['Quote', 'quote', true], ['Author Name', 'author_name', false], ['Author Title', 'author_title', false], ['Location', 'author_location', false]].map(([label, name, ta]) => (
                <div key={name as string}>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label as string}</label>
                  {ta
                    ? <textarea rows={3} value={editing[name as string] || ''} onChange={set(name as string)}
                        className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none" />
                    : <input value={editing[name as string] || ''} onChange={set(name as string)}
                        className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
                  }
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 border border-white/10 text-gray-400 rounded-xl text-sm">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm">
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
