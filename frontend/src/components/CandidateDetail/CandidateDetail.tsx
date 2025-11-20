import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Candidate } from '../../types';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { LoadingSpinner } from '../common/LoadingSpinner';
import './CandidateDetail.css';

export const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) {
        setError('ID de candidato no válido');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.getCandidate(parseInt(id));
        if (response.success && response.data) {
          setCandidate(response.data.candidate);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el candidato');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadCV = async () => {
    if (!candidate?.id || !candidate.cvFilePath) return;

    try {
      const blob = await api.downloadCV(candidate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = candidate.cvFileName || 'CV.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error al descargar el CV');
    }
  };

  if (loading) {
    return (
      <div className="candidate-detail-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="candidate-detail-container">
        <Alert type="error" message={error || 'Candidato no encontrado'} />
        <Button onClick={() => navigate('/candidates')}>Volver a la Lista</Button>
      </div>
    );
  }

  return (
    <div className="candidate-detail-container">
      <div className="candidate-detail-header">
        <h1>Detalles del Candidato</h1>
        <div className="header-actions">
          <Button variant="secondary" onClick={() => navigate('/candidates')}>
            Volver a la Lista
          </Button>
        </div>
      </div>

      <div className="candidate-detail-content">
        <div className="detail-section">
          <h2>Información Personal</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Nombre:</strong>
              <span>{candidate.firstName} {candidate.lastName}</span>
            </div>
            <div className="detail-item">
              <strong>Email:</strong>
              <span>{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className="detail-item">
                <strong>Teléfono:</strong>
                <span>{candidate.phone}</span>
              </div>
            )}
            {candidate.address && (
              <div className="detail-item">
                <strong>Dirección:</strong>
                <span>{candidate.address}</span>
              </div>
            )}
            <div className="detail-item">
              <strong>Fecha de Registro:</strong>
              <span>{formatDate(candidate.createdAt)}</span>
            </div>
            {candidate.cvFileName && (
              <div className="detail-item">
                <strong>CV:</strong>
                <Button variant="primary" onClick={handleDownloadCV}>
                  Descargar CV
                </Button>
              </div>
            )}
          </div>
        </div>

        {candidate.education && candidate.education.length > 0 && (
          <div className="detail-section">
            <h2>Educación</h2>
            {candidate.education.map((edu, index) => (
              <div key={index} className="education-item">
                <h3>{edu.degree}</h3>
                <p><strong>Institución:</strong> {edu.institution}</p>
                {edu.fieldOfStudy && (
                  <p><strong>Campo de estudio:</strong> {edu.fieldOfStudy}</p>
                )}
                {edu.startDate && (
                  <p><strong>Fecha inicio:</strong> {formatDate(edu.startDate)}</p>
                )}
                {edu.endDate && (
                  <p><strong>Fecha fin:</strong> {formatDate(edu.endDate)}</p>
                )}
                {edu.isCurrent && <span className="current-badge">En curso</span>}
              </div>
            ))}
          </div>
        )}

        {candidate.workExperience && candidate.workExperience.length > 0 && (
          <div className="detail-section">
            <h2>Experiencia Laboral</h2>
            {candidate.workExperience.map((exp, index) => (
              <div key={index} className="experience-item">
                <h3>{exp.position}</h3>
                <p><strong>Empresa:</strong> {exp.company}</p>
                {exp.description && (
                  <p><strong>Descripción:</strong> {exp.description}</p>
                )}
                {exp.startDate && (
                  <p><strong>Fecha inicio:</strong> {formatDate(exp.startDate)}</p>
                )}
                {exp.endDate && (
                  <p><strong>Fecha fin:</strong> {formatDate(exp.endDate)}</p>
                )}
                {exp.isCurrent && <span className="current-badge">Trabajo actual</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

