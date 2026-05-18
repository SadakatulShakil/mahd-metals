import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const api = axios.create({ baseURL: BASE })

const TTL = 5 * 60 * 1000 // 5 minutes

function cacheSet(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

async function cachedGet(path: string) {
  const key = `api_cache:${path}`
  const stale = (() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      return JSON.parse(raw).data
    } catch { return null }
  })()

  // Stale-while-revalidate: return cached immediately, refresh in background
  if (stale) {
    api.get(path).then(r => cacheSet(key, r.data)).catch(() => {})
    return Promise.resolve({ data: stale })
  }

  // No cache — fetch, store, return
  const r = await api.get(path)
  cacheSet(key, r.data)
  return r
}

export const fetchHero         = () => cachedGet('/api/admin/hero')
export const fetchAbout        = () => cachedGet('/api/admin/about')
export const fetchStats        = () => cachedGet('/api/admin/stats')
export const fetchMaterials    = () => cachedGet('/api/materials/')
export const fetchTestimonials = () => cachedGet('/api/admin/testimonials')
export const fetchContactInfo  = () => cachedGet('/api/admin/contact-info')
export const fetchSettings     = () => cachedGet('/api/admin/settings')
export const fetchBranding     = () => cachedGet('/api/admin/branding')
export const fetchBanner       = (page: string) => cachedGet(`/api/admin/banners/${page}`)
export const fetchAboutBullets = () => cachedGet('/api/admin/about-bullets')
export const submitContact     = (data: any) => api.post('/api/contact/', data)
