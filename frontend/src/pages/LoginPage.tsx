import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e?: React.FormEvent, demoRole?: string) => {
    e?.preventDefault()
    let loginEmail = email
    let loginPassword = password
    if (demoRole === 'super_admin') { loginEmail = 'superadmin@college.edu'; loginPassword = 'admin123' }
    if (demoRole === 'club_admin') { loginEmail = 'clubadmin@college.edu'; loginPassword = 'admin123' }
    if (demoRole === 'student') { loginEmail = 'student0@college.edu'; loginPassword = 'student123' }
    try {
      const res = await api.post('/login', { email: loginEmail, password: loginPassword })
      login({ token: res.data.access_token, role: res.data.role, user_id: res.data.user_id,
              full_name: res.data.full_name, club_id: res.data.club_id, club_name: res.data.club_name })
      if (res.data.role === 'super_admin') navigate('/super-admin')
      else if (res.data.role === 'club_admin') navigate('/club-admin')
      else navigate('/student')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Club Management System</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" placeholder="name@college.edu" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={e => e.key === 'Enter' && handleLogin(e)} />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-3">Login As:</p>
          <div className="space-y-2">
            {[['super_admin', 'Super Admin'], ['club_admin', 'Club Admin'], ['student', 'Student']].map(([role, label]) => (
              <button key={role} onClick={() => handleLogin(undefined, role)}
                className="w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}