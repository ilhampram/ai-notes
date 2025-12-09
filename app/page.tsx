"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("short");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) {
      setError("Teks tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan.");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setText("");
    setSummary("");
    setError("");
  }

  return (
    <div className="ai-app">
      {/* NAVBAR */}
      <header className="ai-navbar">
        <div className="ai-navbar-inner">
          <div className="ai-logo">
            <span className="ai-logo-mark">📝</span>
            <span className="ai-logo-text">SmartNotes AI</span>
          </div>
          <nav className="ai-nav-links">
            <a href="#features">Fitur</a>
            <a href="#how-it-works">Cara kerja</a>
            <a href="#summary">Demo</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="ai-hero">
        <div className="ai-hero-inner">
          <div className="ai-hero-text">
            <h1>Ringkas catatan panjang dalam hitungan detik.</h1>
            <p>Tempelkan catatan kuliah, meeting, atau artikel panjang. Biarkan AI merangkum menjadi poin-poin penting yang siap dipakai.</p>
            <ul className="ai-hero-bullets">
              <li>Ringkasan singkat 3–5 kalimat</li>
              <li>Poin-poin bullet yang rapi</li>
              <li>Action items untuk tugas & to-do</li>
            </ul>
            <a href="#summary" className="ai-hero-cta">
              Coba sekarang
            </a>
          </div>
          <div className="ai-hero-highlight">
            <p className="ai-hero-badge">Beta • Gratis dipakai</p>
            <p className="ai-hero-mini">&#34;Dalam 1 klik, catatan berantakan jadi terstruktur.&#34;</p>
          </div>
        </div>
      </section>

      {/* MAIN CARD: FORM + HASIL */}
      <main id="summary" className="ai-main">
        <section className="ai-card">
          <div className="ai-card-header">
            <h2>AI Summary</h2>
            <p>Tempel teksmu, pilih mode ringkasan, lalu klik Generate.</p>
          </div>

          <form onSubmit={handleSubmit} className="ai-form">
            <div className="ai-form-group">
              <label htmlFor="note-text">Teks catatan</label>
              <textarea id="note-text" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Tempel teks panjangmu di sini..." />
              <div className="ai-form-hint">Panjang teks sedang saja dulu saat testing. Kalau sudah stabil baru coba teks lebih besar.</div>
            </div>

            <div className="ai-form-row">
              <div className="ai-form-group">
                <label htmlFor="mode">Mode ringkasan</label>
                <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="short">Ringkasan singkat (3–5 kalimat)</option>
                  <option value="bullets">Poin-poin bullet</option>
                  <option value="action_items">Action items / tugas</option>
                </select>
              </div>

              <div className="ai-form-actions">
                <button type="button" className="ai-button ghost" onClick={handleClear} disabled={loading && !text}>
                  Bersihkan
                </button>
                <button type="submit" className="ai-button primary" disabled={loading}>
                  {loading ? "Memproses..." : "Generate Summary"}
                </button>
              </div>
            </div>

            {error && <p className="ai-error">Error: {error}</p>}
          </form>

          {summary && (
            <div className="ai-summary">
              <div className="ai-summary-header">
                <h3>Hasil ringkasan</h3>
                <button
                  type="button"
                  className="ai-button small"
                  onClick={() => {
                    navigator.clipboard.writeText(summary);
                  }}
                >
                  Copy
                </button>
              </div>
              <div className="ai-summary-body">
                <pre>{summary}</pre>
              </div>
            </div>
          )}
        </section>

        {/* SECTION FITUR */}
        <section id="features" className="ai-section">
          <h2>Kenapa pakai SmartNotes AI?</h2>
          <div className="ai-feature-grid">
            <div className="ai-feature-card">
              <h3>Hemat waktu</h3>
              <p>Tidak perlu baca ulang teks panjang. Fokus langsung ke poin penting dan action items.</p>
            </div>
            <div className="ai-feature-card">
              <h3>Multimode</h3>
              <p>Pilih ringkasan singkat, bullet point, atau daftar tugas sesuai kebutuhanmu.</p>
            </div>
            <div className="ai-feature-card">
              <h3>Cocok untuk belajar</h3>
              <p>Bantu merapikan catatan kuliah, jurnal, atau materi kursus menjadi lebih terstruktur.</p>
            </div>
          </div>
        </section>

        {/* SECTION CARA KERJA */}
        <section id="how-it-works" className="ai-section">
          <h2>Cara kerja</h2>
          <ol className="ai-steps">
            <li>Copy-paste catatan atau teks panjang ke dalam textarea.</li>
            <li>Pilih mode ringkasan yang kamu inginkan.</li>
            <li>Klik “Generate Summary” dan tunggu beberapa detik.</li>
            <li>Copy hasil ringkasan dan gunakan di mana pun kamu butuh.</li>
          </ol>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ai-footer">
        <p>Dibuat dengan Next.js & Groq • Project latihan AI Notes / Summary</p>
      </footer>
    </div>
  );
}
