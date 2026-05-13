import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../lib/adminApi'
import { saveToken } from '../lib/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@mahdmetals.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginAdmin(email, password)
      saveToken(res.data.access_token)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-black mb-2">
            <span className="text-amber-400">MAHD</span>
            <span className="text-white"> Metals</span>
          </div>
          <p className="text-gray-500 text-sm">Admin Panel</p>
        </div>

        <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-6">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#1a2235] border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020617] font-bold py-3 rounded-xl transition-all text-sm mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-600 text-xs mt-4">
          Default: admin@mahdmetals.com / admin123
        </p>
      </div>
    </div>
  )
}
