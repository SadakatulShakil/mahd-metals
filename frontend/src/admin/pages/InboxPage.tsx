import { useEffect, useState } from 'react'
import { getSubmissions, markRead } from '../lib/adminApi'
import { Mail, MailOpen } from 'lucide-react'

export default function InboxPage() {
  const [items, setItems] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)

  const load = () => getSubmissions().then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const open = async (item: any) => {
    setSelected(item)
    if (!item.is_read) {
      await markRead(item.id)
      load()
    }
  }

  const unread = items.filter(i => !i.is_read).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Inbox</h1>
        <p className="text-gray-500 text-sm mt-1">{unread} unread of {items.length} total inquiries</p>
      </div>

      <div className="grid grid-cols-2 gap-6 h-[70vh]">
        {/* List */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-y-auto">
          {items.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">No submissions yet</div>
          )}
          {items.map(item => (
            <button key={item.id} onClick={() => open(item)}
              className={`w-full text-left p-5 border-b border-white/5 hover:bg-white/3 transition-all ${selected?.id === item.id ? 'bg-amber-500/5 border-l-2 border-l-amber-500' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${item.is_read ? 'text-gray-600' : 'text-amber-400'}`}>
                  {item.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-semibold text-sm truncate ${item.is_read ? 'text-gray-400' : 'text-white'}`}>{item.name}</span>
                    <span className="text-gray-600 text-xs shrink-0">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-500 text-xs truncate">{item.subject}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">Select a message to read</div>
          ) : (
            <div>
              <div className="mb-6 pb-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white mb-1">{selected.subject}</h2>
                <div className="text-amber-400 text-sm font-medium">{selected.name}</div>
                <a href={`mailto:${selected.email}`} className="text-gray-500 text-sm hover:text-amber-400 transition-colors">{selected.email}</a>
                <div className="text-gray-600 text-xs mt-1">{new Date(selected.created_at).toLocaleString()}</div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message || 'No message body.'}</p>
              <div className="mt-6">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#020617] font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
