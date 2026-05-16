import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ClientDashboard.css';
import NearbyMap from './NearbyMap.jsx';
import './NearbyMap.css';
import {
  LogOut, MapPin, Calendar, Clock, User, Bell,
  CreditCard, Gift, Settings, ChevronRight, Car,
  Plus, Trash2, Home, List, Search, AlertCircle,
  CheckCircle, XCircle, Star, Zap, TrendingUp,
  Download, Eye, Edit, Menu, X, Check, Navigation,
  LayoutDashboard, Wallet, ChevronDown, QrCode
} from 'lucide-react';

/* ── QR Code SVG ───────────────────────────────── */
const QRCodeSVG = () => (
  <svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'auto', display:'block' }}>
    <rect x="5"  y="5"  width="32" height="32" rx="3" fill="none" stroke="#041562" strokeWidth="3"/>
    <rect x="11" y="11" width="20" height="20" rx="2" fill="#041562"/>
    <rect x="73" y="5"  width="32" height="32" rx="3" fill="none" stroke="#041562" strokeWidth="3"/>
    <rect x="79" y="11" width="20" height="20" rx="2" fill="#041562"/>
    <rect x="5"  y="73" width="32" height="32" rx="3" fill="none" stroke="#041562" strokeWidth="3"/>
    <rect x="11" y="79" width="20" height="20" rx="2" fill="#041562"/>
    {[
      [44,5],[50,5],[62,5],[68,5],[44,11],[56,11],[68,11],[44,17],[50,17],[56,17],[62,17],
      [44,23],[62,23],[44,29],[50,29],[56,29],[68,29],[44,44],[50,44],[56,44],[68,44],[80,44],[92,44],[98,44],
      [44,50],[68,50],[80,50],[98,50],[44,56],[50,56],[62,56],[74,56],[86,56],[98,56],
      [44,62],[56,62],[74,62],[86,62],[44,68],[50,68],[62,68],[80,68],[98,68],
      [44,74],[62,74],[74,74],[86,74],[44,80],[50,80],[56,80],[80,80],[92,80],
      [44,86],[56,86],[68,86],[80,86],[44,92],[50,92],[62,92],[74,92],[92,92],
      [44,98],[56,98],[68,98],[86,98],[98,98],[5,44],[17,44],[29,44],[5,50],[17,50],
      [5,56],[11,56],[23,56],[29,56],[5,62],[23,62],[5,68],[11,68],[17,68],[29,68],
      [5,74],[11,74],[23,74],[29,74],[5,80],[17,80],[5,86],[11,86],[17,86],[23,86],
      [5,92],[17,92],[29,92],[5,98],[11,98],[23,98],
    ].map(([x,y],i) => <rect key={i} x={x} y={y} width="6" height="6" rx="0.5" fill="#041562"/>)}
    <circle cx="55" cy="55" r="10" fill="white" stroke="#041562" strokeWidth="1.5"/>
    <text x="55" y="59.5" textAnchor="middle" fontSize="12" fontWeight="900" fill="#041562">P</text>
  </svg>
);

