import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import ClubAdminDashboard from './pages/ClubAdminDashboard'
import CreateEventPage from './pages/CreateEventPage'
import EditEventPage from './pages/EditEventPage'
import StudentDashboard from './pages/StudentDashboard'
import EventRegistrationPage from './pages/EventRegistrationPage'
import RegistrationsPage from './pages/RegistrationsPage'

function PrivateRoute({ children, role }: { children: JSX.Element; role?: string }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/super-admin" element={<PrivateRoute role="super_admin"><SuperAdminDashboard /></PrivateRoute>} />
          <Route path="/club-admin" element={<PrivateRoute role="club_admin"><ClubAdminDashboard /></PrivateRoute>} />
          <Route path="/club-admin/create-event" element={<PrivateRoute role="club_admin"><CreateEventPage /></PrivateRoute>} />
          <Route path="/club-admin/edit-event/:id" element={<PrivateRoute role="club_admin"><EditEventPage /></PrivateRoute>} />
          <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/register/:eventId" element={<PrivateRoute><EventRegistrationPage /></PrivateRoute>} />
          <Route path="/registrations/:eventId" element={<PrivateRoute><RegistrationsPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}