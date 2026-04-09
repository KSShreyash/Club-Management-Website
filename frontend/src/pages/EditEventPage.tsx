import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', venue: '', fee: '0', capacity: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/events/${id}`).then(r => {
      const e = r.data
      setForm({ title: e.title, description: e.description, date: e.date, time: e.time, venue: e.venue, fee: String(e.fee), capacity: String(e.capacity) })
    })
  }, [id])

  const submit = async () => {
    try {
      await api.put(`/events/${id}`, { ...form, fee: parseFloat(form.fee), capacity: parseInt(form.capacity) })
      navigate('/club-admin')
    } catch (e: any) { setError(e.response?.data?.detail || 'Error') }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/club-admin')} className="text-sm text-gray-500 mb-4 hover:text-gray-700">← Back</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">Edit Event</h1>
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
          <div className="space-y-4">
            {[
              { label: 'Event Title', key: 'title', placeholder: 'Event title' },
              { label: 'Venue', key: 'venue', placeholder: 'Venue' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm text-gray-600 mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Time</label>
                <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Fee (₹)</label>
                <input type="number" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Capacity</label>
                <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button onClick={submit}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}