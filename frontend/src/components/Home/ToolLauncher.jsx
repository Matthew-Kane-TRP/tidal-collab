import { supabase } from '../../lib/supabase'
import logo from '../../assets/tidal_logo.svg'

export default function ToolLauncher({ user, profile, onLaunchTool }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const tools = [
    {
      id: 'cma-generator',
      name: 'CMA Generator',
      description: 'Create professional CMAs with AI-powered adjustments',
      icon: '📊',
      available: true,
      onLaunch: () => onLaunchTool('cma-generator')
    },
    {
      id: 'listing-presentation',
      name: 'Listing Presentation',
      description: 'Generate polished listing presentations',
      icon: '📁',
      available: false
    },
    {
      id: 'description-writer',
      name: 'Listing Description Writer',
      description: 'AI-powered property descriptions',
      icon: '✍️',
      available: false
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-wash)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--brand-navy)',
        color: 'var(--brand-white)',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={logo} alt="Tidal Realty Partners" style={{ height: '32px', filter: 'brightness(0) invert(1)' }} />
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', marginBottom: '4px' }}>{profile?.name || user.email}</p>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                color: 'var(--brand-blue-lt)',
                fontSize: '12px',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Your Tools</h1>
          <p style={{ color: 'var(--brand-slate)', fontSize: '18px' }}>
            Select a tool to get started
          </p>
        </div>

        {/* Tool Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => tool.available && tool.onLaunch && tool.onLaunch()}
              disabled={!tool.available}
              className="card"
              style={{
                textAlign: 'left',
                cursor: tool.available ? 'pointer' : 'not-allowed',
                opacity: tool.available ? 1 : 0.5,
                border: '2px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (tool.available) {
                  e.currentTarget.style.borderColor = 'var(--brand-blue)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{tool.icon}</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{tool.name}</h3>
              <p style={{ color: 'var(--brand-slate)', fontSize: '14px', lineHeight: '1.5' }}>
                {tool.description}
              </p>
              {!tool.available && (
                <div style={{
                  marginTop: '12px',
                  padding: '4px 8px',
                  background: 'var(--brand-wash)',
                  borderRadius: '4px',
                  display: 'inline-block',
                  fontSize: '12px',
                  color: 'var(--brand-slate)'
                }}>
                  Coming Soon
                </div>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
