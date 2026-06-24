import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, X, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { fetchContactInfo } from '../lib/api'

const IconWhatsApp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

interface Message { id: number; role: 'user' | 'bot'; text: string }

const QA_EN: { keywords: string[]; response: string }[] = [
  { keywords: ['hi','hello','hey','good morning','good afternoon','good evening','salam','assalam'], response: "Hello! Welcome to Saddam Scrap and Metal. I'm here to help you with any questions about our metal trading services. What can I help you with today?" },
  { keywords: ['about','company','who are you','what is saddam','tell me about','your company','founded','history','background'], response: "Saddam Scrap and Metal is a global scrap and alloy metal trading company based in Jeddah, Saudi Arabia. We serve 10+ countries worldwide with end-to-end metal trading and logistics solutions." },
  { keywords: ['material','metal','what do you sell','what do you trade','products','what metals','trade'], response: "We trade a wide range of metals: Ferrous (steel, iron, HMS), Non-Ferrous (copper, aluminum, brass), Stainless Steel (304, 316, 430), Specialty Alloys and Ferroalloys, Mixed Metals, and Copper Wire. Need details on a specific metal?" },
  { keywords: ['ferrous','steel','iron','hms','heavy melting','cast iron','carbon steel'], response: "We trade all major ferrous metals including Heavy Melting Steel (HMS 1&2), Cast Iron, Carbon Steel scrap, and structural steel sourced from industrial yards and demolition projects globally." },
  { keywords: ['non-ferrous','nonferrous','aluminum','aluminium','brass','zinc','lead','tin'], response: "Our non-ferrous metals include aluminum, brass, zinc, lead, and tin scrap sourced from industrial facilities and demolition projects worldwide." },
  { keywords: ['copper','copper wire','copper scrap','bare bright','berry copper'], response: "We trade high-grade copper including Bare Bright, #1 Copper, #2 Copper, Copper Wire, and Copper Tubing — one of our most in-demand materials." },
  { keywords: ['stainless','stainless steel','304','316','430','inox'], response: "We handle 304, 316, and 430 grade stainless steel scrap, carefully segregated and tested for alloy composition to meet buyer specifications." },
  { keywords: ['alloy','ferroalloy','specialty','nickel','titanium','cobalt','tungsten','molybdenum'], response: "We specialize in ferroalloys and specialty metals including Nickel, Titanium, Cobalt, Tungsten, and Molybdenum sourced from aerospace, defense, and industrial manufacturing sectors." },
  { keywords: ['mixed','mixed metals','zorba','zurik','shredded'], response: "We handle processed and unprocessed mixed metal streams including Zorba, Zurik, and mixed non-ferrous streams suitable for downstream processing." },
  { keywords: ['price','pricing','cost','rate','how much','quote','rates','per ton','per kg','value'], response: "Metal prices vary daily based on LME rates, quality, quantity, and origin. Contact us: +966 54 666 2697 or info@saddamscarpandmetal.com for an accurate quote." },
  { keywords: ['get quote','request quote','quotation','offer','bid','inquiry','enquiry'], response: "To get a quote: 1) Fill our Contact Form 2) Call/WhatsApp +966 54 666 2697 3) Email info@saddamscarpandmetal.com — include material type, quantity in MT, origin country, and port of loading." },
  { keywords: ['contact','reach','phone','call','email','whatsapp','address','location','where are you','office'], response: "Phone/WhatsApp: +966 54 666 2697 | Email: info@saddamscarpandmetal.com | Address: 3469 Al Sarawat District, Al Khomra Area, Jeddah, Saudi Arabia. Available Sat–Thu 8AM–6PM AST." },
  { keywords: ['jeddah','saudi arabia','ksa','kingdom','where','based','headquarters','gulf','middle east'], response: "We are headquartered in Jeddah, Saudi Arabia, operating across the Gulf and internationally serving 10+ countries in the Middle East, Asia, Europe, and Africa." },
  { keywords: ['shipping','logistics','delivery','transport','freight','container','export','import','port','loading'], response: "We offer end-to-end logistics: container loading, export documentation, port coordination, freight forwarding, and export compliance for FCL and bulk shipments." },
  { keywords: ['minimum','min order','minimum order','minimum quantity','ton','mt'], response: "Minimum orders vary by material. Generally we deal in container loads of 20–25 MT and above. Contact us for smaller quantities." },
  { keywords: ['quality','grade','specification','test','inspection','certificate','standard','iso'], response: "Quality assurance includes pre-shipment inspection by certified inspectors, material segregation and testing, detailed specification sheets, and SGS third-party inspection available on request." },
  { keywords: ['payment','pay','lc','letter of credit','tt','wire transfer','bank','terms'], response: "We work with standard trade payment terms: Letter of Credit (LC) at sight, Telegraphic Transfer (TT), and Documents Against Payment (DP). Terms negotiated by relationship and volume." },
  { keywords: ['countries','where do you ship','which country','export to','serve','global','international','worldwide'], response: "We serve 10+ countries: Saudi Arabia, Kuwait, UAE, Bahrain, Qatar, Oman, India, Pakistan, Bangladesh, Turkey, and expanding." },
  { keywords: ['sell','selling','i want to sell','buy my scrap','we have scrap','selling scrap','supplier'], response: "We buy scrap metals! Share material type, estimated quantity, location, and photos if available. Contact +966 54 666 2697 or info@saddamscarpandmetal.com." },
  { keywords: ['buy','buying','purchase','i want to buy','looking to buy','sourcing','need metal','require'], response: "We supply a wide range of scrap and alloy metals globally. Tell us the material, grade, quantity in MT, destination port, and timeline for a competitive offer." },
  { keywords: ['experience','years','how long','since when','established','reliable','trusted'], response: "Saddam Scrap and Metal has been operating since 2015. Our founders bring decades of combined experience from construction, banking, and international trade." },
  { keywords: ['partner','partnership','agent','representative','collaborate','business','dealer'], response: "We welcome business partnerships — scrap yards, metal processors, brokers, or end-buyers. Contact info@saddamscrapandmetal.com to discuss." },
  { keywords: ['environment','green','sustainability','recycle','recycling','eco','carbon'], response: "Metal recycling is at the heart of what we do — reducing mining needs, lowering carbon emissions, and supporting the circular economy." },
  { keywords: ['hours','working hours','open','available','when','time','office hours'], response: "Our office hours are Saturday to Thursday, 8:00 AM to 6:00 PM Arabia Standard Time. For urgent inquiries WhatsApp us at +966 54 666 2697." },
  { keywords: ['thank','thanks','thank you','appreciated','great','helpful','perfect','awesome'], response: "You're welcome! Feel free to ask anything. You can also reach us directly at +966 54 666 2697." },
  { keywords: ['bye','goodbye','see you','later','take care','ok thanks','that is all'], response: "Thank you for chatting with Saddam Scrap and Metal. Don't hesitate to reach out anytime. Have a great day!" },
]

