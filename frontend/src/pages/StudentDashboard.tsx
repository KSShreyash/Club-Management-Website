import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function StudentDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [myRegs, setMyRegs] = useState<number[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [showAnnouncements, setShowAnnouncements] = useState(false)

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data))
    api.get('/my-registrations').then(r => setMyRegs(r.data.map((reg: any) => reg.event_id)))
    api.get('/announcements').then(r => setAnnouncements(r.data))
  }, [])

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.club_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <p className="font-semibold text-gray-800">Browse Events</p>
          <p className="text-sm text-gray-500">Discover and register for upcoming events</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="border border-gray-300 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        {/* Announcements Panel */}
        {announcements.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowAnnouncements(!showAnnouncements)}
              className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-2.5 rounded-lg hover:bg-blue-100 w-full justify-between"
            >
              <span className="flex items-center gap-2">
                📢 <span className="font-medium">Announcements</span>
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {announcements.length}
                </span>
              </span>
              <span>{showAnnouncements ? '▲ Hide' : '▼ Show'}</span>
            </button>

            {showAnnouncements && (
              <div className="mt-2 space-y-2">
                {announcements.map(ann => (
                  <div key={ann.id} className="bg-white border border-blue-100 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800 text-sm">{ann.title}</h3>
                      <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                        {new Date(ann.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{ann.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events by name or club..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(e => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{e.title}</h3>
                {e.fee > 0
                  ? <span className="text-xs font-medium text-green-600">₹{e.fee}</span>
                  : <span className="text-xs text-gray-500">Free</span>}
              </div>
              <p className="text-xs text-blue-500 mb-3">{e.club_name}</p>
              <div className="space-y-1 text-xs text-gray-500 mb-4">
                <p>📅 {e.date} at {e.time}</p>
                <p>📍 {e.venue}</p>
                <p>👥 {e.registration_count}/{e.capacity} registered</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/register/${e.id}`)}
                  className="flex-1 border border-gray-200 text-sm py-2 rounded-lg hover:bg-gray-50"
                >
                  View Details
                </button>
                {myRegs.includes(e.id)
                  ? <button
                      disabled
                      className="flex-1 bg-gray-300 text-white text-sm py-2 rounded-lg cursor-not-allowed"
                    >
                      Registered
                    </button>
                  : <button
                      onClick={() => navigate(`/register/${e.id}`)}
                      className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700"
                    >
                      Register
                    </button>
                }
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">No events found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}