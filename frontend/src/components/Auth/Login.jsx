import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import logo from '../../assets/tidal_logo.svg'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('login') // 'login' or 'signup'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

      if (error) throw error
      
      if (mode === 'signup') {
        alert('Check your email to confirm your account!')
      } else if (data.user) {
        onLogin(data.user)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={logo} alt="Tidal Realty Partners" className="logo" style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: 'var(--brand-slate)' }}>
            {mode === 'login' ? 'Sign in to access your tools' : 'Join Tidal Realty Partners'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--neg)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{ background: 'none', color: 'var(--brand-blue)', textDecoration: 'underline' }}
          >
            {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
