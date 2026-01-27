// HowItWorks.jsx
import React from 'react';
import './HowItWorks.css';
import {
  MapPin, CreditCard, Car, Calendar, Clock, Map,
  Navigation, ScanLine, Smile, CheckCircle
} from 'lucide-react';

function HowItWorks() {
  return (
    <div className="how-it-works-page">
      <div className="container">
        {/* En-tête */}
        <div className="page-header">
          <h1 className="page-title">How It Works</h1>
          <p className="page-subtitle">
            Reserve your parking spot in 3 simple steps
          </p>
        </div>

        {/* Section des étapes */}
        <div className="steps-section">
          {/* Étape 1 */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-number">1</div>
              <h3 className="step-title">Search Location</h3>
            </div>
            <div className="step-icon"><MapPin size={64} strokeWidth={1} /></div>
            <p className="step-description">
              Citation and select your preferred date and time
            </p>
            <div className="step-features">
              <div className="step-features">
                <span className="feature"><Map size={16} /> Live Map</span>
                <span className="feature"><Calendar size={16} /> Flexible Dates</span>
                <span className="feature"><Clock size={16} /> Real-time Availability</span>
              </div>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-number">2</div>
              <h3 className="step-title">Reserve & Pay</h3>
            </div>
            <div className="step-icon"><CreditCard size={64} strokeWidth={1} /></div>
            <p className="step-description">
              Complete your reservation with a QR code, and enjoy hassle-free parking with guaranteed availability.
            </p>
            <div className="qr-code-example">
              <div className="qr-code">
                <div className="qr-pattern"></div>
                <div className="qr-pattern"></div>
                <div className="qr-pattern"></div>
              </div>
              <p className="qr-label">Your digital parking pass</p>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-number">3</div>
              <h3 className="step-title">Park & Go</h3>
            </div>
            <div className="step-icon"><Car size={64} strokeWidth={1} /></div>
            <p className="step-description">
              Enjoy the convenience of booking your parking spot online and then driving directly to your destination.
            </p>
            <div className="arrival-guide">
              <div className="guide-step">
                <span className="guide-number">①</span>
                <span className="guide-text">Drive to location</span>
              </div>
              <div className="guide-step">
                <span className="guide-number">②</span>
                <span className="guide-text">Scan QR code</span>
              </div>
              <div className="guide-step">
                <span className="guide-number">③</span>
                <span className="guide-text">Park & enjoy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section CTA */}
        <div className="cta-section">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers who park smarter with us.
          </p>
          <button className="cta-button">
            Reserve Your Spot Now
          </button>
          <p className="cta-stats">
            <p className="cta-stats">
              <span className="stat"><CheckCircle size={16} /> 10,000+ parking spots</span>
              <span className="stat"><CheckCircle size={16} /> 98% customer satisfaction</span>
              <span className="stat"><CheckCircle size={16} /> 24/7 support</span>
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
