import { useState } from 'react'

export default function SubjectIntake({ onNext }) {
  const [mode, setMode] = useState(null) // 'manual' or 'pdf'
  const [pdfFile, setPdfFile] = useState(null)
  const [formData, setFormData] = useState({
    address: '',
    yearBuilt: '',
    lotSize: '',
    lotSizeUnit: 'acres',
    bedrooms: '',
    bathrooms: '',
    heatedSqft: '',
    quality: 5,
    pool: false,
    poolType: '',
    bonuses: '',
    updateNotes: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const payload = mode === 'pdf' 
      ? { mode: 'pdf', file: pdfFile, updateNotes: formData.updateNotes }
      : { mode: 'manual', ...formData }
    
    onNext(payload)
  }

  if (!mode) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Subject Property</h2>
        <p style={{ color: 'var(--brand-slate)', marginBottom: '32px' }}>
          How would you like to provide the subject property details?
        </p>

        <div style={{ display: 'grid', gap: '16px' }}>
          <button
            onClick={() => setMode('pdf')}
            className="card"
            style={{ 
              cursor: 'pointer', 
              textAlign: 'left',
              border: '2px solid var(--brand-mist)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-blue)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--brand-mist)'}
          >
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>📄 Upload MLS Sheet (PDF)</h3>
            <p style={{ color: 'var(--brand-slate)', fontSize: '14px' }}>
              If the property was recently listed, upload the MLS sheet PDF
            </p>
          </button>

          <button
            onClick={() => setMode('manual')}
            className="card"
            style={{ 
              cursor: 'pointer', 
              textAlign: 'left',
              border: '2px solid var(--brand-mist)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-blue)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--brand-mist)'}
          >
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>✍️ Enter Details Manually</h3>
            <p style={{ color: 'var(--brand-slate)', fontSize: '14px' }}>
              Enter property details manually if never listed or no PDF available
            </p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button
        onClick={() => setMode(null)}
        style={{
          background: 'none',
          color: 'var(--brand-blue)',
          marginBottom: '24px',
          fontSize: '14px'
        }}
      >
        ← Change input method
      </button>

      <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Subject Property</h2>
      <p style={{ color: 'var(--brand-slate)', marginBottom: '32px' }}>
        {mode === 'pdf' ? 'Upload the MLS sheet PDF' : 'Enter property details'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {mode === 'pdf' ? (
          <>
            <div className="card">
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                MLS Sheet PDF *
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                required
                style={{ padding: '8px' }}
              />
              {pdfFile && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--brand-slate)' }}>
                  Selected: {pdfFile.name}
                </p>
              )}
            </div>

            <div className="card">
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                Updates & Condition Notes Since Last Listing *
              </label>
              <textarea
                value={formData.updateNotes}
                onChange={(e) => handleInputChange('updateNotes', e.target.value)}
                placeholder="Any improvements, repairs, or changes since the property was last listed..."
                required
                rows={4}
              />
              <small style={{ display: 'block', marginTop: '8px', color: 'var(--brand-slate)' }}>
                This helps us adjust value for recent improvements
              </small>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                Property Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, Wilmington, NC 28401"
                required
              />
            </div>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                  Year Built
                </label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  placeholder="2020"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                  Lot Size
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    value={formData.lotSize}
                    onChange={(e) => handleInputChange('lotSize', e.target.value)}
                    placeholder="0.5"
                    step="0.01"
                    style={{ flex: 1 }}
                  />
                  <select
                    value={formData.lotSizeUnit}
                    onChange={(e) => handleInputChange('lotSizeUnit', e.target.value)}
                    style={{ width: '100px' }}
                  >
                    <option value="acres">acres</option>
                    <option value="sqft">sqft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="3"
                  min="0"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="2.5"
                  step="0.5"
                  min="0"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                  Heated Sqft *
                </label>
                <input
                  type="number"
                  value={formData.heatedSqft}
                  onChange={(e) => handleInputChange('heatedSqft', e.target.value)}
                  placeholder="2000"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="card">
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                Quality / Condition (1-10) *
              </label>
              <input
                type="range"
                value={formData.quality}
                onChange={(e) => handleInputChange('quality', parseInt(e.target.value))}
                min="1"
                max="10"
                step="1"
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '14px', color: 'var(--brand-slate)' }}>Poor (1)</span>
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--brand-blue)' }}>
                  {formData.quality}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--brand-slate)' }}>Excellent (10)</span>
              </div>
            </div>

            <div className="card">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  checked={formData.pool}
                  onChange={(e) => handleInputChange('pool', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span style={{ fontWeight: 600 }}>Pool</span>
              </label>

              {formData.pool && (
                <input
                  type="text"
                  value={formData.poolType}
                  onChange={(e) => handleInputChange('poolType', e.target.value)}
                  placeholder="e.g., In-ground, heated, saltwater"
                  style={{ marginTop: '8px' }}
                />
              )}
            </div>

            <div className="card">
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                Other Bonuses / Features
              </label>
              <textarea
                value={formData.bonuses}
                onChange={(e) => handleInputChange('bonuses', e.target.value)}
                placeholder="ADU, whole-home generator, new roof/HVAC, renovated kitchen, waterfront, dock, solar..."
                rows={3}
              />
              <small style={{ display: 'block', marginTop: '8px', color: 'var(--brand-slate)' }}>
                Any upgrades, features, or amenities worth noting
              </small>
            </div>

            <div className="card">
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                Recent Updates / Condition Notes *
              </label>
              <textarea
                value={formData.updateNotes}
                onChange={(e) => handleInputChange('updateNotes', e.target.value)}
                placeholder="Recent improvements, current condition, anything affecting value..."
                required
                rows={3}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
          Continue to Comparables
        </button>
      </form>
    </div>
  )
}
