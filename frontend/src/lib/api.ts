import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const api = axios.create({ baseURL: BASE })

export const fetchHero         = () => api.get('/api/admin/hero')
export const fetchAbout        = () => api.get('/api/admin/about')
export const fetchStats        = () => api.get('/api/admin/stats')
export const fetchMaterials    = () => api.get('/api/materials/')
export const fetchTestimonials = () => api.get('/api/admin/testimonials')
export const fetchContactInfo  = () => api.get('/api/admin/contact-info')
export const fetchSettings     = () => api.get('/api/admin/settings')
export const fetchBranding     = () => api.get('/api/admin/branding')
export const fetchBanner       = (page: string) => api.get(`/api/admin/banners/${page}`)
export const fetchAboutBullets = () => api.get('/api/admin/about-bullets')
export const submitContact     = (data: any) => api.post('/api/contact/', data)
