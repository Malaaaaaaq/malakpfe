import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Car, Users, Calendar, Tag, LogOut,
  TrendingUp, Shield, MapPin, Plus, Pencil, Trash2,
  Search, RefreshCw, X, CheckCircle, XCircle, Clock,
  Download,
  Building2, UserCheck, ChevronRight, AlertTriangle,
  BarChart3, Activity, Percent, DollarSign
} from 'lucide-react';
import './AdminPage.css';

/* ─── API Helper ─────────────────────────────────────────────── */
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('parlak_token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${endpoint}`, { ...options, headers });
  if (res.status === 401) { window.location.reload(); return; }
  return res.json();
};

/* ─── Promos (backend) ───────────────────────────────────────── */
const DEFAULT_PROMOS = [];


/* ─── Utility: format date ───────────────────────────────────── */
const fmtDate = () => {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

/* ═══════════════════════════════════════════════════════════════
   MAIN AdminPage Component
   ═══════════════════════════════════════════════════════════════ */
const AdminPage = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  /* ── stats ── */
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  /* ── parkings ── */
  const [parkings, setParkings] = useState([]);
  const [parkingsLoading, setParkingsLoading] = useState(true);
  const [parkingSearch, setParkingSearch] = useState('');
  const [parkingModal, setParkingModal] = useState(null); // null | 'create' | parking-object
  const [parkingForm, setParkingForm] = useState({});
  const [parkingFormLoading, setParkingFormLoading] = useState(false);
  const [parkingMsg, setParkingMsg] = useState(null);

  /* ── agents ── */
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [agentSearch, setAgentSearch] = useState('');
  const [agentModal, setAgentModal] = useState(null);
  const [agentForm, setAgentForm] = useState({});
  const [agentFormLoading, setAgentFormLoading] = useState(false);
  const [agentMsg, setAgentMsg] = useState(null);

  /* ── reservations ── */
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(true);
  const [resSearch, setResSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState('all');
  const [resFromDate, setResFromDate] = useState('');
  const [resToDate, setResToDate] = useState('');
  const [resMsg, setResMsg] = useState(null);

  /* ── cities ── */
  const [cities, setCities] = useState([]);

  /* ── promos ── */
  const [promos, setPromos] = useState(DEFAULT_PROMOS);
  const [promoForm, setPromoForm] = useState({ code: '', discount: '', type: 'percent', max_uses: '', expires_at: '', is_active: true });
  const [promoMsg, setPromoMsg] = useState(null);
  const [promosLoading, setPromosLoading] = useState(false);


  const adminName = user?.firstname || 'Admin';
  const adminInitials = (user?.firstname?.[0] || 'A') + (user?.lastname?.[0] || '');

  /* ─── Data fetchers ─────────────────────────────────────────── */
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await apiFetch('/admin/dashboard-stats');
      if (data?.stats) setStats(data);
    } catch (e) { console.error(e); }
    finally { setStatsLoading(false); }
  }, []);

  const fetchParkings = useCallback(async () => {
    setParkingsLoading(true);
    try {
      const data = await apiFetch('/admin/parkings');
      if (Array.isArray(data)) setParkings(data);
    } catch (e) { console.error(e); }
    finally { setParkingsLoading(false); }
  }, []);

  const fetchAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const data = await apiFetch('/admin/agents');
      if (Array.isArray(data)) setAgents(data);
    } catch (e) { console.error(e); }
    finally { setAgentsLoading(false); }
  }, []);

  const fetchReservations = useCallback(async () => {
    setResLoading(true);
    try {
      const params = new URLSearchParams();
      if (resFromDate) params.append('from', resFromDate);
      if (resToDate) params.append('to', resToDate);
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch(`/admin/reservations${query}`);
      if (Array.isArray(data)) setReservations(data);
    } catch (e) { console.error(e); }
    finally { setResLoading(false); }
  }, [resFromDate, resToDate]);

  const exportReservations = async () => {
    try {
      const params = new URLSearchParams();
      if (resFromDate) params.append('from', resFromDate);
      if (resToDate) params.append('to', resToDate);
      const query = params.toString() ? `?${params.toString()}` : '';
      const token = localStorage.getItem('parlak_token');
      const res = await fetch(`${API}/admin/reservations/export${query}`, {
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        let message = 'Erreur export Excel';
        try {
          const json = JSON.parse(text);
          message = json.message || message;
        } catch {
          if (text) {
            message = text.replace(/\s+/g, ' ').trim().slice(0, 200);
          }
        }
        throw new Error(message);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations-${resFromDate || 'all'}-${resToDate || 'all'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setResMsg({ type: 'error', text: error.message || 'Impossible d\'exporter le fichier.' });
    }
  };

  const resetReservationDates = () => {
    setResFromDate('');
    setResToDate('');
    setResMsg(null);
  };

  const fetchCities = useCallback(async () => {
    try {
      const data = await apiFetch('/admin/cities');
      if (Array.isArray(data)) setCities(data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchPromos = useCallback(async () => {
    setPromosLoading(true);
    try {
      const data = await apiFetch('/admin/promos');
      if (Array.isArray(data)) setPromos(data);
    } catch (e) { console.error(e); }
    finally { setPromosLoading(false); }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchParkings();
    fetchAgents();
    fetchReservations();
    fetchCities();
    fetchPromos();
  }, []);

  /* ─── Parking CRUD handlers ─────────────────────────────────── */
  const openParkingCreate = () => {
    setParkingForm({ name: '', city_id: '', address: '', latitude: '', longitude: '', total_spots: 40, is_active: true, user_id: '' });
    setParkingModal('create');
    setParkingMsg(null);
  };
  const openParkingEdit = (p) => {
    setParkingForm({ ...p, is_active: !!p.is_active, user_id: p.agent_id || '' });
    setParkingModal(p);
    setParkingMsg(null);
  };
  const submitParking = async (e) => {
    e.preventDefault();
    setParkingFormLoading(true);
    setParkingMsg(null);
    try {
      const isEdit = parkingModal !== 'create';
      const endpoint = isEdit ? `/admin/parkings/${parkingModal.id}` : '/admin/parkings';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await apiFetch(endpoint, { method, body: JSON.stringify({ ...parkingForm, is_active: !!parkingForm.is_active, user_id: parkingForm.user_id || null }) });
      if (res?.message) {
        setParkingMsg({ type: 'success', text: res.message });
        fetchParkings();
        fetchAgents();
        setTimeout(() => setParkingModal(null), 1200);
      } else {
        const err = res?.errors ? Object.values(res.errors).flat().join(' ') : (res?.message || 'Erreur inconnue.');
        setParkingMsg({ type: 'error', text: err });
      }
    } catch { setParkingMsg({ type: 'error', text: 'Erreur de connexion au serveur.' }); }
    finally { setParkingFormLoading(false); }
  };
  const deleteParking = async (p) => {
    if (!window.confirm(`Supprimer le parking "${p.name}" ? Toutes ses places et réservations seront effacées.`)) return;
    await apiFetch(`/admin/parkings/${p.id}`, { method: 'DELETE' });
    fetchParkings();
    fetchAgents();
  };
  const toggleParkingActive = async (p) => {
    await apiFetch(`/admin/parkings/${p.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...p, is_active: !p.is_active, user_id: p.agent_id || null }),
    });
    fetchParkings();
  };

  /* ─── Agent CRUD handlers ───────────────────────────────────── */
  const openAgentCreate = () => {
    setAgentForm({ firstname: '', lastname: '', email: '', phone: '', password: '', assigned_parking_id: '' });
    setAgentModal('create');
    setAgentMsg(null);
  };
  const openAgentEdit = (a) => {
    setAgentForm({ ...a, password: '', assigned_parking_id: a.assigned_parking_id || '' });
    setAgentModal(a);
    setAgentMsg(null);
  };
  const submitAgent = async (e) => {
    e.preventDefault();
    setAgentFormLoading(true);
    setAgentMsg(null);
    try {
      const isEdit = agentModal !== 'create';
      const endpoint = isEdit ? `/admin/agents/${agentModal.id}` : '/admin/agents';
      const method = isEdit ? 'PUT' : 'POST';
      const body = { ...agentForm };
      if (!body.password) delete body.password;
      if (!body.assigned_parking_id) body.assigned_parking_id = null;
      const res = await apiFetch(endpoint, { method, body: JSON.stringify(body) });
      if (res?.message && !res?.errors) {
        setAgentMsg({ type: 'success', text: res.message });
        fetchAgents();
        fetchParkings();
        setTimeout(() => setAgentModal(null), 1200);
      } else {
        const err = res?.errors ? Object.values(res.errors).flat().join(' ') : (res?.message || 'Erreur inconnue.');
        setAgentMsg({ type: 'error', text: err });
      }
    } catch { setAgentMsg({ type: 'error', text: 'Erreur de connexion au serveur.' }); }
    finally { setAgentFormLoading(false); }
  };
  const deleteAgent = async (a) => {
    if (!window.confirm(`Supprimer l'agent ${a.firstname} ${a.lastname} ?`)) return;
    await apiFetch(`/admin/agents/${a.id}`, { method: 'DELETE' });
    fetchAgents();
    fetchParkings();
  };

  /* ─── Reservation handlers ──────────────────────────────────── */
  const updateResStatus = async (res, status) => {
    setResMsg(null);
    const r = await apiFetch(`/admin/reservations/${res.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    if (r?.message) {
      setResMsg({ type: 'success', text: r.message });
      fetchReservations();
      setTimeout(() => setResMsg(null), 3000);
    }
  };

  /* ─── Promo handlers ────────────────────────────────────────── */
  const [promoSending, setPromoSending] = useState(null);

  const addPromo = async (e) => {
    e.preventDefault();
    if (!promoForm.code || !promoForm.discount) return;

    setPromoMsg(null);
    setPromosLoading(true);

    try {
      const data = {
        code: promoForm.code,
        discount: Number(promoForm.discount),
        type: promoForm.type,
        is_active: promoForm.is_active ? 1 : 0,
        max_uses: promoForm.max_uses ? Number(promoForm.max_uses) : null,
        expires_at: promoForm.expires_at || null,
      };

      const res = await apiFetch('/admin/promos', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res?.promo) {
        fetchPromos();
        setPromoForm({ code: '', discount: '', type: 'percent', max_uses: '', expires_at: '', is_active: true });
        setPromoMsg({ type: 'success', text: 'Code promo ajouté avec succès !' });
      } else {
        const err = res?.errors ? Object.values(res.errors).flat().join(' ') : (res?.message || 'Erreur inconnue.');
        setPromoMsg({ type: 'error', text: err });
      }
    } catch (error) {
      setPromoMsg({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setPromosLoading(false);
      setTimeout(() => setPromoMsg(null), 3000);
    }
  };

  const togglePromoActive = async (promo) => {
    const res = await apiFetch(`/admin/promos/${promo.id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: !promo.is_active }),
    });
    if (res?.promo) fetchPromos();
  };

  const deletePromo = async (promo) => {
    if (!window.confirm(`Supprimer le code promo "${promo.code}" ?`)) return;
    const res = await apiFetch(`/admin/promos/${promo.id}`, { method: 'DELETE' });
    if (res?.message) fetchPromos();
  };

  const sendPromoToSubscribers = async (promo) => {
    setPromoSending(promo.id);
    const res = await apiFetch(`/admin/promos/${promo.id}/send`, { method: 'POST' });
    if (res?.message) {
      setPromoMsg({ type: 'success', text: res.message });
    } else {
      setPromoMsg({ type: 'error', text: res?.message || 'Erreur lors de l\'envoi.' });
    }
    setPromoSending(null);
    setTimeout(() => setPromoMsg(null), 4000);
  };

  /* ─── Nav Items ─────────────────────────────────────────────── */
  const NAV = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'parkings', label: 'Gestion des Parkings', icon: Building2 },
    { id: 'agents', label: 'Gestion des Agents', icon: UserCheck },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'promos', label: 'Codes Promos', icon: Tag },
  ];

  /* ─── Filtered lists ────────────────────────────────────────── */
  const filteredParkings = parkings.filter(p =>
    p.name?.toLowerCase().includes(parkingSearch.toLowerCase()) ||
    p.city_name?.toLowerCase().includes(parkingSearch.toLowerCase())
  );
  const filteredAgents = agents.filter(a =>
    `${a.firstname} ${a.lastname} ${a.email}`.toLowerCase().includes(agentSearch.toLowerCase())
  );
  const filteredRes = reservations.filter(r => {
    const matchSearch = `${r.reference} ${r.client_name} ${r.vehicle_plate} ${r.parking_name}`.toLowerCase().includes(resSearch.toLowerCase());
    const matchStatus = resStatusFilter === 'all' || r.status === resStatusFilter;
    return matchSearch && matchStatus;
  });

  /* ═══════════════════════════════════════════════════════════════
     SUB-PAGES
     ═══════════════════════════════════════════════════════════════ */

  /* ── Overview ── */
  const OverviewPage = () => {
    const s = stats?.stats || {};
    const dist = stats?.status_distribution || {};
    const activities = stats?.activities || [];
    const totalDist = (dist.upcoming || 0) + (dist.confirmed || 0) + (dist.cancelled || 0) + (dist.refused || 0) || 1;

    const KPI = [
      { label: 'Revenu Total', value: `${(s.total_revenue || 0).toLocaleString('fr-FR')} MAD`, icon: DollarSign, color: 'emerald', delta: '+12.4%' },
      { label: 'Taux d\'Occupation', value: `${s.occupancy_rate || 0}%`, icon: Percent, color: 'indigo', delta: 'Live' },
      { label: 'Clients Actifs', value: s.total_clients || 0, icon: Users, color: 'violet', delta: `+${Math.max(1, Math.floor((s.total_clients || 0) * 0.08))} ce mois` },
      { label: 'Agents', value: s.total_agents || 0, icon: UserCheck, color: 'sky', delta: `${s.total_agents || 0} actifs` },
      { label: 'Réservations', value: s.total_bookings || 0, icon: Calendar, color: 'amber', delta: 'Total plateforme' },
      { label: 'Places Totales', value: s.total_spots || 240, icon: Car, color: 'rose', delta: `${parkings.length} parkings` },
    ];

    return (
      <div>
        <div className="adm-section-header">
          <div>
            <h2>Bonjour, {adminName} 👋</h2>
            <p>Voici le tableau de bord de la plateforme ParLak — {fmtDate()}</p>
          </div>
          <button className="adm-btn adm-btn-secondary" onClick={() => { fetchStats(); fetchParkings(); }}>
            <RefreshCw size={15} /> Actualiser
          </button>
        </div>

        {statsLoading ? (
          <div className="adm-loading"><div className="adm-spinner" /> Chargement des données...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="adm-stats-grid">
              {KPI.map(k => (
                <div key={k.label} className={`adm-stat-card ${k.color}`}>
                  <div className={`adm-stat-icon-wrap ${k.color}`}><k.icon size={20} /></div>
                  <div className="adm-stat-info">
                    <div className="adm-stat-value">{k.value}</div>
                    <div className="adm-stat-label">{k.label}</div>
                    <div className="adm-stat-delta neutral">{k.delta}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="adm-grid-2-3">
              {/* Occupancy + Status */}
              <div className="adm-glass-card">
                <div className="adm-card-pad">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <BarChart3 size={16} color="var(--adm-indigo)" />
                    <span style={{ fontWeight: 700, color: 'var(--adm-text-primary)', fontSize: '0.95rem' }}>Distribution des Réservations</span>
                  </div>
                  <div className="adm-status-dist">
                    {[
                      { key: 'upcoming', label: 'En attente', color: '#818cf8', bg: 'rgba(99,102,241,0.35)' },
                      { key: 'confirmed', label: 'Confirmées', color: '#10b981', bg: 'rgba(16,185,129,0.35)' },
                      { key: 'cancelled', label: 'Annulées', color: '#94a3b8', bg: 'rgba(148,163,184,0.25)' },
                      { key: 'refused', label: 'Refusées', color: '#fb7185', bg: 'rgba(244,63,94,0.3)' },
                    ].map(item => (
                      <div key={item.key} className="adm-status-row">
                        <span className="adm-status-row-label">{item.label}</span>
                        <div className="adm-status-row-bar">
                          <div className="adm-status-row-fill" style={{ width: `${Math.min(100, ((dist[item.key] || 0) / totalDist) * 100)}%`, background: item.bg }} />
                        </div>
                        <span className="adm-status-row-count">{dist[item.key] || 0}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 24, borderTop: '1px solid var(--adm-border)', paddingTop: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <Activity size={15} color="var(--adm-emerald)" />
                      <span style={{ fontWeight: 700, color: 'var(--adm-text-primary)', fontSize: '0.88rem' }}>Taux d'occupation par ville</span>
                    </div>
                    {parkings.slice(0, 4).map(p => {
                      const occ = p.total_spots > 0 ? Math.min(100, Math.round(((p.total_spots - (p.free_spots || 0)) / p.total_spots) * 100)) : 0;
                      return (
                        <div key={p.id} className="adm-occ-bar-wrap">
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginBottom: 4 }}>
                            <span style={{ color: 'var(--adm-text-secondary)' }}>{p.name}</span>
                            <span style={{ fontWeight: 700, color: occ > 80 ? 'var(--adm-rose)' : occ > 50 ? 'var(--adm-amber)' : 'var(--adm-emerald)' }}>{occ}%</span>
                          </div>
                          <div className="adm-occ-bar-track">
                            <div className={`adm-occ-bar-fill ${occ > 80 ? 'rose' : occ > 50 ? 'amber' : 'emerald'}`} style={{ width: `${occ}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Activity feed */}
              <div className="adm-glass-card">
                <div className="adm-card-pad">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Activity size={16} color="var(--adm-indigo)" />
                    <span style={{ fontWeight: 700, color: 'var(--adm-text-primary)', fontSize: '0.95rem' }}>Activité Récente</span>
                  </div>
                  <div className="adm-activity-list">
                    {activities.map(a => (
                      <div key={a.id} className="adm-activity-item">
                        <div className={`adm-activity-dot ${a.type}`} />
                        <span className="adm-activity-text">{a.text}</span>
                        <span className="adm-activity-time">{a.time}</span>
                      </div>
                    ))}
                    {activities.length === 0 && <div className="adm-empty-state" style={{ padding: '24px 0' }}><p style={{ fontSize: '0.82rem' }}>Aucune activité récente.</p></div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="adm-grid-2">
              <div className="adm-glass-card adm-card-pad">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building2 size={16} color="var(--adm-indigo)" />
                    <span style={{ fontWeight: 700, color: 'var(--adm-text-primary)', fontSize: '0.95rem' }}>Parkings Actifs</span>
                  </div>
                  <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => setActiveTab('parkings')}>
                    Voir tout <ChevronRight size={14} />
                  </button>
                </div>
                {parkings.filter(p => p.is_active).slice(0, 4).map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--adm-border)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={14} color="var(--adm-indigo)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--adm-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)' }}>{p.city_name} · {p.free_spots}/{p.total_spots} libres</div>
                    </div>
                    <span className={`adm-badge ${p.is_active ? 'active' : 'inactive'}`}><span className="adm-badge-dot" />{p.is_active ? 'Actif' : 'Fermé'}</span>
                  </div>
                ))}
              </div>

              <div className="adm-glass-card adm-card-pad">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserCheck size={16} color="var(--adm-emerald)" />
                    <span style={{ fontWeight: 700, color: 'var(--adm-text-primary)', fontSize: '0.95rem' }}>Agents de terrain</span>
                  </div>
                  <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => setActiveTab('agents')}>
                    Gérer <ChevronRight size={14} />
                  </button>
                </div>
                {agents.slice(0, 4).map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--adm-border)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--adm-emerald)' }}>
                      {(a.firstname?.[0] || 'A') + (a.lastname?.[0] || '')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--adm-text-primary)' }}>{a.firstname} {a.lastname}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.assigned_parking_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  /* ── Parkings page ── */
  const ParkingsPage = () => (
    <div>
      <div className="adm-section-header">
        <div>
          <h2>Gestion des Parkings</h2>
          <p>{parkings.length} parking(s) enregistré(s) sur la plateforme</p>
        </div>
        <div className="adm-header-actions">
          <div className="adm-search-wrap">
            <Search size={15} />
            <input className="adm-search-input" placeholder="Rechercher un parking..." value={parkingSearch} onChange={e => setParkingSearch(e.target.value)} />
          </div>
          <button className="adm-btn adm-btn-primary" onClick={openParkingCreate}><Plus size={15} /> Nouveau Parking</button>
        </div>
      </div>

      {parkingsLoading ? (
        <div className="adm-loading"><div className="adm-spinner" /> Chargement...</div>
      ) : filteredParkings.length === 0 ? (
        <div className="adm-glass-card"><div className="adm-empty-state"><Building2 size={40} /><p className="adm-empty-title">Aucun parking trouvé</p></div></div>
      ) : (
        <div className="adm-parking-grid">
          {filteredParkings.map(p => {
            const occ = p.total_spots > 0 ? Math.min(100, Math.round(((p.total_spots - (p.free_spots || 0)) / p.total_spots) * 100)) : 0;
            return (
              <div key={p.id} className="adm-parking-card">
                <div className="adm-parking-card-header">
                  <div>
                    <div className="adm-parking-card-name">{p.name}</div>
                    <div className="adm-parking-card-city"><MapPin size={11} />{p.city_name}</div>
                  </div>
                  <span className={`adm-badge ${p.is_active ? 'active' : 'inactive'}`}><span className="adm-badge-dot" />{p.is_active ? 'Actif' : 'Inactif'}</span>
                </div>
                <div className="adm-parking-card-body">
                  <div className="adm-parking-meter">
                    <div className="adm-parking-meter-label">
                      <span>Occupation</span>
                      <span style={{ fontWeight: 700, color: occ > 80 ? 'var(--adm-rose)' : occ > 50 ? 'var(--adm-amber)' : 'var(--adm-emerald)' }}>{occ}%</span>
                    </div>
                    <div className="adm-parking-meter-bar">
                      <div className="adm-parking-meter-fill" style={{ width: `${occ}%`, background: occ > 80 ? 'linear-gradient(90deg,#e11d48,#f43f5e)' : occ > 50 ? 'linear-gradient(90deg,#d97706,#f59e0b)' : 'linear-gradient(90deg,#059669,#10b981)' }} />
                    </div>
                  </div>
                  <div className="adm-parking-meta">
                    <span className="adm-parking-meta-item"><Car size={12} /> {p.total_spots} places</span>
                    <span className="adm-parking-meta-item"><CheckCircle size={12} /> {p.free_spots} libres</span>
                    <span className="adm-parking-meta-item"><UserCheck size={12} /> {p.agent_name}</span>
                  </div>
                </div>
                <div className="adm-parking-card-actions">
                  <button className="adm-btn adm-btn-secondary adm-btn-sm adm-btn-icon" title="Modifier" onClick={() => openParkingEdit(p)}><Pencil size={14} /></button>
                  <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" title="Supprimer" onClick={() => deleteParking(p)}><Trash2 size={14} /></button>
                  <label className="adm-toggle" style={{ marginLeft: 'auto' }} title={p.is_active ? 'Désactiver' : 'Activer'}>
                    <input type="checkbox" checked={!!p.is_active} onChange={() => toggleParkingActive(p)} />
                    <div className="adm-toggle-track"><div className="adm-toggle-thumb" /></div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ── Agents page ── */
  const AgentsPage = () => (
    <div>
      <div className="adm-section-header">
        <div>
          <h2>Gestion des Agents</h2>
          <p>{agents.length} agent(s) de terrain enregistré(s)</p>
        </div>
        <div className="adm-header-actions">
          <div className="adm-search-wrap">
            <Search size={15} />
            <input className="adm-search-input" placeholder="Rechercher un agent..." value={agentSearch} onChange={e => setAgentSearch(e.target.value)} />
          </div>
          <button className="adm-btn adm-btn-primary" onClick={openAgentCreate}><Plus size={15} /> Nouvel Agent</button>
        </div>
      </div>

      {agentsLoading ? (
        <div className="adm-loading"><div className="adm-spinner" /> Chargement...</div>
      ) : (
        <div className="adm-glass-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Parking Assigné</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length === 0 ? (
                  <tr><td colSpan={5}><div className="adm-empty-state"><UserCheck size={36} /><p className="adm-empty-title">Aucun agent trouvé</p></div></td></tr>
                ) : filteredAgents.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--adm-emerald)', flexShrink: 0 }}>
                          {(a.firstname?.[0] || 'A') + (a.lastname?.[0] || '')}
                        </div>
                        <div>
                          <div className="adm-table-name">{a.firstname} {a.lastname}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{a.email}</td>
                    <td style={{ fontSize: '0.8rem' }}>{a.phone || '—'}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Building2 size={12} color="var(--adm-indigo)" />{a.assigned_parking_name}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="adm-btn adm-btn-secondary adm-btn-sm adm-btn-icon" onClick={() => openAgentEdit(a)} title="Modifier"><Pencil size={14} /></button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => deleteAgent(a)} title="Supprimer"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Reservations page ── */
  const ReservationsPage = () => (
    <div>
      <div className="adm-section-header">
        <div>
          <h2>Supervision des Réservations</h2>
          <p>{filteredRes.length} réservation(s) affichée(s)</p>
        </div>
        <button className="adm-btn adm-btn-secondary" onClick={fetchReservations}><RefreshCw size={14} /> Rafraîchir</button>
      </div>

      <div className="adm-glass-card adm-card-pad" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={18} color="var(--adm-indigo)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--adm-text-primary)', fontSize: '0.95rem' }}>Filtrer par période</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--adm-text-muted)' }}>Choisis une plage de dates pour limiter les réservations.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={resetReservationDates}>Réinitialiser</button>
            <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={fetchReservations}>Valider</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, alignItems: 'flex-end' }}>
          <div>
            <div className="adm-filter-label">Du :</div>
            <input type="date" className="adm-form-input" value={resFromDate} onChange={e => setResFromDate(e.target.value)} />
          </div>
          <div>
            <div className="adm-filter-label">Au :</div>
            <input type="date" className="adm-form-input" value={resToDate} onChange={e => setResToDate(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="adm-form-select" style={{ minWidth: 170 }} value={resStatusFilter} onChange={e => setResStatusFilter(e.target.value)}>
              <option value="all">Tous les statuts</option>
              <option value="upcoming">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="cancelled">Annulées</option>
              <option value="refused">Refusées</option>
            </select>
            <div className="adm-search-wrap" style={{ maxWidth: '280px' }}>
              <Search size={15} />
              <input className="adm-search-input" placeholder="Référence, client, plaque..." value={resSearch} onChange={e => setResSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {(resFromDate || resToDate) && (
          <div className="adm-filter-summary">
            <span className="adm-filter-pill">{resFromDate || '...'} → {resToDate || '...'}</span>
            <span className="adm-filter-badge">{filteredRes.length} réservation(s) trouvée(s)</span>
          </div>
        )}
      </div>

      {resMsg && <div className={`adm-alert ${resMsg.type}`}><CheckCircle size={15} />{resMsg.text}</div>}

      {resLoading ? (
        <div className="adm-loading"><div className="adm-spinner" /> Chargement...</div>
      ) : (
        <div className="adm-glass-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Client</th>
                  <th>Parking</th>
                  <th>Place</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRes.length === 0 ? (
                  <tr><td colSpan={8}><div className="adm-empty-state"><Calendar size={36} /><p className="adm-empty-title">Aucune réservation trouvée</p></div></td></tr>
                ) : filteredRes.map(r => (
                  <tr key={r.id}>
                    <td><span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--adm-indigo)', fontFamily: 'monospace' }}>{r.reference}</span></td>
                    <td>
                      <div className="adm-table-name">{r.client_name}</div>
                      <div className="adm-table-sub">{r.vehicle_plate} · {r.vehicle_model}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{r.parking_name}</td>
                    <td><span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--adm-text-secondary)', fontFamily: 'monospace' }}>{r.spot_code}</span></td>
                    <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{r.entry_date}<br /><span style={{ color: 'var(--adm-text-muted)' }}>{r.entry_time} → {r.exit_time}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--adm-emerald)', fontSize: '0.88rem' }}>{Number(r.total_price || 0).toFixed(2)} MAD</td>
                    <td><span className={`adm-badge ${r.status}`}><span className="adm-badge-dot" />
                      {r.status === 'upcoming' ? 'En attente' : r.status === 'confirmed' ? 'Confirmée' : r.status === 'cancelled' ? 'Annulée' : 'Refusée'}
                    </span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'nowrap' }}>
                        {r.status === 'upcoming' && (
                          <>
                            <button className="adm-btn adm-btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--adm-emerald)', border: '1px solid rgba(16,185,129,0.2)' }} onClick={() => updateResStatus(r, 'confirmed')} title="Confirmer"><CheckCircle size={13} /></button>
                            <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => updateResStatus(r, 'refused')} title="Refuser"><XCircle size={13} /></button>
                          </>
                        )}
                        {(r.status === 'upcoming' || r.status === 'confirmed') && (
                          <button className="adm-btn adm-btn-secondary adm-btn-sm adm-btn-icon" onClick={() => updateResStatus(r, 'cancelled')} title="Annuler"><X size={13} /></button>
                        )}
                        {(r.status === 'cancelled' || r.status === 'refused') && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', alignSelf: 'center' }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 22, padding: '0 18px 18px' }}>
            <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.88rem' }}>{filteredRes.length} ligne(s) prête(s) pour export</div>
            <button className="adm-btn adm-btn-success" onClick={exportReservations} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Download size={14} /> Exporter Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Promos page ── */
  const PromosPage = () => (
    <div>
      <div className="adm-section-header">
        <div>
          <h2>Codes Promos & Tarifs</h2>
          <p>Gérez les codes promotionnels et les multiplicateurs de tarifs</p>
        </div>
      </div>

      {promoMsg && <div className={`adm-alert ${promoMsg.type}`}><CheckCircle size={15} />{promoMsg.text}</div>}

      <div className="adm-grid-2">
        {/* Add promo form */}
        <div className="adm-glass-card adm-card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Tag size={16} color="var(--adm-indigo)" />
            <span style={{ fontWeight: 700, color: 'var(--adm-text-primary)', fontSize: '0.95rem' }}>Créer un Code Promo</span>
          </div>
          <form onSubmit={addPromo} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="adm-form-group">
              <label className="adm-form-label">Code</label>
              <input className="adm-form-input" placeholder="Ex: SUMMER25" value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="adm-form-group">
                <label className="adm-form-label">Réduction</label>
                <input type="number" className="adm-form-input" placeholder="Ex: 15" min="1" max="100" value={promoForm.discount} onChange={e => setPromoForm({ ...promoForm, discount: e.target.value })} required />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Type</label>
                <select className="adm-form-select" value={promoForm.type} onChange={e => setPromoForm({ ...promoForm, type: e.target.value })}>
                  <option value="percent">Pourcentage (%)</option>
                  <option value="flat">Montant fixe (MAD)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="adm-btn adm-btn-primary" style={{ marginTop: 4 }}><Plus size={15} /> Ajouter le code</button>
          </form>
        </div>

        {/* Rate multipliers info */}
        <div className="adm-glass-card adm-card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={16} color="var(--adm-amber)" />
            <span style={{ fontWeight: 700, color: 'var(--adm-text-primary)', fontSize: '0.95rem' }}>Tarifs & Multiplicateurs</span>
          </div>
          {[
            { label: 'Tarif de base', value: '10 MAD/h', color: 'var(--adm-text-primary)' },
            { label: 'Tarif VIP', value: '20 MAD/h', color: 'var(--adm-amber)' },
            { label: 'Tarif Électrique', value: '15 MAD/h', color: 'var(--adm-emerald)' },
            { label: 'Tarif Moto', value: '6 MAD/h', color: 'var(--adm-indigo)' },
            { label: 'Tarif PMR/Handicap', value: '8 MAD/h', color: '#c4b5fd' },
            { label: 'Heure de pointe (×1.5)', value: '+50%', color: 'var(--adm-rose)' },
          ].map(t => (
            <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--adm-border)' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--adm-text-secondary)' }}>{t.label}</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: t.color }}>{t.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Promo list */}
      <div className="adm-glass-card">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--adm-border)', fontWeight: 700, color: 'var(--adm-text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag size={15} color="var(--adm-indigo)" /> Codes actifs ({promos.filter(p => p.is_active || p.is_active === undefined).length}/{promos.length})
        </div>
        <div style={{ padding: '16px 24px' }}>
          {promosLoading ? (
            <div className="adm-loading"><div className="adm-spinner" /> Chargement...</div>
          ) : promos.length === 0 ? (
            <div className="adm-empty-state"><Tag size={36} /><p className="adm-empty-title">Aucun code promo pour le moment</p></div>
          ) : (
            <div className="adm-promo-grid">
              {promos.map((p) => (
                <div key={p.id} className="adm-promo-code-chip" style={{ opacity: p.is_active ? 1 : 0.45 }}>
                  <div>
                    <div className="adm-promo-code-val">{p.code}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', marginTop: 2 }}>
                      {p.uses_count || 0} utilisation(s)
                      {p.max_uses ? ` / ${p.max_uses}` : ''}
                    </div>
                    {p.expires_at && (
                      <div style={{ fontSize: '0.68rem', color: 'var(--adm-rose)', marginTop: 1 }}>
                        Expire le {p.expires_at}
                      </div>
                    )}
                  </div>
                  <div className="adm-promo-code-discount">
                    -{p.discount}{p.type === 'percent' ? '%' : ' MAD'}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button
                      className="adm-btn adm-btn-secondary adm-btn-sm"
                      disabled={promoSending === p.id}
                      onClick={() => sendPromoToSubscribers(p)}
                      title="Envoyer aux abonnés"
                      style={{ fontSize: '0.7rem', padding: '4px 8px', whiteSpace: 'nowrap' }}
                    >
                      {promoSending === p.id ? '...' : '📧 Envoyer'}
                    </button>
                    <label className="adm-toggle">
                      <input type="checkbox" checked={!!p.is_active} onChange={() => togglePromoActive(p)} />
                      <div className="adm-toggle-track"><div className="adm-toggle-thumb" /></div>
                    </label>
                    <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => deletePromo(p)}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════
     MODALS
     ═══════════════════════════════════════════════════════════════ */

  const ParkingModal = () => {
    if (!parkingModal) return null;
    const isEdit = parkingModal !== 'create';
    return (
      <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setParkingModal(null)}>
        <div className="adm-modal">
          <div className="adm-modal-header">
            <h3 className="adm-modal-title"><Building2 size={18} />{isEdit ? 'Modifier le Parking' : 'Nouveau Parking'}</h3>
            <button className="adm-modal-close" onClick={() => setParkingModal(null)}>×</button>
          </div>
          <form onSubmit={submitParking}>
            <div className="adm-modal-body">
              {parkingMsg && <div className={`adm-alert ${parkingMsg.type}`}>{parkingMsg.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}{parkingMsg.text}</div>}
              <div className="adm-form-grid">
                <div className="adm-form-group adm-form-grid-1">
                  <label className="adm-form-label">Nom du Parking *</label>
                  <input className="adm-form-input" placeholder="Ex: Parking Twin Center" value={parkingForm.name || ''} onChange={e => setParkingForm({ ...parkingForm, name: e.target.value })} required />
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">Ville *</label>
                  <select className="adm-form-select" value={parkingForm.city_id || ''} onChange={e => setParkingForm({ ...parkingForm, city_id: e.target.value })} required>
                    <option value="">Sélectionner une ville</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">Nombre de places *</label>
                  <input type="number" className="adm-form-input" min="4" max="200" value={parkingForm.total_spots || ''} onChange={e => setParkingForm({ ...parkingForm, total_spots: e.target.value })} required />
                </div>
                <div className="adm-form-group adm-form-grid-1">
                  <label className="adm-form-label">Adresse complète *</label>
                  <input className="adm-form-input" placeholder="Ex: Bd Zerktouni, Casablanca" value={parkingForm.address || ''} onChange={e => setParkingForm({ ...parkingForm, address: e.target.value })} required />
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">Latitude *</label>
                  <input type="number" step="any" className="adm-form-input" placeholder="Ex: 33.5867" value={parkingForm.latitude || ''} onChange={e => setParkingForm({ ...parkingForm, latitude: e.target.value })} required />
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">Longitude *</label>
                  <input type="number" step="any" className="adm-form-input" placeholder="Ex: -7.6430" value={parkingForm.longitude || ''} onChange={e => setParkingForm({ ...parkingForm, longitude: e.target.value })} required />
                </div>
                <div className="adm-form-group adm-form-grid-1">
                  <label className="adm-form-label">Agent assigné</label>
                  <select className="adm-form-select" value={parkingForm.user_id || ''} onChange={e => setParkingForm({ ...parkingForm, user_id: e.target.value })}>
                    <option value="">Aucun agent assigné</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.firstname} {a.lastname} ({a.email})</option>)}
                  </select>
                </div>
                <div className="adm-form-group adm-form-grid-1">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <label className="adm-toggle">
                      <input type="checkbox" checked={!!parkingForm.is_active} onChange={e => setParkingForm({ ...parkingForm, is_active: e.target.checked })} />
                      <div className="adm-toggle-track"><div className="adm-toggle-thumb" /></div>
                    </label>
                    <span className="adm-form-label" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.875rem', color: 'var(--adm-text-secondary)' }}>Parking actif et visible par les clients</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button type="button" className="adm-btn adm-btn-secondary" onClick={() => setParkingModal(null)}>Annuler</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={parkingFormLoading}>
                {parkingFormLoading ? <><div className="adm-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Enregistrement...</> : <><CheckCircle size={15} /> {isEdit ? 'Mettre à jour' : 'Créer le Parking'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AgentModal = () => {
    if (!agentModal) return null;
    const isEdit = agentModal !== 'create';
    return (
      <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setAgentModal(null)}>
        <div className="adm-modal">
          <div className="adm-modal-header">
            <h3 className="adm-modal-title"><UserCheck size={18} />{isEdit ? 'Modifier l\'Agent' : 'Nouvel Agent'}</h3>
            <button className="adm-modal-close" onClick={() => setAgentModal(null)}>×</button>
          </div>
          <form onSubmit={submitAgent}>
            <div className="adm-modal-body">
              {agentMsg && <div className={`adm-alert ${agentMsg.type}`}>{agentMsg.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}{agentMsg.text}</div>}
              <div className="adm-form-grid">
                <div className="adm-form-group">
                  <label className="adm-form-label">Prénom *</label>
                  <input className="adm-form-input" placeholder="Ex: Karima" value={agentForm.firstname || ''} onChange={e => setAgentForm({ ...agentForm, firstname: e.target.value })} required />
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">Nom</label>
                  <input className="adm-form-input" placeholder="Ex: Idrissi" value={agentForm.lastname || ''} onChange={e => setAgentForm({ ...agentForm, lastname: e.target.value })} />
                </div>
                <div className="adm-form-group adm-form-grid-1">
                  <label className="adm-form-label">Email *</label>
                  <input type="email" className="adm-form-input" placeholder="agent@parlak.ma" value={agentForm.email || ''} onChange={e => setAgentForm({ ...agentForm, email: e.target.value })} required />
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">Téléphone</label>
                  <input className="adm-form-input" placeholder="06 XX XX XX XX" value={agentForm.phone || ''} onChange={e => setAgentForm({ ...agentForm, phone: e.target.value })} />
                </div>
                <div className="adm-form-group">
                  <label className="adm-form-label">{isEdit ? 'Nouveau mot de passe (laisser vide)' : 'Mot de passe *'}</label>
                  <input type="password" className="adm-form-input" placeholder={isEdit ? 'Laisser vide pour ne pas changer' : 'Min. 6 caractères'} value={agentForm.password || ''} onChange={e => setAgentForm({ ...agentForm, password: e.target.value })} required={!isEdit} />
                </div>
                <div className="adm-form-group adm-form-grid-1">
                  <label className="adm-form-label">Parking assigné</label>
                  <select className="adm-form-select" value={agentForm.assigned_parking_id || ''} onChange={e => setAgentForm({ ...agentForm, assigned_parking_id: e.target.value })}>
                    <option value="">Aucun parking assigné</option>
                    {parkings.map(p => <option key={p.id} value={p.id}>{p.name} — {p.city_name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button type="button" className="adm-btn adm-btn-secondary" onClick={() => setAgentModal(null)}>Annuler</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={agentFormLoading}>
                {agentFormLoading ? <><div className="adm-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Enregistrement...</> : <><CheckCircle size={15} /> {isEdit ? 'Mettre à jour' : 'Créer l\'Agent'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  const PAGE_TITLES = {
    overview: { title: 'Vue d\'ensemble', sub: 'Tableau de bord global de la plateforme' },
    parkings: { title: 'Gestion des Parkings', sub: 'CRUD complet sur tous les parkings' },
    agents: { title: 'Gestion des Agents', sub: 'Création, modification et supervision des agents' },
    reservations: { title: 'Réservations', sub: 'Supervision de toutes les réservations clients' },
    promos: { title: 'Codes Promos & Tarifs', sub: 'Gestion des codes promotionnels et tarification' },
  };
  const currentPage = PAGE_TITLES[activeTab];

  return (
    <div className="adm-shell">
      <div className="adm-grid-bg" />

      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <div className="adm-brand-icon">P</div>
          <div className="adm-brand-text">
            <span className="adm-brand-name">ParLak</span>
            <span className="adm-brand-sub">Administration</span>
          </div>
        </div>

        <div className="adm-sidebar-profile">
          <div className="adm-avatar">{adminInitials}</div>
          <div>
            <div className="adm-sidebar-profile-name">{user?.firstname} {user?.lastname}</div>
            <div className="adm-sidebar-profile-role">Administrateur</div>
          </div>
        </div>

        <nav className="adm-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`adm-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.id === 'reservations' && reservations.filter(r => r.status === 'upcoming').length > 0 && (
                <span className="adm-nav-badge">{reservations.filter(r => r.status === 'upcoming').length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-logout-btn" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) onLogout(); }}>
            <LogOut size={17} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <h1>{currentPage.title}</h1>
            <p>{currentPage.sub}</p>
          </div>
          <div className="adm-topbar-right">
            <span className="adm-topbar-date">{fmtDate()}</span>
            <div className="adm-user-chip">
              <Shield size={14} color="var(--adm-indigo)" />
              <span className="adm-user-chip-name">{adminName}</span>
            </div>
          </div>
        </header>

        <div className="adm-content">
          {activeTab === 'overview' && <OverviewPage />}
          {activeTab === 'parkings' && <ParkingsPage />}
          {activeTab === 'agents' && <AgentsPage />}
          {activeTab === 'reservations' && <ReservationsPage />}
          {activeTab === 'promos' && <PromosPage />}
        </div>
      </main>

      {/* Modals */}
      <ParkingModal />
      <AgentModal />
    </div>
  );
};

export default AdminPage;
