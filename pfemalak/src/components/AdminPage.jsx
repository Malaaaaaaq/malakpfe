import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import './AdminPage.css';

const AdminPage = ({ user, onLogout }) => {
  const name = user?.firstname || 'Admin';

  return (
    <div className="role-page admin-page">
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
          <div className="role-icon admin-icon">
            <Shield size={48} />
          </div>
          <h1 className="role-greeting">Bonjour, {name} 👋</h1>
          <p className="role-sub">Vous êtes connecté en tant qu'<strong>Administrateur</strong>.</p>
          <div className="role-badge admin-badge">Administrateur</div>
          <p className="role-coming">
            Le tableau de bord administrateur est en cours de développement.<br />
            Revenez bientôt !
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
