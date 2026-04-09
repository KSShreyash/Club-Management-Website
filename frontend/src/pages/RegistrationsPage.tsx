import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

export default function RegistrationsPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [regs, setRegs] = useState<any[]>([])
  const [eventTitle, setEventTitle] = useState('')

  useEffect(() => {
    api.get(`/events/${eventId}`).then(r => setEventTitle(r.data.title))
    api.get(`/events/${eventId}/registrations`).then(r => setRegs(r.data))
  }, [eventId])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 mb-4 hover:text-gray-700">← Back</button>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">Registrations</h1>
          <p className="text-sm text-gray-500 mb-5">{eventTitle}</p>
          {regs.length === 0
            ? <p className="text-center text-gray-400 py-8">No registrations yet</p>
            : <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['#', 'Name', 'Email', 'Phone', 'Roll Number', 'Registered At'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {regs.map((r, i) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-gray-400">{i + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-800">{r.full_name}</td>
                      <td className="py-2.5 px-3 text-gray-600">{r.email}</td>
                      <td className="py-2.5 px-3 text-gray-600">{r.phone}</td>
                      <td className="py-2.5 px-3 text-gray-600">{r.roll_number}</td>
                      <td className="py-2.5 px-3 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>
    </div>
  )
}