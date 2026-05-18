import { useEffect, useState } from 'react'
import { adminApi } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Plus, Trash2, Save, GripVertical, EyeOff, Eye } from 'lucide-react'

interface Bullet {
  id?: number
  text: string
  order: number
  is_active: boolean
}

export default function AboutBulletsEditor() {
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [loading, setLoading] = useState(true)
  const [newText, setNewText] = useState('')
  const [adding, setAdding]   = useState(false)

  const load = () =>
    adminApi.get('/api/admin/about-bullets/all')
      .then(r => { setBullets(r.data); setLoading(false) })
      .catch(() => setLoading(false))

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!newText.trim()) return
    setAdding(true)
    try {
      await adminApi.post('/api/admin/about-bullets', {
        text: newText.trim(),
        order: bullets.length,
        is_active: true,
      })
      setNewText('')
      toast.success('Bullet added!')
      load()
    } catch { toast.error('Failed to add') }
    finally { setAdding(false) }
  }

  const update = async (b: Bullet) => {
    try {
      await adminApi.put(`/api/admin/about-bullets/${b.id}`, b)
      toast.success('Saved!')
    } catch { toast.error('Save failed') }
  }

  const remove = async (id: number) => {
    try {
      await adminApi.delete(`/api/admin/about-bullets/${id}`)
      setBullets(prev => prev.filter(b => b.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  const toggle = async (b: Bullet) => {
    const updated = { ...b, is_active: !b.is_active }
    setBullets(prev => prev.map(x => x.id === b.id ? updated : x))
    await update(updated)
  }

  const setText = (id: number, text: string) =>
    setBullets(prev => prev.map(b => b.id === id ? { ...b, text } : b))

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">About Bullet Points</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the capability list shown in the About section</p>
      </div>

      <div className="space-y-3 mb-6">
        {bullets.map((b, i) => (
          <div key={b.id}
            className={`flex items-center gap-3 bg-[#0d1424] border rounded-xl px-4 py-3 transition-all ${
              b.is_active ? 'border-white/5' : 'border-white/5 opacity-50'
            }`}>
            <GripVertical size={14} className="text-gray-600 shrink-0" />
            <span className="text-gray-500 text-xs w-5 shrink-0">{i + 1}.</span>
            <input
              value={b.text}
              onChange={e => setText(b.id!, e.target.value)}
              onBlur={() => update(b)}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
            />
            <button onClick={() => toggle(b)}
              className="text-gray-500 hover:text-amber-400 transition-colors p-1 shrink-0"
              title={b.is_active ? 'Hide' : 'Show'}>
              {b.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button onClick={() => remove(b.id!)}
              className="text-gray-500 hover:text-red-400 transition-colors p-1 shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="bg-[#0d1424] border border-white/5 rounded-xl p-4">
        <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Add Bullet Point</label>
        <div className="flex gap-3">
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="e.g. End-to-end logistics management"
            className="flex-1 bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
          />
          <button onClick={add} disabled={adding || !newText.trim()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-[#020617] font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
            <Plus size={15} /> {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
