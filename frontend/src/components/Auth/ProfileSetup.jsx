import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ProfileSetup({ user, onComplete }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          phone,
          email: user.email,
          updated_at: new Date()
        })

      if (error) throw error
      onComplete()
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
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Complete Your Profile</h1>
        <p style={{ color: 'var(--brand-slate)', marginBottom: '32px' }}>
          Tell us a bit about yourself so we can personalize your experience.
        </p>

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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(910) 555-0123"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{ background: 'var(--brand-wash)', cursor: 'not-allowed' }}
            />
            <small style={{ color: 'var(--brand-slate)', fontSize: '14px' }}>
              Email cannot be changed here
            </small>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '16px' }}>
            {loading ? 'Saving...' : 'Continue to Tools'}
          </button>
        </form>
      </div>
    </div>
  )
}
