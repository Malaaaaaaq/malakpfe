import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* Fix leaflet default icon paths */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const AgentLocationModal = ({ onConfirm, onClose }) => {
  const [position, setPosition] = useState({ lat: 33.5731, lng: -7.5898 }); // Default Casa

  const handleConfirm = () => {
    onConfirm(position);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal" style={{ width: '90%', maxWidth: '800px', padding: 0, overflow: 'hidden' }}>
        <div className="modal-header" style={{ padding: '1rem 1.5rem', background: '#041562', color: 'white' }}>
          <h3 style={{ margin: 0 }}>📍 Localisez votre parking</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>
            Cliquez sur la carte pour placer le marqueur à l'endroit exact de votre parking.
          </p>
          
          <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={13}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.9rem', color: '#041562', fontWeight: '600' }}>
              Coordonnées : {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-ghost" onClick={onClose}>Annuler</button>
              <button 
                className="btn-primary" 
                onClick={handleConfirm}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Confirmer la position
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLocationModal;