const QA_AR: { keywords: string[]; response: string }[] = [
  { keywords: ['مرحبا','مرحباً','أهلاً','أهلا','السلام','هاي','صباح','مساء'], response: "مرحباً بك في صدام للخردة والمعادن! أنا هنا للإجابة على أي استفسار حول خدمات تداول المعادن. كيف يمكنني مساعدتك اليوم؟" },
  { keywords: ['عن الشركة','من أنتم','ما هي الشركة','تأسيس','تاريخ','خلفية','معلومات'], response: "صدام للخردة والمعادن شركة عالمية لتداول خردة ومعادن السبائك مقرها جدة، المملكة العربية السعودية. نخدم أكثر من ١٠ دول بحلول شاملة لتداول المعادن واللوجستيات." },
  { keywords: ['ما المعادن','ما الخدمات','ما المواد','ماذا تبيعون','ماذا تتداولون','منتجات'], response: "نتداول مجموعة واسعة من المعادن: الحديد (فولاذ، حديد، HMS)، غير الحديدية (نحاس، ألمنيوم، نحاس أصفر)، الفولاذ المقاوم للصدأ (304، 316، 430)، سبائك متخصصة، معادن مختلطة، وأسلاك نحاسية." },
  { keywords: ['حديد','فولاذ','hms','خردة حديدية','حديد مصهور'], response: "نتداول جميع المعادن الحديدية الرئيسية بما فيها HMS 1&2 والحديد الزهر وخردة الفولاذ الكربوني والفولاذ الإنشائي من مواقع صناعية وهدم حول العالم." },
  { keywords: ['غير حديدي','ألمنيوم','نحاس أصفر','خارصين','رصاص','قصدير'], response: "تشمل معادننا غير الحديدية: الألمنيوم والنحاس الأصفر والخارصين والرصاص والقصدير المصدرة من مصانع ومشاريع هدم حول العالم." },
  { keywords: ['نحاس','أسلاك نحاسية','خردة نحاس'], response: "نتداول نحاساً عالي الجودة يشمل النحاس الخام ودرجة #1 و#2 والأسلاك والأنابيب النحاسية — من أكثر موادنا طلباً." },
  { keywords: ['فولاذ مقاوم','ستانلس','304','316','430'], response: "نتعامل مع خردة الفولاذ المقاوم للصدأ درجات 304 و316 و430 مع فحص دقيق للتركيب السبائكي لتلبية مواصفات المشترين." },
  { keywords: ['سبائك','سبيكة','نيكل','تيتانيوم','كوبالت','تنغستن','مولبيدنوم'], response: "نتخصص في السبائك الحديدية والمعادن المتخصصة كالنيكل والتيتانيوم والكوبالت والتنغستن والموليبدينوم من قطاعات الفضاء والدفاع والتصنيع." },
  { keywords: ['معادن مختلطة','زوربا'], response: "نتعامل مع تدفقات المعادن المختلطة المعالجة وغير المعالجة بما فيها Zorba وZurik المناسبة للمعالجة والصهر اللاحق." },
  { keywords: ['سعر','تسعير','تكلفة','كم يكلف','عرض سعر','أسعار','قيمة'], response: "تتغير أسعار المعادن يومياً بحسب أسعار LME والجودة والكمية والمصدر. تواصل معنا: +966 54 666 2697 أو info@saddamscarpandmetal.com للحصول على عرض دقيق." },
  { keywords: ['أريد عرض','طلب عرض','استفسار','عرض سعر'], response: "للحصول على عرض سعر: 1) املأ نموذج التواصل 2) اتصل/واتساب +966 54 666 2697 3) راسلنا على info@saddamscarpandmetal.com مع نوع المادة والكمية بالطن ودولة المصدر وميناء الشحن." },
  { keywords: ['تواصل','اتصال','هاتف','واتساب','بريد','عنوان','موقع','مكتب'], response: "هاتف/واتساب: 966 54 666 2697 | البريد: info@saddamscarpandmetal.com | العنوان: ٣٤٦٩ حي السروات، منطقة الخمرة، جدة ٢٢٥٢٥، المملكة العربية السعودية. متاحون السبت–الخميس ٨ص–٦م." },
  { keywords: ['جدة','السعودية','المملكة','الخليج','الشرق الأوسط','أين','مقر'], response: "مقرنا في جدة، المملكة العربية السعودية، ونعمل في منطقة الخليج ودولياً لخدمة أكثر من ١٠ دول في الشرق الأوسط وآسيا وأوروبا وأفريقيا." },
  { keywords: ['شحن','لوجستيات','توصيل','نقل','شحن بحري','حاوية','تصدير','استيراد','ميناء'], response: "نقدم خدمات لوجستية متكاملة: تحميل الحاويات، وثائق التصدير، تنسيق الموانئ، شحن بحري، وامتثال للتصدير للشحنات FCL والسائبة." },
  { keywords: ['الحد الأدنى','أقل كمية','كمية','طن'], response: "يتفاوت الحد الأدنى للطلب حسب المادة. عموماً نتعامل بحمولات حاويات تبدأ من ٢٠–٢٥ طناً. تواصل معنا لمناقشة كميات أقل." },
  { keywords: ['جودة','درجة','مواصفات','فحص','شهادة','معيار'], response: "نضمن الجودة عبر فحص قبل الشحن من مفتشين معتمدين، وتصنيف واختبار المواد، وصحائف مواصفات تفصيلية، وفحص SGS متاح عند الطلب." },
  { keywords: ['دفع','سداد','اعتماد مستندي','تحويل','بنك','شروط دفع'], response: "نعمل بشروط التجارة الدولية المعيارية: اعتماد مستندي (LC) عند الاطلاع، تحويل بنكي (TT)، ومستندات مقابل الدفع (DP). تُفاوَض الشروط بحسب العلاقة والحجم." },
  { keywords: ['دول','إلى أين تشحنون','أي دولة','تصدير إلى','نخدم','عالمي','دولي'], response: "نخدم أكثر من ١٠ دول: المملكة العربية السعودية، الكويت، الإمارات، البحرين، قطر، عُمان، الهند، باكستان، بنغلاديش، تركيا، ونتوسع باستمرار." },
  { keywords: ['أريد البيع','لدي خردة','خردة للبيع','مورد'], response: "نشتري الخردة المعدنية! أرسل لنا نوع المادة والكمية التقريبية والموقع والصور إن وُجدت. تواصل: +966 54 666 2697 أو info@saddamscarpandmetal.com." },
  { keywords: ['أريد الشراء','شراء','توريد','أحتاج معادن'], response: "نوفر مجموعة واسعة من الخردة والمعادن السبائكية. أخبرنا بنوع المادة والكمية بالطن وميناء الوجهة والجدول الزمني للحصول على عرض تنافسي." },
  { keywords: ['خبرة','سنوات','منذ متى','موثوق','جدير'], response: "صدام للخردة والمعادن تعمل منذ ٢٠١٥. مؤسسونا لديهم عقود من الخبرة في البناء والبنوك والتجارة الدولية." },
  { keywords: ['شراكة','وكالة','تعاون','عمل مشترك'], response: "نرحب بالشراكات التجارية — سواء كنت ساحة خردة أو معالج معادن أو وسيط أو مشترياً نهائياً. تواصل: info@saddamscrapandmetal.com." },
  { keywords: ['بيئة','استدامة','تدوير','اعادة التدوير'], response: "إعادة تدوير المعادن في صميم عملنا — نقلص الحاجة للتعدين ونخفض انبعاثات الكربون وندعم الاقتصاد الدائري." },
  { keywords: ['ساعات','أوقات العمل','متاح','متى','وقت'], response: "ساعات عملنا: السبت إلى الخميس، ٨:٠٠ صباحاً حتى ٦:٠٠ مساءً بتوقيت السعودية. للاستفسارات العاجلة واتسابنا على +966 54 666 2697." },
  { keywords: ['شكراً','شكرا','ممتاز','رائع','مفيد','جيد','تمام'], response: "العفو! يسعدنا خدمتك. لا تتردد في السؤال في أي وقت. يمكنك التواصل مباشرة على +966 54 666 2697." },
  { keywords: ['مع السلامة','باي','وداعاً','إلى اللقاء','أكيد شكراً'], response: "شكراً لتواصلك مع صدام للخردة والمعادن. لا تتردد في التواصل متى احتجت. يوم سعيد!" },
]

