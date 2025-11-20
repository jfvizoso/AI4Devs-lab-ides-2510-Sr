import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>LTI - Talent Tracking System</h1>
        <Button variant="secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Bienvenido, Reclutador</h2>
          <p>Gestiona los candidatos de manera eficiente</p>
        </div>
        <div className="dashboard-actions">
          <Button
            variant="primary"
            onClick={() => navigate('/candidates')}
            className="view-candidates-button"
          >
            Ver Candidatos
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/candidates/new')}
            className="add-candidate-button"
          >
            Añadir Nuevo Candidato
          </Button>
        </div>
      </main>
    </div>
  );
};

