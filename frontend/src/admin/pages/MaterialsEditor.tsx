import { useEffect, useState, useRef } from 'react'
import { getMaterials, createMaterial, updateMaterial, deleteMaterial, uploadMaterialImage } from '../lib/adminApi'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, X, Save, ExternalLink } from 'lucide-react'

const CATEGORIES = ['Ferrous', 'Non-Ferrous', 'Specialty', 'Mixed']

const empty = () => ({
  slug: '', name: '', category: 'Non-Ferrous', description: '',
  seo_title: '', seo_description: '', image_url: '', is_active: true,
  full_description: '', specifications: '', applications: '',
  origin_countries: '', min_order: '', packaging: '',
  meta_title: '', meta_description: '',
})

function makeSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
}

export default function MaterialsEditor() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [slugLocked, setSlugLocked] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => getMaterials().then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(empty()); setSlugLocked(false) }
  const openEdit = (item: any) => { setEditing({ ...item }); setSlugLocked(true) }

  const handleNameChange = (val: string) => {
    setEditing((m: any) => ({
      ...m,
      name: val,
      slug: slugLocked ? m.slug : makeSlug(val),
    }))
  }

  const save = async () => {
    setSaving(true)
    try {
      if (editing.id) await updateMaterial(editing.id, editing)
      else await createMaterial(editing)
      toast.success(editing.id ? 'Material updated!' : 'Material created!')
      setEditing(null)
      load()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this material?')) return
    await deleteMaterial(id)
    toast.success('Deleted')
    load()
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editing?.id) return
    setUploading(true)
    try {
      const res = await uploadMaterialImage(editing.id, file)
      setEditing((m: any) => ({ ...m, image_url: res.data.url }))
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const set = (name: string) => (e: any) => setEditing((m: any) => ({ ...m, [name]: e.target.value }))

  const inputCls = 'w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none text-sm'
  const labelCls = 'block text-xs text-gray-400 mb-2 uppercase tracking-wider'

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Materials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your metals portfolio</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
          <Plus size={15} /> Add Material
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {items.map(item => (
          <div key={item.id} className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
            {item.image_url
              ? <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0" />
              : <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/10 shrink-0 flex items-center justify-center text-gray-600 text-xs">No img</div>
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-bold text-sm">{item.name}</span>
                <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">{item.category}</span>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2 mb-2">{item.description}</p>
              {item.slug && (
                <a href={`/materials/${item.slug}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  <ExternalLink size={10} /> View on site
                </a>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative ml-auto w-full max-w-2xl bg-[#080d1a] h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'Edit Material' : 'New Material'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">

              {/* Image upload */}
              {editing.id && (
                <div>
                  <label className={labelCls}>Cover Image</label>
                  {editing.image_url && (
                    <img src={editing.image_url} alt="" className="w-full h-36 object-cover rounded-xl mb-3 border border-white/10" />
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 border border-white/10 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 px-4 py-2 rounded-xl text-sm transition-all">
                    <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              )}

              {/* Basic info */}
              <div className="space-y-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Basic Info</p>
                <div>
                  <label className={labelCls}>Name *</label>
                  <input value={editing.name || ''} onChange={e => handleNameChange(e.target.value)} className={inputCls} placeholder="e.g. Copper Wire" />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <div className="flex gap-2">
                    <input value={editing.slug || ''} onChange={e => { setSlugLocked(true); set('slug')(e) }} className={inputCls} placeholder="auto-generated from name" />
                    <button onClick={() => { setSlugLocked(false); setEditing((m: any) => ({ ...m, slug: makeSlug(m.name || '') })) }}
                      className="px-3 py-2 text-xs text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-500/10 transition-colors whitespace-nowrap">
                      Auto
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={editing.category || ''} onChange={set('category')} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Short Description</label>
                  <textarea rows={3} value={editing.description || ''} onChange={set('description')} className={`${inputCls} resize-none`} placeholder="Brief description shown on cards" />
                </div>
              </div>

              {/* Rich content */}
              <div className="space-y-4 border-t border-white/5 pt-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Rich Content</p>
                <div>
                  <label className={labelCls}>Full Description</label>
                  <textarea rows={6} value={editing.full_description || ''} onChange={set('full_description')} className={`${inputCls} resize-none`}
                    placeholder="Detailed description shown on the material detail page" />
                </div>
              </div>

              {/* Trading details */}
              <div className="space-y-4 border-t border-white/5 pt-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Trading Details</p>
                <div>
                  <label className={labelCls}>Applications (comma separated)</label>
                  <input value={editing.applications || ''} onChange={set('applications')} className={inputCls}
                    placeholder="Electrical wiring, Construction, Automotive" />
                </div>
                <div>
                  <label className={labelCls}>Origin Countries</label>
                  <input value={editing.origin_countries || ''} onChange={set('origin_countries')} className={inputCls}
                    placeholder="Saudi Arabia, UAE, Kuwait, Global" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Minimum Order</label>
                    <input value={editing.min_order || ''} onChange={set('min_order')} className={inputCls} placeholder="20 MT per container" />
                  </div>
                  <div>
                    <label className={labelCls}>Packaging</label>
                    <input value={editing.packaging || ''} onChange={set('packaging')} className={inputCls} placeholder="Baled or loose" />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4 border-t border-white/5 pt-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Technical Specifications</p>
                <div>
                  <label className={labelCls}>Specifications (JSON)</label>
                  <textarea rows={5} value={editing.specifications || ''} onChange={set('specifications')} className={`${inputCls} resize-none font-mono text-xs`}
                    placeholder={'[{"key":"Grade","value":"#1, #2"},{"key":"Form","value":"Wire"}]'} />
                  <p className="text-gray-600 text-xs mt-1">Array of {"{"}"key", "value"{"}"} objects</p>
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-4 border-t border-white/5 pt-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">SEO</p>
                <div>
                  <label className={labelCls}>SEO Title (legacy)</label>
                  <input value={editing.seo_title || ''} onChange={set('seo_title')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>SEO Description (legacy)</label>
                  <textarea rows={2} value={editing.seo_description || ''} onChange={set('seo_description')} className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Meta Title</label>
                  <input value={editing.meta_title || ''} onChange={set('meta_title')} className={inputCls} placeholder="Copper Scrap | Saddam Scarp and Metal" />
                </div>
                <div>
                  <label className={labelCls}>Meta Description</label>
                  <textarea rows={2} value={editing.meta_description || ''} onChange={set('meta_description')} className={`${inputCls} resize-none`}
                    placeholder="High-grade copper scrap sourced globally…" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-sm transition-all">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
                <Save size={14} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