function getReply(input: string, lang: string): string {
  const lower = input.toLowerCase()
  const QA = lang === 'ar' ? QA_AR : QA_EN
  for (const qa of QA) {
    if (qa.keywords.some(kw => lower.includes(kw))) return qa.response
  }
  return lang === 'ar'
    ? "لم أفهم سؤالك جيداً. يمكنني مساعدتك بمعلومات عن معادننا والأسعار والشحن. حاول: ما المعادن التي تتداولونها؟"
    : "I'm not sure I understood that. I can help with metals, pricing, shipping, contact details, or quotes. Try: What metals do you trade?"
}

export default function Chatbot() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const [nextId, setNextId]     = useState(1)
  const [waNumber, setWaNumber] = useState('966546662697')
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  if (pathname.startsWith('/admin')) return null

  useEffect(() => {
    fetchContactInfo().then((r: any) => {
      const phone = r.data?.phone || ''
      const digits = phone.replace(/\D/g, '')
      if (digits) setWaNumber(digits)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  // Reset messages when language changes
  useEffect(() => {
    setMessages([])
  }, [i18n.language])

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
      addMessage('bot', getReply(trimmed, i18n.language))
    }, 600)
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') send(input) }

  const chips = [
    t('chatbot.chips.metals'),
    t('chatbot.chips.quote'),
    t('chatbot.chips.contact'),
  ]

  return (
    <>
      {open && (
        <div className={`
          fixed z-50 bg-[#0d1424] border border-white/10 shadow-2xl shadow-black/60 flex flex-col
          md:bottom-28 md:right-6 md:w-[380px] md:h-[500px] md:rounded-2xl
          bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl
          animate-slide-up
        `} dir={isAr ? 'rtl' : 'ltr'}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
            <div>
              <div className="text-white font-bold text-sm">{t('chatbot.header')}</div>
              <div className="text-gray-400 text-xs mt-0.5">{t('chatbot.subheader')}</div>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-gray-400 text-xs text-center">{t('chatbot.greeting')}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {chips.map(chip => (
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
                    ? 'bg-amber-500 text-[#020617] font-medium rounded-2xl rounded-ee-sm'
                    : 'bg-[#1a2235] text-white rounded-2xl rounded-es-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-[#1a2235] rounded-2xl rounded-es-sm px-4 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-white/10 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 bg-[#1a2235] border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600"
            />
            <button onClick={() => send(input)} disabled={!input.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-[#020617] p-2.5 rounded-xl transition-all shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="fixed z-50 md:bottom-6 md:right-6 bottom-5 right-5 flex flex-col md:flex-row items-center gap-3">
        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
          className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] hover:bg-[#20bc5a] text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="WhatsApp">
          <IconWhatsApp />
        </a>
        <button onClick={() => setOpen(o => !o)}
          className="w-12 h-12 md:w-14 md:h-14 bg-amber-500 hover:bg-amber-400 text-white rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Open chat">
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      </div>
    </>
  )
}
