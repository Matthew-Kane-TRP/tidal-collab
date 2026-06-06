export default function ProcessingView() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div className="card">
        <div style={{
          width: '80px',
          height: '80px',
          border: '6px solid var(--brand-mist)',
          borderTopColor: 'var(--brand-blue)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 24px'
        }} />
        
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Analyzing Your Comparables</h2>
        
        <div style={{ color: 'var(--brand-slate)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '12px' }}>🔍 Extracting property details from PDFs...</p>
          <p style={{ marginBottom: '12px' }}>📊 Calculating price adjustments...</p>
          <p style={{ marginBottom: '12px' }}>✍️ Generating market narrative...</p>
        </div>
        
        <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--brand-slate)' }}>
          This usually takes 30-60 seconds
        </p>
      </div>
    </div>
  )
}
