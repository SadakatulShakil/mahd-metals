import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
}

const QA: { keywords: string[]; response: string }[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'salam', 'assalam'],
    response: "Hello! Welcome to Saddam Scrap and Metal. I'm here to help you with any questions about our metal trading services. What can I help you with today?",
  },
  {
    keywords: ['about', 'company', 'who are you', 'what is saddam', 'tell me about', 'your company', 'founded', 'history', 'background'],
    response: "Saddam Scrap and Metal is a global scrap and alloy metal trading company founded in 2015 by Mohammad Saddam Al Bahar and his brothers. Based in Jeddah, Saudi Arabia, we serve 10+ countries worldwide with end-to-end metal trading and logistics solutions.",
  },
  {
    keywords: ['material', 'metal', 'what do you sell', 'what do you trade', 'products', 'what metals', 'trade'],
    response: "We trade a wide range of metals including: Ferrous Metals (steel, iron, HMS), Non-Ferrous Metals (copper, aluminum, brass), Stainless Steel (304, 316, 430 grades), Specialty Alloys and Ferroalloys, Mixed Metals, Copper Wire and Scrap. Would you like to know more about any specific metal?",
  },
  {
    keywords: ['ferrous', 'steel', 'iron', 'hms', 'heavy melting', 'cast iron', 'carbon steel'],
    response: "We trade all major ferrous metals including Heavy Melting Steel (HMS 1&2), Cast Iron, Carbon Steel scrap, and structural steel. These are sourced from industrial yards, demolition projects, and manufacturing facilities globally.",
  },
  {
    keywords: ['non-ferrous', 'nonferrous', 'aluminum', 'aluminium', 'brass', 'zinc', 'lead', 'tin'],
    response: "Our non-ferrous metals include aluminum, brass, zinc, lead, and tin scrap. We source high-quality non-ferrous materials from industrial facilities and demolition projects worldwide.",
  },
  {
    keywords: ['copper', 'copper wire', 'copper scrap', 'bare bright', 'berry copper'],
    response: "We trade high-grade copper including Bare Bright Copper, #1 Copper, #2 Copper, Copper Wire, and Copper Tubing. Copper is one of our most in-demand materials with consistent global buyer interest.",
  },
  {
    keywords: ['stainless', 'stainless steel', '304', '316', '430', 'inox'],
    response: "We handle 304, 316, and 430 grade stainless steel scrap. Our stainless steel is carefully segregated and tested for alloy composition to meet precise buyer specifications.",
  },
  {
    keywords: ['alloy', 'ferroalloy', 'specialty', 'nickel', 'titanium', 'cobalt', 'tungsten', 'molybdenum'],
    response: "We specialize in ferroalloys and specialty metals including Nickel, Titanium, Cobalt, Tungsten, and Molybdenum scrap sourced from aerospace, defense, and industrial manufacturing sectors.",
  },
  {
    keywords: ['mixed', 'mixed metals', 'zorba', 'zurik', 'shredded'],
    response: "We handle processed and unprocessed mixed metal streams including Zorba, Zurik, and mixed non-ferrous streams from industrial yards suitable for downstream processing and smelting.",
  },
  {
    keywords: ['price', 'pricing', 'cost', 'rate', 'how much', 'quote', 'rates', 'per ton', 'per kg', 'value'],
    response: "Metal prices vary daily based on LME market rates, quality, quantity, and origin. For an accurate quote contact us: Phone +966 54 666 2697, Email info@saddamscarpandmetal.com, or use our Contact form and we will respond within 24 hours.",
  },
  {
    keywords: ['get quote', 'request quote', 'quotation', 'offer', 'bid', 'inquiry', 'enquiry'],
    response: "To get a quote: 1. Fill our Contact Form on the Contact page 2. Call/WhatsApp +966 54 666 2697 3. Email info@saddamscarpandmetal.com. Please include material type, quantity in MT, origin country, and port of loading for fastest response.",
  },
  {
    keywords: ['contact', 'reach', 'phone', 'call', 'email', 'whatsapp', 'address', 'location', 'where are you', 'office'],
    response: "You can reach us: Phone/WhatsApp +966 54 666 2697, Email info@saddamscarpandmetal.com, Address 3469 Al Sarawat District, Al Khomra Area, Jeddah 22525-7891, Saudi Arabia. Available Saturday to Thursday 8AM–6PM AST.",
  },
  {
    keywords: ['jeddah', 'saudi arabia', 'ksa', 'kingdom', 'where', 'based', 'headquarters', 'gulf', 'middle east'],
    response: "We are headquartered in Jeddah, Saudi Arabia. We operate across the Gulf region and internationally serving clients in 10+ countries across the Middle East, Asia, Europe, and Africa.",
  },
  {
    keywords: ['shipping', 'logistics', 'delivery', 'transport', 'freight', 'container', 'export', 'import', 'port', 'loading'],
    response: "We offer end-to-end logistics including container loading and export documentation, port coordination at Jeddah Islamic Port and global ports, freight forwarding, and export compliance. We handle both FCL and bulk shipments.",
  },
  {
    keywords: ['minimum', 'min order', 'minimum order', 'minimum quantity', 'how much minimum', 'small order', 'ton', 'mt'],
    response: "Minimum order quantities vary by material. Generally we deal in container loads of 20–25 MT and above. For smaller quantities contact us directly to discuss your requirements.",
  },
  {
    keywords: ['quality', 'grade', 'specification', 'test', 'inspection', 'certificate', 'standard', 'iso'],
    response: "We ensure quality through pre-shipment inspection by certified inspectors, material segregation and testing, detailed specification sheets, and SGS third-party inspection available on request.",
  },
  {
    keywords: ['payment', 'pay', 'lc', 'letter of credit', 'tt', 'wire transfer', 'bank', 'terms', 'payment terms'],
    response: "We work with standard international trade payment terms including Letter of Credit (LC) at sight, Telegraphic Transfer (TT), and Documents Against Payment (DP). Terms are negotiated based on relationship and order volume.",
  },
  {
    keywords: ['countries', 'where do you ship', 'which country', 'export to', 'serve', 'global', 'international', 'worldwide'],
    response: "We serve clients in 10+ countries including Saudi Arabia, Kuwait, UAE, Bahrain, Qatar, Oman, India, Pakistan, Bangladesh, Turkey, and other markets. We are continuously expanding our global network.",
  },
  {
    keywords: ['sell', 'selling', 'i want to sell', 'buy my scrap', 'we have scrap', 'selling scrap', 'supplier'],
    response: "We buy scrap metals! If you have scrap to sell please contact us with material type, estimated quantity, location/origin, and photos if available. Contact +966 54 666 2697 or info@saddamscrapandmetal.com",
  },
  {
    keywords: ['buy', 'buying', 'purchase', 'i want to buy', 'looking to buy', 'sourcing', 'need metal', 'require'],
    response: "We can supply a wide range of scrap and alloy metals globally. Tell us the material type and grade, required quantity in MT, destination port, and required timeline. Contact us for a competitive offer.",
  },
  {
    keywords: ['experience', 'years', 'how long', 'since when', 'established', 'old', 'reliable', 'trusted'],
    response: "Saddam Scrap and Metal has been operating since 2015 — over 10 years in the metal trading industry. Our founders bring decades of combined experience from construction, banking, and international trade sectors.",
  },
  {
    keywords: ['partner', 'partnership', 'agent', 'representative', 'collaborate', 'business', 'joint venture', 'dealer'],
    response: "We welcome business partnerships. Whether you are a scrap yard, metal processor, broker, or end-buyer we are open to long-term trading relationships. Contact info@saddamscrapandmetal.com to discuss.",
  },
  {
    keywords: ['environment', 'green', 'sustainability', 'recycle', 'recycling', 'eco', 'carbon', 'footprint'],
    response: "Metal recycling is at the heart of what we do. By trading scrap metals we contribute to global recycling efforts, reducing mining needs, lowering carbon emissions, and supporting the circular economy.",
  },
  {
    keywords: ['hours', 'working hours', 'open', 'available', 'when', 'time', 'office hours', 'business hours'],
    response: "Our office hours are Saturday to Thursday, 8:00 AM to 6:00 PM Arabia Standard Time. For urgent inquiries WhatsApp us at +966 54 666 2697.",
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'appreciated', 'great', 'helpful', 'perfect', 'awesome', 'good'],
    response: "You're welcome! It's our pleasure to help. If you have more questions feel free to ask anytime. You can also reach us directly at +966 54 666 2697.",
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'take care', 'ok thanks', 'that is all'],
    response: "Thank you for chatting with Saddam Scrap and Metal. Don't hesitate to reach out if you need anything. Have a great day!",
  },
]

