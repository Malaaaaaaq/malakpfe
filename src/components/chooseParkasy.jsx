// ChooseParkEasy.jsx
import React from 'react';
import './ChooseParkasy.css';

const ChooseParkEasy = ({ lang = 'FR' }) => {
  const t = {
    FR: {
      title: "Pourquoi choisir ParLak ?",
      tagline: "La manière intelligente de se garer",
      f1T: "Gagnez du temps",
      f1D: "Fini de tourner en rond pour trouver une place. Réservez à l'avance et garez-vous directement.",
      f2T: "Économisez de l'argent",
      f2D: "Obtenez les meilleurs tarifs grâce à notre comparateur de prix et nos réductions exclusives.",
      f3T: "Parking sécurisé",
      f3D: "Tous nos parkings sont surveillés 24h/24 et 7j/7 par vidéosurveillance pour votre tranquillité.",
      f4T: "Accès facile",
      f4D: "Utilisez des codes QR pour une entrée et sortie sans contact. Gérez vos réservations partout."
    },
    EN: {
      title: "Why choose ParLak?",
      tagline: "The smart way to park",
      f1T: "Save Time",
      f1D: "No more driving in circles to find a spot. Book in advance and park directly.",
      f2T: "Save Money",
      f2D: "Get the best rates through our price comparator and exclusive discounts.",
      f3T: "Secure Parking",
      f3D: "All our parking lots are monitored 24/7 via video surveillance for your peace of mind.",
      f4T: "Easy Access",
      f4D: "Use QR codes for contactless entry and exit. Manage your bookings anywhere."
    }
  }[lang];

  const features = [
    {
      id: 1,
      title: t.f1T,
      description: t.f1D,
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
      title: t.f2T,
      description: t.f2D,
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"></path>
        </svg>
      ),
      color: "#2ecc71"
    },
    {
      id: 3,
      title: t.f3T,
      description: t.f3D,
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      color: "#e74c3c"
    },
    {
      id: 4,
      title: t.f4T,
      description: t.f4D,
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
          <h1 className="choose-title">{t.title}</h1>
          <p className="choose-tagline">{t.tagline}</p>
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

const FeatureCard = ({ title, description, icon, color }) => (
    <div className="feature-card">
      <div className="feature-icon-container" style={{ color }}>
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
);

export default ChooseParkEasy;