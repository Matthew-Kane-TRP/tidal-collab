import { useState } from 'react'
import ToolLauncher from './components/Home/ToolLauncher'
import CMAGenerator from './components/CMA/CMAGenerator'
import './styles/brand.css'

function App() {
  const [activeTool, setActiveTool] = useState(null)

  // Mock user and profile - NO LOGIN REQUIRED
  const mockUser = { email: 'demo@tidalrealtypartners.com' }
  const mockProfile = { 
    name: 'TRP Agent',
    phone: '',
    headshot: null
  }

  if (activeTool === 'cma-generator') {
    return <CMAGenerator onBack={() => setActiveTool(null)} />
  }

  return <ToolLauncher user={mockUser} profile={mockProfile} onLaunchTool={setActiveTool} />
}

export default App
