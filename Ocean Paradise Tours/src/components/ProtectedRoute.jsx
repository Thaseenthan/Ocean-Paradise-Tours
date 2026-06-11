// import { Navigate } from 'react-router-dom'
// import { useAuth } from '../hooks/AuthContext.jsx'
// import LoadingSpinner from './LoadingSpinner.jsx'

// export default function ProtectedRoute({ children }) {
//   // Opt-in bypass for local/dev use. Set VITE_DISABLE_ADMIN_AUTH=true in .env
//   const disableAuth = import.meta.env.VITE_DISABLE_ADMIN_AUTH === 'true'

//   const { user, isAdmin, loading } = useAuth()

//   if (loading) return <LoadingSpinner label="Checking access..." />

//   if (disableAuth) return children

//   if (!user || !isAdmin) {
//     return <Navigate to="/" replace />
//   }

//   return children
// }


import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

export default function ProtectedRoute({ children }) {
  const disableAuth = import.meta.env.VITE_DISABLE_ADMIN_AUTH === 'true'
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <LoadingSpinner label="Checking access..." />

  if (disableAuth) return children

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace /> // Redirect directly to login instead of home page if denied
  }

  return children
}