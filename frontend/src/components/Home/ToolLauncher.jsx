import logo from '../../assets/tidal_logo.svg'
import ToolIcon from '../icons/ToolIcon'

const TOOLS = [
  {
    id: 'cma-generator',
    name: 'CMA Generator',
    description: 'Create professional CMAs with AI-powered comp adjustments and market narrative.',
    icon: 'cma',
    available: true,
  },
  {
    id: 'inspection-review',
    name: 'Home Inspection Review',
    description: 'Upload inspection PDFs → AI categorizes issues, estimates costs, and suggests strategy.',
    icon: 'inspection',
    available: false,
  },
  {
    id: 'repair-request',
    name: 'Repair Request Generator',
    description: 'Convert inspection findings into professional due diligence repair requests.',
    icon: 'repair',
    available: false,
  },
  {
    id: 'contract-generator',
    name: 'Contract Document Generator',
    description: 'Dotloop + MLS integration: auto-populate contracts from listing data.',
    icon: 'contract',
    available: false,
  },
  {
    id: 'social-posts',
    name: 'Social Post Generator',
    description: 'Turn listings into Instagram / Facebook posts with captions and hashtags.',
    icon: 'social',
    available: false,
  },
  {
    id: 'listing-alerts',
    name: 'Listing Alert Builder',
    description: 'Generate polished email and text templates for new listings.',
    icon: 'alert',
    available: false,
  },
  {
    id: 'fub-dashboard',
    name: 'FUB Pipeline Dashboard',
    description: 'Your Follow Up Boss stats and hot leads at a glance.',
    icon: 'pipeline',
    available: false,
  },
  {
    id: 'market-snapshot',
    name: 'Market Snapshot',
    description: 'Wilmington-area market stats: inventory, days on market, and price trends.',
    icon: 'market',
    available: false,
  },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function initials(name) {
  if (!name) return 'TR'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function ToolCard({ tool, onLaunchTool }) {
  const available = tool.available
  return (
    <button
      className={`tool-card ${available ? 'is-available' : 'is-soon'}`}
      disabled={!available}
      onClick={() => available && onLaunchTool(tool.id)}
    >
      <div className="tool-icon">
        <ToolIcon name={tool.icon} size={26} />
      </div>
      <h3 className="tool-name">{tool.name}</h3>
      <p className="tool-desc">{tool.description}</p>
      <div className="tool-footer">
        {available ? (
          <span className="badge badge-live">Ready</span>
        ) : (
          <span className="badge badge-soon">Coming soon</span>
        )}
        {available && (
          <span className="tool-go">
            <ToolIcon name="arrow" size={20} />
          </span>
        )}
      </div>
    </button>
  )
}

export default function ToolLauncher({ user, profile, onLaunchTool }) {
  const name = profile?.name || user?.email || 'TRP Agent'
  // Only personalize the greeting when we have a real, specific first name —
  // the shared placeholder ("TRP Agent") would read awkwardly as "morning, TRP".
  const firstName = profile?.name && profile.name !== 'TRP Agent'
    ? profile.name.split(' ')[0]
    : null
  const available = TOOLS.filter(t => t.available)
  const soon = TOOLS.filter(t => !t.available)

  return (
    <div className="app-shell">
      {/* Hero */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-topbar">
            <img
              src={logo}
              alt="Tidal Realty Partners"
              style={{ height: '30px', filter: 'brightness(0) invert(1)' }}
            />
            <div className="hero-user">
              <span>{name}</span>
              <span className="hero-avatar">{initials(profile?.name)}</span>
            </div>
          </div>

          <p className="hero-eyebrow">Tidal Collab · Agent Toolkit</p>
          <h1 className="hero-title">{greeting()}{firstName ? `, ${firstName}` : ''}</h1>
          <p className="hero-sub">
            Your AI-powered workspace for CMAs, inspections, listings, and more —
            built to give back hours of every week to TRP agents.
          </p>
        </div>
      </header>

      {/* Tools */}
      <main className="content">
        <div className="section-head">
          <h2>Available now</h2>
          <span className="section-count">{available.length}</span>
        </div>
        <div className="tool-grid">
          {available.map(tool => (
            <ToolCard key={tool.id} tool={tool} onLaunchTool={onLaunchTool} />
          ))}
        </div>

        <div className="section-head">
          <h2>Coming soon</h2>
          <span className="section-count">{soon.length}</span>
        </div>
        <div className="tool-grid">
          {soon.map(tool => (
            <ToolCard key={tool.id} tool={tool} onLaunchTool={onLaunchTool} />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <span>© {new Date().getFullYear()} Tidal Realty Partners</span>
        <span>Built for the TRP team</span>
      </footer>
    </div>
  )
}
