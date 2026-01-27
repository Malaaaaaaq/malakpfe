// ChooseParkEasy.jsx
import React from 'react';
import './ChooseParkasy.css';

const ChooseParkEasy = () => {
  const features = [
    {
      id: 1,
      title: "Gagnez du temps",
      description: "Fini de tourner en rond pour trouver une place. Réservez à l'avance et garez-vous directement.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      color: "#3498db"
    },
    {
      id: 2,
      title: "Économisez de l'argent",
      description: "Obtenez les meilleurs tarifs grâce à notre comparateur de prix et nos réductions exclusives.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"></path>
        </svg>
      ),
      color: "#2ecc71"
    },
    {
      id: 3,
      title: "Parking sécurisé",
      description: "Tous nos parkings sont surveillés 24h/24 et 7j/7 par vidéosurveillance pour votre tranquillité d'esprit.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      color: "#e74c3c"
    },git 
    {
      id: 4,
      title: "Accès facile",
      description: "Utilisez des codes QR pour une entrée et sortie sans contact. Gérez vos réservations où que vous soyez.",
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M16 8l-8 8M8 8l8 8"></path>
        </svg>
      ),
      color: "#9b59b6"
    }
  ];

  return (
    <section className="choose-parkeasy">
      <div className="choose-container">
        <header className="choose-header">
          <h1 className="choose-title">Pourquoi choisir ParkEasy ?</h1>
          <p className="choose-tagline">La manière intelligente de se garer</p>
        </header>
        
        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant pour chaque carte de fonctionnalité
const FeatureCard = ({ title, description, icon, color }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon-container" style={{ color }}>
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

export default ChooseParkEasy;