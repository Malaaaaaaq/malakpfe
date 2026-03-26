import React from 'react';
import './HowItWorks.css';
import {
  MapPin, CreditCard, Car, Calendar, Clock, Map,
  CheckCircle, ArrowRight, QrCode
} from 'lucide-react';

function HowItWorks({ lang = 'FR' }) {
  const t = {
    FR: {
      badge: "Comment ça marche",
      title: "Réservez en 3 étapes simples",
      subtitle: "De la recherche à la place garée, tout se passe en quelques clics.",
      step1T: "Rechercher un lieu",
      step1D: "Saisissez votre adresse et choisissez vos dates. Notre carte vous affiche les parkings disponibles.",
      step1Tags: ["Carte en direct", "Dates flexibles", "Temps réel"],
      step2T: "Réserver & Payer",
      step2D: "Finalisez votre réservation en ligne. Recevez instantanément votre pass numérique avec QR code.",
      step2Pass: "Votre pass numérique",
      step3T: "Garez-vous & Partez",
      step3D: "Rendez-vous directement à votre place. Scannez le QR code à l'entrée et profitez.",
      step3G: ["Rendez-vous sur place", "Scannez le QR code", "Garez-vous & profitez"],
      ctaTitle: "Prêt à commencer ?",
      ctaDesc: "Rejoignez des milliers de conducteurs qui se garent intelligemment avec ParLak.",
      ctaBtn: "Réservez votre place maintenant",
      ctaStats: ["10 000+ places", "98% satisfaits", "Assistance 24h/24"]
    },
    EN: {
      badge: "How It Works",
      title: "Book in 3 simple steps",
      subtitle: "From search to parked spot, everything happens in just a few clicks.",
      step1T: "Search a Place",
      step1D: "Enter your address and choose your dates. Our map shows you available parking spots.",
      step1Tags: ["Live Map", "Flexible Dates", "Real Time"],
      step2T: "Book & Pay",
      step2D: "Finalize your booking online. Instantly receive your digital pass with QR code.",
      step2Pass: "Your digital pass",
      step3T: "Park & Go",
      step3D: "Go directly to your spot. Scan the QR code at the entrance and enjoy.",
      step3G: ["Go to the spot", "Scan the QR code", "Park & enjoy"],
      ctaTitle: "Ready to start ?",
      ctaDesc: "Join thousands of drivers who park smart with ParLak.",
      ctaBtn: "Book your spot now",
      ctaStats: ["10,000+ spots", "98% satisfied", "24/7 Support"]
    }
  }[lang];

  return (
    <section className="hiw-section">
      <div className="hiw-container">
        <div className="hiw-header">
          <span className="hiw-badge">{t.badge}</span>
          <h2 className="hiw-title">{t.title}</h2>
          <p className="hiw-subtitle">{t.subtitle}</p>
        </div>

        <div className="hiw-steps">
          <div className="hiw-card">
            <div className="hiw-icon-wrap hiw-color-1">
              <MapPin size={34} />
              <span className="hiw-num">1</span>
            </div>
            <h3 className="hiw-card-title">{t.step1T}</h3>
            <p className="hiw-card-desc">{t.step1D}</p>
            <div className="hiw-tags">
              <span className="hiw-tag"><Map size={13} /> {t.step1Tags[0]}</span>
              <span className="hiw-tag"><Calendar size={13} /> {t.step1Tags[1]}</span>
              <span className="hiw-tag"><Clock size={13} /> {t.step1Tags[2]}</span>
            </div>
          </div>

          <div className="hiw-arrow"><ArrowRight size={28} /></div>

          <div className="hiw-card">
            <div className="hiw-icon-wrap hiw-color-2">
              <CreditCard size={34} />
              <span className="hiw-num">2</span>
            </div>
            <h3 className="hiw-card-title">{t.step2T}</h3>
            <p className="hiw-card-desc">{t.step2D}</p>
            <div className="hiw-qr">
              <div className="hiw-qr-box">
                <QrCode size={52} strokeWidth={1.2} />
              </div>
              <span className="hiw-qr-label">{t.step2Pass}</span>
            </div>
          </div>

          <div className="hiw-arrow"><ArrowRight size={28} /></div>

          <div className="hiw-card">
            <div className="hiw-icon-wrap hiw-color-3">
              <Car size={34} />
              <span className="hiw-num">3</span>
            </div>
            <h3 className="hiw-card-title">{t.step3T}</h3>
            <p className="hiw-card-desc">{t.step3D}</p>
            <div className="hiw-guide">
              <div className="hiw-guide-step">
                <span className="hiw-guide-dot">①</span>
                <span>{t.step3G[0]}</span>
              </div>
              <div className="hiw-guide-step">
                <span className="hiw-guide-dot">②</span>
                <span>{t.step3G[1]}</span>
              </div>
              <div className="hiw-guide-step">
                <span className="hiw-guide-dot">③</span>
                <span>{t.step3G[2]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hiw-cta">
          <div className="hiw-cta-text">
            <h2 className="hiw-cta-title">{t.ctaTitle}</h2>
            <p className="hiw-cta-desc">{t.ctaDesc}</p>
          </div>
          <button className="hiw-cta-btn">
            {t.ctaBtn} <ArrowRight size={18} />
          </button>
          <div className="hiw-cta-stats">
            <span><CheckCircle size={16} /> {t.ctaStats[0]}</span>
            <span><CheckCircle size={16} /> {t.ctaStats[1]}</span>
            <span><CheckCircle size={16} /> {t.ctaStats[2]}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
