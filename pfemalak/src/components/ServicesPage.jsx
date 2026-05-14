import React, { useState } from 'react';
import './ServicesPage.css';
import QuoteForm from './QuoteForm.jsx';
import ParkingHeroAnim from '../animations/ParkingHeroAnim.jsx';
import { 
  Clock, Calendar, Car, Zap, 
  Shield, MapPin, CheckCircle, 
  Settings, Users, ArrowRight,
  Navigation, Star, Award
} from 'lucide-react';

export default function ServicesPage({ lang = 'FR' }) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const t = {
    FR: {
      badge: "Services ParLak",
      heroTitle: "Des Solutions Sur Mesure",
      heroSub: "Nous révolutionnons le stationnement en offrant plus qu'une simple place : une expérience de mobilité complète.",
      s1T: "Short Stay",
      s1D: "Idéal pour le shopping ou vos rendez-vous. Réservez à l'heure.",
      s1F: ["Accès instantané", "Paiement sans contact", "Annulation facile"],
      s2T: "Abonnements Mensuels",
      s2D: "La solution parfaite pour les résidents. Place garantie 24h/24.",
      s2F: ["Tarifs préférentiels", "Place attitrée", "Facture groupée"],
      s3T: "Park & Fly (Aéroport)",
      s3D: "Stationnement au pied des aéroports avec navette gratuite.",
      s3F: ["Surveillance 24/7", "Navette incluse", "Option Lavage"],
      s4T: "Bornes de Recharge",
      s4D: "Rechargez votre véhicule électrique en toute sérénité.",
      s4F: ["Charge rapide", "Multi-marques", "Suivi via App"],
      s5T: "Solutions Entreprise",
      s5D: "Gestion de flotte pour optimiser les frais de stationnement.",
      s5F: ["Dashboard Admin", "Remises Flotte", "Rapports RH"],
      s6T: "Service Voiturier",
      s6D: "Déposez votre voiture à l'entrée et laissez-nous faire.",
      s6F: ["Accueil Premium", "Protection assurance", "Retour sur demande"],
      enSavoirPlus: "En savoir plus",
      vipBadge: "Nouveau Service VIP",
      vipTitle: "Le Confort d'un Voiturier",
      vipDesc: "Pourquoi perdre du temps à chercher une place au restaurant ou à l'aéroport ? Avec nos voituriers professionnels, déposez votre clé et profitez de votre moment. Votre véhicule sera stationné en sécurité.",
      vipStat1: "Qualité Certifiée",
      vipStat2: "Assurance Totale",
      vipArrival: "ARRIVÉE PRÉVUE",
      vipStaff: "Voiturier : Mohamed A.",
      ctaTitle: "Donnez une nouvelle dimension à votre parking",
      ctaSub: "Que vous soyez un conducteur ou un gestionnaire de parking, nous avons la solution.",
      ctaBtn: "Demander un Devis"
    },
    EN: {
      badge: "ParLak Services",
      heroTitle: "Tailored Solutions",
      heroSub: "We revolutionize parking by offering more than just a spot: a complete mobility experience.",
      s1T: "Short Stay",
      s1D: "Ideal for shopping or meetings. Book by the hour.",
      s1F: ["Instant Access", "Contactless Payment", "Easy Cancellation"],
      s2T: "Monthly Subscriptions",
      s2D: "The perfect solution for residents. Guaranteed 24/7 spot.",
      s2F: ["Preferential Rates", "Reserved Spot", "Consolidated Invoice"],
      s3T: "Park & Fly (Airport)",
      s3D: "Parking at airport proximity with free shuttle.",
      s3F: ["24/7 Monitoring", "Shuttle included", "Wash Option"],
      s4T: "Charging Stations",
      s4D: "Charge your electric vehicle with peace of mind.",
      s4F: ["Fast Charge", "Multi-brand", "App Tracking"],
      s5T: "Corporate Solutions",
      s5D: "Fleet management to optimize parking costs.",
      s5F: ["Admin Dashboard", "Fleet Discounts", "HR Reports"],
      s6T: "Valet Service",
      s6D: "Drop your car at the entrance and let us handle it.",
      s6F: ["Premium Welcome", "Insurance Protection", "On-demand return"],
      enSavoirPlus: "Learn more",
      vipBadge: "New VIP Service",
      vipTitle: "The Comfort of a Valet",
      vipDesc: "Why waste time looking for a spot at the restaurant or airport? With our professional valets, drop your key and enjoy your moment. Your vehicle will be safely parked.",
      vipStat1: "Certified Quality",
      vipStat2: "Total Insurance",
      vipArrival: "SCHEDULED ARRIVAL",
      vipStaff: "Valet: Mohamed A.",
      ctaTitle: "Take your parking to the next level",
      ctaSub: "Whether you are a driver or a parking manager, we have the solution.",
      ctaBtn: "Request a Quote"
    }
  }[lang];

  const services = [
    { icon: <Clock size={32} color="#041562" />, title: t.s1T, desc: t.s1D, features: t.s1F },
    { icon: <Calendar size={32} color="#041562" />, title: t.s2T, desc: t.s2D, features: t.s2F },
    { icon: <Car size={32} color="#041562" />, title: t.s3T, desc: t.s3D, features: t.s3F },
    { icon: <Zap size={32} color="#041562" />, title: t.s4T, desc: t.s4D, features: t.s4F },
    { icon: <Settings size={32} color="#041562" />, title: t.s5T, desc: t.s5D, features: t.s5F },
    { icon: <Users size={32} color="#041562" />, title: t.s6T, desc: t.s6D, features: t.s6F },
  ];

  return (
    <div className="services-page">
      <QuoteForm isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />

      <section className="srv-hero">
        <div className="srv-container">
          <div className="srv-hero-layout">
            <div className="srv-hero-anim">
              <ParkingHeroAnim />
            </div>
            <div className="srv-hero-content">
              <span style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '30px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '24px' }}>{t.badge}</span>
              <h1>{t.heroTitle}</h1>
              <p>{t.heroSub}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="srv-grid-section">
        <div className="srv-container">
          <div className="srv-grid">
            {services.map((s, i) => (
              <div key={i} className="srv-card">
                <div className="srv-icon-outer">{s.icon}</div>
                <h3 className="srv-name">{s.title}</h3>
                <p className="srv-desc">{s.desc}</p>
                <ul className="srv-features-list">
                  {s.features.map((f, idx) => (
                    <li key={idx} className="srv-feature-item">
                      <CheckCircle size={14} /> {f}
                    </li>
                  ))}
                </ul>
                <button className="srv-btn" onClick={() => setIsQuoteOpen(true)}>{t.enSavoirPlus} <ArrowRight size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="srv-panel panel-dark">
        <div className="srv-container">
          <div className="panel-row">
            <div className="panel-text">
              <span style={{ color: '#DA1212', fontWeight: 700, marginBottom: '16px', display: 'block' }}>{t.vipBadge}</span>
              <h2>{t.vipTitle}</h2>
              <p>{t.vipDesc}</p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <Award size={34} style={{ color: '#DA1212', marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t.vipStat1}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Shield size={34} style={{ color: '#DA1212', marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t.vipStat2}</div>
                </div>
              </div>
            </div>
            <div className="panel-image" style={{ background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
               <Car size={180} style={{ opacity: 0.1, color: 'white' }} />
               <div style={{ position: 'absolute', background: 'white', padding: '24px', borderRadius: '16px', color: '#041562', width: '280px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', transform: 'rotate(-4deg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                     <Clock size={16} /> <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{t.vipArrival}</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>12:30 PM</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>{t.vipStaff}</div>
                  <div style={{ height: '4px', background: '#041562', width: '60%', marginTop: '14px', borderRadius: '2px' }}></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="srv-cta">
        <div className="srv-container">
          <div className="srv-cta-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#041562' }}>
             <h2>{t.ctaTitle}</h2>
             <p style={{ color: '#64748b', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>{t.ctaSub}</p>
             <button 
                className="srv-btn" 
                style={{ background: '#041562', color: 'white', fontSize: '1.2rem', padding: '20px 44px', borderRadius: '50px' }}
                onClick={() => setIsQuoteOpen(true)}
             >
               {t.ctaBtn} <ArrowRight size={22} />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}
