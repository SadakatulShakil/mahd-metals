import axios from 'axios'
import { getToken, clearToken } from './auth'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const adminApi = axios.create({ baseURL: BASE })

adminApi.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

adminApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      clearToken()
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const loginAdmin = (email: string, password: string) =>
  adminApi.post('/api/admin/auth/login', { email, password })

// Hero
export const getHero = () => adminApi.get('/api/admin/hero')
export const updateHero = (data: any) => adminApi.put('/api/admin/hero', data)
export const uploadHeroImage = (file: File) => {
  const fd = new FormData(); fd.append('file', file)
  return adminApi.post('/api/admin/hero/image', fd)
}

// About
export const getAbout = () => adminApi.get('/api/admin/about')
export const updateAbout = (data: any) => adminApi.put('/api/admin/about', data)
export const uploadAboutImage = (file: File) => {
  const fd = new FormData(); fd.append('file', file)
  return adminApi.post('/api/admin/about/image', fd)
}

// Stats
export const getStats = () => adminApi.get('/api/admin/stats')
export const updateStats = (data: any) => adminApi.put('/api/admin/stats', data)

// Materials
export const getMaterials = () => adminApi.get('/api/admin/materials')
export const createMaterial = (data: any) => adminApi.post('/api/admin/materials', data)
export const updateMaterial = (id: number, data: any) => adminApi.put(`/api/admin/materials/${id}`, data)
export const deleteMaterial = (id: number) => adminApi.delete(`/api/admin/materials/${id}`)
export const uploadMaterialImage = (id: number, file: File) => {
  const fd = new FormData(); fd.append('file', file)
  return adminApi.post(`/api/admin/materials/${id}/image`, fd)
}

// Testimonials
export const getTestimonials = () => adminApi.get('/api/admin/testimonials')
export const createTestimonial = (data: any) => adminApi.post('/api/admin/testimonials', data)
export const updateTestimonial = (id: number, data: any) => adminApi.put(`/api/admin/testimonials/${id}`, data)
export const deleteTestimonial = (id: number) => adminApi.delete(`/api/admin/testimonials/${id}`)

// Contact Info
export const getContactInfo = () => adminApi.get('/api/admin/contact-info')
export const updateContactInfo = (data: any) => adminApi.put('/api/admin/contact-info', data)

// Inbox
export const getSubmissions = () => adminApi.get('/api/admin/submissions')
export const markRead = (id: number) => adminApi.put(`/api/admin/submissions/${id}/read`)

// Settings
export const getSiteSettings = () => adminApi.get('/api/admin/settings')
export const updateSiteSettings = (data: any) => adminApi.put('/api/admin/settings', data)

// Blog
export const getAdminBlogPosts = () => adminApi.get('/api/admin/blog')
export const createBlogPost = (data: any) => adminApi.post('/api/admin/blog', data)
export const updateBlogPost = (id: number, data: any) => adminApi.put(`/api/admin/blog/${id}`, data)
export const deleteBlogPost = (id: number) => adminApi.delete(`/api/admin/blog/${id}`)
export const uploadBlogImage = (id: number, file: File) => {
  const fd = new FormData(); fd.append('file', file)
  return adminApi.post(`/api/admin/blog/${id}/image`, fd)
}

// FAQs
export const getFAQs = () => adminApi.get('/api/admin/faqs')
export const createFAQ = (data: any) => adminApi.post('/api/admin/faqs', data)
export const updateFAQ = (id: number, data: any) => adminApi.put(`/api/admin/faqs/${id}`, data)
export const deleteFAQ = (id: number) => adminApi.delete(`/api/admin/faqs/${id}`)
