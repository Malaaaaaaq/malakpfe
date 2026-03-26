import React from 'react';
import './AboutPage.css';
import { 
  Zap, Shield, Globe, Users, CheckCircle, 
  ArrowRight, MapPin, Star, Clock, Headphones, 
  Mail, Phone, Award, BarChart
} from 'lucide-react';

import awardIcon from '../assets/logo.png'; // Just in case, keeping current logic/assets
import aboutPhoto from '../assets/photo.png';

const stats = [
  { icon: <MapPin size={24} />, value: '10,000+', label: 'Places de Parking' },
  { icon: <Globe size={24} />, value: '50+', label: 'Villes au Maroc' },
  { icon: <Users size={24} />, value: '25,000+', label: 'Utilisateurs' },
  { icon: <Star size={24} />, value: '4.8/5', label: 'Satisfaction Client' },
];

const values = [
  {
    icon: <Zap size={28} />,
    title: 'Innovation',
    desc: 'Nous utilisons les dernières technologies pour rendre votre expérience de stationnement simple et fluide.',
    color: '#3b82f6',
  },
  {
    icon: <Shield size={28} />,
    title: 'Sécurité',
    desc: 'Tous nos parkings partenaires sont surveillés 24h/24 et vérifiés pour garantir la sécurité de votre véhicule.',
    color: '#10b981',
  },
  {
    icon: <Globe size={28} />,
    title: 'Accessibilité',
    desc: 'Disponible sur mobile et desktop, ParLak est accessible partout, à tout moment, pour tous les conducteurs.',
    color: '#8b5cf6',
  },
  {
    icon: <Award size={28} />,
    title: 'Excellence',
    desc: 'Nous nous efforçons de fournir le meilleur service possible à nos clients et partenaires chaque jour.',
    color: '#f59e0b',
  },
];

const team = [
  { name: 'Malak Tamrani', role: 'CEO & Fondatrice', avatar: '👩‍💼' },
  { name: 'Fatima Zahraa Hofr', role: 'Directrice Technique', avatar: '👩‍💻' },
];

