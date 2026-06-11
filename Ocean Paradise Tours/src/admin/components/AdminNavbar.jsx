import { useNavigate } from 'react-router-dom'
import { signOut } from '../../services/authService.js'

export default function AdminNavbar() {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <header className="glass-card mb-5 flex items-center justify-between px-5 py-3">
      <h1 className="font-display text-2xl text-white">Ocean Paradise Admin</h1>
      <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm" type="button">
        Logout
      </button>
    </header>
  )
}
