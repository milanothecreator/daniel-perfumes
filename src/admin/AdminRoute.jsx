import { Navigate, useLocation, Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  // Not signed in → send to login, remember where they were going.
  if (!user) return <Navigate to="/auth" state={{ from: location.pathname }} replace />

  // Owner email bypass — works even if Firestore rules block the role read.
  const ownerEmails = ['musaanthony123456@gmail.com']
  const isOwner = user?.email && ownerEmails.includes(user.email)

  // Signed in but not an admin → clear "not authorized" notice.
  if (!isAdmin && !isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0E0F13' }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(241,90,36,0.12)' }}>
            <ShieldAlert size={30} style={{ color: '#FF6B2C' }} />
          </div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: '#F4F4F6' }}>Not authorized</h1>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#8A8B93' }}>
            This area is for Daniel Perfumes administrators only. Your account doesn’t have access.
          </p>
          <Link
            to="/"
            className="inline-block text-sm font-medium px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: '#F15A24', color: '#fff' }}
          >
            Back to store
          </Link>
        </div>
      </div>
    )
  }

  return children
}
