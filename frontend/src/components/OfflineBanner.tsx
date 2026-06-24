import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)
  const { t } = useTranslation()

  useEffect(() => {
    const on  = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  if (!offline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-[#020617] px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
      <WifiOff size={15} />
      <span>{t('offline.msg')}</span>
    </div>
  )
}
