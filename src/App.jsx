// App.js
import React, { useState } from 'react';
import './App.css';
import HowItWorks from './components/HowItWorks.jsx';
import Footer from './components/Footer.jsx';
import ChooseParkEasy from './components/chooseParkasy.jsx';
import ParkingResults from './components/ParkingResults.jsx';
import Login from './components/Login.jsx';
import Inscription from './components/inscription.jsx';
import AboutPage from './components/AboutPage.jsx';
import FeaturesPage from './components/FeaturesPage.jsx';
import ServicesPage from './components/ServicesPage.jsx';
import logo from './assets/logo.png';
import parkingBg from './assets/parking.png';
import {
  Sparkles, Menu, X, Search, MapPin, ClipboardList,
  Tag, HelpCircle, Globe, User, LogIn,
  Calendar, Clock
} from 'lucide-react';

function App() {
  const [view, setView] = useState('home');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('27/01/2026');
  const [endDate, setEndDate] = useState('27/01/2026');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [lang, setLang] = useState('FR');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = {
    FR: {
      promo: "réservez gratuitement votre 1ère place avec le code",
      enProfiter: "En profiter",
      accueil: "Accueil",
      services: "Services",
      features: "Fonctionnalités",
      about: "À propos",
      login: "Connexion",
      signup: "S'inscrire",
      heroT1: "Trouvez & Réservez un Parking en",
      heroSec: "Secondes",
      heroSub: "Réservez des places garanties dans les aéroports et centres-villes. Économisez du temps et de l'argent.",
      now: "Maintenant",
      tomorrow: "Demain",
      loc: "Localisation",
      locPlaceholder: "Adresse, lieu, quartier...",
      start: "Début",
      end: "Fin",
      searchBtn: "Rechercher",
      pop: "Populaire :",
      villes: "Villes au Maroc",
      stat1Label: "Places de Parking",
      stat2Label: "Villes",
      stat3Label: "Assistance",
      stat4Label: "Satisfaction"
    },
    EN: {
      promo: "book your 1st spot for free with code",
      enProfiter: "Enjoy now",
      accueil: "Home",
      services: "Services",
      features: "Features",
      about: "About",
      login: "Login",
      signup: "Sign up",
      heroT1: "Find & Book a Parking in",
      heroSec: "Seconds",
      heroSub: "Reserve guaranteed spots in airports and city centers. Save time and money.",
      now: "Now",
      tomorrow: "Tomorrow",
      loc: "Location",
      locPlaceholder: "Address, place...",
      start: "Start",
      end: "End",
      searchBtn: "Search",
      pop: "Popular:",
      villes: "Cities in Morocco",
      stat1Label: "Parking Spaces",
      stat2Label: "Cities",
      stat3Label: "Support",
      stat4Label: "Satisfaction"
    }
  }[lang];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      alert("Veuillez entrer une localisation");
      return;
    }
    alert(`Recherche de parking à : ${location}\nDu : ${startDate} ${startTime}\nAu : ${endDate} ${endTime}`);
  };

  const handleTimeChange = (type, value) => {
    if (type === 'start')
      setStartTime(value);
    else setEndTime(value);
  };

  const handleDateChange = (type, value) => {
    if (type === 'start') setStartDate(value);
    else setEndDate(value);
  };

  const handleNow = (type) => {
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR');
    const time = now.toTimeString().slice(0, 5);

    if (type === 'start' || type === 'both') {
      setStartDate(date);
      setStartTime(time);
    }
    if (type === 'end' || type === 'both') {
      setEndDate(date);
      setEndTime(time);
    }
  };

  return (
    <div className="app">
      {/* ── TOPBAR ── */}
      <div className="topbar">
        <Sparkles size={14} className="topbar-icon" />
        <span>Nouveau&nbsp;: {t.promo}&nbsp;<strong>PARLAK1</strong></span>
        <a href="#find-parking" className="topbar-cta">{t.enProfiter} →</a>
      </div>

      {/* ── HEADER (Shared) ── */}
      <header className="header">
        <div className="hdr-inner">
          <a href="/" className="hdr-logo" onClick={(e) => { e.preventDefault(); setView('home'); }}>
            <div className="hdr-logo-badge">
              <img src={logo} alt="" className="hdr-logo-img" />
            </div>
            <div className="hdr-logo-text">
              <span className="hdr-logo-name">ParLak</span>
              <span className="hdr-logo-tagline">Stationnement Intelligent</span>
            </div>
          </a>

          <nav className={`hdr-nav ${isMenuOpen ? 'open' : ''}`}>
            <a href="/" className={`hdr-link ${view === 'home' ? 'hdr-link--active' : ''}`} onClick={(e) => { e.preventDefault(); setView('home'); setIsMenuOpen(false); }}>
              {t.accueil}
            </a>
            <a href="#services" className={`hdr-link ${view === 'services' ? 'hdr-link--active' : ''}`} onClick={(e) => { e.preventDefault(); setView('services'); setIsMenuOpen(false); }}>
              {t.services}
            </a>
            <a href="#features" className={`hdr-link ${view === 'features' ? 'hdr-link--active' : ''}`} onClick={(e) => { e.preventDefault(); setView('features'); setIsMenuOpen(false); }}>
              {t.features}
            </a>
            <a href="#about" className={`hdr-link ${view === 'about' ? 'hdr-link--active' : ''}`} onClick={(e) => { e.preventDefault(); setView('about'); setIsMenuOpen(false); }}>
              {t.about}
            </a>
          </nav>

          <div className="hdr-right">
            <div className="hdr-lang-wrap">
              <button 
                className="hdr-lang" 
                onClick={() => setIsLangOpen(!isLangOpen)}
                onBlur={() => setTimeout(() => setIsLangOpen(false), 200)}
              >
                <Globe size={16} /> {lang} <span style={{fontSize: '10px', marginLeft: '4px'}}>▼</span>
              </button>
              {isLangOpen && (
                <div className="hdr-lang-dropdown">
                  <div className={`lang-opt ${lang === 'FR' ? 'active' : ''}`} onClick={() => { setLang('FR'); setIsLangOpen(false); }}>
                    Français (FR)
                  </div>
                  <div className={`lang-opt ${lang === 'EN' ? 'active' : ''}`} onClick={() => { setLang('EN'); setIsLangOpen(false); }}>
                    English (EN)
                  </div>
                </div>
              )}
            </div>
            <button className={`hdr-btn hdr-btn--ghost ${view === 'login' ? 'active' : ''}`} onClick={() => setView('login')}>
              <User size={17} /> {t.login}
            </button>
            <button className="hdr-btn hdr-btn--fill" onClick={() => setView('inscription')}>
              <LogIn size={17} /> {t.signup}
            </button>
            <button
              className="hdr-burger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT (Conditional) ── */}
      {view === 'home' && (
        <>
          <main className="main-content" style={{ backgroundImage: `url(${parkingBg})` }}>
            <div className="container">
              <div className="hero-section">
                <div className="hero-content">
                  <h1 className="hero-title">
                    {t.heroT1} <span className="highlight">{t.heroSec}</span>
                  </h1>
                  <p className="hero-subtitle">
                    {t.heroSub}
                  </p>
                </div>

                <div className="search-bar-wrapper">
                  <div className="search-chips">
                    <button type="button" className="chip" onClick={() => handleNow('both')}>
                      <Clock size={14} /> {t.now}
                    </button>
                    <button
                      type="button"
                      className="chip"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        setStartDate(tomorrow.toLocaleDateString('fr-FR'));
                        setEndDate(tomorrow.toLocaleDateString('fr-FR'));
                      }}
                    >
                      <Calendar size={14} /> {t.tomorrow}
                    </button>
                  </div>

                  <form onSubmit={handleSearch} className="search-bar">
                    <div className="bar-field bar-location">
                      <span className="bar-label"><MapPin size={14} /> {t.loc}</span>
                      <div className="bar-input-row">
                        <input
                          type="text"
                          className="bar-input"
                          placeholder={t.locPlaceholder}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="bar-geo-btn"
                          onClick={() => navigator.geolocation.getCurrentPosition(
                            (pos) => setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
                            () => setLocation('Près de ma position')
                          )}
                        >
                          <MapPin size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="bar-divider" />
                    <div className="bar-field bar-datetime">
                      <span className="bar-label"><Calendar size={14} /> {t.start}</span>
                      <div className="bar-input-row">
                        <input
                          type="text"
                          className="bar-input"
                          value={startDate}
                          onChange={(e) => handleDateChange('start', e.target.value)}
                          placeholder="JJ/MM/AAAA"
                        />
                        <select
                          className="bar-select"
                          value={startTime}
                          onChange={(e) => handleTimeChange('start', e.target.value)}
                        >
                          {Array.from({ length: 24 * 4 }, (_, i) => {
                            const h = Math.floor(i / 4);
                            const m = (i % 4) * 15;
                            const t = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                            return <option key={t} value={t}>{t}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="bar-divider" />
                    <div className="bar-field bar-datetime">
                      <span className="bar-label"><Clock size={14} /> {t.end}</span>
                      <div className="bar-input-row">
                        <input
                          type="text"
                          className="bar-input"
                          value={endDate}
                          onChange={(e) => handleDateChange('end', e.target.value)}
                          placeholder="JJ/MM/AAAA"
                        />
                        <select
                          className="bar-select"
                          value={endTime}
                          onChange={(e) => handleTimeChange('end', e.target.value)}
                        >
                          {Array.from({ length: 24 * 4 }, (_, i) => {
                            const h = Math.floor(i / 4);
                            const m = (i % 4) * 15;
                            const t = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                            return <option key={t} value={t}>{t}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="bar-search-btn">
                      <Search size={20} />
                      <span>{t.searchBtn}</span>
                    </button>
                  </form>

                  <div className="quick-filters">
                    <span className="filters-label">{t.pop}</span>
                    <button type="button" className="filter-btn">Aéroports</button>
                    <button type="button" className="filter-btn">Événements</button>
                    <button type="button" className="filter-btn">Centres-villes</button>
                    <button type="button" className="filter-btn">Centres commerciaux</button>
                    <button type="button" className="filter-btn">Hôtels</button>
                  </div>
                </div>

                <div className="stats-section">
                  <div className="stat-item">
                    <div className="stat-number">10,000+</div>
                    <div className="stat-label">{t.stat1Label}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">{t.stat2Label}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">{t.stat3Label}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">{t.stat4Label}</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <ParkingResults lang={lang} />
          <HowItWorks lang={lang} />
          <ChooseParkEasy lang={lang} />
        </>
      )}

      {view === 'about' && <AboutPage lang={lang} />}
      {view === 'features' && <FeaturesPage lang={lang} />}
      {view === 'services' && <ServicesPage lang={lang} />}
{view === 'login' && <Login lang={lang} onBack={() => setView('home')} />}
      {view === 'inscription' && <Inscription lang={lang} onBack={() => setView('home')} />}

      {view !== 'login' && view !== 'inscription' && <Footer lang={lang} />}
    </div>
  );
}

export default App;