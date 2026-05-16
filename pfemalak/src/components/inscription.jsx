// src/components/Inscription.jsx
import { useState } from 'react';
import './Inscription.css';

const Inscription = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('client');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    latitude: '',
    longitude: '',
    parking_name: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ text: '', color: '' });
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: 'agent', label: 'Agent' },
    { id: 'client', label: 'Client' }
  ];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    if (password.length === 0) {
      setPasswordStrength({ text: '', color: '' });
    } else if (strength <= 2) {
      setPasswordStrength({ text: '🔴 Mot de passe faible', color: '#c33' });
    } else if (strength <= 4) {
      setPasswordStrength({ text: '🟡 Mot de passe moyen', color: '#fc0' });
    } else {
      setPasswordStrength({ text: '🟢 Mot de passe fort', color: '#3c3' });
    }
  };

  const formatPhoneNumber = (value) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.length > 10) numbers = numbers.slice(0, 10);
    if (numbers.length >= 6) {
      numbers = numbers.slice(0, 5) + ' ' + numbers.slice(5);
    }
    if (numbers.length >= 10) {
      numbers = numbers.slice(0, 2) + ' ' + numbers.slice(2);
    }
    return numbers;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const validateForm = () => {
    const { firstname, lastname, email, password, confirmPassword } = formData;

    if (!firstname || !firstname.trim()) {
      setError('Veuillez entrer votre prénom.');
      return false;
    }

    if (!lastname || !lastname.trim()) {
      setError('Veuillez entrer votre nom.');
      return false;
    }

    if (!email || !email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return false;
    }
    
    if (!password) {
      setError('Veuillez créer un mot de passe.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide (ex: nom@domaine.com).');
      return false;
    }
    
    if (!termsAccepted) {
      setError('Vous devez accepter les conditions générales pour vous inscrire.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || undefined,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          role: selectedRole,
          latitude: selectedRole === 'agent' ? formData.latitude : undefined,
          longitude: selectedRole === 'agent' ? formData.longitude : undefined,
          parking_name: selectedRole === 'agent' ? formData.parking_name : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const firstError = data.errors
          ? Object.values(data.errors)[0][0]
          : (data.message || 'Une erreur est survenue.');
        setError(firstError);
        return;
      }

      localStorage.setItem('parlak_token', data.token);
      setSuccess('Inscription réussie ! Redirection vers la connexion...');
      setFormData({ firstname: '', lastname: '', email: '', phone: '', password: '', confirmPassword: '' });
      setTermsAccepted(false);
      setPasswordStrength({ text: '', color: '' });
      setTimeout(() => { if (onLogin) onLogin(); }, 2000);

    } catch {
      setError('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inscription-container">
      <div className="inscription-wrapper">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="lp-circle-1"/>
          <div className="lp-circle-2"/>
          <div className="lp-dot-1"/>
          <div className="lp-dot-2"/>

          <div className="logo">
            <h1>ParLak</h1>
            <p>STATIONNEMENT INTELLIGENT</p>
          </div>

          <div className="welcome-message">
            <h2>Rejoignez-nous 🎉</h2>
            <p>Créez votre compte et profitez de tous nos services de stationnement intelligent.</p>
          </div>

          <div className="features">
            <h3>Ce qui vous attend</h3>
            <ul>
              <li>Réservation de place instantanée</li>
              <li>Surveillance en temps réel</li>
              <li>Contrôle d'accès sécurisé</li>
              <li>Historique et factures en ligne</li>
            </ul>
          </div>

        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="insc-card">
          <h2 className="form-title">Créer un compte</h2>
          <p className="form-subtitle">Rejoignez ParLak en quelques secondes</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}
          
          {/* Role Selection */}
          <div className="role-selector">
            {roles.map(role => (
              <button
                key={role.id}
                type="button"
                className={`role-btn ${selectedRole === role.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                {role.label}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label>Prénom *</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                />
              </div>
              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  autoComplete="family-name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="+212 6XX XXX XXX"
                autoComplete="tel"
              />
            </div>
            
            <div className="form-group">
              <label>Mot de passe *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Créez un mot de passe"
                autoComplete="new-password"
              />
              {passwordStrength.text && (
                <div className="password-strength" style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Confirmer le mot de passe *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmez votre mot de passe"
                autoComplete="new-password"
              />
            </div>

            {selectedRole === 'agent' && (
              <div className="agent-extra-fields">
                <h3 style={{ fontSize: '1rem', color: '#041562', margin: '1.5rem 0 1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Informations du Parking</h3>
                
                <div className="form-group">
                  <label>Nom du Parking *</label>
                  <input
                    type="text"
                    name="parking_name"
                    value={formData.parking_name}
                    onChange={handleInputChange}
                    placeholder="Ex: Parking Al Maghrib"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude *</label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="33.5731"
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude *</label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="-7.5898"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-geolocate-agent"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        setFormData(prev => ({
                          ...prev,
                          latitude: pos.coords.latitude.toFixed(6),
                          longitude: pos.coords.longitude.toFixed(6)
                        }));
                      }, (err) => {
                        setError("Impossible d'obtenir votre position. Vérifiez vos permissions.");
                      });
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '8px',
                    color: '#041562',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📍 Utiliser ma position actuelle
                </button>
              </div>
            )}
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (error && error.includes('conditions')) setError('');
                }}
              />
              <label htmlFor="terms">
                J'accepte les conditions générales d'utilisation et la politique de confidentialité
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn-register"
              disabled={isLoading}
            >
              {isLoading ? 'INSCRIPTION EN COURS...' : "S'INSCRIRE"}
            </button>
          </form>
          
          <div className="login-link">
            Déjà un compte ? <a href="#" onClick={(e) => { e.preventDefault(); onLogin && onLogin(); }}>Connectez-vous ici</a>
          </div>
          </div>{/* fin insc-card */}
        </div>
      </div>
    </div>
  );
};

export default Inscription;