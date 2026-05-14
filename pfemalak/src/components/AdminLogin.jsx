import { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [twofa, setTwofa]       = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.user?.role !== 'admin') { setError(true); setLoading(false); return; }
      localStorage.setItem('parlak_token', data.token);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => { if (onLoginSuccess) onLoginSuccess(data.user); }, 1000);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className={`al-page ${success ? 'al-success-state' : ''}`}>

      {/* ── Animated background ── */}
      <div className="al-grid" />
      <div className="al-orb al-orb1" />
      <div className="al-orb al-orb2" />
      <div className="al-orb al-orb3" />
      {[...Array(20)].map((_, i) => (
        <div key={i} className="al-particle" style={{ '--i': i }} />
      ))}

      {/* ── Card ── */}
      <div className="al-card">
        <div className="al-scanline" />

        {/* Header */}
        <div className="al-header">
          <div className={`al-icon-ring ${success ? 'al-ring-success' : ''}`}>
            <div className="al-ring r1" />
            <div className="al-ring r2" />
            <div className="al-icon-core">
              {success
                ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              }
            </div>
          </div>

          <div className="al-badge">RESTRICTED ACCESS</div>
          <h1 className="al-title">
            {success ? 'Accès Accordé' : 'Espace Admin'}
          </h1>
          <p className="al-sub">
            {success ? 'Redirection en cours…' : 'Panneau de contrôle ParLak'}
          </p>
        </div>

        {/* Form */}
        {!success && (
          <form onSubmit={handleLogin} className="al-form">

            <div className="al-field" style={{ '--d': '0.1s' }}>
              <label>Adresse e-mail</label>
              <div className="al-input-wrap">
                <svg className="al-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input type="email" placeholder="admin@parlak.com" value={email}
                  onChange={e => setEmail(e.target.value)} required autoComplete="username" />
                <div className="al-line" />
              </div>
            </div>

            <div className="al-field" style={{ '--d': '0.2s' }}>
              <label>Mot de passe</label>
              <div className="al-input-wrap">
                <svg className="al-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                <button type="button" className="al-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
                <div className="al-line" />
              </div>
            </div>

            <div className="al-field" style={{ '--d': '0.3s' }}>
              <label>Code 2FA</label>
              <div className="al-otp-wrap">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="al-otp-slot">
                    <span>{twofa[i] || ''}</span>
                    {twofa.length === i && <div className="al-otp-cursor" />}
                  </div>
                ))}
                <input
                  className="al-otp-hidden"
                  type="text" maxLength="6" value={twofa}
                  onChange={e => setTwofa(e.target.value.replace(/\D/g, ''))}
                  autoComplete="one-time-code"
                />
              </div>
            </div>

            {error && (
              <div className="al-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Identifiants incorrects ou accès refusé
              </div>
            )}

            <button type="submit" className={`al-btn ${loading ? 'al-btn--loading' : ''}`} disabled={loading}>
              <div className="al-btn-bg" />
              <span className="al-btn-text">
                {loading
                  ? <><span className="al-dot"/><span className="al-dot"/><span className="al-dot"/></>
                  : 'ACCÉDER AU PANNEAU'
                }
              </span>
              <div className="al-btn-shine" />
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="al-footer">
          <div className="al-divider">
            <span>ParLak</span>
            <span className="al-dot-sep">·</span>
            <span>Système Sécurisé</span>
            <span className="al-dot-sep">·</span>
            <span>v2.0</span>
          </div>
          <a className="al-back" href="/" onClick={e => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }}>
            ← Retour au site public
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