/* ════════════════════════════════════════════════
   API HELPER
════════════════════════════════════════════════ */
const API = 'http://localhost:8000/api';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('parlak_token') || ''}`,
});
const apiFetch = (path, opts = {}) =>
  fetch(`${API}${path}`, { ...opts, headers: authHeaders() }).then(r => r.json());

/* spots: { id, status: libre|occupee|reservee|vip, type: standard|vip|electrique|handicap|moto, price } */
const mkS = (id, st, tp, pr) => ({ id, status: st, type: tp, price: pr });

const PARKING_ZONES = {
  'Zone A – Niveau 1': [
    [mkS('A-01','occupee','standard',8), mkS('A-02','libre','standard',8),    mkS('A-03','occupee','standard',8), mkS('A-04','libre','standard',8),    mkS('A-05','libre','standard',8),    mkS('A-06','occupee','standard',8)],
    [mkS('B-01','libre','electrique',12),mkS('B-02','occupee','standard',8),  mkS('B-03','libre','standard',8),   mkS('B-04','libre','standard',8),    mkS('B-05','occupee','standard',8),  mkS('B-06','libre','handicap',8)],
    [mkS('C-01','occupee','standard',8), mkS('C-02','libre','standard',8),    mkS('C-03','libre','standard',8),   mkS('C-04','occupee','standard',8),  mkS('C-05','libre','standard',8),    mkS('C-06','reservee','standard',8)],
    [mkS('D-01','libre','standard',8),   mkS('D-02','occupee','standard',8),  mkS('D-03','libre','standard',8),   mkS('D-04','libre','standard',8),    mkS('D-05','occupee','standard',8),  mkS('D-06','libre','standard',8)],
  ],
  'Zone B – Niveau 1': [
    [mkS('A-01','occupee','standard',8), mkS('A-02','occupee','standard',8),  mkS('A-03','libre','standard',8),   mkS('A-04','libre','standard',8),    mkS('A-05','reservee','standard',8), mkS('A-06','occupee','standard',8)],
    [mkS('B-01','occupee','standard',8), mkS('B-02','libre','standard',8),    mkS('B-03','libre','standard',8),   mkS('B-04','libre','vip',15),         mkS('B-05','libre','vip',15),         mkS('B-06','occupee','standard',8)],
    [mkS('C-01','libre','standard',8),   mkS('C-02','libre','standard',8),    mkS('C-03','libre','standard',8),   mkS('C-04','libre','standard',8),    mkS('C-05','occupee','standard',8),  mkS('C-06','libre','standard',8)],
    [mkS('D-01','occupee','standard',8), mkS('D-02','libre','standard',8),    mkS('D-03','libre','standard',8),   mkS('D-04','occupee','standard',8),  mkS('D-05','libre','standard',8),    mkS('D-06','libre','standard',8)],
  ],
  'Zone C – Niveau 2': [
    [mkS('A-01','libre','standard',8),   mkS('A-02','libre','standard',8),    mkS('A-03','occupee','standard',8), mkS('A-04','libre','standard',8),    mkS('A-05','occupee','standard',8),  mkS('A-06','libre','standard',8)],
    [mkS('B-01','libre','vip',15),       mkS('B-02','reservee','standard',8), mkS('B-03','libre','standard',8),   mkS('B-04','occupee','standard',8),  mkS('B-05','libre','standard',8),    mkS('B-06','libre','electrique',12)],
    [mkS('C-01','occupee','standard',8), mkS('C-02','libre','standard',8),    mkS('C-03','occupee','standard',8), mkS('C-04','libre','standard',8),    mkS('C-05','libre','standard',8),    mkS('C-06','occupee','standard',8)],
    [mkS('D-01','libre','standard',8),   mkS('D-02','libre','standard',8),    mkS('D-03','occupee','standard',8), mkS('D-04','libre','standard',8),    mkS('D-05','reservee','standard',8), mkS('D-06','libre','standard',8)],
  ],
};


const PARKINGS_BY_CITY = {
  'Casablanca': [
    { id:'casa-1', name:'Parking Casa-Voyageurs',    address:'Gare Casa-Voyageurs, Bd Mohammed V', free:12, total:80,  dist:'0.8 km', rating:4.5, lat:33.5912, lng:-7.6235 },
    { id:'casa-2', name:'Parking Anfa Place',         address:'Bd de la Corniche, Anfa',            free:5,  total:120, dist:'2.1 km', rating:4.2, lat:33.5955, lng:-7.6680 },
    { id:'casa-3', name:'Parking Twin Center',        address:'Bd Zerktouni, Maarif',               free:23, total:150, dist:'3.5 km', rating:4.7, lat:33.5867, lng:-7.6430 },
    { id:'casa-4', name:'Parking Marjane Hay Hassani',address:'Rue Hassan Al Maamri',               free:45, total:200, dist:'4.8 km', rating:4.0, lat:33.5688, lng:-7.6601 },
  ],
  'Rabat': [
    { id:'rab-1', name:'Parking Gare Rabat-Ville', address:'Av. Mohammed V, Rabat',             free:8,  total:60,  dist:'0.5 km', rating:4.3, lat:34.0122, lng:-6.8326 },
    { id:'rab-2', name:'Parking Agdal Center',     address:'Av. Al Amir Fal Ould Omeir, Agdal', free:30, total:90,  dist:'1.9 km', rating:4.6, lat:33.9857, lng:-6.8509 },
    { id:'rab-3', name:'Parking Hay Riad',         address:'Av. Oued Akrach, Hay Riad',         free:18, total:75,  dist:'3.2 km', rating:4.1, lat:33.9637, lng:-6.8685 },
  ],
  'Marrakech': [
    { id:'mar-1', name:'Parking Jemaa El-Fna', address:'Place Jemaa El-Fna',     free:15, total:100, dist:'0.3 km', rating:4.8, lat:31.6258, lng:-7.9891 },
    { id:'mar-2', name:'Parking Gueliz',       address:'Av. Mohammed V, Gueliz', free:28, total:80,  dist:'1.5 km', rating:4.4, lat:31.6358, lng:-8.0099 },
    { id:'mar-3', name:'Parking Menara Mall',  address:'Av. de France',           free:50, total:300, dist:'4.0 km', rating:4.2, lat:31.6490, lng:-8.0391 },
  ],
  'Fès': [
    { id:'fes-1', name:'Parking Ville Nouvelle', address:'Bd Mohammed V, Fès', free:20, total:70,  dist:'0.7 km', rating:4.0, lat:34.0374, lng:-5.0010 },
    { id:'fes-2', name:'Parking Médina',         address:'Bab Bou Jeloud',      free:10, total:50,  dist:'2.3 km', rating:4.5, lat:34.0647, lng:-4.9783 },
  ],
  'Tanger': [
    { id:'tan-1', name:'Parking Port de Tanger', address:'Av. de la Résistance', free:35, total:120, dist:'0.9 km', rating:4.3, lat:35.7888, lng:-5.8138 },
    { id:'tan-2', name:'Parking Iberia',         address:'Rue Ibn Zaidoun',       free:12, total:60,  dist:'1.8 km', rating:4.1, lat:35.7735, lng:-5.8088 },
  ],
  'Agadir': [
    { id:'aga-1', name:'Parking Souss Massa',   address:'Bd Hassan II, Agadir',  free:40, total:180, dist:'1.1 km', rating:4.4, lat:30.4202, lng:-9.5987 },
    { id:'aga-2', name:'Parking Marina Agadir', address:'Bd du 20 Août',         free:22, total:90,  dist:'2.6 km', rating:4.6, lat:30.4165, lng:-9.6110 },
  ],
};

/* Haversine : distance en km entre deux points GPS */
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};
const CITY_LIST = Object.keys(PARKINGS_BY_CITY);

const DURATIONS = ['1 heure','2 heures','3 heures','4 heures','6 heures','8 heures','12 heures','24 heures'];
const ZONE_KEYS = Object.keys(PARKING_ZONES);
const ROW_LABELS = ['A','B','C','D'];
const SPOT_TYPES = [
  { id:'standard',  label:'Standard',  icon:'🅿️' },
  { id:'handicap',  label:'Handicapé', icon:'♿' },
  { id:'vip',       label:'VIP',       icon:'⭐' },
  { id:'moto',      label:'Moto',      icon:'🏍️' },
  { id:'electrique',label:'Électrique',icon:'⚡' },
  { id:'couvert',   label:'Couvert',   icon:'🏠' },
];

/* ════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════ */
const StatusBadge = ({ status }) => {
  const map = {
    upcoming:  { label:'À venir',  cls:'badge-upcoming',  Icon: AlertCircle  },
    completed: { label:'Terminé',  cls:'badge-completed', Icon: CheckCircle  },
    cancelled: { label:'Annulé',   cls:'badge-cancelled', Icon: XCircle      },
  };
  const { label, cls, Icon } = map[status] || map.upcoming;
  return <span className={`sb ${cls}`}><Icon size={11}/>{label}</span>;
};

const SpotCard = ({ spot, selected, active, onClick }) => {
  const isFree = spot.status === 'libre';
  const isVip  = spot.type === 'vip';
  const cls = selected ? 'spot-selected'
            : spot.status === 'libre'    ? (isVip ? 'spot-vip' : 'spot-libre')
            : spot.status === 'reservee' ? 'spot-reservee'
            : 'spot-occupee';

  const icon = spot.status === 'libre'    ? (isVip ? '⭐' : spot.type === 'electrique' ? '⚡' : spot.type === 'handicap' ? '♿' : '✓')
             : spot.status === 'reservee' ? '⏰'
             : '🚗';

  return (
    <div
      className={`spot-card ${cls} ${active && isFree ? 'clickable' : ''} ${selected ? 'spot-selected' : ''}`}
      onClick={() => active && isFree && onClick(spot)}
      title={`Place ${spot.id} · ${spot.status} · ${spot.price} MAD/h`}
    >
      <span className="spot-icon">{icon}</span>
      <span className="spot-id">{spot.id}</span>
      <span className="spot-price">{spot.price} MAD/h</span>
    </div>
  );
};

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
const ClientDashboard = ({ user, lang = 'FR', onLogout, onNavigate }) => {
  const [activePage, setActivePage] = useState('reserve');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Reservation state ── */
  const today = new Date().toLocaleDateString('fr-FR');
  const [form, setForm] = useState({
    city: 'Casablanca', parkingId: 'casa-1',
    date: today, time: '10:00', duration: '2 heures',
    zone: 'Zone B – Niveau 1', types: ['standard'],
  });
  const [locating, setLocating] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [nearbyParkings, setNearbyParkings] = useState([]);
  const [gridVisible, setGridVisible] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [reservationDone, setReservationDone] = useState(false);
  const [confirmedResId, setConfirmedResId] = useState('');
  const [qrModal, setQrModal] = useState(null);
  const [autoDownload, setAutoDownload] = useState(false);
  const qrRef = useRef(null);

  const handleDownloadQR = () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 400);
    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 400, 400);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `parlak-qr-${qrModal?.reference || 'ticket'}.png`;
      a.click();
    };
    img.src = url;
  };

  // Auto-télécharge le QR quand demandé depuis le tableau
  useEffect(() => {
    if (!autoDownload || !qrModal) return;
    const t = setTimeout(() => { handleDownloadQR(); setAutoDownload(false); }, 200);
    return () => clearTimeout(t);
  }, [autoDownload, qrModal]);

  /* ── Vehicles state ── */
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [noVehicleAlert, setNoVehicleAlert] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plate:'', make:'', model:'', color:'', type:'Berline' });

  /* ── Reservations state ── */
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(false);

  /* ── Load vehicles & reservations on mount ── */
  const fetchVehicles = useCallback(async () => {
    try {
      setVehiclesLoading(true);
      const data = await apiFetch('/vehicles');
      if (Array.isArray(data)) {
        setVehicles(data);
        if (data.length > 0) {
          setSelectedVehicle(prev => prev || data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    setResLoading(true);
    const data = await apiFetch('/reservations');
    if (Array.isArray(data)) setReservations(data);
    setResLoading(false);
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchReservations();
  }, [fetchVehicles, fetchReservations]);

  /* ── City/Parking computed ── */
  const cityParkings   = PARKINGS_BY_CITY[form.city] || [];
  const selectedParking = cityParkings.find(p => p.id === form.parkingId) || cityParkings[0];

  /* ── Computed ── */
  const firstName  = user?.firstname || user?.username || 'Utilisateur';
  const lastName   = user?.lastname  || '';
  const initials   = (firstName[0]||'U').toUpperCase() + (lastName[0]||'').toUpperCase();
  const hours      = parseInt(form.duration) || 2;
  const spotPrice  = selectedSpot ? selectedSpot.price : (form.types.includes('vip') ? 15 : 8);
  const subtotal   = spotPrice * hours;
  const tva        = +(subtotal * 0.1).toFixed(2);
  const total      = +(subtotal + tva).toFixed(2);
  const zoneSpots  = PARKING_ZONES[form.zone] || [];
  const libreCount = zoneSpots.flat().filter(s => s.status === 'libre').length;
  const totalCount = zoneSpots.flat().length;

  // Calculate exit time
  const exitTime = (() => {
    const [h, m] = form.time.split(':').map(Number);
    const d = new Date(); d.setHours(h + hours, m);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  })();

  /* ── Handlers ── */
  const handleSearch = () => {
    if (vehicles.length === 0) { setNoVehicleAlert(true); return; }
    setNoVehicleAlert(false);
    setGridVisible(true);
    setSelectedSpot(null);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        setUserPos({ lat, lng });

        // Trouver tous les parkings avec distance réelle
        const allParkings = Object.entries(PARKINGS_BY_CITY).flatMap(([city, list]) =>
          list.map(p => ({
            ...p,
            city,
            distKm: haversine(lat, lng, p.lat, p.lng),
          }))
        ).sort((a, b) => a.distKm - b.distKm).slice(0, 8); // 8 plus proches

        setNearbyParkings(allParkings);
        setLocating(false);
        setMapOpen(true);
      },
      () => {
        setLocating(false);
        alert('Impossible de détecter votre position. Activez la géolocalisation dans votre navigateur.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectParkingFromMap = (parking) => {
    setForm(f => ({ ...f, city: parking.city, parkingId: parking.id }));
    setMapOpen(false);
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.plate || !newVehicle.make || !newVehicle.model) return;
    const data = await apiFetch('/vehicles', {
      method: 'POST',
      body: JSON.stringify(newVehicle),
    });
    if (data.id) {
      const updated = [...vehicles, data];
      setVehicles(updated);
      setSelectedVehicle(data.id);
      setNewVehicle({ plate:'', make:'', model:'', color:'', type:'Berline' });
      setShowAddVehicle(false);
      setNoVehicleAlert(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    await apiFetch(`/vehicles/${id}`, { method: 'DELETE' });
    const updated = vehicles.filter(v => v.id !== id);
    setVehicles(updated);
    if (selectedVehicle === id) setSelectedVehicle(updated[0]?.id || null);
  };

  const handleConfirm = async () => {
    if (!selectedSpot) return;
    if (!selectedVehicle) { alert('Veuillez sélectionner un véhicule.'); return; }

    const data = await apiFetch('/reservations', {
      method: 'POST',
      body: JSON.stringify({
        vehicle_id:     selectedVehicle,
        spot_code:      selectedSpot.id,
        parking_name:   selectedParking?.name || 'Parking',
        city_name:      form.city,
        entry_date:     (() => { const [d,m,y] = form.date.split('/'); return `${y}-${m}-${d}`; })(),
        entry_time:     form.time,
        exit_time:      exitTime,
        duration_hours: hours,
        total_price:    total,
        payment_method: paymentMethod,
      }),
    });

    if (data.reference) {
      setConfirmedResId(data.reference);
      setReservationDone(true);
      fetchReservations();
    } else {
      alert(data.message || 'Erreur lors de la réservation.');
    }
  };

  const toggleType = (t) => {
    setForm(f => ({
      ...f,
      types: f.types.includes(t) ? (f.types.length > 1 ? f.types.filter(x => x !== t) : f.types) : [...f.types, t],
    }));
  };

  /* ══════════════════════════════════════════
     SIDEBAR
  ══════════════════════════════════════════ */
  const NAV = [
    { section: 'PRINCIPAL', items: [
      { id:'dashboard', label:'Tableau de bord',   Icon: LayoutDashboard },
      { id:'reserve',   label:'Réserver une place', Icon: MapPin },
      { id:'reservations',label:'Mes Réservations', Icon: List  },
      { id:'vehicles',  label:'Mes Véhicules',      Icon: Car   },
    ]},
    { section: 'COMPTE', items: [
      { id:'notifications', label:'Notifications',  Icon: Bell, badge: 3 },
      { id:'profile', label:'Mon Profil', Icon: User },
    ]},
  ];

  const Sidebar = () => (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-logo-p">P</div>
        <div>
          <span className="sb-logo-name">ParLak</span>
          <span className="sb-logo-sub">Stationnement Intelligent</span>
        </div>
      </div>

      {/* User info */}
      <div className="sb-user">
        <div className="sb-avatar">{initials}</div>
        <div>
          <div className="sb-user-name">{firstName} {lastName}</div>
          <div className="sb-user-role">Client</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        {NAV.map(({ section, items }) => (
          <div key={section} className="sb-section">
            <span className="sb-section-title">{section}</span>
            {items.map(({ id, label, Icon, badge }) => (
              <button
                key={id}
                className={`sb-item ${activePage === id ? 'active' : ''}`}
                onClick={() => { setActivePage(id); setSidebarOpen(false); }}
              >
                <Icon size={17}/>
                <span>{label}</span>
                {badge && <span className="sb-badge">{badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <button className="sb-logout" onClick={onLogout}>
        <LogOut size={17}/> Déconnexion
      </button>
    </aside>
  );

  /* ══════════════════════════════════════════
     TOP BAR (mobile + breadcrumb)
  ══════════════════════════════════════════ */
  const pageLabel = { dashboard:'Tableau de bord', reserve:'Réservation', reservations:'Réservations', vehicles:'Mes Véhicules', payment:'Paiement', notifications:'Notifications', profile:'Mon Profil' };

  const TopBar = () => (
    <div className="content-topbar">
      <button className="topbar-burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu size={20}/>
      </button>
      <div className="breadcrumb">
        <span onClick={() => setActivePage('dashboard')} className="bc-home">Accueil</span>
        <span className="bc-sep">›</span>
        <span className="bc-current">{pageLabel[activePage]}</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-notif">
          <Bell size={18}/>
          <span className="notif-dot"/>
        </div>
        <div className="topbar-avatar">{initials}</div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     PAGE: ONBOARDING (nouveau utilisateur)
  ══════════════════════════════════════════ */
  const OnboardingPage = () => {
    const [form, setForm] = useState({ plate:'', make:'', model:'', color:'', type:'Berline' });
    const [err, setErr] = useState('');

    const handleSave = async () => {
      if (!form.plate.trim()) { setErr('L\'immatriculation est obligatoire.'); return; }
      if (!form.make.trim())  { setErr('La marque est obligatoire.'); return; }
      if (!form.model.trim()) { setErr('Le modèle est obligatoire.'); return; }
      const data = await apiFetch('/vehicles', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (data.id) {
        setVehicles([data]);
        setSelectedVehicle(data.id);
      } else {
        setErr(data.message || 'Erreur lors de l\'enregistrement.');
      }
    };

    return (
      <div className="page-body">
        <div className="onboarding-wrap">
          <div className="onboarding-icon"><Car size={52}/></div>
          <h2>Bienvenue, {firstName} ! 👋</h2>
          <p className="onboarding-sub">
            Pour réserver une place de parking, vous devez d'abord enregistrer votre véhicule.
          </p>

          <div className="onboarding-form card">
            <h4>🚗 Mon premier véhicule</h4>

            {err && <div className="onboarding-err"><AlertCircle size={14}/> {err}</div>}

            <div className="form-grid-2" style={{marginTop:'1rem'}}>
              <div className="field-group full">
                <label>Immatriculation <span className="required">*</span></label>
                <input placeholder="Ex : 12345-A-1" value={form.plate}
                  onChange={e => { setForm(f=>({...f, plate:e.target.value})); setErr(''); }}/>
              </div>
              <div className="field-group">
                <label>Marque <span className="required">*</span></label>
                <input placeholder="Ex : Toyota, Dacia…" value={form.make}
                  onChange={e => { setForm(f=>({...f, make:e.target.value})); setErr(''); }}/>
              </div>
              <div className="field-group">
                <label>Modèle <span className="required">*</span></label>
                <input placeholder="Ex : Corolla, Logan…" value={form.model}
                  onChange={e => { setForm(f=>({...f, model:e.target.value})); setErr(''); }}/>
              </div>
              <div className="field-group">
                <label>Couleur</label>
                <input placeholder="Ex : Blanc, Gris…" value={form.color}
                  onChange={e => setForm(f=>({...f, color:e.target.value}))}/>
              </div>
              <div className="field-group">
                <label>Type</label>
                <div className="select-wrap">
                  <select value={form.type} onChange={e => setForm(f=>({...f, type:e.target.value}))}>
                    {['Berline','SUV','Citadine','Utilitaire','Break','Moto'].map(t=><option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={13} className="select-arrow"/>
                </div>
              </div>
            </div>

            <button className="btn-primary onboarding-btn" onClick={handleSave}>
              <Car size={17}/> Enregistrer et commencer à réserver
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════
     PAGE: RÉSERVER UNE PLACE
  ══════════════════════════════════════════ */
  const ReservePage = () => {
    if (reservationDone) return (
      <div className="page-body">
        <div className="confirm-success">
          <div className="success-icon"><CheckCircle size={52}/></div>
          <h2>Réservation confirmée !</h2>
          <p>Votre réservation <strong>{confirmedResId}</strong> a été enregistrée.</p>

          {/* ── QR Code ── */}
          <div className="success-qr-block">
            <p className="qr-label"><QrCode size={14}/> QR Code d'accès au parking</p>
            <div className="success-qr-wrap" ref={qrRef}>
              <QRCodeSVG/>
            </div>
            <p className="qr-hint">Présentez ce code à l'entrée du parking</p>
            <p style={{ fontSize: '0.85rem', color: '#041562', fontWeight: '600', marginTop: '0.5rem', textAlign: 'center' }}>
              💳 Le paiement s'effectue sur place à votre arrivée.
            </p>
            <button className="btn-dl-qr" onClick={handleDownloadQR}><Download size={14}/> Télécharger le QR code</button>
          </div>

          <div className="success-details">
            <div><MapPin size={14}/> {form.city} — {selectedParking?.name}</div>
            <div><Calendar size={14}/> {form.date}</div>
            <div><Clock size={14}/> {form.time} → {exitTime}</div>
            <div><span style={{fontSize:'1rem'}}>🅿️</span> {form.zone} · Place <strong>{selectedSpot?.id}</strong></div>
            <div><Car size={14}/> {vehicles.find(v=>v.id===selectedVehicle)?.plate}</div>
          </div>
          <button className="btn-primary" onClick={() => { setReservationDone(false); setSelectedSpot(null); }}>
            Nouvelle réservation
          </button>
        </div>
      </div>
    );

    return (
      <div className="page-body reserve-layout">

        {/* ── Left panel ── */}
        <div className="reserve-left">

          {/* No vehicle alert */}
          {noVehicleAlert && (
            <div className="alert-banner">
              <AlertCircle size={18}/>
              <span>Vous devez ajouter un véhicule avant de réserver.</span>
              <button onClick={() => { setShowAddVehicle(true); setNoVehicleAlert(false); }}>
                + Ajouter un véhicule
              </button>
            </div>
          )}

          {/* ── Form card ── */}
          <div className="card">

            {/* ── City + Geolocation row ── */}
            <div className="location-row">
              <div className="field-group">
                <label><MapPin size={13}/> Ville / Localisation</label>
                <div className="city-select-wrap">
                  <div className="select-wrap city-select">
                    <select
                      value={form.city}
                      onChange={e => {
                        const city = e.target.value;
                        const firstParking = PARKINGS_BY_CITY[city]?.[0]?.id || '';
                        setForm(f => ({ ...f, city, parkingId: firstParking }));
                      }}
                    >
                      {CITY_LIST.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="select-arrow"/>
                  </div>
                  <button
                    type="button"
                    className={`btn-geolocate ${locating ? 'loading' : ''}`}
                    onClick={handleGeolocate}
                  >
                    <Navigation size={15}/>
                    <span>{locating ? 'Localisation…' : 'Près de moi'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Parking cards picker ── */}
            <div className="parking-picker">
              <div className="parking-picker-label">
                <MapPin size={13}/> Parkings disponibles à <strong>{form.city}</strong>
                <span className="pp-count">{cityParkings.length} parkings trouvés</span>
              </div>
              <div className="parking-cards-list">
                {cityParkings.map(p => (
                  <label
                    key={p.id}
                    className={`parking-pick-card ${form.parkingId === p.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="parking"
                      checked={form.parkingId === p.id}
                      onChange={() => setForm(f => ({ ...f, parkingId: p.id }))}
                    />
                    <div className="ppc-left">
                      <div className="ppc-name">{p.name}</div>
                      <div className="ppc-addr"><MapPin size={11}/> {p.address}</div>
                    </div>
                    <div className="ppc-right">
                      <div className="ppc-dist">📍 {p.dist}</div>
                      <div className={`ppc-avail ${p.free < 10 ? 'low' : ''}`}>
                        {p.free} places libres / {p.total}
                      </div>
                      <div className="ppc-rating">{'★'.repeat(Math.round(p.rating))} {p.rating}</div>
                    </div>
                    {form.parkingId === p.id && <CheckCircle size={16} className="ppc-check"/>}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-grid-4">
              <div className="field-group">
                <label><Calendar size={13}/> Date d'entrée</label>
                <input type="date" value={form.date.split('/').reverse().join('-')}
                  onChange={e => {
                    const d = new Date(e.target.value);
                    setForm(f => ({ ...f, date: d.toLocaleDateString('fr-FR') }));
                  }}
                />
              </div>
              <div className="field-group">
                <label><Clock size={13}/> Heure d'entrée</label>
                <input type="time" value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                />
              </div>
              <div className="field-group">
                <label>Durée</label>
                <div className="select-wrap">
                  <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                    {DURATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={14} className="select-arrow"/>
                </div>
              </div>
              <div className="field-group">
                <label><MapPin size={13}/> Zone</label>
                <div className="select-wrap">
                  <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}>
                    {ZONE_KEYS.map(z => <option key={z}>{z}</option>)}
                  </select>
                  <ChevronDown size={14} className="select-arrow"/>
                </div>
              </div>
            </div>

            {/* Type chips */}
            <div className="type-chips">
              {SPOT_TYPES.map(t => (
                <button
                  key={t.id}
                  className={`type-chip ${form.types.includes(t.id) ? 'active' : ''}`}
                  onClick={() => toggleType(t.id)}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {/* ── Véhicule (obligatoire) ── */}
            <div className="form-vehicle-section">
              <div className="form-vehicle-title">
                <Car size={14}/> Véhicule <span className="required">* obligatoire</span>
              </div>

              {vehicles.length === 0 ? (
                <div className="form-no-vehicle">
                  <AlertCircle size={15}/>
                  <span>Aucun véhicule enregistré. Ajoutez-en un pour continuer.</span>
                  <button onClick={() => setShowAddVehicle(true)}><Plus size={13}/> Ajouter</button>
                </div>
              ) : (
                <div className="form-vehicle-cards">
                  {vehicles.map(v => (
                    <label
                      key={v.id}
                      className={`form-vehicle-card ${selectedVehicle === v.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="fv"
                        checked={selectedVehicle === v.id}
                        onChange={() => setSelectedVehicle(v.id)}
                      />
                      <div className="fv-icon"><Car size={18}/></div>
                      <div className="fv-info">
                        <span className="fv-plate">{v.plate}</span>
                        <span className="fv-meta">{v.make} {v.model} · {v.color} · {v.type}</span>
                      </div>
                      {selectedVehicle === v.id && <CheckCircle size={17} className="fv-check"/>}
                    </label>
                  ))}
                </div>
              )}

              <button className="form-add-vehicle-btn" onClick={() => setShowAddVehicle(true)}>
                <Plus size={14}/> Ajouter un autre véhicule
              </button>
            </div>

            <button className="btn-search" onClick={handleSearch}>
              <Search size={16}/> Rechercher les places disponibles
            </button>
          </div>

          {/* ── Parking grid ── */}
          {gridVisible && (
            <div className="card parking-card">
              <div className="parking-card-header">
                <span>🅿️ Plan du Parking — {form.zone}</span>
                <div className="legend">
                  <span className="leg leg-libre">Libre</span>
                  <span className="leg leg-occupee">Occupée</span>
                  <span className="leg leg-reservee">Réservée</span>
                  <span className="leg leg-vip">VIP</span>
                  {selectedSpot && <span className="leg leg-selected">Sélectionnée</span>}
                </div>
              </div>

              {/* Zone tabs */}
              <div className="zone-tabs">
                {ZONE_KEYS.map(z => (
                  <button
                    key={z}
                    className={`zone-tab ${form.zone === z ? 'active' : ''}`}
                    onClick={() => { setForm(f => ({ ...f, zone: z })); setSelectedSpot(null); }}
                  >
                    {z.split('–')[0].trim()}
                  </button>
                ))}
              </div>

              {/* Spot grid */}
              <div className="spot-grid">
                {zoneSpots.map((row, ri) => (
                  <div key={ri} className="spot-row">
                    <span className="row-label">{ROW_LABELS[ri]}</span>
                    {row.map(spot => (
                      <SpotCard
                        key={spot.id}
                        spot={spot}
                        active={true}
                        selected={selectedSpot?.id === spot.id}
                        onClick={setSelectedSpot}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Availability bar */}
              <div className="avail-bar-wrap">
                <div className="avail-bar-label">Disponibilité {form.zone.split('–')[0].trim()}</div>
                <div className="avail-bar">
                  <div className="avail-fill" style={{ width: `${(libreCount / totalCount) * 100}%` }}/>
                </div>
                <span className="avail-count">{libreCount} places libres sur {totalCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Right recap panel ── */}
        <div className="recap-panel">
          <div className="recap-header">
            <span>📋 Récapitulatif</span>
            <small>Vérifiez les détails avant de confirmer</small>
          </div>

          {/* Selected spot visual */}
          <div className={`recap-spot-preview ${selectedSpot ? 'has-spot' : ''}`}>
            {selectedSpot ? (
              <>
                <div className="preview-spot-icon">P</div>
                <div className="preview-spot-id">Place {selectedSpot.id}</div>
                <div className="preview-spot-type">{selectedSpot.type.charAt(0).toUpperCase()+selectedSpot.type.slice(1)}</div>
              </>
            ) : (
              <span className="preview-placeholder">─────</span>
            )}
          </div>

          {/* Details */}
          <div className="recap-details">
            <div className="recap-row"><MapPin size={13}/><span>Ville</span><strong>{form.city}</strong></div>
            <div className="recap-row"><span className="recap-icon">🅿️</span><span>Parking</span><strong>{selectedParking?.name || '—'}</strong></div>
            <div className="recap-row"><Calendar size={13}/><span>Date</span><strong>{form.date}</strong></div>
            <div className="recap-row"><Clock size={13}/><span>Entrée</span><strong>{form.time}</strong></div>
            <div className="recap-row"><Clock size={13}/><span>Sortie prévue</span><strong className="text-blue">{exitTime}</strong></div>
            <div className="recap-row"><span className="recap-icon">⏱</span><span>Durée</span><strong>{form.duration}</strong></div>
            <div className="recap-row"><MapPin size={13}/><span>Zone</span><strong>{form.zone}</strong></div>
          </div>

          {/* Vehicle — affichage lecture seule (sélection dans le formulaire) */}
          <div className="recap-section-title">VÉHICULE</div>
          <div className="recap-vehicle-display">
            {(() => {
              const v = vehicles.find(v => v.id === selectedVehicle);
              return v ? (
                <div className="recap-vehicle-item">
                  <Car size={14}/>
                  <div>
                    <strong>{v.plate}</strong>
                    <span>{v.make} {v.model} · {v.color}</span>
                  </div>
                </div>
              ) : (
                <span className="recap-no-vehicle">⚠ Sélectionnez un véhicule dans le formulaire</span>
              );
            })()}
          </div>

          {/* Pricing */}
          <div className="recap-pricing">
            <div className="price-row"><span>Tarif horaire</span><span>{spotPrice} MAD/h</span></div>
            <div className="price-row"><span>Durée</span><span>{hours}h</span></div>
            <div className="price-row"><span>Sous-total</span><span>{subtotal} MAD</span></div>
            <div className="price-row"><span>TVA (10%)</span><span>{tva} MAD</span></div>
            <div className="price-row total-row"><span>Total</span><strong className="text-blue">{total} MAD</strong></div>
          </div>

          <div className="recap-section-title" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>PAIEMENT</div>
          <div style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#eff6ff', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <QrCode size={18} color="#041562" />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>Paiement sur place</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Réglez votre stationnement à l'arrivée</span>
              </div>
            </div>
          </div>

          {/* Confirm button */}
          <button
            className={`btn-confirm ${!selectedSpot || !selectedVehicle ? 'disabled' : ''}`}
            onClick={handleConfirm}
            disabled={!selectedSpot || !selectedVehicle}
          >
            Confirmer la Réservation
          </button>

          {!selectedSpot && <p className="recap-hint">Sélectionnez une place sur le plan</p>}

          {/* Policy */}
          <div className="cancel-policy">
            <AlertCircle size={12}/>
            Annulation gratuite jusqu'à <strong>30 minutes</strong> avant l'heure d'entrée.
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════
     PAGE: TABLEAU DE BORD
  ══════════════════════════════════════════ */
  const DashboardPage = () => {
    const completed = reservations.filter(r => r.status === 'completed');
    const upcoming  = reservations.filter(r => r.status === 'upcoming');
    const spent     = reservations.filter(r => r.status !== 'cancelled').reduce((s,r) => s + (r.total_price || 0), 0);
    return (
      <div className="page-body">
        <div className="welcome-banner">
          <div>
            <h2>Bonjour, {firstName} 👋</h2>
            <p>Bienvenue sur votre espace de stationnement ParLak.</p>
          </div>
          <button className="btn-primary" onClick={() => setActivePage('reserve')}>
            <Search size={16}/> Réserver une place
          </button>
        </div>
        <div className="stats-grid">
          {[
            { label:'Réservations à venir', value: upcoming.length,  Icon: AlertCircle, color:'#3b82f6' },
            { label:'Trajets complétés',    value: completed.length, Icon: CheckCircle, color:'#10b981' },
            { label:'Estimation totale (MAD)',  value: `${spent} MAD`,   Icon: Wallet,      color:'#8b5cf6' },
            { label:'Points fidélité',      value:'1 250',           Icon: Gift,        color:'#f59e0b' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="stat-card">
              <div className="stat-ico" style={{ background:`${color}18`, color }}><Icon size={22}/></div>
              <div><div className="stat-val">{value}</div><div className="stat-lbl">{label}</div></div>
            </div>
          ))}
        </div>
        {upcoming[0] && (
          <div className="card">
            <div className="card-title-row"><Calendar size={16}/> Prochaine réservation</div>
            <div className="res-preview">
              <div><strong>{upcoming[0].parking}</strong><br/><small>{upcoming[0].city}</small></div>
              <div><Clock size={13}/> {upcoming[0].entry_time} → {upcoming[0].exit_time}</div>
              <div>Place <strong>{upcoming[0].spot_code}</strong></div>
              <div><strong>{upcoming[0].total_price} MAD</strong></div>
              <StatusBadge status={upcoming[0].status}/>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ══════════════════════════════════════════
     PAGE: MES RÉSERVATIONS
  ══════════════════════════════════════════ */
  const handleCancelReservation = async (id) => {
    if (!confirm('Annuler cette réservation ?')) return;
    const data = await apiFetch(`/reservations/${id}/cancel`, { method: 'PATCH' });
    if (data.message) fetchReservations();
  };

  const ReservationsPage = () => (
    <div className="page-body">
      <div className="page-title-row">
        <div><h2>Mes Réservations</h2><p>{reservations.length} réservation{reservations.length !== 1 ? 's' : ''} au total</p></div>
        <button className="btn-primary small" onClick={() => setActivePage('reserve')}>
          <Plus size={14}/> Nouvelle réservation
        </button>
      </div>
      <div className="card table-card">
        <div className="table-wrap">
          {resLoading ? (
            <p style={{ padding:'1rem', textAlign:'center', color:'#64748b' }}>Chargement...</p>
          ) : (
          <table className="res-table">
            <thead><tr>
              <th>Référence</th><th>Parking</th><th>Date</th><th>Horaire</th>
              <th>Place</th><th>Durée</th><th>Prix</th><th>Statut</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id}>
                  <td><code>{r.reference}</code></td>
                  <td><div className="tbl-parking">{r.parking}<small>{r.city}</small></div></td>
                  <td>{r.entry_date}</td>
                  <td>{r.entry_time} → {r.exit_time}</td>
                  <td><strong>{r.spot_code}</strong></td>
                  <td>{r.duration_hours}h</td>
                  <td><strong>{r.total_price} MAD</strong></td>
                  <td><StatusBadge status={r.status}/></td>
                  <td>
                    <div className="tbl-actions">
                      {r.status === 'upcoming' && (
                        <button className="icon-btn qr-btn" title="Voir QR code"
                          onClick={() => setQrModal(r)}>
                          <QrCode size={14}/>
                        </button>
                      )}
                      <button className="icon-btn" title="Détails"
                        onClick={() => setQrModal(r)}>
                        <Eye size={14}/>
                      </button>
                      <button className="icon-btn" title="Télécharger QR"
                        onClick={() => { setQrModal(r); setAutoDownload(true); }}>
                        <Download size={14}/>
                      </button>
                      {r.status === 'upcoming' && (
                        <button className="icon-btn red" title="Annuler"
                          onClick={() => handleCancelReservation(r.id)}>
                          <XCircle size={14}/>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign:'center', color:'#94a3b8', padding:'2rem' }}>Aucune réservation pour l'instant.</td></tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     PAGE: MES VÉHICULES
  ══════════════════════════════════════════ */
  const VehiclesPage = () => (
    <div className="page-body">
      <div className="page-title-row">
        <div><h2>Mes Véhicules</h2><p>{vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''} enregistré{vehicles.length > 1 ? 's' : ''}</p></div>
        <button className="btn-primary small" onClick={() => setShowAddVehicle(true)}>
          <Plus size={14}/> Ajouter un véhicule
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="card empty-state">
          <Car size={48} opacity={.25}/>
          <p>Aucun véhicule enregistré</p>
          <p className="text-muted">Ajoutez un véhicule pour pouvoir réserver une place de parking.</p>
          <button className="btn-primary" onClick={() => setShowAddVehicle(true)}>
            <Plus size={15}/> Ajouter mon premier véhicule
          </button>
        </div>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map(v => (
            <div key={v.id} className="vehicle-card">
              <div className="vehicle-card-top">
                <div className="vehicle-icon"><Car size={28}/></div>
                <div className="vehicle-plate">{v.plate}</div>
              </div>
              <div className="vehicle-info">
                <div className="vehicle-make">{v.make} {v.model}</div>
                <div className="vehicle-meta">
                  <span className="vchip">{v.color}</span>
                  <span className="vchip">{v.type}</span>
                </div>
              </div>
              <div className="vehicle-actions">
                <button className="icon-btn"><Edit size={14}/></button>
                <button className="icon-btn red" onClick={() => handleDeleteVehicle(v.id)}><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ══════════════════════════════════════════
     PAGE: PROFIL
  ══════════════════════════════════════════ */
  const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      firstName: firstName,
      lastName: lastName,
      email: user?.email || 'client@parlak.ma',
      phone: '+212 6XX XXX XXX',
      city: 'Casablanca'
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = () => {
      setIsEditing(false);
      // Optional: Simulate API update here if needed
    };

    const displayFirst = formData.firstName || 'Utilisateur';
    const displayLast = formData.lastName || '';
    const displayInitials = (displayFirst[0] || 'U').toUpperCase() + (displayLast[0] || '').toUpperCase();

    return (
      <div className="page-body">
        <h2>Mon Profil</h2>
        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-avatar">{displayInitials}</div>
            <h3>{displayFirst} {displayLast}</h3>
            <p className="text-muted">{formData.email}</p>
            <span className="role-badge">Client ParLak</span>
          </div>
          <div className="profile-form card">
            <h4>Informations personnelles</h4>
            <div className="form-grid-2">
              <div className="field-group">
                <label>Prénom</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} readOnly={!isEditing} />
              </div>
              <div className="field-group">
                <label>Nom</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} readOnly={!isEditing} />
              </div>
              <div className="field-group full">
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} readOnly={!isEditing} />
              </div>
              <div className="field-group">
                <label>Téléphone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} readOnly={!isEditing} />
              </div>
              <div className="field-group">
                <label>Ville</label>
                <input name="city" value={formData.city} onChange={handleChange} readOnly={!isEditing} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              {!isEditing ? (
                <button className="btn-primary small" onClick={() => setIsEditing(true)}>
                  <Edit size={14} /> Modifier
                </button>
              ) : (
                <>
                  <button className="btn-primary small" onClick={handleSave} style={{ background: '#10b981' }}>
                    <Check size={14} /> Sauvegarder
                  </button>
                  <button className="btn-ghost small" onClick={() => {
                    setIsEditing(false);
                    // Reset fields if canceled (optional to be rigorous, but straightforward to reset them)
                    setFormData({
                      firstName: firstName,
                      lastName: lastName,
                      email: user?.email || 'client@parlak.ma',
                      phone: '+212 6XX XXX XXX',
                      city: 'Casablanca'
                    });
                  }}>
                    <X size={14} /> Annuler
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════
     MODAL: AJOUTER UN VÉHICULE
  ══════════════════════════════════════════ */
  const AddVehicleModal = () => (
    <div className="modal-overlay" onClick={() => setShowAddVehicle(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><Car size={18}/> Ajouter un véhicule</h3>
          <button className="modal-close" onClick={() => setShowAddVehicle(false)}><X size={18}/></button>
        </div>
        <div className="modal-body">
          <p className="modal-sub">Ces informations sont requises pour toute réservation de parking.</p>
          <div className="form-grid-2">
            <div className="field-group full">
              <label>Immatriculation <span className="required">*</span></label>
              <input placeholder="Ex: 12345-A-1" value={newVehicle.plate}
                onChange={e => setNewVehicle(v => ({ ...v, plate: e.target.value }))}/>
            </div>
            <div className="field-group">
              <label>Marque <span className="required">*</span></label>
              <input placeholder="Ex: Toyota, Dacia…" value={newVehicle.make}
                onChange={e => setNewVehicle(v => ({ ...v, make: e.target.value }))}/>
            </div>
            <div className="field-group">
              <label>Modèle <span className="required">*</span></label>
              <input placeholder="Ex: Corolla, Logan…" value={newVehicle.model}
                onChange={e => setNewVehicle(v => ({ ...v, model: e.target.value }))}/>
            </div>
            <div className="field-group">
              <label>Couleur</label>
              <input placeholder="Ex: Blanc, Gris…" value={newVehicle.color}
                onChange={e => setNewVehicle(v => ({ ...v, color: e.target.value }))}/>
            </div>
            <div className="field-group">
              <label>Type</label>
              <div className="select-wrap">
                <select value={newVehicle.type} onChange={e => setNewVehicle(v => ({ ...v, type: e.target.value }))}>
                  {['Berline','SUV','Citadine','Utilitaire','Break','Moto'].map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} className="select-arrow"/>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={() => setShowAddVehicle(false)}>Annuler</button>
          <button className="btn-primary"
            onClick={handleAddVehicle}
            disabled={!newVehicle.plate || !newVehicle.make || !newVehicle.model}
          >
            <Check size={15}/> Enregistrer le véhicule
          </button>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     PAGE: NOTIFICATIONS
  ══════════════════════════════════════════ */
  const NotificationsPage = () => {
    const [notifs, setNotifs] = useState([
      { id: 1, type: 'reminder', title: 'Rappel de réservation', desc: 'Votre réservation au Parking Anfa Place commence dans 30 minutes. Pensez à préparer votre QR code.', time: 'Il y a 10 min', read: false },
      { id: 2, type: 'success', title: 'Paiement confirmé', desc: 'Votre reçu pour la réservation REF-89A2 a été généré avec succès.', time: 'Il y a 2 heures', read: false },
      { id: 3, type: 'promo', title: 'Nouveau code promo !', desc: 'Profitez de -15% sur toutes vos réservations ce week-end avec le code WEEKEND15.', time: 'Hier', read: false },
      { id: 4, type: 'alert', title: 'Forte affluence', desc: 'Le parking Gare Casa-Voyageurs est presque complet. Nous vous conseillons de réserver à l\'avance.', time: 'Hier', read: true },
      { id: 5, type: 'success', title: 'Bienvenue sur ParLak', desc: 'Votre compte a été créé avec succès. Ajoutez votre premier véhicule pour commencer.', time: 'Il y a 3 jours', read: true },
    ]);

    const markAllRead = () => {
      setNotifs(notifs.map(n => ({ ...n, read: true })));
    };

    const getIconInfo = (type) => {
      switch(type) {
        case 'reminder': return { Icon: Clock, color: '#3b82f6', bg: '#eff6ff' };
        case 'success': return { Icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' };
        case 'promo': return { Icon: Gift, color: '#f59e0b', bg: '#fffbeb' };
        case 'alert': return { Icon: AlertCircle, color: '#ef4444', bg: '#fef2f2' };
        default: return { Icon: Bell, color: '#64748b', bg: '#f8fafc' };
      }
    };

    const unreadCount = notifs.filter(n => !n.read).length;

    return (
      <div className="page-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>Notifications</h2>
            <p className="text-muted">Vous avez {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}</p>
          </div>
          {unreadCount > 0 && (
            <button className="btn-ghost small" onClick={markAllRead}>
              <Check size={14} /> Tout marquer comme lu
            </button>
          )}
        </div>

        <div className="notif-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifs.map(n => {
            const { Icon, color, bg } = getIconInfo(n.type);
            return (
              <div key={n.id} className="card" style={{ display: 'flex', gap: '1rem', padding: '1.25rem', position: 'relative', borderLeft: !n.read ? '4px solid #041562' : '4px solid transparent', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => {
                if (!n.read) setNotifs(notifs.map(x => x.id === n.id ? { ...x, read: true } : x));
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: !n.read ? '#0f172a' : '#475569', fontWeight: !n.read ? '600' : '500' }}>{n.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{n.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: !n.read ? '#475569' : '#64748b', lineHeight: '1.4' }}>{n.desc}</p>
                </div>
                {!n.read && (
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.25rem', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#041562' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════
     PAGE: PAIEMENT
  ══════════════════════════════════════════ */
  const PaymentPage = () => {
    const [balance, setBalance] = useState(120.00);
    const [showRecharge, setShowRecharge] = useState(false);
    const [rechargeAmt, setRechargeAmt] = useState(100);
    const [isRecharging, setIsRecharging] = useState(false);
    const [history, setHistory] = useState([
      { id: 1, date: '12 Mai 2026', desc: 'Paiement Réservation (Gare Casa-Voyageurs)', method: 'Solde ParLak', amount: -32.00, status: 'completed' },
      { id: 2, date: '05 Mai 2026', desc: 'Recharge Solde', method: 'Visa **4242', amount: 100.00, status: 'completed' },
      { id: 3, date: '28 Avr 2026', desc: 'Paiement Réservation (Twin Center)', method: 'Visa **4242', amount: -45.00, status: 'completed' }
    ]);

    const handleRecharge = () => {
      setIsRecharging(true);
      setTimeout(() => {
        setBalance(prev => prev + Number(rechargeAmt));
        setHistory(prev => [
          {
            id: Date.now(),
            date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            desc: 'Recharge Solde',
            method: 'Visa **4242',
            amount: Number(rechargeAmt),
            status: 'completed'
          },
          ...prev
        ]);
        setIsRecharging(false);
        setShowRecharge(false);
        setRechargeAmt(100);
      }, 1000);
    };

    return (
      <div className="page-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>Paiement & Solde</h2>
            <p className="text-muted">Gérez vos méthodes de paiement et consultez vos transactions</p>
          </div>
        </div>

        <div className="form-grid-2">
          {/* Solde actuel */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #041562, #1e3a8a)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', minHeight: '160px' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Solde ParLak</p>
              <h2 style={{ margin: '0.5rem 0', fontSize: '2.5rem', fontWeight: 700 }}>{balance.toFixed(2)} <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>MAD</span></h2>
            </div>
            <button className="btn-primary" onClick={() => setShowRecharge(true)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '8px' }}>
              <Plus size={16} /> Recharger mon solde
            </button>
          </div>

          {/* Méthodes de paiement */}
          <div className="card">
            <h4 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem' }}>
              Moyens de paiement
              <button className="btn-ghost small"><Plus size={14} /> Ajouter</button>
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '26px', background: '#1e293b', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: 4, bottom: 2, color: 'white', fontSize: '9px', fontWeight: 'bold', fontStyle: 'italic' }}>VISA</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>Visa terminant par 4242</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Expire le 12/28</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.7srem', background: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontWeight: 600 }}>Défaut</span>
                  <button className="icon-btn red"><Trash2 size={14} /></button>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '26px', background: '#ef4444', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: 4, bottom: 4, display: 'flex', gap: '2px' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'white', opacity: 0.8 }}></div>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'white', opacity: 0.8, marginLeft: '-4px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>Mastercard terminant par 8810</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Expire le 09/27</div>
                  </div>
                </div>
                <button className="icon-btn red"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Historique des transactions */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h4>Historique des transactions récentes</h4>
          <table className="res-table" style={{ marginTop: '1rem', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Moyen de paiement</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Montant</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {history.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 0.75rem', fontSize: '0.9rem' }}>{tx.date}</td>
                  <td style={{ padding: '1rem 0.75rem', fontSize: '0.9rem' }}>{tx.desc}</td>
                  <td style={{ padding: '1rem 0.75rem', fontSize: '0.9rem', color: '#64748b' }}>{tx.method}</td>
                  <td style={{ padding: '1rem 0.75rem', fontSize: '0.9rem', fontWeight: 'bold', color: tx.amount > 0 ? '#10b981' : '#0f172a', textAlign: 'right' }}>
                    {tx.amount > 0 ? '+ ' : '- '}{Math.abs(tx.amount).toFixed(2)} MAD
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}><span className="sb badge-completed"><CheckCircle size={11}/> Terminé</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recharge Modal */}
        {showRecharge && (
          <div className="modal-overlay" onClick={() => !isRecharging && setShowRecharge(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <div className="modal-header">
                <h3><CreditCard size={18}/> Recharger Mon Solde</h3>
                {!isRecharging && <button className="modal-close" onClick={() => setShowRecharge(false)}><X size={18}/></button>}
              </div>
              <div className="modal-body">
                <p className="modal-sub">Sélectionnez ou saisissez le montant que vous souhaitez ajouter à votre portefeuille ParLak.</p>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {[50, 100, 200, 500].map(amt => (
                    <button 
                      key={amt} 
                      onClick={() => setRechargeAmt(amt)}
                      style={{ 
                        flex: 1, padding: '0.5rem', borderRadius: '8px', 
                        border: rechargeAmt === amt ? '2px solid #041562' : '1px solid #cbd5e1', 
                        background: rechargeAmt === amt ? '#eff6ff' : 'white',
                        fontWeight: 'bold', color: '#041562', cursor: 'pointer'
                      }}
                    >
                      {amt} MAD
                    </button>
                  ))}
                </div>

                <div className="field-group full">
                  <label>Montant personnalisé (MAD)</label>
                  <input type="number" min="10" placeholder="Ex: 150" value={rechargeAmt} onChange={e => setRechargeAmt(e.target.value)} />
                </div>

                <div className="field-group full" style={{ marginTop: '1rem' }}>
                  <label>Moyen de paiement</label>
                  <div className="select-wrap">
                    <select>
                      <option>Visa terminant par 4242</option>
                      <option>Mastercard terminant par 8810</option>
                      <option>Nouvelle carte...</option>
                    </select>
                    <ChevronDown size={13} className="select-arrow" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setShowRecharge(false)} disabled={isRecharging}>Annuler</button>
                <button className="btn-primary" onClick={handleRecharge} disabled={!rechargeAmt || isRecharging}>
                  {isRecharging ? 'Traitement...' : `Payer ${rechargeAmt} MAD`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ══════════════════════════════════════════
     PAGE TITLE
  ══════════════════════════════════════════ */
  const pageTitles = {
    dashboard:    { title:'Tableau de bord',   sub:'Vue d\'ensemble de votre activité' },
    reserve:      { title:'Réserver une Place',sub:'Choisissez votre créneau et sélectionnez une place disponible' },
    reservations: { title:'Mes Réservations',  sub:'Historique de vos réservations de parking' },
    vehicles:     { title:'Mes Véhicules',     sub:'Gérez vos véhicules enregistrés' },
    payment:      { title:'Paiement',          sub:'Gérez vos moyens de paiement' },
    notifications:{ title:'Notifications',     sub:'Vos alertes et messages' },
    profile:      { title:'Mon Profil',        sub:'Gérez vos informations personnelles' },
  };
  const { title, sub } = pageTitles[activePage] || pageTitles.dashboard;

  /* ══════════════════════════════════════════
     RENDER STEPS INDICATOR (reserve only)
  ══════════════════════════════════════════ */
  const step = selectedSpot ? 2 : 1;

  /* ══════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="dash-layout">
      <Sidebar/>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}/>}

      <div className="dash-content">
        <TopBar/>

        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-sub">{sub}</p>
          </div>
          {activePage === 'reserve' && (
            <div className="steps-indicator">
              {[
                { n:1, label:'Choisir un créneau'    },
                { n:2, label:'Sélectionner la place' },
                { n:3, label:'Confirmer'              },
              ].map(({ n, label }, i) => (
                <React.Fragment key={n}>
                  {i > 0 && <div className={`step-line ${step >= n ? 'done' : ''}`}/>}
                  <div className={`step ${step >= n ? 'active' : ''} ${step > n ? 'done' : ''}`}>
                    <div className="step-num">{step > n ? <Check size={12}/> : n}</div>
                    <span className="step-label">{label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Page content */}
        {activePage === 'dashboard'     && <DashboardPage/>}
        {activePage === 'reserve' && vehiclesLoading && (
          <div className="page-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#64748b' }}>
            Chargement...
          </div>
        )}
        {activePage === 'reserve' && !vehiclesLoading && vehicles.length === 0 && <OnboardingPage/>}
        {activePage === 'reserve' && !vehiclesLoading && vehicles.length > 0  && <ReservePage/>}
        {activePage === 'reservations'  && <ReservationsPage/>}
        {activePage === 'vehicles'      && <VehiclesPage/>}
        {activePage === 'profile'       && <ProfilePage/>}
        {activePage === 'notifications' && <NotificationsPage/>}
      </div>

      {showAddVehicle && <AddVehicleModal/>}

      {/* ── Modal QR Code ── */}
      {qrModal && (
        <div className="modal-overlay" onClick={() => setQrModal(null)}>
          <div className="modal qr-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><QrCode size={17}/> QR Code d'accès</h3>
              <button className="modal-close" onClick={() => setQrModal(null)}><X size={18}/></button>
            </div>
            <div className="qr-modal-body">
              <code className="qr-res-id">{qrModal.reference}</code>
              <div className="qr-code-big" ref={qrRef}><QRCodeSVG/></div>
              <p className="qr-modal-hint">Présentez ce QR code à l'entrée du parking</p>
              <div className="qr-info-grid">
                <div><Calendar size={13}/> {qrModal.entry_date}</div>
                <div><Clock size={13}/> {qrModal.entry_time} → {qrModal.exit_time}</div>
                <div><MapPin size={13}/> {qrModal.parking}</div>
                <div><Car size={13}/> Place <strong>{qrModal.spot_code}</strong></div>
              </div>
              <button className="btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={handleDownloadQR}>
                <Download size={15}/> Télécharger le QR code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Carte ── */}
      {mapOpen && (
        <NearbyMap
          userPos={userPos}
          parkings={nearbyParkings}
          onSelect={handleSelectParkingFromMap}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
