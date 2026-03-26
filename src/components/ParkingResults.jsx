import React, { useState } from 'react';
import { Star, MapPin, Zap, Shield, Clock, Sun, Wifi, Car } from 'lucide-react';
import Map from './Map';
import './ParkingResults.css';

const ParkingResults = ({ lang = 'FR' }) => {
  const t = {
    FR: {
      title: "Parkings Disponibles",
      viewMap: "Vue Carte",
      viewList: "Vue Liste",
      sortBy: "Trier par :",
      sortOpts: ["Recommandé", "Prix", "Note", "Distance"],
      available: "Disponible",
      full: "Complet",
      limited: "Limité",
      perHour: "/heure",
      reserve: "Réserver",
      f1: "Sécurité 24h/24",
      f2: "Recharge VE",
      f3: "Parking PMR",
      f4: "Parking couvert",
      f5: "Vidéosurveillance",
      f6: "Éclairage 24h/24",
      f7: "Navette aéroport",
      f8: "Lavage auto",
      f9: "Bornes recharge",
      f10: "Entrée intelligente"
    },
    EN: {
      title: "Available Parking",
      viewMap: "Map View",
      viewList: "List View",
      sortBy: "Sort by :",
      sortOpts: ["Recommended", "Price", "Rating", "Distance"],
      available: "Available",
      full: "Full",
      limited: "Limited",
      perHour: "/hour",
      reserve: "Reserve Now",
      f1: "24/7 Security",
      f2: "EV Charging",
      f3: "Disabled Parking",
      f4: "Covered Parking",
      f5: "Video Surveillance",
      f6: "24/7 Lighting",
      f7: "Airport Shuttle",
      f8: "Car Wash",
      f9: "Charging Stations",
      f10: "Smart Entry"
    }
  }[lang];

  const parkingData = [
    {
      id: 1,
      name: 'Downtown Plaza Parking',
      address: '123 Main Street, Downtown',
      rating: 4.8,
      reviews: 234,
      price: 10,
      available: true,
      badge: t.available,
      badgeColor: '#22c55e',
      distance: '0.3 km',
      features: [t.f1, t.f2, t.f3],
      featureIcons: [Shield, Zap, Car],
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80',
    },
    {
      id: 2,
      name: 'Central Station Garage',
      address: '145 Station Road, City Center',
      rating: 4.5,
      reviews: 189,
      price: 10,
      available: true,
      badge: t.available,
      badgeColor: '#22c55e',
      distance: '0.8 km',
      features: [t.f4, t.f5, t.f6],
      featureIcons: [Car, Shield, Sun],
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80',
    },
    {
      id: 3,
      name: 'Airport Express Parking',
      address: '789 Airport Boulevard',
      rating: 4.3,
      reviews: 412,
      price: 10,
      available: false,
      badge: t.full,
      badgeColor: '#ef4444',
      distance: '1.2 km',
      features: [t.f7, t.f1, t.f8],
      featureIcons: [Car, Shield, Zap],
      image: 'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?w=400&q=80',
    }
  ];

  const [viewMode, setViewMode] = useState('split');
  const [sortBy, setSortBy] = useState('recommended');

  return (
    <section className="parking-results-section">
      <div className="results-container">
        <div className="results-toolbar">
          <h2 className="results-title">{t.title}</h2>
          <div className="toolbar-right">
            <div className="view-toggle">
              <button className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`} onClick={() => setViewMode('split')}>{t.viewMap}</button>
              <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>{t.viewList}</button>
            </div>
            <div className="sort-wrapper">
              <span className="sort-label">{t.sortBy}</span>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">{t.sortOpts[0]}</option>
                <option value="price">{t.sortOpts[1]}</option>
                <option value="rating">{t.sortOpts[2]}</option>
                <option value="distance">{t.sortOpts[3]}</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`results-content ${viewMode === 'list' ? 'list-only' : ''}`}>
          <div className="parking-list">
            {parkingData.map((p) => (
              <div key={p.id} className="parking-card">
                <div className="card-image-wrapper">
                  <img src={p.image} alt={p.name} className="card-image" />
                  <span className="card-badge" style={{ background: p.badgeColor }}>{p.badge}</span>
                  <span className="card-distance">{p.distance}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-name">{p.name}</h3>
                  <p className="card-address"><MapPin size={13} /> {p.address}</p>
                  <div className="card-rating">
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span className="rating-value">{p.rating}</span>
                    <span className="rating-count">({p.reviews})</span>
                  </div>
                  <div className="card-features">
                    {p.features.map((f, i) => {
                      const Icon = p.featureIcons[i];
                      return <span key={i} className="feature-tag"><Icon size={11} /> {f}</span>;
                    })}
                  </div>
                  <div className="card-footer">
                    <div className="card-price">
                      <span className="price-value">{p.price}dh</span>
                      <span className="price-unit">{t.perHour}</span>
                    </div>
                    <button className={`reserve-btn ${!p.available ? 'disabled' : ''}`} disabled={!p.available}>
                      {p.available ? t.reserve : t.full}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {viewMode !== 'list' && (
            <div className="map-panel">
              <Map center={[33.5731, -7.5898]} zoom={13} parkings={parkingData} />
              <div className="map-legend">
                <span className="legend-item available">● {t.available}</span>
                <span className="legend-item full">● {t.full}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ParkingResults;
