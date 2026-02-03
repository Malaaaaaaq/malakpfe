//hadi component t9adro t integriwha f projet dialkom ba9in chi 7wayj feha gha statique 
//- concept li 3andi f bali howa 'admin dial lparking ida crea compt as admin localisation dial parking dialo ghadi twali tal3a 3la chkal marker (chufo lcdoe bach t3arfo chno howa lmarker)'
//j'espere nkun 3awntkom bhadchi wla l9ito mushkil bach t integriw hadchi fel projet guliha lia a malak
// smit had library leflet js 
// courage et desole 


//Kan-importiw hooks dyal React
import { useEffect, useRef, useState } from 'react';

// Kan-importiw Leaflet (library dyal maps)
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Plugins dyal Leaflet
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Plugin dyal routing (bach n7sbo tri9)
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix dyal marker icons hit React ma kay7mlhomch mzyan
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Icon khas dyal parking (7mer)
const parkingIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component dyal map
const Map = ({ center = [31.7917, -7.0926], zoom = 6 }) => {

  // ref dyal div fin ghadi trsam  map
  const mapRef = useRef(null);

  // ref bach n7fdo instance dyal leaflet map
  const mapInstance = useRef(null);

  // state dyal location dyal user
  const [userLocation, setUserLocation] = useState(null);

  // ref bach location bach events tb9a dispo
  const userLocationRef = useRef(null);

 
  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {

    // n-initialisiw map ghir mara wa7da
    if (!mapInstance.current && mapRef.current) {

      // création dyal map
      mapInstance.current = L.map(mapRef.current).setView(center, zoom);

      // tiles dyal OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapInstance.current);

      // function bach njibo location dyal user
      const getUserLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {

            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // stockage dyal location
            setUserLocation(location);
            userLocationRef.current = location;

            mapInstance.current.setView([location.lat, location.lng], 13);

            // marker dyal user
            L.marker([location.lat, location.lng])
              .addTo(mapInstance.current)
              .bindPopup('Your Location');
          });
        }
      };

      // kan3ayto l function
      getUserLocation();

      // layer dyal parkings
      const parkingLayer = L.layerGroup();

      // fake service kayrja3 data dyal parkings
      const fetchParkingFromService = async () => {
        return [
          { lat: 31.6295, lng: -7.9811, name: 'Parking Jemaa el-Fnaa' },
          { lat: 34.0209, lng: -6.8416, name: 'Parking Mohammed V' },
          { lat: 35.7595, lng: -5.8340, name: 'Parking Medina Tangier' },
        ];
      };

      // hadi gha katfetchi lekom parking li kaynin
      const fetchParkingData = async () => {
        const parkings = await fetchParkingFromService();

        parkings.forEach((parking) => {

          const marker = L.marker(
            [parking.lat, parking.lng],
            { icon: parkingIcon }
          );

          marker.bindPopup(parking.name);

          // ila user clicka 3la parking
          marker.on('click', () => {

            // kat7ayed route ila kant 9dima
            if (window.currentRoute) {
              mapInstance.current.removeControl(window.currentRoute);
            }

            const userLoc = userLocationRef.current;

            if (userLoc) {
              // hadi kaybayen lekom tre9 mn user l parking li howa khtaro
              window.currentRoute = L.Routing.control({
                waypoints: [
                  L.latLng(userLoc.lat, userLoc.lng),
                  L.latLng(parking.lat, parking.lng)
                ]
              }).addTo(mapInstance.current);
            } else {
              alert('خصك تفعّل location');
            }
          });

          marker.addTo(parkingLayer);
        });
      };

      fetchParkingData();

      // control dyal layers
      L.control.layers({}, { Parkings: parkingLayer })
        .addTo(mapInstance.current);

      parkingLayer.addTo(mapInstance.current);
    }

    // cleanup mali ghadi t7ayed compo
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };

  }, []);

  // div dyal map
  return (
    <div
      ref={mapRef}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default Map;
