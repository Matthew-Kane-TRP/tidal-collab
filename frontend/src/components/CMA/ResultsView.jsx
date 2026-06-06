export default function ResultsView({ data, onStartNew }) {
  const downloadPDF = () => {
    // Trigger PDF download from Supabase Edge Function
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-cma?id=${data.id}`
    window.open(url, '_blank')
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '24px', background: 'var(--brand-blue)', color: 'white' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px', color: 'white' }}>CMA Complete! 🎉</h2>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          Your professional CMA is ready to download
        </p>
      </div>

      {/* Quick summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <p style={{ fontSize: '14px', color: 'var(--brand-slate)', marginBottom: '4px' }}>Subject Address</p>
          <p style={{ fontSize: '18px', fontWeight: 600 }}>{data.subject.address}</p>
        </div>

        <div className="card">
          <p style={{ fontSize: '14px', color: 'var(--brand-slate)', marginBottom: '4px' }}>Suggested Value</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--brand-blue)' }}>
            ${data.suggestedValue.toLocaleString()}
          </p>
        </div>

        <div className="card">
          <p style={{ fontSize: '14px', color: 'var(--brand-slate)', marginBottom: '4px' }}>Comps Analyzed</p>
          <p style={{ fontSize: '18px', fontWeight: 600 }}>{data.comps.length} properties</p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button onClick={downloadPDF} className="btn-primary" style={{ flex: 1 }}>
          📥 Download PDF
        </button>
        <button 
          onClick={onStartNew}
          style={{
            flex: 1,
            background: 'white',
            border: '2px solid var(--brand-blue)',
            color: 'var(--brand-blue)',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ➕ New CMA
        </button>
      </div>

      {/* Preview */}
      <div className="card">
        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Preview</h3>
        
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--brand-slate)' }}>
            Market Narrative
          </h4>
          <p style={{ lineHeight: '1.6', color: 'var(--brand-navy)' }}>
            {data.narrative}
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--brand-slate)' }}>
            Comparable Properties
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--brand-navy)', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Original Price</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Adjusted Price</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>DOM</th>
                </tr>
              </thead>
              <tbody>
                {data.comps.map((comp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--brand-mist)' }}>
                    <td style={{ padding: '12px' }}>{comp.address}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      ${comp.originalPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                      ${comp.adjustedPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{comp.dom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
