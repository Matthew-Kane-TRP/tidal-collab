import { useState } from 'react'

export default function CompsUpload({ subjectData, onNext, onBack }) {
  const [compsFile, setCompsFile] = useState(null)
  const [competitionFile, setCompetitionFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({
      subject: subjectData,
      comps: compsFile,
      competition: competitionFile
    })
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          color: 'var(--brand-blue)',
          marginBottom: '24px',
          fontSize: '14px'
        }}
      >
        ← Back to subject property
      </button>

      <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Upload Comparables</h2>
      <p style={{ color: 'var(--brand-slate)', marginBottom: '32px' }}>
        Upload PDFs of comparable sold properties and active competition
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card">
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
            Comparable Sold Properties (PDF) *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setCompsFile(e.target.files[0])}
            required
            style={{ padding: '8px' }}
          />
          {compsFile && (
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--brand-slate)' }}>
              ✓ {compsFile.name}
            </p>
          )}
          <small style={{ display: 'block', marginTop: '12px', color: 'var(--brand-slate)' }}>
            Include 3-6 recently sold properties similar to the subject
          </small>
        </div>

        <div className="card">
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
            Active Competition (PDF) *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setCompetitionFile(e.target.files[0])}
            required
            style={{ padding: '8px' }}
          />
          {competitionFile && (
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--brand-slate)' }}>
              ✓ {competitionFile.name}
            </p>
          )}
          <small style={{ display: 'block', marginTop: '12px', color: 'var(--brand-slate)' }}>
            Currently listed properties competing for buyers
          </small>
        </div>

        <div className="card" style={{ background: 'var(--brand-blue-lt)', border: '1px solid var(--brand-blue)' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--brand-navy)' }}>
            💡 Pro Tip
          </h4>
          <p style={{ fontSize: '14px', color: 'var(--brand-navy)', lineHeight: '1.5' }}>
            Select properties within 1 mile, similar size (±20% sqft), sold in last 6 months.
            The AI will extract details and calculate adjustments automatically.
          </p>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
          Generate CMA
        </button>
      </form>
    </div>
  )
}
