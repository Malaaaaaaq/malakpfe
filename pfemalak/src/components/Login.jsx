import React, { useState } from 'react';
import Lottie from 'lottie-react';
import loginAnimation from '../animations/login.json';
import './Login.css';

const Login = ({ onBack, onSignup, onLoginSuccess, lang = 'FR' }) => {
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

  const [role, setRole] = useState(lang === 'FR' ? 'Agent' : 'Agent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError('default');
        setLoading(false);
        return;
      }

      // Block admin role from public login page
      if (data.user?.role === 'admin') {
        setError('admin_blocked');
        setLoading(false);
        return;
      }

      localStorage.setItem('parlak_token', data.token);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(data.user);
      }, 800);
    } catch {
      setError('default');
      setLoading(false);
    }
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

          <div className="scene lottie-scene">
            <Lottie animationData={loginAnimation} loop={true} autoplay={true} style={{ width: '100%', height: '100%', maxHeight: '400px' }} />
            
            <div className="caption" style={{ marginTop: '20px' }}>
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
              {[t.agent, t.client].map(r => (
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

<div className="field">
                <label>{t.passLabel}</label>
                <div className="input-wrap">
                  <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <input type={showPass ? "text" : "password"} placeholder={t.passPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

<div className="row-extra">
                <label className="remember"><input type="checkbox"/> {t.remember}</label>
                <a href="#" className="forgot">{t.forgot}</a>
              </div>

              <button type="submit" className={`btn-submit ${loading ? 'loading' : ''}`} style={success ? { background: '#10b981' } : {}} disabled={loading}>
                <span className="btn-text">{success ? t.btnSuccess : t.btnText}</span>
                <div className="spinner"><div className="ring"></div></div>
              </button>
            </form>

            <div className={`alert ${error ? 'show' : ''}`}>
              {error === 'admin_blocked'
                ? (lang === 'FR'
                    ? "⚠ Accès refusé. Les administrateurs doivent se connecter sur le portail d'administration dédié."
                    : "⚠ Access denied. Administrators must connect via the dedicated admin portal.")
                : t.error
              }
            </div>
            <div className="signup-row">{t.noAccount} <a href="#" onClick={(e) => { e.preventDefault(); onSignup && onSignup(); }}>{t.create}</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;