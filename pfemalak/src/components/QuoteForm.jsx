import React, { useState } from 'react';
import './QuoteForm.css';
import { X, Send, CheckCircle, Info } from 'lucide-react';

export default function QuoteForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    parkingSize: '10-50',
    serviceType: 'Gestion complète',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="quote-overlay" onClick={onClose}>
      <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
        {isSuccess ? (
          <div className="quote-success">
            <div className="success-icon">
              <CheckCircle size={40} />
            </div>
            <h2>Demande Envoyée !</h2>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>
              Merci pour votre intérêt. Un conseiller ParLak vous contactera sous 24h ouvrées pour discuter de votre projet de parking.
            </p>
            <button className="quote-submit" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <>
            <div className="quote-header">
              <button className="quote-close" onClick={onClose}>
                <X size={20} />
              </button>
              <h2>Demander un Devis</h2>
              <p>Optimisez la gestion de votre parking avec nos solutions digitales sur mesure.</p>
            </div>
            
            <form className="quote-body" onSubmit={handleSubmit}>
              <div className="quote-form-grid">
                <div className="form-field">
                  <label htmlFor="name">Nom Complet</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Ex: Mohamed Alami" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email Professionnel</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="ex: contact@entreprise.ma" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="company">Nom de l'Entreprise</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    placeholder="Ex: SARL Park & Go" 
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="parkingSize">Taille du Parking</label>
                  <select 
                    id="parkingSize" 
                    name="parkingSize"
                    value={formData.parkingSize}
                    onChange={handleChange}
                  >
                    <option value="1-10">Moins de 10 places</option>
                    <option value="10-50">10 à 50 places</option>
                    <option value="50-200">50 à 200 places</option>
                    <option value="200+">Plus de 200 places</option>
                  </select>
                </div>
                <div className="form-field full-width">
                  <label htmlFor="serviceType">Type de Service</label>
                  <select 
                    id="serviceType" 
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                  >
                    <option value="Gestion complète">Gestion Complète (Digital + Physique)</option>
                    <option value="Digitalisation uniquement">Digitalisation (Logiciel uniquement)</option>
                    <option value="Équipement Smart">Équipement (Bornes, Barrières)</option>
                    <option value="Partenariat VIP">Partenariat VIP Voiturier</option>
                  </select>
                </div>
                <div className="form-field full-width">
                  <label htmlFor="message">Votre Message / Besoins Spécifiques</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4" 
                    placeholder="Décrivez votre parking et vos attentes..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.85rem', color: '#64748b' }}>
                 <Info size={18} />
                 <span>Ce devis est gratuit et sans engagement.</span>
              </div>

              <button type="submit" className="quote-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                     Envoi en cours...
                  </span>
                ) : (
                  <>
                    <Send size={18} /> Envoyer la demande
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
