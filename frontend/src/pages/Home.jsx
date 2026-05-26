import { useState } from "react";
import { analyzeResume } from "../services/api";

/* ── Score Ring ── */
const ScoreRing = ({ score }) => {
  const radius = 50;
  const circ = 2 * Math.PI * radius;
  const filled = (score / 100) * circ;
  const color = score >= 75 ? "var(--green)" : score >= 50 ? "var(--amber)" : "var(--red)";
  return (
    <div className="score-ring-wrapper">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--border)" strokeWidth="9" />
        <circle
          cx="65" cy="65" r={radius}
          fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dasharray 1.1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="score-number" style={{ color }}>
        {score}
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
};

/* ── Auth mock state ── */
const MOCK_USER = { name: "Alex Johnson", email: "alex@example.com", initials: "AJ" };

export default function Home({ dark, setDark }) {
  const [resumeText, setResumeText]     = useState("");
  const [jobDesc, setJobDesc]           = useState("");
  const [result, setResult]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [user, setUser]                 = useState(null);   // null = signed out

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      setError("Please fill in both fields before analyzing.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await analyzeResume(resumeText, jobDesc);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = () => {
    if (user) {
      setUser(null);
    } else {
      // mock sign-in
      setUser(MOCK_USER);
    }
  };

  return (
    <>
      {/* ─── Loading bar (top of page) ─── */}
      {loading && (
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>
      )}

      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          {/* Logo + theme toggle */}
          <div className="logo-row">
            <div className="logo-inner">
              <div className="logo-mark">ATS</div>
              <div>
                <div className="site-title">ResumeAI</div>
                <div className="site-sub">ATS Optimizer</div>
              </div>
            </div>
            <button className="theme-btn" onClick={() => setDark(d => !d)} title="Toggle theme">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Input fields */}
          <div className="sidebar-fields">
            <div>
              <div className="field-label">
                <span className="label-dot" style={{ background: "#818cf8" }} />
                Your Resume
              </div>
              <textarea
                className="field-textarea"
                placeholder="Paste your resume text here…"
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={8}
              />
            </div>

            <div>
              <div className="field-label">
                <span className="label-dot" style={{ background: "#34d399" }} />
                Job Description
              </div>
              <textarea
                className="field-textarea"
                placeholder="Paste the target job description here…"
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                rows={8}
              />
            </div>

            {error && <p className="error-msg">⚠ {error}</p>}

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" /> Analyzing…</>
                : <><span>⚡</span> Analyze ATS Score</>
              }
            </button>
          </div>
        </div>

        {/* Spacer pushes auth to bottom */}
        <div className="sidebar-spacer" />

      </aside>

      {/* ─── Main content ─── */}
      <main className="main">
        {!loading && !result && (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <div className="empty-title">Ready to analyze</div>
            <p className="empty-sub">
              Paste your resume and a job description in the sidebar, then click
              <strong> Analyze ATS Score</strong> to see your results.
            </p>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="loading-dots">
              <span /><span /><span />
            </div>
            <div className="loading-text">Analyzing your resume…</div>
            <div className="loading-sub">Running ATS compatibility check via Ollama</div>
          </div>
        )}

        {!loading && result && (
          <div className="results-panel">
            {/* Header + score */}
            <div className="results-header">
              <div>
                <div className="results-title">ATS Analysis Complete</div>
                <div className="results-sub">Here's how your resume performs against the job</div>
              </div>
              <ScoreRing score={result.ats_score} />
            </div>

            {/* Summary */}
            {result.summary && (
              <div className="result-card full">
                <div className="card-title">📋 Summary</div>
                <p className="summary-text">{result.summary}</p>
              </div>
            )}

            {/* Strengths + Weaknesses */}
            <div className="cards-grid">
              {result.strengths?.length > 0 && (
                <div className="result-card">
                  <div className="card-title">✅ Strengths</div>
                  <ul className="bullet-list green">
                    {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {result.weaknesses?.length > 0 && (
                <div className="result-card">
                  <div className="card-title">⚠️ Weaknesses</div>
                  <ul className="bullet-list amber">
                    {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Missing keywords */}
            {result.missing_keywords?.length > 0 && (
              <div className="result-card full">
                <div className="card-title">🔍 Missing Keywords</div>
                <div className="chip-group">
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} className="chip">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}