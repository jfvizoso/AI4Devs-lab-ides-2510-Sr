import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Candidate, CandidatesResponse } from '../../types';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { LoadingSpinner } from '../common/LoadingSpinner';
import './CandidatesList.css';

export const CandidatesList: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCandidates = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getCandidates(pageNum, limit);
      if (response.success && response.data) {
        setCandidates(response.data.candidates);
        setTotalPages(response.data.pagination.totalPages);
        setTotal(response.data.pagination.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar candidatos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(page);
  }, [page]);

  const handleViewDetails = (id: number) => {
    navigate(`/candidates/${id}`);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && candidates.length === 0) {
    return (
      <div className="candidates-list-container">
        <div className="candidates-list-header">
          <h1>Lista de Candidatos</h1>
          <Button onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="candidates-list-container">
      <div className="candidates-list-header">
        <h1>Lista de Candidatos</h1>
        <div className="header-actions">
          <Button variant="primary" onClick={() => navigate('/candidates/new')}>
            Añadir Nuevo Candidato
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {candidates.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No hay candidatos registrados.</p>
          <Button variant="primary" onClick={() => navigate('/candidates/new')}>
            Añadir Primer Candidato
          </Button>
        </div>
      ) : (
        <>
          <div className="candidates-stats">
            <p>Total de candidatos: <strong>{total}</strong></p>
            <p>Página {page} de {totalPages}</p>
          </div>

          <div className="candidates-grid">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-card-header">
                  <h3>{candidate.firstName} {candidate.lastName}</h3>
                  {candidate.cvFileName && (
                    <span className="cv-badge">CV</span>
                  )}
                </div>
                <div className="candidate-card-body">
                  <p className="candidate-email">
                    <strong>Email:</strong> {candidate.email}
                  </p>
                  {candidate.phone && (
                    <p className="candidate-phone">
                      <strong>Teléfono:</strong> {candidate.phone}
                    </p>
                  )}
                  {candidate.education && candidate.education.length > 0 && (
                    <p className="candidate-education">
                      <strong>Educación:</strong> {candidate.education.length} registro(s)
                    </p>
                  )}
                  {candidate.workExperience && candidate.workExperience.length > 0 && (
                    <p className="candidate-experience">
                      <strong>Experiencia:</strong> {candidate.workExperience.length} registro(s)
                    </p>
                  )}
                  <p className="candidate-date">
                    <strong>Registrado:</strong> {formatDate(candidate.createdAt)}
                  </p>
                </div>
                <div className="candidate-card-footer">
                  <Button
                    variant="primary"
                    onClick={() => handleViewDetails(candidate.id)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <Button
                variant="secondary"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="pagination-info">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

