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
    console.log('Subject data received:', data)
    setSubjectData(data)
    setStep('comps')
    setError(null)
  }

  const handleCompsSubmit = async (data) => {
    console.log('=== Starting CMA Generation ===')
    console.log('Subject:', data.subject)
    console.log('Comps file:', data.comps?.name, data.comps?.size, 'bytes')
    console.log('Competition file:', data.competition?.name, data.competition?.size, 'bytes')
    
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

      console.log('Sending request to:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-cma`)

      // Call backend API
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-cma`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: formData
      })

      console.log('Response status:', response.status)
      
      const responseText = await response.text()
      console.log('Response body (first 500 chars):', responseText.substring(0, 500))

      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorMessage
          if (errorData.details) {
            console.error('Error details:', errorData.details)
          }
        } catch (e) {
          // Response wasn't JSON
          errorMessage += ` - ${responseText.substring(0, 200)}`
        }
        throw new Error(errorMessage)
      }

      let result
      try {
        result = JSON.parse(responseText)
      } catch (e) {
        throw new Error('Invalid JSON response from server')
      }
      
      console.log('=== CMA Generation Successful ===')
      console.log('Suggested value:', result.suggestedValue)
      console.log('Comps:', result.comps?.length)
      console.log('Competition:', result.competition?.length)
      
      setCmaData(result)
      setStep('results')
    } catch (err) {
      console.error('=== CMA Generation Error ===')
      console.error('Error type:', err.constructor.name)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      
      setError(err.message || 'Failed to generate CMA. Please try again.')
      setStep('comps')
    }
  }

  const handleStartNew = () => {
    console.log('Starting new CMA')
    setStep('subject')
    setSubjectData(null)
    setCmaData(null)
    setError(null)
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
            background: '#FEE2E2', 
            color: '#991B1B', 
            marginBottom: '24px',
            borderLeft: '4px solid #DC2626',
            padding: '16px'
          }}>
            <strong>Error:</strong> {error}
            <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.9 }}>
              Check the browser console (F12) for detailed error information.
            </div>
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
          onStartNew={handleStartNew}
        />
      )}
    </div>
  )
}
