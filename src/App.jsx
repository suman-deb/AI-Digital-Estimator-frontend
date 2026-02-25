import { useState } from "react";
import "./App.css";

function App() {
  const [rfpText, setRfpText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateROM = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://func-digital-estimator-czhpbua7ggbqd7hs.swedencentral-01.azurewebsites.net/api/generate_rom_api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rfp_text: rfpText }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const useSample = () => {
    setRfpText(
      `We need a data platform for 500 users, ~2TB data, 6 month timeline. Medium complexity. Full testing.`
    );
  };

  return (
    <div className="estimator-root">
      <header className="estimator-header">
        <div className="brand">
          <div className="brand-logo">🤖</div>
          <div>
            <h1>AI Digital Estimator</h1>
            <p className="subtitle">Quick ROM estimates powered by Azure OpenAI</p>
          </div>
        </div>
        <div className="header-illustration" aria-hidden>
          {/* Decorative SVG */}
          <svg width="120" height="60" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#06b6d4" stopOpacity="0.9" />
                <stop offset="1" stopColor="#7c3aed" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <rect x="8" y="12" width="160" height="96" rx="12" fill="url(#g1)" opacity="0.12" />
            <g fill="#fff" opacity="0.18">
              <circle cx="196" cy="24" r="18" />
              <circle cx="220" cy="56" r="8" />
            </g>
          </svg>
        </div>
      </header>

      <main className="estimator-main">
        <section className="panel input-panel">
          <label className="label">Opportunity Brief</label>
          <textarea
            className="rfp-textarea"
            rows={8}
            placeholder="Paste the opportunity brief or RFP summary here..."
            value={rfpText}
            onChange={(e) => setRfpText(e.target.value)}
          />

          <div className="controls">
            <button className="btn primary" onClick={generateROM} disabled={loading}>
              {loading ? "Generating…" : "Generate ROM"}
            </button>
            <button className="btn" onClick={useSample} disabled={loading}>
              Use Sample
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </section>

        <section className="panel results-panel">
          <div className="card">
            <div className="card-header">
              <h3>Extracted Data</h3>
            </div>
            <div className="card-body">
              {!result && <div className="empty">No result yet — run an estimate</div>}
              {result && (
                <pre className="json-output">{JSON.stringify(result.extracted_data, null, 2)}</pre>
              )}
            </div>
          </div>

          <div className="card rom-card">
            <div className="card-header">
              <h3>ROM Result</h3>
            </div>
            <div className="card-body">
              {result ? (
                <div className="rom-grid">
                  <div className="rom-item">
                    <div className="rom-label">Hours</div>
                    <div className="rom-value">{result.rom_result?.rom_hours ?? "—"}</div>
                  </div>
                  <div className="rom-item">
                    <div className="rom-label">Cost (USD)</div>
                    <div className="rom-value">{result.rom_result?.rom_cost ?? "—"}</div>
                  </div>
                </div>
              ) : (
                <div className="empty">Results appear here after running the estimator.</div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="estimator-footer">Built with Azure Functions • Cosmos DB • Azure OpenAI</footer>
    </div>
  );
}

export default App;