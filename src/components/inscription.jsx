// src/components/Inscription.jsx
import React, { useState, useEffect } from 'react';
import './Inscription.css';

const Inscription = () => {
  const [selectedRole, setSelectedRole] = useState('client');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    twofa: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ text: '', color: '' });
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: 'admin', label: 'Administrateur' },
    { id: 'agent', label: 'Agent' },
    { id: 'client', label: 'Client' }
  ];

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('fr-FR'));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

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
    const { firstname, lastname, username, email, password, confirmPassword } = formData;
    
    if (!firstname || !firstname.trim()) {
      setError('Veuillez entrer votre prénom.');
      return false;
    }
    
    if (!lastname || !lastname.trim()) {
      setError('Veuillez entrer votre nom.');
      return false;
    }
    
    if (!username || !username.trim()) {
      setError('Veuillez choisir un nom d\'utilisateur.');
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
    
    console.log('Formulaire soumis'); // Debug
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    
    const userData = {
      id: Date.now().toString(),
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      // Only include twofa for admin role
      twofa: selectedRole === 'admin' ? (formData.twofa || null) : null,
      role: selectedRole,
      createdAt: new Date().toISOString()
    };
    
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('parlak_users') || '[]');
      console.log('Utilisateurs existants:', existingUsers); // Debug
      
      // Check if user already exists
      const userExists = existingUsers.some(
        u => u.username === userData.username || u.email === userData.email
      );
      
      if (userExists) {
        setError('Ce nom d\'utilisateur ou cet email est déjà utilisé.');
        setIsLoading(false);
        return;
      }
      
      // Save user
      existingUsers.push(userData);
      localStorage.setItem('parlak_users', JSON.stringify(existingUsers));
      console.log('Utilisateur enregistré:', userData); // Debug
      
      setSuccess('Inscription réussie ! Redirection vers la page de connexion...');
      
      // Clear form
      setFormData({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        twofa: ''
      });
      setTermsAccepted(false);
      setPasswordStrength({ text: '', color: '' });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        // Try to use React Router if available, otherwise use window.location
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 2000);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inscription-container">
      <div className="inscription-wrapper">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="logo">
            <h1>ParLak</h1>
            <p>STATIONNEMENT INTELLIGENT</p>
          </div>
          
          <div className="welcome-message">
            <h2>Rejoignez-nous 🎉</h2>
            <p>Créez votre compte et profitez de tous nos services de stationnement intelligent.</p>
            <div className="features">
              <h3>Ce qui vous attend :</h3>
              <ul>
                <li>Cédez votre parking facilement</li>
                <li>Surveillance en temps réel</li>
                <li>Réservation instantanée</li>
                <li>Contrôle d'accès sécurisé</li>
              </ul>
            </div>
          </div>
          
          <div className="weather">
            <span>🌡️</span>
            <span>16°</span>
            <span>🕘</span>
            <span>{currentTime}</span>
            <span>📅</span>
            <span>{currentDate}</span>
          </div>
        </div>
        
        {/* Right Panel - Registration Form */}
        <div className="right-panel">
          <h2 className="form-title">Inscription</h2>
          
          {error && (
            <div className="error-message">
              <span>❌ </span>
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              <span>✅ </span>
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
              <label>Nom d'utilisateur *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choisissez un nom d'utilisateur"
                autoComplete="username"
              />
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
            
            {/* Only show 2FA field for admin role */}
            {selectedRole === 'admin' && (
              <div className="form-group">
                <label>Code de Sécurité (2FA)</label>
                <input
                  type="text"
                  name="twofa"
                  value={formData.twofa}
                  onChange={handleInputChange}
                  placeholder="Entrez le code de sécurité"
                  maxLength="6"
                  autoComplete="off"
                />
                <small className="twofa-hint">
                  Optionnel - Pour renforcer la sécurité de votre compte
                </small>
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
            Déjà un compte ? <a href="/login">Connectez-vous ici</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inscription;