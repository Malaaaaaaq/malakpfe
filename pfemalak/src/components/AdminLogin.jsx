import { useState } from 'react';
import { Shield, Key, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setError(false);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.user?.role !== 'admin') { 
        setError(true); 
        setLoading(false); 
        return; 
      }
      
      localStorage.setItem('parlak_token', data.token);
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => { 
        if (onLoginSuccess) onLoginSuccess(data.user); 
      }, 1000);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className={`al-page-wrapper ${success ? 'al-success-mode' : ''}`}>
      
      {/* Premium ambient backdrop glow */}
      <div className="al-ambient-glow" />
      <div className="al-grid-overlay" />

      <div className="al-card-container">
        
        {/* Sleek logo/icon badge */}
        <div className="al-badge-logo">
          <div className="al-badge-inner">
            <Shield className={`al-shield-icon ${success ? 'pulse' : ''}`} size={28} />
          </div>
        </div>

        <h1 className="al-main-title">
          {success ? 'Accès Autorisé' : 'Espace Administrateur'}
        </h1>
        <p className="al-main-subtitle">
          {success ? 'Chargement de votre console...' : 'Système de gestion globale de ParLak'}
        </p>

        {!success && (
          <form onSubmit={handleLogin} className="al-glass-form">
            
            {/* Admin Select Input */}
            <div className="al-input-group">
              <label className="al-label">Identité Admin</label>
              <div className="al-input-field-wrapper">
                <Shield className="al-input-icon" size={18} />
                <select
                  className="al-select-element"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                >
                  <option value="" disabled>Sélectionnez votre compte...</option>
                  <option value="malak.tamrani@parlak.ma">Malak Tamrani</option>
                  <option value="fatimazahra.hofr@parlak.ma">Fatima Zahra Hofr</option>
                </select>
                <div className="al-select-arrow-custom">▼</div>
              </div>
            </div>

            {/* Password Input */}
            <div className="al-input-group">
              <label className="al-label">Clé d'Accès</label>
              <div className="al-input-field-wrapper">
                <Key className="al-input-icon" size={18} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="al-input-element"
                />
                <button
                  type="button"
                  className="al-toggle-password-btn"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Afficher le mot de passe"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="al-error-alert animate-shake">
                <div className="al-error-dot" />
                <span>Clé d'accès incorrecte. Veuillez réessayer.</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`al-submit-action-btn ${loading ? 'btn-loading' : ''}`}
              disabled={loading || !email}
            >
              {loading ? (
                <span className="btn-content-loading">
                  <Loader2 className="spinner-icon animate-spin" size={18} />
                  Vérification...
                </span>
              ) : (
                'INITIALISER LA SESSION'
              )}
            </button>
          </form>
        )}

        {/* Minimal Footer */}
        <div className="al-footer-section">
          <div className="al-divider-line" />
          <a
            href="/"
            className="al-back-to-public-link"
            onClick={e => {
              e.preventDefault();
              window.location.hash = '';
              window.location.reload();
            }}
          >
            <ArrowLeft size={14} style={{ marginRight: '6px' }} />
            Retour au site public
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
