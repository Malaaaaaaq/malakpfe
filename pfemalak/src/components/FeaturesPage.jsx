import React from 'react';
import './FeaturesPage.css';
import FeaturesHeroAnim from '../animations/FeaturesHeroAnim.jsx';
import { 
  Zap, Shield, Globe, MapPin, 
  Smartphone, CreditCard, Clock, 
  Navigation, CheckCircle, BarChart, 
  Lock, Bell, ArrowRight
} from 'lucide-react';

export default function FeaturesPage({ lang = 'FR' }) {
  const t = {
    FR: {
      heroBadge: "Innovation & Technologie",
      heroTitle: "Fonctionnalités ",
      heroSpan: "ParLak",
      heroSub: "Découvrez comment nous transformons le stationnement urbain en une expérience fluide, numérique et sans stress.",
      f1T: "Réservation Instantanée",
      f1D: "Réservez votre place en quelques secondes via notre application ou plateforme web.",
      f2T: "Paiement Sécurisé",
      f2D: "Transactions cryptées et support de plusieurs méthodes (Carte, Wallet, Cash).",
      f3T: "Réseau Étendu",
      f3D: "Accédez à des milliers de places dans les aéroports et centres-villes du Maroc.",
      f4T: "Guidage GPS",
      f4D: "Navigation intégrée pour vous conduire directement à votre place réservée.",
      f5T: "Accès Sans Contact",
      f5D: "Ouverture automatique des barrières via reconnaissance de plaque ou QR code.",
      f6T: "Analyse & Rapports",
      f6D: "Pour les propriétaires : suivez votre occupation et vos revenus en temps réel.",
      show1Tag: "Pour les Conducteurs",
      show1Title: "Réservez plus vite, stationnez mieux",
      show1Sub: "Notre application mobile est conçue pour être votre compagnon de route ultime, vous faisant gagner du temps chaque jour.",
      show1L1: "Disponibilité en temps réel",
      show1L2: "Prolongation de session à distance",
      show1L3: "Historique de facturation numérique",
      show1L4: "Notifications intelligentes",
      show2Tag: "Pour les Propriétaires",
      show2Title: "Optimisez vos espaces, augmentez vos revenus",
      show2Sub: "ParLak offre une suite d'outils puissants pour les gestionnaires, permettant une supervision totale.",
      show2L1: "Tableau de bord administratif",
      show2L2: "Tarification dynamique automatique",
      show2L3: "Gestion multi-parkings",
      show2L4: "Import/Export de données comptables",
      extraTitle: "Prêt pour le futur ?",
      extraSub: "Plus de 20 autres fonctionnalités intelligentes vous attendent.",
      extra1: "App iOS & Android",
      extra2: "Alertes Push",
      extra3: "Portefeuille ParLak",
      extra4: "Sessions 24/7",
      ctaTitle: "Prêt à optimiser votre trajet ?",
      ctaSub: "Ne tournez plus en rond. Réservez votre place maintenant et gagnez du temps.",
      ctaBtn: "Commencer l'expérience"
    },
    EN: {
      heroBadge: "Innovation & Technology",
      heroTitle: "ParLak ",
      heroSpan: "Features",
      heroSub: "Discover how we transform urban parking into a seamless, digital, and stress-free experience.",
      f1T: "Instant Booking",
      f1D: "Book your spot in seconds via our mobile app or web platform.",
      f2T: "Secure Payment",
      f2D: "Encrypted transactions and support for multiple methods (Card, Wallet, Cash).",
      f3T: "Global Network",
      f3D: "Access thousands of parking spots in airports and city centers across Morocco.",
      f4T: "GPS Guidance",
      f4D: "Integrated navigation to lead you directly to your reserved parking spot.",
      f5T: "Contactless Access",
      f5D: "Automatic barrier opening via plate recognition or QR code.",
      f6T: "Analytics & Reports",
      f6D: "For owners: track your occupancy rate and revenue in real-time.",
      show1Tag: "For Drivers",
      show1Title: "Book faster, park better",
      show1Sub: "Our mobile app is designed to be your ultimate road companion, saving you precious time every day.",
      show1L1: "Real-time availability",
      show1L2: "Remote session extension",
      show1L3: "Digital billing history",
      show1L4: "Smart notifications",
      show2Tag: "For Owners",
      show2Title: "Optimize your spaces, increase revenue",
      show2Sub: "ParLak offers a suite of powerful tools for managers, allowing total supervision and profitability.",
      show2L1: "Administrative dashboard",
      show2L2: "Automatic dynamic pricing",
      show2L3: "Multi-parking management",
      show2L4: "Accounting data Import/Export",
      extraTitle: "Ready for the future ?",
      extraSub: "More than 20 other smart features are waiting for you.",
      extra1: "iOS & Android App",
      extra2: "Push Alerts",
      extra3: "ParLak Wallet",
      extra4: "24/7 Sessions",
      ctaTitle: "Ready to optimize your trip ?",
      ctaSub: "Stop driving in circles. Book your spot now and save time.",
      ctaBtn: "Start the experience"
    }
  }[lang];

  const mainFeatures = [
    { icon: <Zap size={28} color="#041562" />, title: t.f1T, desc: t.f1D },
    { icon: <Shield size={28} color="#041562" />, title: t.f2T, desc: t.f2D },
    { icon: <Globe size={28} color="#041562" />, title: t.f3T, desc: t.f3D },
    { icon: <Navigation size={28} color="#041562" />, title: t.f4T, desc: t.f4D },
    { icon: <Lock size={28} color="#041562" />, title: t.f5T, desc: t.f5D },
    { icon: <BarChart size={28} color="#041562" />, title: t.f6T, desc: t.f6D },
  ];

  return (
    <div className="features-page">
      <section className="feat-hero">
        <div className="feat-container">
          <div className="feat-hero-layout">
            <div className="feat-hero-anim">
              <FeaturesHeroAnim />
            </div>
            <div className="feat-hero-content">
              <span className="feat-badge">{t.heroBadge}</span>
              <h1>{t.heroTitle} <span>{t.heroSpan}</span></h1>
              <p>{t.heroSub}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="feat-grid-section">
        <div className="feat-container">
          <div className="feat-grid">
            {mainFeatures.map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon-box">{f.icon}</div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feat-showcase">
        <div className="feat-container">
          <div className="showcase-row">
            <div className="showcase-text">
              <span className="showcase-tag">{t.show1Tag}</span>
              <h2>{t.show1Title}</h2>
              <p className="showcase-sub">{t.show1Sub}</p>
              <ul className="showcase-list">
                <li className="showcase-item"><CheckCircle size={18} className="showcase-check" /> {t.show1L1}</li>
                <li className="showcase-item"><CheckCircle size={18} className="showcase-check" /> {t.show1L2}</li>
                <li className="showcase-item"><CheckCircle size={18} className="showcase-check" /> {t.show1L3}</li>
                <li className="showcase-item"><CheckCircle size={18} className="showcase-check" /> {t.show1L4}</li>
              </ul>
            </div>
            <div className="showcase-image">
               <div className="phone-mockup">
                 <div className="phone-screen">
                   <MapPin size={40} style={{ margin: '30px 0 10px', color: 'white' }} />
                   <div style={{ fontSize: '10px', opacity: 0.7, color: 'white' }}>PARLAK APP</div>
                   <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '20px', color: 'white' }}>{lang === 'FR' ? 'Parking Réservé !' : 'Parking Reserved !'}</div>
                   <div className="qr-box">QR CODE</div>
                 </div>
               </div>
            </div>
          </div>

          <div className="showcase-row">
            <div className="showcase-text">
              <span className="showcase-tag">{t.show2Tag}</span>
              <h2>{t.show2Title}</h2>
              <p className="showcase-sub">{t.show2Sub}</p>
              <ul className="showcase-list">
                <li className="showcase-item"><CheckCircle size={18} className="showcase-check" /> {t.show2L1}</li>
                <li className="showcase-item"><CheckCircle size={18} className="showcase-check" /> {t.show2L2}</li>
                <li className="showcase-item"><CheckCircle size={18} className="showcase-check" /> {t.show2L3}</li>
                <li className="showcase-item"><CheckCircle size={18} className="showcase-check" /> {t.show2L4}</li>
              </ul>
            </div>
            <div className="showcase-image">
               <div className="mockup-ui">
                 <div className="ui-header">
                   <div className="ui-chart-box"></div>
                   <div className="ui-text-lines">
                     <div className="line long"></div>
                     <div className="line short"></div>
                   </div>
                 </div>
                 <div className="ui-grid">
                   <div className="ui-item"></div>
                   <div className="ui-item"></div>
                 </div>
                 <div className="ui-footer"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="extra-features">
        <div className="feat-container">
          <div className="extra-header">
            <h2>{t.extraTitle}</h2>
            <p>{t.extraSub}</p>
          </div>
          <div className="extra-grid">
             {[ 
               { ico: <Smartphone size={20} />, t: t.extra1 },
               { ico: <Bell size={20} />, t: t.extra2 },
               { ico: <CreditCard size={20} />, t: t.extra3 },
               { ico: <Clock size={20} />, t: t.extra4 }
             ].map((x, i) => (
                <div key={i} className="extra-card">
                  <div className="extra-ico">{x.ico}</div>
                  <div className="extra-t">{x.t}</div>
                </div>
             ))}
          </div>
        </div>
      </section>

      <section className="feat-cta">
        <div className="feat-container">
          <div className="feat-cta-box">
             <h2>{t.ctaTitle}</h2>
             <p className="cta-sub-text">{t.ctaSub}</p>
             <button className="feat-cta-btn">
               {t.ctaBtn} <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}