const DEFAULT_RESPONSE = "I'm not sure I understood that. I can help with information about our metals, pricing, shipping, contact details, or how to get a quote. Try asking: What metals do you trade? How do I get a quote? How can I contact you?"

const QUICK_CHIPS = [
  'What metals do you trade?',
  'How to get a quote?',
  'Contact information',
]

function getReply(input: string): string {
  const lower = input.toLowerCase()
  for (const qa of QA) {
    if (qa.keywords.some(kw => lower.includes(kw))) return qa.response
  }
  return DEFAULT_RESPONSE
}

export default function Chatbot() {
  const { pathname } = useLocation()
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]     = useState('')
  const [typing, setTyping]   = useState(false)
  const [nextId, setNextId]   = useState(1)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  if (pathname.startsWith('/admin')) return null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const addMessage = (role: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, { id: nextId, role, text }])
    setNextId(n => n + 1)
  }

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setInput('')
    addMessage('user', trimmed)
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      addMessage('bot', getReply(trimmed))
    }, 600)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') send(input)
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className={`
          fixed z-50 bg-[#0d1424] border border-white/10 shadow-2xl shadow-black/60 flex flex-col
          md:bottom-24 md:right-6 md:w-[380px] md:h-[500px] md:rounded-2xl
          bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl
          animate-slide-up
        `}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
            <div>
              <div className="text-white font-bold text-sm">Saddam Scrap &amp; Metal</div>
              <div className="text-gray-400 text-xs mt-0.5">Ask us anything</div>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Quick chips shown before any conversation */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-gray-400 text-xs text-center">Hi! How can we help you today?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_CHIPS.map(chip => (
                    <button key={chip} onClick={() => send(chip)}
                      className="text-xs bg-white/5 border border-white/10 hover:border-amber-500/40 hover:text-amber-400 text-gray-300 px-3 py-1.5 rounded-full transition-all">
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-[#020617] font-medium rounded-2xl rounded-br-sm'
                    : 'bg-[#1a2235] text-white rounded-2xl rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-[#1a2235] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              className="flex-1 bg-[#1a2235] border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600"
            />
            <button onClick={() => send(input)} disabled={!input.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-[#020617] p-2.5 rounded-xl transition-all shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed z-50 md:bottom-6 md:right-6 bottom-5 right-5 md:w-14 md:h-14 w-13 h-13 bg-amber-500 hover:bg-amber-400 text-white rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Open chat">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  )
}
