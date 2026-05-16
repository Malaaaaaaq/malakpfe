import React from 'react';
import { LogOut, UserCheck } from 'lucide-react';
import './AdminPage.css';

const AgentPage = ({ user, onLogout }) => {
  const name = user?.firstname || 'Agent';

  return (
    <div className="role-page agent-page">
      <header className="role-header">
        <div className="role-logo">
          <span className="role-logo-p">P</span>
          <div>
            <span className="role-logo-name">ParLak</span>
            <span className="role-logo-sub">Stationnement Intelligent</span>
          </div>
        </div>
        <button className="role-logout" onClick={onLogout}>
          <LogOut size={16} /> Déconnexion
        </button>
      </header>

      <main className="role-main">
        <div className="role-card">
          <div className="role-icon agent-icon">
            <UserCheck size={48} />
          </div>
          <h1 className="role-greeting">Bonjour, {name} 👋</h1>
          <p className="role-sub">Vous êtes connecté en tant qu'<strong>Agent</strong>.</p>
          <div className="role-badge agent-badge">Agent</div>
          
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#041562', marginBottom: '1rem' }}>📍 Mon Parking</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.95rem' }}><strong>Nom :</strong> {user?.parking_name || 'Non défini'}</div>
              <div style={{ fontSize: '0.95rem' }}><strong>Coordonnées :</strong> {user?.latitude && user?.longitude ? `${user.latitude}, ${user.longitude}` : 'Non définies'}</div>
            </div>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee', color: '#64748b', fontSize: '0.85rem' }}>
              ℹ️ Ces informations sont utilisées pour localiser votre parking sur la carte des clients.
            </div>
          </div>

          <p className="role-coming" style={{ marginTop: '2rem' }}>
            Le tableau de bord agent complet est en cours de développement.<br />
            Revenez bientôt pour gérer vos places !
          </p>
        </div>
      </main>
    </div>
  );
};

export default AgentPage;
