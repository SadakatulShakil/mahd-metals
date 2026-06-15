import { useEffect, useState } from 'react'
import { adminApi } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
  order: number
  is_active: boolean
}

const emptyFAQ = (): Omit<FAQItem, 'id'> => ({
  question: '',
  answer: '',
  order: 0,
  is_active: true,
})

export default function FAQEditor() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [editing, setEditing] = useState<Partial<FAQItem> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () => adminApi.get('/api/admin/faqs').then(r => setFaqs(r.data)).catch(() => {})

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(emptyFAQ()); setIsNew(true) }
  const openEdit = (f: FAQItem) => { setEditing({ ...f }); setIsNew(false) }
  const close = () => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!editing?.question?.trim()) { toast.error('Question is required'); return }
    if (!editing?.answer?.trim()) { toast.error('Answer is required'); return }
    setSaving(true)
    try {
      if (isNew) {
        await adminApi.post('/api/admin/faqs', editing)
        toast.success('FAQ created')
      } else {
        await adminApi.put(`/api/admin/faqs/${(editing as FAQItem).id}`, editing)
        toast.success('FAQ updated')
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
    if (!confirm('Delete this FAQ?')) return
    try {
      await adminApi.delete(`/api/admin/faqs/${id}`)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">FAQ</h1>
          <p className="text-gray-400 text-sm mt-0.5">{faqs.length} question{faqs.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={15} /> New FAQ
        </button>
      </div>

      <div className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden">
        {faqs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No FAQs yet. Add your first question!</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium w-8">#</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Question</th>
                <th className="px-6 py-4 text-gray-400 font-medium hidden md:table-cell">Status</th>
                <th className="px-6 py-4 text-gray-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map(f => (
                <tr key={f.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-gray-500">{f.order}</td>
                  <td className="px-6 py-4 text-white font-medium max-w-sm truncate">{f.question}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      f.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {f.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(f)} className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => del(f.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative ml-auto w-full max-w-xl bg-[#080d1a] h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <h2 className="text-lg font-bold text-white">{isNew ? 'New FAQ' : 'Edit FAQ'}</h2>
              <button onClick={close} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
            </div>

            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Question *</label>
                <input
                  value={editing.question || ''}
                  onChange={e => setEditing(p => ({ ...p!, question: e.target.value }))}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm"
                  placeholder="What is your question?"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Answer *</label>
                <textarea
                  value={editing.answer || ''}
                  onChange={e => setEditing(p => ({ ...p!, answer: e.target.value }))}
                  rows={6}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none"
                  placeholder="Write the full answer here..."
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Order</label>
                <input
                  type="number"
                  value={editing.order ?? 0}
                  onChange={e => setEditing(p => ({ ...p!, order: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm"
                />
              </div>

              <div className="flex items-center justify-between bg-[#1a2235] border border-white/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-white text-sm font-medium">Active</p>
                  <p className="text-gray-500 text-xs">{editing.is_active ? 'Visible on site' : 'Hidden from public'}</p>
                </div>
                <button
                  onClick={() => setEditing(p => ({ ...p!, is_active: !p!.is_active }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editing.is_active ? 'bg-amber-500' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${editing.is_active ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex gap-3 flex-shrink-0">
              <button onClick={close} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-2.5 rounded-xl text-sm transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold py-2.5 rounded-xl text-sm transition-colors">
                {saving ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
