import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function EventRegistrationPage() {
  const { eventId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState<any>(null)
  const [form, setForm] = useState({ full_name: user?.full_name || '', email: '', phone: '', roll_number: '' })
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/events/${eventId}`).then(r => setEvent(r.data))
  }, [eventId])

  const submit = async () => {
    if (!form.full_name || !form.email || !form.phone || !form.roll_number) { setError('All fields required'); return }
    if (event.fee > 0 && (!card.number || !card.expiry || !card.cvv)) { setError('Payment details required'); return }
    try {
      await api.post(`/events/${eventId}/register`, form)
      setSuccess(true)
    } catch (e: any) { setError(e.response?.data?.detail || 'Registration failed') }
  }

  if (!event) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Loading...</p></div>
  if (success) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Registration Successful!</h2>
        <p className="text-gray-500 text-sm mb-6">You've been registered for {event.title}</p>
        <button onClick={() => navigate('/student')} className="bg-gray-900 text-white px-6 py-2 rounded-lg">Back to Events</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Event Registration</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
                  <p className="text-sm text-blue-500">{event.club_name}</p>
                </div>
                {event.fee > 0 && <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">₹{event.fee}</span>}
              </div>
              <div className="text-sm text-gray-500 space-y-1 mb-3">
                <p>📅 {event.date} &nbsp; {event.time}</p>
                <p>📍 {event.venue}</p>
                <p>👥 {event.registration_count}/{event.capacity} participants registered</p>
              </div>
              {event.description && (
                <div><p className="text-sm font-medium text-gray-700 mb-1">About the Event</p>
                <p className="text-sm text-gray-500">{event.description}</p></div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Registration Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name *', key: 'full_name', placeholder: 'Enter your name' },
                  { label: 'Email *', key: 'email', placeholder: 'student@college.edu' },
                  { label: 'Phone Number *', key: 'phone', placeholder: '+91 98765 43210' },
                  { label: 'Roll Number *', key: 'roll_number', placeholder: 'e.g. 2023-CS-101' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-sm text-gray-600 mb-1 block">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
            </div>

            {event.fee > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">💳 Payment Information</h2>
                <div className="space-y-4">
                  <input readOnly value={`Registration fee: ₹${event.fee}`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" />
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Card Number</label>
                    <input value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Expiry Date</label>
                      <input value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">CVV</label>
                      <input value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} placeholder="123"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Registration Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                {[['Event', event.title], ['Date', event.date], ['Venue', event.venue]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-gray-800 font-medium text-right max-w-[120px]">{v}</span>
                  </div>
                ))}
                <hr className="my-3" />
                <div className="flex justify-between">
                  <span className="text-gray-500">Registration Fee</span>
                  <span className="text-gray-800">{event.fee > 0 ? `₹${event.fee}` : 'Free'}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>{event.fee > 0 ? `₹${event.fee}` : 'Free'}</span>
                </div>
              </div>
              <button onClick={submit}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700">
                {event.fee > 0 ? 'Pay & Register' : 'Register'}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">By registering, you agree to the event terms and conditions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}