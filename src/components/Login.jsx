import React, { useState } from 'react';
import './Login.css';

const Login = ({ onBack, lang = 'FR' }) => {
  const t = {
    FR: {
      welcome: "Bienvenue 👋",
      sub: "Connectez-vous pour continuer",
      admin: "Administrateur",
      agent: "Agent",
      client: "Client",
      emailLabel: "Adresse e-mail",
      emailPass: "votre@email.com",
      agentLabel: "Matricule Agent",
      agentPass: "Ex: AG-2024-88",
      adminLabel: "Identifiant Admin",
      adminPass: "Nom d'utilisateur",
      passLabel: "Mot de passe",
      passPlaceholder: "Entrez votre mot de passe",
      securityLabel: "Code de Sécurité (2FA)",
      remember: "Se souvenir de moi",
      forgot: "Mot de passe oublié ?",
      btnText: "SE CONNECTER",
      btnSuccess: "✓ Accès autorisé",
      error: "⚠ Identifiants incorrects. Veuillez réessayer.",
      noAccount: "Pas encore de compte ?",
      create: "Créer un compte",
      authorized: "Accès autorisé ✓",
      manageTitle: "Gérez votre parking",
      manageSub: "Surveillance · Réservation · Contrôle d'accès"
    },
    EN: {
      welcome: "Welcome Back 👋",
      sub: "Login to your account",
      admin: "Administrator",
      agent: "Agent",
      client: "Client",
      emailLabel: "Email Address",
      emailPass: "your@email.com",
      agentLabel: "Agent ID",
      agentPass: "Ex: AG-2024-88",
      adminLabel: "Admin Username",
      adminPass: "Enter username",
      passLabel: "Password",
      passPlaceholder: "Enter your password",
      securityLabel: "Security Code (2FA)",
      remember: "Remember me",
      forgot: "Forgot password?",
      btnText: "LOG IN",
      btnSuccess: "✓ Access Granted",
      error: "⚠ Incorrect credentials. Please try again.",
      noAccount: "No account yet?",
      create: "Create an account",
      authorized: "Access Granted ✓",
      manageTitle: "Manage your parking",
      manageSub: "Monitoring · Booking · Access Control"
    }
  }[lang];

  const [role, setRole] = useState(lang === 'FR' ? 'Administrateur' : 'Administrator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@parklak.ma' || email === 'admin') {
        setSuccess(true);
      } else {
        setError(true);
      }
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-main">
        <div className="login-left">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
          <div className="circle c3"></div>
          <div className="dot-sm d1"></div>
          <div className="dot-sm d2"></div>

          <div className="scene">
            <div className="board">
              <div className="board-sign">
                <div className="board-p">P</div>
                <div className="board-row">
                  <div className="board-bar full"></div>
                  <div className="board-bar full"></div>
                  <div className="board-bar"></div>
                </div>
              </div>
              <div className="board-pole"></div>
            </div>

            <div className="key-bubble">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7.5" cy="15.5" r="5.5"/>
                <path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/>
              </svg>
              <span>{t.authorized}</span>
            </div>

            <div className="car">
              <svg width="120" viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="22" width="112" height="26" rx="8" fill="#1e3a7a"/>
                <path d="M28 22 L38 8 L82 8 L96 22Z" fill="#1a3060"/>
                <circle cx="30" cy="48" r="8" fill="#0f172a"/>
                <circle cx="90" cy="48" r="8" fill="#0f172a"/>
                <rect x="46" y="38" width="28" height="8" rx="2" fill="#fff" opacity=".9"/>
                <text x="60" y="45" fontFamily="monospace" fontSize="7" fill="#0f172a" textAnchor="middle" fontWeight="bold">PARLAK-26</text>
              </svg>
            </div>

            <div className="person">
              <svg width="100" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="28" r="20" fill="#fde68a"/>
                <rect x="30" y="50" width="40" height="55" rx="10" fill="#1e3a7a"/>
                <rect x="32" y="100" width="14" height="55" rx="7" fill="#334155"/>
                <rect x="54" y="100" width="14" height="55" rx="7" fill="#334155"/>
              </svg>
            </div>

            <div className="ground"></div>

            <div className="caption">
              <h2>{t.manageTitle}</h2>
              <p>{t.manageSub}</p>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="card">
             <button className="back-btn" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
            <div className="card-title">{t.welcome}</div>
            <div className="card-sub">{t.sub}</div>

            <div className="role-tabs">
              {[t.admin, t.agent, t.client].map(r => (
                <div 
                  key={r}
                  className={`role-tab ${role === r ? 'active' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r}
                </div>
              ))}
            </div>

            <form onSubmit={handleLogin}>
              {(role === t.client) && (
                <div className="field">
                  <label>{t.emailLabel}</label>
                  <div className="input-wrap">
                    <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    <input type="email" placeholder={t.emailPass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
              )}

              {(role === t.agent) && (
                <div className="field">
                  <label>{t.agentLabel}</label>
                  <div className="input-wrap">
                    <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                    <input type="text" placeholder={t.agentPass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
              )}

              {(role === t.admin) && (
                <div className="field">
                  <label>{t.adminLabel}</label>
                  <div className="input-wrap">
                    <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <input type="text" placeholder={t.adminPass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
              )}

              <div className="field">
                <label>{t.passLabel}</label>
                <div className="input-wrap">
                  <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <input type={showPass ? "text" : "password"} placeholder={t.passPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

              {role === t.admin && (
                <div className="field">
                  <label>{t.securityLabel}</label>
                  <div className="input-wrap">
                    <input type="text" maxLength="6" placeholder="______" style={{ letterSpacing: '8px', textAlign: 'center' }} />
                  </div>
                </div>
              )}

              <div className="row-extra">
                <label className="remember"><input type="checkbox"/> {t.remember}</label>
                <a href="#" className="forgot">{t.forgot}</a>
              </div>

              <button type="submit" className={`btn-submit ${loading ? 'loading' : ''}`} style={success ? { background: '#10b981' } : {}} disabled={loading}>
                <span className="btn-text">{success ? t.btnSuccess : t.btnText}</span>
                <div className="spinner"><div className="ring"></div></div>
              </button>
            </form>

            <div className={`alert ${error ? 'show' : ''}`}>{t.error}</div>
            <div className="signup-row">{t.noAccount} <a href="#">{t.create}</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;