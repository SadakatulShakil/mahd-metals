import { useEffect, useState, useRef } from 'react'
import { getMaterials, createMaterial, updateMaterial, deleteMaterial, uploadMaterialImage } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, X, Save } from 'lucide-react'

const empty = { slug: '', name: '', category: 'Non-Ferrous', description: '', seo_title: '', seo_description: '', image_url: '', is_active: true }

export default function MaterialsEditor() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => getMaterials().then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      if (editing.id) await updateMaterial(editing.id, editing)
      else await createMaterial(editing)
      toast.success(editing.id ? 'Material updated!' : 'Material created!')
      setEditing(null); load()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this material?')) return
    await deleteMaterial(id); toast.success('Deleted'); load()
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !editing?.id) return
    setUploading(true)
    try {
      const res = await uploadMaterialImage(editing.id, file)
      setEditing((m: any) => ({ ...m, image_url: res.data.url }))
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const set = (name: string) => (e: any) => setEditing((m: any) => ({ ...m, [name]: e.target.value }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Materials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your metals portfolio</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
          <Plus size={15} /> Add Material
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {items.map(item => (
          <div key={item.id} className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
            {item.image_url
              ? <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0" />
              : <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/10 shrink-0 flex items-center justify-center text-gray-600 text-xs">No img</div>
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-bold text-sm">{item.name}</span>
                <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">{item.category}</span>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(item)} className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'Edit Material' : 'Add Material'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image */}
              {editing.id && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Material Image</label>
                  {editing.image_url && <img src={editing.image_url} alt="" className="w-full h-36 object-cover rounded-xl mb-3 border border-white/10" />}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 px-4 py-2 rounded-xl text-sm transition-all">
                    <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {[['Name', 'name'], ['Slug', 'slug']].map(([label, name]) => (
                  <div key={name}>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
                    <input value={editing[name] || ''} onChange={set(name)}
                      className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Category</label>
                <select value={editing.category || ''} onChange={set('category')}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm">
                  {['Ferrous', 'Non-Ferrous', 'Specialty', 'Mixed'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Description</label>
                <textarea rows={3} value={editing.description || ''} onChange={set('description')}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">SEO Title</label>
                <input value={editing.seo_title || ''} onChange={set('seo_title')}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">SEO Description</label>
                <textarea rows={2} value={editing.seo_description || ''} onChange={set('seo_description')}
                  className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-sm transition-all">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