export default function AboutPage({ lang = 'FR' }) {
  const t = {
    FR: {
      vision: "Notre Vision",
      h1: "Redéfinir le ",
      h1Span: "Stationnement",
      h1End: " Urbain",
      hHeroSub: "Nous construisons l'avenir de la mobilité intelligente en simplifiant le stationnement pour chaque conducteur.",
      stat1: "Places de Parking",
      stat2: "Villes au Maroc",
      stat3: "Utilisateurs",
      stat4: "Satisfaction Client",
      missionTag: "Notre Mission",
      missionTitle: "Pourquoi ParLak ?",
      missionP1: "Nous croyons que le stationnement ne devrait jamais être une source de stress. En ville, trouver une place peut devenir un véritable défi, faisant perdre du temps et de l'énergie.",
      missionP2: "ParLak est né de la volonté de transformer cette frustration en une expérience fluide. Notre plateforme connecte les conducteurs avec des places garanties dans les aéroports, les centres-villes et lors d'événements majeurs.",
      missionP3: "En utilisant la technologie pour optimiser l'espace urbain, nous aidons à réduire le trafic lié à la recherche de stationnement et contribuons à des villes plus durables.",
      valTag: "Nos Valeurs",
      valTitle: "Ce qui nous guide",
      teamTag: "Notre Équipe",
      teamTitle: "Les visages derrière ParLak",
      ctaTitle: "Prêt à stationner intelligemment ?",
      ctaSub: "Rejoignez plus de 25,000 utilisateurs qui font confiance à ParLak pour leurs déplacements quotidiens.",
      ctaBtn: "Réserver maintenant",
      contactTxt: "Vous avez des questions ? Notre équipe est là pour vous aider."
    },
    EN: {
      vision: "Our Vision",
      h1: "Redefining Urban ",
      h1Span: "Parking",
      h1End: "",
      hHeroSub: "We are building the future of smart mobility by simplifying parking for every driver.",
      stat1: "Parking Spaces",
      stat2: "Cities in Morocco",
      stat3: "Users",
      stat4: "Customer Satisfaction",
      missionTag: "Our Mission",
      missionTitle: "Why ParLak ?",
      missionP1: "We believe parking should never be a source of stress. In the city, finding a spot can become a real challenge, wasting time and energy.",
      missionP2: "ParLak was born from the desire to transform this frustration into a seamless experience. Our platform connects drivers with guaranteed spots in airports, city centers and at major events.",
      missionP3: "By using technology to optimize urban space, we help reduce traffic related to parking search and contribute to more sustainable cities.",
      valTag: "Our Values",
      valTitle: "What guides us",
      teamTag: "Our Team",
      teamTitle: "The faces behind ParLak",
      ctaTitle: "Ready to park smart ?",
      ctaSub: "Join more than 25,000 users who trust ParLak for their daily trips.",
      ctaBtn: "Reserve now",
      contactTxt: "Any questions ? Our team is here to help."
    }
  }[lang];

  return (
    <div className="about-page">
      {/* ── Hero Section ── */}
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-content">
            <span className="about-badge">{t.vision}</span>
            <h1 className="about-hero-title">
              {t.h1}<span>{t.h1Span}</span>{t.h1End}
            </h1>
            <p className="about-hero-sub">
              {t.hHeroSub}
            </p>
          </div>
        </div>
      </section>

      <div className="about-container">
        {/* ── Stats Bar ── */}
        <div className="about-stats-bar">
          <div className="about-stat-item">
            <div className="about-stat-icon"><MapPin size={24} /></div>
            <div className="about-stat-value">10,000+</div>
            <div className="about-stat-label">{t.stat1}</div>
          </div>
          <div className="about-stat-item">
            <div className="about-stat-icon"><Globe size={24} /></div>
            <div className="about-stat-value">50+</div>
            <div className="about-stat-label">{t.stat2}</div>
          </div>
          <div className="about-stat-item">
            <div className="about-stat-icon"><Users size={24} /></div>
            <div className="about-stat-value">25,000+</div>
            <div className="about-stat-label">{t.stat3}</div>
          </div>
          <div className="about-stat-item">
            <div className="about-stat-icon"><Star size={24} /></div>
            <div className="about-stat-value">4.8/5</div>
            <div className="about-stat-label">{t.stat4}</div>
          </div>
        </div>
      </div>

      {/* ── Mission Section ── */}
      <section className="about-mission">
        <div className="about-container">
          <div className="mission-grid">
            <div className="mission-content">
              <span className="section-tag">{t.missionTag}</span>
              <h2 className="section-title">{t.missionTitle}</h2>
              <div className="mission-text">
                <p>{t.missionP1}</p>
                <p>{t.missionP2}</p>
                <p>{t.missionP3}</p>
              </div>
            </div>
            <div className="mission-image-container">
              <div className="mission-image-card">
                 <img src={aboutPhoto} alt="ParLak Vision" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values Grid ── */}
      <section className="about-values">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">{t.valTag}</span>
            <h2 className="section-title">{t.valTitle}</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon-box" style={{ background: `${v.color}15`, color: v.color }}>
                  {v.icon}
                </div>
                <h3 className="value-title">{lang === 'FR' ? v.title : v.title.replace(' Innovation', ' Innovation').replace('Sécurité', 'Security').replace('Accessibilité', 'Accessibility').replace('Excellence', 'Excellence')}</h3>
                <p className="value-desc">{lang === 'FR' ? v.desc : v.desc.replace('dernières technologies', 'latest technologies').replace('expérience de stationnement', 'parking experience').replace('surveillés 24h/24', 'monitored 24/7').replace('garantir la sécurité', 'ensure safety').replace('mobile et desktop', 'mobile and desktop').replace('accessible partout', 'accessible everywhere').replace('meilleur service', 'best service')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="about-team">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">{t.teamTag}</span>
            <h2 className="section-title">{t.teamTitle}</h2>
          </div>
          <div className="team-grid">
            {team.map((m, i) => (
              <div key={i} className="team-member">
                <div className="member-avatar">{m.avatar}</div>
                <h4 className="member-name">{m.name}</h4>
                <p className="member-role">{lang === 'FR' ? m.role : m.role.replace('Fondatrice', 'Founder').replace('Directrice Technique', 'CTO')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="about-container">
          <h2 className="cta-title">{t.ctaTitle}</h2>
          <p className="cta-sub">{t.ctaSub}</p>
          <button className="cta-btn">
            {t.ctaBtn} <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ── Contact Section (Minimalist) ── */}
      <section style={{ padding: '80px 0', background: 'white', textAlign: 'center' }}>
        <div className="about-container">
           <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>{t.contactTxt}</p>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#041562', fontWeight: 600 }}>
                <Mail size={18} /> contact@parklak.ma
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#041562', fontWeight: 600 }}>
                <Phone size={18} /> +212 5 22 00 00 00
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
