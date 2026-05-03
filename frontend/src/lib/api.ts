import axios from 'axios'

// ─────────────────────────────────────────────
// API Base URL
// LOCAL DEV (active):
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// PRODUCTION on Render/VPS (comment out until deployed):
// const BASE_URL = 'https://api.mahdmetals.com'

// VERCEL + Render combo (comment out until deployed):
// const BASE_URL = import.meta.env.VITE_API_URL
// ─────────────────────────────────────────────

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface Material {
  id: number
  slug: string
  name: string
  category: string
  description: string
  seo_title: string
  seo_description: string
  image_url: string
}

export const submitContact = async (data: ContactForm) => {
  const res = await api.post('/api/contact/', data)
  return res.data
}

export const getMaterials = async (): Promise<Material[]> => {
  const res = await api.get('/api/materials/')
  return res.data
}

export const getStats = async () => {
  const res = await api.get('/api/stats')
  return res.data
}
