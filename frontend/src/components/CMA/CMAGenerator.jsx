import { useState } from 'react'
import SubjectIntake from './SubjectIntake'
import CompsUpload from './CompsUpload'
import ProcessingView from './ProcessingView'
import ResultsView from './ResultsView'
import ToolIcon from '../icons/ToolIcon'

export default function CMAGenerator({ onBack }) {
  const [step, setStep] = useState('subject') // 'subject' | 'comps' | 'processing' | 'results'
  const [subjectData, setSubjectData] = useState(null)
  const [cmaData, setCmaData] = useState(null)
  const [error, setError] = useState(null)

  const handleSubjectNext = (data) => {
    setSubjectData(data)
    setStep('comps')
  }

  const handleCompsSubmit = async (data) => {
    setStep('processing')
    setError(null)

    try {
      // Create FormData for file uploads
      const formData = new FormData()
      
      // Add subject data
      formData.append('subject', JSON.stringify(data.subject))
      
      // Add PDFs
      if (data.comps) formData.append('comps', data.comps)
      if (data.competition) formData.append('competition', data.competition)

      // Call backend API (production Supabase Edge Function)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-cma`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      setCmaData(result)
      setStep('results')
    } catch (err) {
      console.error('CMA generation error:', err)
      setError(err.message)
      setStep('comps')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-wash)', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 40px' }}>
        <button onClick={onBack} className="back-link" style={{ marginBottom: '16px' }}>
          <ToolIcon name="back" size={18} />
          Back to Tools
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', margin: 0 }}>CMA Generator</h1>
          
          {/* Progress indicator */}
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <div style={{
              width: '32px',
              height: '4px',
              background: step === 'subject' || step === 'comps' || step === 'processing' || step === 'results' 
                ? 'var(--brand-blue)' : 'var(--brand-mist)',
              borderRadius: '2px'
            }} />
            <div style={{
              width: '32px',
              height: '4px',
              background: step === 'comps' || step === 'processing' || step === 'results'
                ? 'var(--brand-blue)' : 'var(--brand-mist)',
              borderRadius: '2px'
            }} />
            <div style={{
              width: '32px',
              height: '4px',
              background: step === 'processing' || step === 'results'
                ? 'var(--brand-blue)' : 'var(--brand-mist)',
              borderRadius: '2px'
            }} />
            <div style={{
              width: '32px',
              height: '4px',
              background: step === 'results' ? 'var(--brand-blue)' : 'var(--brand-mist)',
              borderRadius: '2px'
            }} />
          </div>
        </div>

        {error && (
          <div className="card" style={{ 
            background: 'var(--neg)', 
            color: 'white', 
            marginBottom: '24px',
            borderLeft: '4px solid darkred'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Step content */}
      {step === 'subject' && (
        <SubjectIntake onNext={handleSubjectNext} />
      )}

      {step === 'comps' && (
        <CompsUpload 
          subjectData={subjectData}
          onNext={handleCompsSubmit}
          onBack={() => setStep('subject')}
        />
      )}

      {step === 'processing' && (
        <ProcessingView />
      )}

      {step === 'results' && cmaData && (
        <ResultsView 
          data={cmaData}
          onStartNew={() => {
            setStep('subject')
            setSubjectData(null)
            setCmaData(null)
          }}
        />
      )}
    </div>
  )
}
