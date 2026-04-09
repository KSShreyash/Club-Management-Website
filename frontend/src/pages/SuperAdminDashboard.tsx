import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total_clubs: 0, total_events: 0, total_students: 0 })
  const [clubs, setClubs] = useState<any[]>([])
  const [clubName, setClubName] = useState('')
  const [clubDesc, setClubDesc] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [selectedClub, setSelectedClub] = useState('')
  const [annTitle, setAnnTitle] = useState('')
  const [annMsg, setAnnMsg] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/stats').then(r => setStats(r.data))
    api.get('/clubs').then(r => setClubs(r.data))
  }, [])

  const addClub = async () => {
    if (!clubName.trim()) return
    try {
      const r = await api.post('/clubs', { name: clubName, description: clubDesc })
      setClubs([...clubs, r.data])
      setStats(s => ({ ...s, total_clubs: s.total_clubs + 1 }))
      setClubName(''); setClubDesc('')
      setMsg('Club added successfully!')
    } catch (e: any) { setMsg(e.response?.data?.detail || 'Error') }
  }

  const removeClub = async () => {
    if (!selectedClub) return
    try {
      await api.delete(`/clubs/${selectedClub}`)
      setClubs(clubs.filter(c => c.id !== parseInt(selectedClub)))
      setSelectedClub('')
      setMsg('Club removed!')
    } catch { setMsg('Error removing club') }
  }

  const assignAdmin = async () => {
    if (!adminEmail || !selectedClub) return
    try {
      await api.post('/assign-admin', { student_email: adminEmail, club_id: parseInt(selectedClub) })
      setMsg('Admin assigned!')
    } catch (e: any) { setMsg(e.response?.data?.detail || 'Error') }
  }

  const removeAdmin = async () => {
    if (!adminEmail || !selectedClub) return
    try {
      await api.post('/remove-admin', { student_email: adminEmail, club_id: parseInt(selectedClub) })
      setMsg('Admin removed!')
    } catch (e: any) { setMsg(e.response?.data?.detail || 'Error') }
  }

  const publishAnnouncement = async () => {
    if (!annTitle || !annMsg) return
    try {
      await api.post('/announcements', { title: annTitle, message: annMsg })
      setAnnTitle(''); setAnnMsg('')
      setMsg('Announcement published!')
    } catch { setMsg('Error') }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-blue-500"></div>
          <span className="font-semibold text-gray-800">Super Admin Dashboard</span>
        </div>
        <button onClick={() => { logout(); navigate('/login') }}
          className="border border-gray-300 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50">Logout</button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {msg && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">{msg}</div>}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Clubs', value: stats.total_clubs, sub: 'Active clubs' },
            { label: 'Total Events', value: stats.total_events, sub: 'Scheduled events' },
            { label: 'Total Students', value: stats.total_students.toLocaleString(), sub: 'Registered students' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-2">{s.label}</p>
              <p className="text-3xl font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Club Management</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Club Name</label>
                <input value={clubName} onChange={e => setClubName(e.target.value)} placeholder="Enter club name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Description</label>
                <input value={clubDesc} onChange={e => setClubDesc(e.target.value)} placeholder="Enter club description"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={addClub}
                  className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700 font-medium">+ Add Club</button>
                <button onClick={removeClub}
                  className="flex-1 bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 font-medium">✕ Remove Club</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Assign Club Admin</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Student Email</label>
                <input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="student@college.edu"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Select Club</label>
                <select value={selectedClub} onChange={e => setSelectedClub(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a club</option>
                  {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={assignAdmin}
                  className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700 font-medium">Assign Admin</button>
                <button onClick={removeAdmin}
                  className="flex-1 border border-gray-300 text-sm py-2 rounded-lg hover:bg-gray-50 font-medium">Remove Admin</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">📢 Post Announcement</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Announcement Title</label>
              <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Enter announcement title"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Message</label>
              <textarea value={annMsg} onChange={e => setAnnMsg(e.target.value)} placeholder="Enter announcement message" rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="flex justify-end">
              <button onClick={publishAnnouncement}
                className="bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-700 font-medium">Publish Announcement</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}