import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* Fix leaflet default icon paths (broken in Vite) */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Icône parking personnalisée */
const makeIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="
    background:${color};color:#fff;border:2.5px solid #fff;
    border-radius:50% 50% 50% 0;transform:rotate(-45deg);
    width:32px;height:32px;display:flex;align-items:center;justify-content:center;
    box-shadow:0 3px 10px rgba(0,0,0,.35);font-weight:800;font-size:14px;
  "><span style="transform:rotate(45deg)">P</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
});

const greenIcon  = makeIcon('#10b981');
const orangeIcon = makeIcon('#f59e0b');
const redIcon    = makeIcon('#ef4444');

/* Icône position utilisateur */
const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;background:#2563eb;border:3px solid #fff;
    border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,.25);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/* Recentre la carte sur la position de l'utilisateur */
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, 14); }, [center, map]);
  return null;
};

const NearbyMap = ({ userPos, parkings, onSelect, onClose }) => {
  if (!userPos) return null;

  const getParkingIcon = (p) => {
    const ratio = p.free / p.total;
    if (ratio > 0.3) return greenIcon;
    if (ratio > 0.1) return orangeIcon;
    return redIcon;
  };

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal-box" onClick={e => e.stopPropagation()}>
        <div className="map-modal-header">
          <div>
            <h3>🗺 Parkings près de vous</h3>
            <span>{parkings.length} parking{parkings.length > 1 ? 's' : ''} trouvé{parkings.length > 1 ? 's' : ''}</span>
          </div>
          <button className="map-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="map-legend">
          <span><span className="legend-dot green"/>Disponible</span>
          <span><span className="legend-dot orange"/>Limité</span>
          <span><span className="legend-dot red"/>Complet</span>
          <span><span className="legend-dot blue"/>Vous</span>
        </div>

        <MapContainer
          center={[userPos.lat, userPos.lng]}
          zoom={14}
          style={{ width: '100%', height: '420px', borderRadius: '12px' }}
          scrollWheelZoom={true}
        >
          <RecenterMap center={[userPos.lat, userPos.lng]} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Position utilisateur */}
          <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
            <Popup><strong>Vous êtes ici</strong></Popup>
          </Marker>

          {/* Rayon 5 km */}
          <Circle
            center={[userPos.lat, userPos.lng]}
            radius={5000}
            pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.04, weight: 1.5, dashArray: '6' }}
          />

          {/* Markers parkings */}
          {parkings.map(p => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={getParkingIcon(p)}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0a1628', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{p.address}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 10 }}>
                    <span style={{ color: p.free > 5 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                      {p.free} place{p.free > 1 ? 's' : ''} libre{p.free > 1 ? 's' : ''}
                    </span>
                    <span style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(p.rating))} {p.rating}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>
                    📍 {p.distKm ? p.distKm.toFixed(1) + ' km' : p.dist}
                  </div>
                  <button
                    onClick={() => onSelect(p)}
                    style={{
                      width: '100%', padding: '7px 0',
                      background: 'linear-gradient(135deg,#0a1628,#2563eb)',
                      color: '#fff', border: 'none', borderRadius: 7,
                      fontWeight: 600, fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    ✓ Sélectionner ce parking
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Liste rapide sous la carte */}
        <div className="map-parking-list">
          {parkings.map(p => (
            <div key={p.id} className="map-parking-item" onClick={() => onSelect(p)}>
              <div>
                <div className="mpi-name">{p.name}</div>
                <div className="mpi-addr">{p.address}</div>
              </div>
              <div className="mpi-right">
                <span className={`mpi-free ${p.free > 5 ? 'green' : p.free > 0 ? 'orange' : 'red'}`}>
                  {p.free} libres
                </span>
                <span className="mpi-dist">{p.distKm ? p.distKm.toFixed(1)+' km' : p.dist}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyMap;
