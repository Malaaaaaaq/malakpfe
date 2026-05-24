import React, { useState, useEffect } from 'react';
import { 
  LogOut, LayoutDashboard, Car, Calendar, 
  Settings, Bell, Search, Filter, CheckCircle, 
  XCircle, Clock, MapPin, Plus, UserCircle
} from 'lucide-react';
import './AgentPage.css';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('parlak_token');
  const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${endpoint}`, { ...options, headers });
  if (res.status === 401) window.location.reload();
  return res.json();
};

const AgentPage = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({
    total_spots: 0, free_spots: 0, today_count: 0, upcoming_count: 0
  });
  const [zones, setZones] = useState([]);
  const [spotsLoading, setSpotsLoading] = useState(false);
  const [spotSearch, setSpotSearch] = useState('');
  const [filterZone, setFilterZone] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Nouveau système de suivi activé', time: 'Aujourd\'hui', unread: true },
  ]);
  const [parkingSettings, setParkingSettings] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    is_active: true
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState(null);

  useEffect(() => {
    fetchAgentData();
    fetchSpots();
    fetchParkingSettings();
  }, []);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/agent/reservations');
      if (data.reservations) setReservations(data.reservations);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error('Erreur fetch agent data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpots = async () => {
    setSpotsLoading(true);
    try {
      const data = await apiFetch('/agent/spots');
      if (data.zones) setZones(data.zones);
    } catch (err) {
      console.error('Erreur fetch spots:', err);
    } finally {
      setSpotsLoading(false);
    }
  };

  const toggleSpotStatus = async (spot) => {
    const next = spot.status === 'libre' ? 'occupee' : 'libre';
    await apiFetch(`/agent/spots/${spot.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: next }),
    });
    fetchSpots();
  };

  const fetchParkingSettings = async () => {
    setSettingsLoading(true);
    try {
      const data = await apiFetch('/agent/parking');
      if (data) {
        setParkingSettings({
          name: data.name || '',
          address: data.address || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          is_active: !!data.is_active
        });
      }
    } catch (err) {
      console.error('Erreur fetch settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const saveParkingSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMessage(null);
    try {
      const res = await apiFetch('/agent/parking', {
        method: 'PUT',
        body: JSON.stringify(parkingSettings)
      });
      if (res.message) {
        setSettingsMessage({ type: 'success', text: res.message });
        // Reload agent data to refresh name in topbar
        fetchAgentData();
      } else {
        setSettingsMessage({ type: 'error', text: 'Une erreur est survenue.' });
      }
    } catch (err) {
      setSettingsMessage({ type: 'error', text: 'Impossible de mettre à jour le parking.' });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleConfirmReservation = async (reservationId) => {
    try {
      const res = await apiFetch(`/agent/reservations/${reservationId}/confirm`, {
        method: 'POST'
      });
      if (res.message) {
        fetchAgentData();
        fetchSpots();
      }
    } catch (err) {
      console.error('Erreur confirmation reservation:', err);
    }
  };

  const handleRefuseReservation = async (reservationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir refuser cette réservation ? La place sera libérée.")) {
      try {
        const res = await apiFetch(`/agent/reservations/${reservationId}/refuse`, {
          method: 'POST'
        });
        if (res.message) {
          fetchAgentData();
          fetchSpots();
        }
      } catch (err) {
        console.error('Erreur refus reservation:', err);
      }
    }
  };

  const name = user?.firstname || 'Agent';
  const parkingName = user?.parking_name || 'Mon Parking';

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'spots', label: 'Gestion des places', icon: Car },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  /* ══════════════════════════════════════════
     COMPONENTS: SUB-PAGES
  ══════════════════════════════════════════ */

  const DashboardOverview = () => (
    <div className="agent-content-area">
      <div className="welcome-section">
        <h2>Bonjour, {name} 👋</h2>
        <p>Voici l'état actuel de <strong>{parkingName}</strong></p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Car size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">Places Totales</span>
            <span className="stat-value">{stats.total_spots}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">Places Libres</span>
            <span className="stat-value">{stats.free_spots}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Calendar size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">Réservations Aujourd'hui</span>
            <span className="stat-value">{stats.today_count}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Clock size={24}/></div>
          <div className="stat-info">
            <span className="stat-label">Arrivées Prévues</span>
            <span className="stat-value">{stats.upcoming_count}</span>
          </div>
        </div>
      </div>

      <div className="agent-grid-two-cols">
        <div className="agent-card">
          <div className="card-header">
            <h3>Réservations Récentes</h3>
            <button className="btn-text">Voir tout</button>
          </div>
          <div className="simple-table">
            <div className="table-row header">
              <span>Client</span>
              <span>Véhicule</span>
              <span>Place</span>
              <span>Statut</span>
            </div>
            {loading ? (
              <p style={{ padding: '1rem', color: '#64748b' }}>Chargement...</p>
            ) : reservations.length === 0 ? (
              <p style={{ padding: '1rem', color: '#64748b' }}>Aucune réservation trouvée.</p>
            ) : (
              reservations.slice(0, 5).map(res => (
                <div key={res.id} className="table-row">
                  <div className="client-cell">
                    <div className="avatar">{(res.user?.firstname?.[0] || 'U')+(res.user?.lastname?.[0] || '')}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{res.user?.firstname} {res.user?.lastname}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>📍 {res.spot?.zone?.parking?.name}</div>
                    </div>
                  </div>
                  <span>{res.vehicle?.plate || '—'}</span>
                  <span className="spot-tag">{res.spot_code}</span>
                  <span className={`status-badge ${res.status}`}>
                    {res.status === 'upcoming' ? 'En attente' : res.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="agent-card">
          <div className="card-header">
            <h3>Dernières Activités</h3>
          </div>
          <div className="activity-list">
            {notifications.map(n => (
              <div key={n.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p>{n.text}</p>
                  <span>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const allSpots = zones.flatMap(z => (z.spots || []).map(s => ({ ...s, zoneName: z.name, parkingName: z.parking?.name })));
  const filteredSpots = allSpots.filter(s => {
    const matchSearch = s.code?.toLowerCase().includes(spotSearch.toLowerCase());
    const matchZone   = filterZone === 'all' || s.zoneName === filterZone;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchZone && matchStatus;
  });

  const SpotsManagement = () => (
    <div className="agent-content-area">
      <div className="page-header">
        <h2>Gestion des Places</h2>
        <button className="btn-primary" onClick={fetchSpots}>
          <Clock size={16}/> Rafraîchir
        </button>
      </div>

      {/* Stat mini bar */}
      <div className="spots-stat-bar" style={{ display:'flex', gap:'1rem', marginBottom:'1.2rem', flexWrap:'wrap' }}>
        {[{label:'Total', val: allSpots.length, color:'#2563eb'},
          {label:'Libres', val: allSpots.filter(s=>s.status==='libre').length, color:'#10b981'},
          {label:'Occupées', val: allSpots.filter(s=>s.status==='occupee').length, color:'#ef4444'},
          {label:'Réservée', val: allSpots.filter(s=>s.status==='reservee').length, color:'#8b5cf6'},
        ].map(({label, val, color}) => (
          <div key={label} style={{ background:'white', borderRadius:'10px', padding:'0.6rem 1.2rem',
            boxShadow:'0 1px 4px rgba(0,0,0,.08)', borderLeft:`3px solid ${color}` }}>
            <div style={{ fontSize:'1.4rem', fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:'0.75rem', color:'#64748b' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="spots-filters">
        <div className="search-box">
          <Search size={16}/>
          <input
            type="text"
            placeholder="Rechercher une place (ex: A-05)..."
            value={spotSearch}
            onChange={e => setSpotSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={filterZone} onChange={e => setFilterZone(e.target.value)}>
            <option value="all">Toutes les zones</option>
            {zones.map(z => <option key={z.id} value={z.name}>{z.name} — {z.parking?.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="libre">Libre</option>
            <option value="occupee">Occupée</option>
            <option value="reservee">Réservée</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {spotsLoading ? (
        <p style={{ textAlign:'center', padding:'2rem', color:'#64748b' }}>Chargement des places...</p>
      ) : filteredSpots.length === 0 ? (
        <p style={{ textAlign:'center', padding:'2rem', color:'#94a3b8' }}>Aucune place trouvée.</p>
      ) : (
        <div className="spots-grid-display">
          {filteredSpots.map(spot => (
            <div
              key={spot.id}
              className={`spot-item-card ${
                spot.status === 'libre' ? 'free'
                : spot.status === 'reservee' ? 'reservee'
                : 'occupied'
              }`}
            >
              <div className="spot-id">{spot.code}</div>
              <div className="spot-zone" style={{ fontSize:'0.7rem', color:'#94a3b8', marginBottom:'2px' }}>{spot.zoneName}</div>
              <div className="spot-status">
                {spot.status === 'libre' ? 'Libre' : spot.status === 'reservee' ? 'Réservée' : 'Occupée'}
              </div>
              <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginBottom:'0.4rem' }}>{spot.type} · {spot.price_per_hour} MAD/h</div>
              <div className="spot-actions">
                <button title="Changer statut" onClick={() => toggleSpotStatus(spot)}>
                  <Settings size={14}/>
                </button>
                <button title="Bloquer/Libérer" onClick={() => toggleSpotStatus(spot)}>
                  {spot.status === 'libre' ? <XCircle size={14}/> : <CheckCircle size={14}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const SettingsPanel = () => {
    return (
      <div className="agent-content-area">
        <div className="page-header">
          <h2>Paramètres du Parking</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            Configurez et mettez à jour les informations visibles par vos clients.
          </p>
        </div>

        {settingsLoading ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Chargement des paramètres...</p>
        ) : (
          <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
            {/* Form Card */}
            <div className="agent-card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#1e293b' }}>Informations Générales</h3>
              
              {settingsMessage && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: settingsMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
                  color: settingsMessage.type === 'success' ? '#065f46' : '#991b1b',
                  border: `1px solid ${settingsMessage.type === 'success' ? '#a7f3d0' : '#fca5a5'}`
                }}>
                  {settingsMessage.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span>{settingsMessage.text}</span>
                </div>
              )}

              <form onSubmit={saveParkingSettings}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#475569' }}>
                    Nom de l'établissement
                  </label>
                  <input
                    type="text"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    value={parkingSettings.name}
                    onChange={e => setParkingSettings({ ...parkingSettings, name: e.target.value })}
                    placeholder="Ex: Parking Agdal Premium"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#475569' }}>
                    Adresse
                  </label>
                  <input
                    type="text"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    value={parkingSettings.address}
                    onChange={e => setParkingSettings({ ...parkingSettings, address: e.target.value })}
                    placeholder="Ex: Av. de la Résistance, Tanger"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#475569' }}>
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      value={parkingSettings.latitude}
                      onChange={e => setParkingSettings({ ...parkingSettings, latitude: e.target.value })}
                      placeholder="Ex: 33.5867"
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#475569' }}>
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      value={parkingSettings.longitude}
                      onChange={e => setParkingSettings({ ...parkingSettings, longitude: e.target.value })}
                      placeholder="Ex: -7.6430"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="is_active_toggle"
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    checked={parkingSettings.is_active}
                    onChange={e => setParkingSettings({ ...parkingSettings, is_active: e.target.checked })}
                  />
                  <label htmlFor="is_active_toggle" style={{ fontWeight: 500, fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
                    Parking actif et visible par les clients
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
                >
                  {settingsSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>

            {/* Preview Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="agent-card" style={{ padding: '1.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                <h4 style={{ fontWeight: 600, color: '#475569', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Aperçu Client
                </h4>
                
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: '120px', borderRadius: '8px', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative', overflow: 'hidden', marginBottom: '1rem' }}>
                    <MapPin size={36} style={{ zIndex: 2 }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15, background: 'radial-gradient(circle, #fff 10%, transparent 11%)', backgroundSize: '12px 12px' }} />
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                    {parkingSettings.name || 'Nom de votre parking'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    <MapPin size={12} /> {parkingSettings.address || 'Adresse de votre parking'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      background: parkingSettings.is_active ? '#d1fae5' : '#fee2e2',
                      color: parkingSettings.is_active ? '#065f46' : '#991b1b'
                    }}>
                      {parkingSettings.is_active ? 'Ouvert' : 'Fermé'}
                    </span>
                    
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {parkingSettings.latitude && parkingSettings.longitude ? `${parseFloat(parkingSettings.latitude).toFixed(4)}, ${parseFloat(parkingSettings.longitude).toFixed(4)}` : 'Coordonnées non définies'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="agent-card" style={{ padding: '1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', fontSize: '0.85rem', lineHeight: '1.4' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  💡 Conseil de l'équipe ParLak
                </p>
                Renseignez des coordonnées GPS exactes pour permettre à vos clients de se diriger directement vers votre établissement via le guidage intégré de l'application !
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`agent-dashboard ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="agent-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">P</div>
          <span className="brand-name">ParLak <span>Agent</span></span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={onLogout}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="agent-main">
        <header className="agent-topbar">
          <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <LayoutDashboard size={20} />
          </button>
          
          <div className="topbar-right">
            <div className="notifications-btn">
              <Bell size={20} />
              <span className="badge">2</span>
            </div>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{name}</span>
                <span className="user-role">{parkingName}</span>
              </div>
              <div className="user-avatar">
                <UserCircle size={32} />
              </div>
            </div>
          </div>
        </header>

        <div className="agent-scroll-area">
          {activePage === 'dashboard' && <DashboardOverview />}
          {activePage === 'spots' && <SpotsManagement />}
          {activePage === 'reservations' && (
            <div className="agent-content-area">
              <div className="page-header">
                <h2>Gestion des Réservations</h2>
                <div className="header-actions">
                  <button className="btn-secondary"><Filter size={16}/> Filtrer</button>
                  <button className="btn-primary" onClick={fetchAgentData}><Clock size={16}/> Rafraîchir</button>
                </div>
              </div>
              
              <div className="agent-card" style={{ padding: 0 }}>
                <div className="simple-table">
                  <div className="table-row header">
                    <span>Référence</span>
                    <span>Client</span>
                    <span>Véhicule</span>
                    <span>Entrée</span>
                    <span>Sortie</span>
                    <span>Place</span>
                    <span>Statut</span>
                    <span>Actions</span>
                  </div>
                  {loading ? (
                    <p style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</p>
                  ) : reservations.length === 0 ? (
                    <p style={{ padding: '2rem', textAlign: 'center' }}>Aucune réservation pour le moment.</p>
                  ) : (
                    reservations.map(res => (
                      <div key={res.id} className="table-row">
                        <strong style={{ fontSize: '0.8rem', color: '#64748b' }}>{res.reference || `#${res.id}`}</strong>
                        <div className="client-cell">
                          <div className="avatar">{(res.user?.firstname?.[0] || 'U')+(res.user?.lastname?.[0] || '')}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{res.user?.firstname} {res.user?.lastname}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>📍 {res.spot?.zone?.parking?.name}</div>
                          </div>
                        </div>
                        <span>{res.vehicle?.plate || '—'}</span>
                        <span>{res.entry_time}</span>
                        <span>{res.exit_time}</span>
                        <span className="spot-tag">{res.spot_code}</span>
                        <span className={`status-badge ${res.status}`}>
                          {res.status === 'upcoming' ? 'En attente' : res.status === 'confirmed' ? 'Confirmée' : res.status === 'refused' ? 'Refusée' : res.status}
                        </span>
                        <div className="actions-cell" style={{ display: 'flex', gap: '0.5rem' }}>
                          {res.status === 'upcoming' ? (
                            <>
                              <button 
                                onClick={() => handleConfirmReservation(res.id)}
                                style={{
                                  background: '#d1fae5',
                                  color: '#065f46',
                                  border: 'none',
                                  padding: '0.35rem 0.6rem',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                Accepter
                              </button>
                              <button 
                                onClick={() => handleRefuseReservation(res.id)}
                                style={{
                                  background: '#fee2e2',
                                  color: '#991b1b',
                                  border: 'none',
                                  padding: '0.35rem 0.6rem',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                Refuser
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>—</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          {activePage === 'settings' && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
};

export default AgentPage;
