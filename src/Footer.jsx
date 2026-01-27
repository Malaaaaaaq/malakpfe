// Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Section Logo et Description */}
        <div className="footer-brand">
          <h2 className="footer-logo">ParkEasy</h2>
          <p className="footer-tagline">
            Rendre le stationnement simple, rapide et abordable pour tous.
          </p>
        </div>

        {/* Liens principaux */}
        <div className="footer-links">
          <div className="footer-column">
            <h3 className="footer-column-title color-1">À propos</h3>
            <ul className="footer-list">
              <li><a href="/about" className="footer-link">À propos de nous</a></li>
              <li><a href="/careers" className="footer-link">Carrières</a></li>
              <li><a href="/press" className="footer-link">Presse</a></li>
              <li><a href="/blog" className="footer-link">Blog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title color-2">Assistance</h3>
            <ul className="footer-list">
              <li><a href="/help" className="footer-link">Centre d'aide</a></li>
              <li><a href="/contact" className="footer-link">Contactez-nous</a></li>
              <li><a href="/safety" className="footer-link">Sécurité</a></li>
              <li><a href="/terms" className="footer-link">Conditions d'utilisation</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title color-3">Partenaires</h3>
            <ul className="footer-list">
              <li><a href="/list-your-parking" className="footer-link">Listez votre parking</a></li>
              <li><a href="/business" className="footer-link">Solutions entreprises</a></li>
              <li><a href="/affiliate" className="footer-link">Programme d'affiliation</a></li>
              <li><a href="/api" className="footer-link">Accès API</a></li>
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2024 ParkEasy. Tous droits réservés.
          </div>
          <div className="footer-legal">
            <a href="/privacy" className="footer-legal-link">Politique de confidentialité</a>
            <span className="footer-separator">|</span>
            <a href="/terms-conditions" className="footer-legal-link">Conditions générales</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;