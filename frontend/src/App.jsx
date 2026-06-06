import { useState } from 'react'
import ToolLauncher from './components/Home/ToolLauncher'
import CMAGenerator from './components/CMA/CMAGenerator'
import './styles/brand.css'

function App() {
  const [activeTool, setActiveTool] = useState(null)

  // Mock user and profile for demo (no auth required)
  const mockUser = { email: 'demo@tidalrealtypartners.com' }
  const mockProfile = { 
    name: 'Demo User',
    phone: '(555) 123-4567',
    headshot: null
  }

  if (activeTool === 'cma-generator') {
    return <CMAGenerator onBack={() => setActiveTool(null)} />
  }

  return <ToolLauncher user={mockUser} profile={mockProfile} onLaunchTool={setActiveTool} />
}

export default App
