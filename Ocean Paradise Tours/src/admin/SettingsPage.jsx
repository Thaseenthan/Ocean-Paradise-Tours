import { useState } from 'react'
import { updateAdminPassword } from '../services/authService.js'

export default function SettingsPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' }) // type: 'success' or 'error'

  async function handlePasswordUpdate(event) {
    event.preventDefault()
    setMessage({ text: '', type: '' })

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' })
      return
    }

    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' })
      return
    }

    setLoading(true)
    try {
      await updateAdminPassword(password)
      setMessage({ text: 'Password updated successfully!', type: 'success' })
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update password.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-3xl text-white">Settings</h1>
      
      <div className="glass-card max-w-md p-6 space-y-4">
        <h2 className="text-xl text-cyan-100 font-semibold">Change Password</h2>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <label className="block text-sm text-cyan-100/80">New Password
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:border-cyan-400" 
            />
          </label>

          <label className="block text-sm text-cyan-100/80">Confirm New Password
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:border-cyan-400" 
            />
          </label>

          <button 
            disabled={loading} 
            type="submit" 
            className="btn-primary w-full py-2 bg-cyan-500 text-white rounded-xl disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {message.text && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}