export default function ResultsView({ data, onStartNew }) {
  const downloadPDF = () => {
    console.log('Downloading PDF for CMA:', data.id)
    
    // Encode the entire CMA data as a URL parameter
    const dataParam = encodeURIComponent(JSON.stringify(data))
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-cma?data=${dataParam}`
    
    // Open in new window which will show the HTML that can be printed to PDF
    const printWindow = window.open(url, '_blank')
    
    // Give it a moment to load, then trigger print dialog
    setTimeout(() => {
      if (printWindow) {
        printWindow.focus()
        printWindow.print()
      }
    }, 1500)
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
          <p style={{ fontSize: '18px', fontWeight: 600 }}>{data.subject.address || 'Subject Property'}</p>
        </div>

        <div className="card">
          <p style={{ fontSize: '14px', color: 'var(--brand-slate)', marginBottom: '4px' }}>Suggested Value</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--brand-blue)' }}>
            ${data.suggestedValue.toLocaleString()}
          </p>
          {data.valueRange && (
            <p style={{ fontSize: '12px', color: 'var(--brand-slate)', marginTop: '4px' }}>
              Range: ${data.valueRange.low.toLocaleString()} - ${data.valueRange.high.toLocaleString()}
            </p>
          )}
        </div>

        <div className="card">
          <p style={{ fontSize: '14px', color: 'var(--brand-slate)', marginBottom: '4px' }}>Analysis</p>
          <p style={{ fontSize: '18px', fontWeight: 600 }}>
            {data.comps.length} comps + {data.competition?.length || 0} active
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button onClick={downloadPDF} className="btn-primary" style={{ flex: 1 }}>
          📥 Download PDF Report
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
        
        {/* Market Narrative */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--brand-slate)' }}>
            Market Narrative
          </h4>
          <div style={{ 
            background: 'var(--brand-wash)', 
            borderLeft: '4px solid var(--brand-blue)',
            padding: '16px',
            lineHeight: '1.6', 
            color: 'var(--brand-navy)' 
          }}>
            {data.narrative}
          </div>
        </div>

        {/* Comparable Properties */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--brand-slate)' }}>
            Comparable Sold Properties
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--brand-navy)', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Sold Price</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Adjusted Price</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Sqft</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>DOM</th>
                </tr>
              </thead>
              <tbody>
                {data.comps.map((comp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--brand-mist)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600 }}>{comp.address}</div>
                      {comp.notes && (
                        <div style={{ fontSize: '12px', color: 'var(--brand-slate)', marginTop: '4px' }}>
                          {comp.notes}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      ${comp.originalPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: 'var(--brand-blue)' }}>
                      ${comp.adjustedPrice.toLocaleString()}
                      {comp.totalAdjustment !== undefined && (
                        <div style={{ 
                          fontSize: '11px', 
                          color: comp.totalAdjustment >= 0 ? '#059669' : '#DC2626',
                          marginTop: '2px'
                        }}>
                          {comp.totalAdjustment >= 0 ? '+' : ''}${comp.totalAdjustment.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {comp.heatedSqft?.toLocaleString() || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{comp.dom || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Competition */}
        {data.competition && data.competition.length > 0 && (
          <div>
            <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--brand-slate)' }}>
              Active Competition ({data.competition.length} properties)
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#F59E0B', color: 'white' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>List Price</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Adjusted Price</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Sqft</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>DOM</th>
                  </tr>
                </thead>
                <tbody>
                  {data.competition.map((comp, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--brand-mist)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{comp.address}</div>
                        {comp.notes && (
                          <div style={{ fontSize: '12px', color: 'var(--brand-slate)', marginTop: '4px' }}>
                            {comp.notes}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        ${comp.listPrice?.toLocaleString() || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#F59E0B' }}>
                        ${comp.adjustedPrice?.toLocaleString() || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {comp.heatedSqft?.toLocaleString() || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{comp.dom || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="card" style={{ 
        marginTop: '24px', 
        background: '#EFF6FF', 
        borderLeft: '4px solid #3B82F6' 
      }}>
        <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#1E40AF' }}>
          💡 How to Save as PDF
        </h4>
        <p style={{ fontSize: '13px', color: '#1E3A8A', lineHeight: '1.5', margin: 0 }}>
          Click "Download PDF Report" above. A new window will open with your professionally formatted 4-page CMA. 
          Use your browser's Print function (Ctrl/Cmd+P) and select "Save as PDF" as the destination.
        </p>
      </div>
    </div>
  )
}
