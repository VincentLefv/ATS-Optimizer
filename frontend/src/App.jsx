import { useState, useEffect } from "react";
import Home from "./pages/Home";

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.className = dark ? "theme-dark" : "theme-light";
  }, [dark]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Theme tokens ── */
        .theme-dark {
          --bg:         #0a0b10;
          --sidebar-bg: #0f1117;
          --surface:    #161820;
          --surface2:   #1c1f2b;
          --border:     rgba(255,255,255,0.07);
          --text:       #e8eaf0;
          --text2:      #c8ccd8;
          --muted:      #5a6072;
          --accent:     #818cf8;
          --accent-glow:rgba(129,140,248,0.28);
          --green:      #22c55e;
          --amber:      #f59e0b;
          --red:        #ef4444;
          --ph:         #2e3140;
        }
        .theme-light {
          --bg:         #f4f5f9;
          --sidebar-bg: #ffffff;
          --surface:    #ffffff;
          --surface2:   #f0f1f7;
          --border:     rgba(0,0,0,0.08);
          --text:       #1a1c26;
          --text2:      #3a3d52;
          --muted:      #8b90a8;
          --accent:     #6366f1;
          --accent-glow:rgba(99,102,241,0.18);
          --green:      #16a34a;
          --amber:      #d97706;
          --red:        #dc2626;
          --ph:         #c5c8d8;
        }

        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          transition: background 0.25s, color 0.25s;
        }

        /* ── Shell ── */
        .shell {
          display: flex;
          min-height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        /* ══════════════════════════════════════
           SIDEBAR
        ══════════════════════════════════════ */
        .sidebar {
          width: 300px;
          min-width: 300px;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          transition: background 0.25s, border-color 0.25s;
        }

        .sidebar-top {
          padding: 24px 20px 20px;
          border-bottom: 1px solid var(--border);
        }

        .logo-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .logo-inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-mark {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: var(--accent);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 1px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 16px var(--accent-glow);
        }
        .site-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.2px;
        }
        .site-sub {
          color: var(--muted);
          font-size: 11px;
          margin-top: 1px;
        }

        /* Theme toggle */
        .theme-btn {
          width: 34px; height: 34px;
          border-radius: 9px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text);
          font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .theme-btn:hover { background: var(--surface); transform: scale(1.08); }

        /* Fields */
        .sidebar-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .field-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .label-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .field-textarea {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.6;
          padding: 11px 13px;
          resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.25s;
          outline: none;
          min-height: 110px;
        }
        .field-textarea::placeholder { color: var(--ph); }
        .field-textarea:focus {
          border-color: rgba(129,140,248,0.5);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        /* Analyze button */
        .analyze-btn {
          width: 100%;
          margin-top: 4px;
          padding: 13px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px var(--accent-glow);
        }
        .analyze-btn:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
        }
        .analyze-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Error */
        .error-msg {
          font-size: 12px;
          color: var(--red);
          padding: 9px 12px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          margin-top: 2px;
        }

        /* Sidebar spacer */
        .sidebar-spacer { flex: 1; }

        /* Auth section */
        .sidebar-auth {
          padding: 16px 20px;
          border-top: 1px solid var(--border);
        }
        .auth-btn {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .auth-btn.sign-in {
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text);
        }
        .auth-btn.sign-in:hover { background: var(--surface); transform: translateY(-1px); }
        .auth-btn.sign-out {
          background: transparent;
          border: 1px solid rgba(239,68,68,0.3);
          color: var(--red);
        }
        .auth-btn.sign-out:hover {
          background: rgba(239,68,68,0.07);
          transform: translateY(-1px);
        }
        .auth-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 2px 12px;
        }
        .auth-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .auth-name { font-size: 13px; font-weight: 500; }
        .auth-email { font-size: 11px; color: var(--muted); }

        /* ══════════════════════════════════════
           MAIN
        ══════════════════════════════════════ */
        .main {
          flex: 1;
          min-width: 0;
          padding: 40px 36px 60px;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          transition: background 0.25s;
        }

        /* Loading bar */
        .loading-bar-track {
          position: fixed;
          top: 0; left: 300px; right: 0;
          height: 3px;
          background: var(--border);
          z-index: 100;
          overflow: hidden;
        }
        .loading-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), #a78bfa, var(--accent));
          background-size: 200% 100%;
          animation: barSlide 1.4s linear infinite;
          border-radius: 0 2px 2px 0;
        }
        @keyframes barSlide {
          0%   { width: 0%; margin-left: 0; }
          50%  { width: 70%; }
          100% { width: 100%; margin-left: 0; opacity: 0; }
        }

        /* Empty state */
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--muted);
          text-align: center;
          padding: 60px 20px;
          animation: fadeIn 0.4s ease;
        }
        .empty-icon {
          font-size: 48px;
          opacity: 0.4;
          margin-bottom: 4px;
        }
        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--text2);
        }
        .empty-sub { font-size: 13.5px; max-width: 300px; line-height: 1.6; }

        /* Loading state */
        .loading-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          animation: fadeIn 0.3s ease;
        }
        .loading-dots {
          display: flex; gap: 7px;
        }
        .loading-dots span {
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--accent);
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse {
          0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
          40%          { transform: scale(1.1); opacity: 1; }
        }
        .loading-text {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text2);
        }
        .loading-sub { font-size: 13px; color: var(--muted); }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Results ── */
        .results-panel {
          display: flex;
          flex-direction: column;
          gap: 22px;
          animation: fadeUp 0.45s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        .results-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: -0.3px;
        }
        .results-sub { color: var(--muted); font-size: 13px; margin-top: 3px; }

        /* Score ring */
        .score-ring-wrapper {
          position: relative;
          width: 130px; height: 130px;
          flex-shrink: 0;
        }
        .score-number {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          line-height: 1;
        }
        .score-label {
          font-size: 10px;
          font-weight: 500;
          color: var(--muted);
          margin-top: 3px;
        }

        /* Cards grid */
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 700px) {
          .cards-grid { grid-template-columns: 1fr; }
        }

        .result-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          transition: background 0.25s;
        }
        .result-card.full { grid-column: 1 / -1; }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--muted);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .bullet-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .bullet-list li {
          padding-left: 16px;
          position: relative;
          font-size: 13.5px;
          color: var(--text2);
          line-height: 1.5;
        }
        .bullet-list li::before {
          content: '';
          position: absolute;
          left: 0; top: 7px;
          width: 6px; height: 6px;
          border-radius: 50%;
        }
        .bullet-list.green li::before { background: var(--green); }
        .bullet-list.amber li::before { background: var(--amber); }

        .summary-text {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.8;
        }

        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .chip {
          padding: 4px 11px;
          background: rgba(129,140,248,0.1);
          border: 1px solid rgba(129,140,248,0.22);
          color: var(--accent);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .theme-light .chip {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.2);
        }

        /* Spinner inline */
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .shell { flex-direction: column; }
          .sidebar {
            width: 100%; min-width: unset;
            height: auto; position: static;
          }
          .loading-bar-track { left: 0; }
          .main { padding: 24px 18px 48px; }
        }
      `}</style>

      <div className="shell">
        <Home dark={dark} setDark={setDark} />
      </div>
    </>
  );
}