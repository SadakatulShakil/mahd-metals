import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../lib/auth'
import AdminNav from './AdminNav'

export default function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn()) navigate('/admin/login')
  }, [])

  if (!isLoggedIn()) return null

  return (
    <div className="flex min-h-screen bg-[#020617]">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
