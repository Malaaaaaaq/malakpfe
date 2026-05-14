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
          <p className="role-coming">
            Le tableau de bord agent est en cours de développement.<br />
            Revenez bientôt !
          </p>
        </div>
      </main>
    </div>
  );
};

export default AgentPage;
