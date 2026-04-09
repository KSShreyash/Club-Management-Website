import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function ClubAdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total_events: 0, total_registrations: 0 })
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    api.get('/club-stats').then(r => setStats(r.data))
    api.get('/events/my-club').then(r => setEvents(r.data))
  }, [])

  const deleteEvent = async (id: number) => {
    if (!confirm('Delete this event?')) return
    await api.delete(`/events/${id}`)
    setEvents(events.filter(e => e.id !== id))
    setStats(s => ({ ...s, total_events: s.total_events - 1 }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <p className="font-semibold text-gray-800">Club Admin Dashboard</p>
          <p className="text-sm text-gray-500">{user?.club_name}</p>
        </div>
        <button onClick={() => { logout(); navigate('/login') }}
          className="border border-gray-300 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50">Logout</button>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Total Events', value: stats.total_events, sub: 'Events created' },
            { label: 'Total Registrations', value: stats.total_registrations, sub: 'Total attendees' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-2">{s.label}</p>
              <p className="text-3xl font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Manage Events</h2>
            <button onClick={() => navigate('/club-admin/create-event')}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 font-medium">+ Create Event</button>
          </div>
          <div className="space-y-3">
            {events.map(e => (
              <div key={e.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{e.title}</span>
                    {e.fee > 0
                      ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Paid - ₹{e.fee}</span>
                      : <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Free</span>}
                  </div>
                  <p className="text-xs text-gray-400">📅 {e.date} &nbsp; 👥 {e.registration_count} registrations</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate(`/registrations/${e.id}`)} className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
                    👁 View Registrations
                  </button>
                  <button onClick={() => navigate(`/club-admin/edit-event/${e.id}`)} className="text-gray-400 hover:text-gray-700">✏️</button>
                  <button onClick={() => deleteEvent(e.id)} className="text-red-400 hover:text-red-600">🗑</button>
                </div>
              </div>
            ))}
            {events.length === 0 && <p className="text-center text-gray-400 py-8">No events yet. Create your first event!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}