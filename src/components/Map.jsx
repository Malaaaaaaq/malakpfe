import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const parkingIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = ({ center = [33.5731, -7.5898], zoom = 13, parkings = [] }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const userLocationRef = useRef(null);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance.current);

      navigator.geolocation?.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        userLocationRef.current = location;
        mapInstance.current.setView([location.lat, location.lng], 13);
        L.marker([location.lat, location.lng])
          .addTo(mapInstance.current)
          .bindPopup('<b>Votre position</b>');
      });

      const defaultParkings = parkings.length > 0 ? parkings : [
        { lat: 33.5731, lng: -7.5898, name: 'Downtown Plaza Parking', price: '10dh/hr', available: true },
        { lat: 33.5800, lng: -7.6000, name: 'Central Station Garage', price: '10dh/hr', available: true },
        { lat: 33.5650, lng: -7.5750, name: 'Airport Express Parking', price: '10dh/hr', available: false },
        { lat: 33.5900, lng: -7.5850, name: 'Business District Lot', price: '10dh/hr', available: true },
        { lat: 33.5600, lng: -7.6100, name: 'Mall Plaza Parking', price: '10dh/hr', available: true },
      ];

      defaultParkings.forEach((parking) => {
        if (!parking.lat || !parking.lng) return;
        L.marker([parking.lat, parking.lng], { icon: parkingIcon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="min-width:150px">
              <b>${parking.name}</b><br/>
              <span style="color:#041562;font-weight:600">${parking.price}</span><br/>
              <span style="color:${parking.available ? '#22c55e' : '#ef4444'}">${parking.available ? '● Available' : '● Full'}</span>
            </div>
          `);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
  );
};

export default Map;
