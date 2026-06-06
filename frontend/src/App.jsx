import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Auth/Login'
import ProfileSetup from './components/Auth/ProfileSetup'
import ToolLauncher from './components/Home/ToolLauncher'
import './styles/brand.css'

function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }
      
      setProfile(data)
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--brand-wash)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--brand-mist)',
            borderTopColor: 'var(--brand-blue)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--brand-slate)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  if (!profile || !profile.name) {
    return <ProfileSetup user={user} onComplete={() => fetchProfile(user.id)} />
  }

  return <ToolLauncher user={user} profile={profile} />
}

export default App
