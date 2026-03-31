
import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [manualText, setManualText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleTextChange = (e) => {
    setManualText(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (manualText) formData.append('text', manualText);
      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, background: '#fafbfc' }}>
      <h2>Document Risk Analyzer</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>
          Upload PDF or Image:
          <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
        </label>
        <label>
          Or enter text manually:
          <textarea value={manualText} onChange={handleTextChange} rows={4} placeholder="Paste or type text here..." />
        </label>
        <button type="submit" disabled={loading} style={{ padding: '8px 0', fontWeight: 600 }}>
          {loading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24, background: '#f6f8fa', padding: 16, borderRadius: 6 }}>
          <h3>Analysis Result</h3>
          <div><strong>Risk Score:</strong> {result.riskScore}</div>
          <div><strong>Missing Documents:</strong> {result.missingDocuments?.length ? result.missingDocuments.join(', ') : 'None'}</div>
          <div><strong>Recommendation:</strong> <span style={{ color: result.recommendation === 'Safe' ? 'green' : result.recommendation === 'Risky' ? 'orange' : 'red', fontWeight: 700 }}>{result.recommendation}</span></div>
        </div>
      )}
    </div>
  );
}

export default App;
