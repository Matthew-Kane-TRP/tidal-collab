import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import logo from '../../assets/tidal_logo.svg'

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkDomainAndLogin(session.user)
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkDomainAndLogin(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkDomainAndLogin = (user) => {
    // Check if email ends with @tidalrealtypartners.com
    if (user.email && user.email.toLowerCase().endsWith('@tidalrealtypartners.com')) {
      onLogin(user)
    } else {
      setError('Access restricted to @tidalrealtypartners.com email addresses only.')
      supabase.auth.signOut()
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/tidal-collab/',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
    } catch (err) {
      setError(err.message)
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
            Welcome to Tidal Collab
          </h1>
          <p style={{ color: 'var(--brand-slate)' }}>
            Sign in with your @tidalrealtypartners.com Google account
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--neg)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin} 
          className="btn-primary" 
          disabled={loading}
          style={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '14px'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.039-3.71z" fill="#EA4335"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '13px',
          color: '#666',
          textAlign: 'center'
        }}>
          ⚠️ Access is restricted to Tidal Realty Partners team members only.<br/>
          You must sign in with your @tidalrealtypartners.com email address.
        </div>
      </div>
    </div>
  )
}
