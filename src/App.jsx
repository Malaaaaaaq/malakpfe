// App.js
import React, { useState } from 'react';
import './App.css';
import HowItWorks from './components/HowItWorks.jsx';
import Footer from './components/Footer.jsx';
import ChooseParkEasy from './components/chooseParkasy.jsx';
import {
  Zap, Menu, X, Search, ClipboardList, HelpCircle,
  User, LogIn, MapPin, Calendar, Clock, ArrowRight,
  Car, Map, Headphones, Star, Sparkles
} from 'lucide-react';

function App() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('27/01/2026');
  const [endDate, setEndDate] = useState('27/01/2026');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      alert("Veuillez entrer une localisation");
      return;
    }
    alert(`Recherche de parking à: ${location}\nDu: ${startDate} ${startTime}\nAu: ${endDate} ${endTime}`);
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
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <button
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="logo">ParLak</h1>
            </div>

            <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
              <a href="#find-parking" className="nav-link active">
                <Search size={20} />
                <span className="nav-text">Find Parking</span>
              </a>
              <a href="#bookings" className="nav-link">
                <ClipboardList size={20} />
                <span className="nav-text">My Bookings</span>
              </a>
              <a href="#how-it-works" className="nav-link">
                <HelpCircle size={20} />
                <span className="nav-text">How It Works</span>
              </a>
            </nav>

            <div className="auth-section">
              <button className="auth-btn login">
                <User size={20} />
                <span className="btn-text">Login</span>
              </button>
              <button className="auth-btn signin">
                <LogIn size={20} />
                <span className="btn-text">Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </header>


      <main className="main-content">
        <div className="container">
          <div className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Find & Reserve Parking in <span className="highlight">Seconds</span>
              </h1>
              <p className="hero-subtitle">
                Book guaranteed parking spots at airports, events, and city centers.
                Save time and money.
              </p>
            </div>


            <div className="search-card">
              <form onSubmit={handleSearch} className="search-form">
                <div className="form-header">
                  <h3 className="form-title">📍 Find Your Perfect Spot</h3>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="action-btn now-btn"
                      onClick={() => handleNow('both')}
                    >
                      Now
                    </button>
                    <button
                      type="button"
                      className="action-btn soon-btn"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        setStartDate(tomorrow.toLocaleDateString('fr-FR'));
                        setEndDate(tomorrow.toLocaleDateString('fr-FR'));
                      }}
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>

                <div className="form-grid">
                  {/* Location */}
                  <div className="form-group location-group">
                    <label className="form-label">
                      <MapPin size={18} className="label-icon" />
                      Location
                    </label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        id="location-input"
                        className="form-input"
                        placeholder="Enter address or landmark..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="input-action"
                        onClick={() => navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const { latitude, longitude } = pos.coords;
                            setLocation(`Near me (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                          },
                          () => setLocation("Near my location")
                        )}
                      >
                        <MapPin size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="form-group datetime-group">
                    <label className="form-label">
                      <Calendar size={18} className="label-icon" />
                      Start Date & Time
                    </label>
                    <div className="datetime-inputs">
                      <div className="date-wrapper">
                        <input
                          type="text"
                          id="start-date-input"
                          className="date-input"
                          value={startDate}
                          onChange={(e) => handleDateChange('start', e.target.value)}
                          placeholder="DD/MM/YYYY"
                        />
                        <button
                          type="button"
                          className="date-action"
                          onClick={() => handleNow('start')}
                        >
                          Now
                        </button>
                      </div>
                      <div className="time-wrapper">
                        <select
                          id="start-time-select"
                          className="time-input"
                          value={startTime}
                          onChange={(e) => handleTimeChange('start', e.target.value)}
                        >
                          {Array.from({ length: 24 * 4 }, (_, i) => {
                            const hour = Math.floor(i / 4);
                            const minute = (i % 4) * 15;
                            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            return (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group datetime-group">
                    <label className="form-label">
                      <Clock size={18} className="label-icon" />
                      End Date & Time
                    </label>
                    <div className="datetime-inputs">
                      <div className="date-wrapper">
                        <input
                          type="text"
                          id="end-date-input"
                          className="date-input"
                          value={endDate}
                          onChange={(e) => handleDateChange('end', e.target.value)}
                          placeholder="DD/MM/YYYY"
                        />
                        <button
                          type="button"
                          className="date-action"
                          onClick={() => handleNow('end')}
                        >
                          Now
                        </button>
                      </div>
                      <div className="time-wrapper">
                        <select
                          id="end-time-select"
                          className="time-input"
                          value={endTime}
                          onChange={(e) => handleTimeChange('end', e.target.value)}
                        >
                          {Array.from({ length: 24 * 4 }, (_, i) => {
                            const hour = Math.floor(i / 4);
                            const minute = (i % 4) * 15;
                            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            return (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group search-group">
                    <button type="submit" id="search-submit-btn" className="search-btn">
                      <Search size={20} />
                      <span className="search-text">Search Parking</span>
                      <ArrowRight size={20} className="search-arrow" />
                    </button>
                    <p className="search-hint">
                      <Sparkles size={14} className="hint-icon" />
                      Over 1,000+ spots available
                    </p>
                  </div>
                </div>


                <div className="quick-filters">
                  <span className="filters-label">Popular:</span>
                  <button type="button" className="filter-btn">Airports</button>
                  <button type="button" className="filter-btn">Events</button>
                  <button type="button" className="filter-btn">City Centers</button>
                  <button type="button" className="filter-btn">Shopping Malls</button>
                  <button type="button" className="filter-btn">Hotels</button>
                </div>
              </form>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Parking Spots</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Cities</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </main>


      <HowItWorks />
<ChooseParkEasy/>
<Footer />
     
    </div>
  );
}

export default App;