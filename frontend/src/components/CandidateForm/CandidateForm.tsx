import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Education, WorkExperience } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { FileUpload } from './FileUpload';
import { EducationSection } from './EducationSection';
import { WorkExperienceSection } from './WorkExperienceSection';
import { validateEmail, validateRequired, validateMinLength, validateDateRange } from '../../utils/validation';
import './CandidateForm.css';

export const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Información personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Educación y experiencia
  const [education, setEducation] = useState<Education[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);

  // CV
  const [cvFile, setCvFile] = useState<File | null>(null);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validar información personal
    const firstNameValidation = validateRequired(firstName, 'Nombre');
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error!;
    } else {
      const firstNameLength = validateMinLength(firstName, 2, 'Nombre');
      if (!firstNameLength.isValid) {
        errors.firstName = firstNameLength.error!;
      }
    }

    const lastNameValidation = validateRequired(lastName, 'Apellido');
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.error!;
    } else {
      const lastNameLength = validateMinLength(lastName, 2, 'Apellido');
      if (!lastNameLength.isValid) {
        errors.lastName = lastNameLength.error!;
      }
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }

    // Validar educación
    education.forEach((edu, index) => {
      const institutionValidation = validateRequired(edu.institution, 'Institución');
      if (!institutionValidation.isValid) {
        errors[`education-${index}-institution`] = institutionValidation.error!;
      }

      const degreeValidation = validateRequired(edu.degree, 'Título');
      if (!degreeValidation.isValid) {
        errors[`education-${index}-degree`] = degreeValidation.error!;
      }

      if (edu.startDate && edu.endDate) {
        const dateValidation = validateDateRange(edu.startDate, edu.endDate);
        if (!dateValidation.isValid) {
          errors[`education-${index}-dates`] = dateValidation.error!;
        }
      }
    });

    // Validar experiencia laboral
    workExperience.forEach((exp, index) => {
      const companyValidation = validateRequired(exp.company, 'Empresa');
      if (!companyValidation.isValid) {
        errors[`work-${index}-company`] = companyValidation.error!;
      }

      const positionValidation = validateRequired(exp.position, 'Puesto');
      if (!positionValidation.isValid) {
        errors[`work-${index}-position`] = positionValidation.error!;
      }

      if (exp.startDate && exp.endDate) {
        const dateValidation = validateDateRange(exp.startDate, exp.endDate);
        if (!dateValidation.isValid) {
          errors[`work-${index}-dates`] = dateValidation.error!;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      // Crear candidato
      const response = await api.createCandidate({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        address: address || undefined,
        education: education.length > 0 ? education : undefined,
        workExperience: workExperience.length > 0 ? workExperience : undefined
      });

      // Subir CV si existe
      if (cvFile && response.data?.candidate.id) {
        try {
          await api.uploadCV(response.data.candidate.id, cvFile);
        } catch (cvError) {
          console.error('Error al subir CV:', cvError);
          // No fallar si el CV no se puede subir
        }
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el candidato');
    } finally {
      setLoading(false);
    }
  };

  const addEducation = () => {
    setEducation([...education, { institution: '', degree: '' }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string | boolean) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, { company: '', position: '' }]);
  };

  const removeWorkExperience = (index: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [field]: value };
    setWorkExperience(updated);
  };

  const handleAddAnother = () => {
    setSuccess(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setEducation([]);
    setWorkExperience([]);
    setCvFile(null);
    setFormErrors({});
  };

  if (success) {
    return (
      <div className="candidate-form-container">
        <div className="candidate-form-card">
          <Alert type="success" message="Candidato añadido exitosamente al sistema" />
          <div className="form-actions">
            <Button onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
            <Button variant="secondary" onClick={handleAddAnother}>
              Añadir Otro Candidato
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-form-container">
      <div className="candidate-form-card">
        <h1 className="form-title">Añadir Nuevo Candidato</h1>
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleSubmit} className="candidate-form">
          <section className="form-section">
            <h2>Información Personal</h2>
            <Input
              label="Nombre"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={formErrors.firstName}
              required
            />
            <Input
              label="Apellido"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={formErrors.lastName}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
              required
            />
            <Input
              label="Teléfono"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={formErrors.phone}
            />
            <Input
              label="Dirección"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={formErrors.address}
            />
          </section>

          <section className="form-section">
            <div className="section-header-form">
              <h2>Educación</h2>
              <Button type="button" variant="secondary" onClick={addEducation}>
                Añadir Educación
              </Button>
            </div>
            {education.map((edu, index) => (
              <EducationSection
                key={index}
                education={edu}
                index={index}
                onChange={updateEducation}
                onRemove={removeEducation}
                errors={formErrors}
              />
            ))}
            {education.length === 0 && (
              <p className="empty-section">No hay educación agregada. Haz clic en "Añadir Educación" para agregar.</p>
            )}
          </section>

          <section className="form-section">
            <div className="section-header-form">
              <h2>Experiencia Laboral</h2>
              <Button type="button" variant="secondary" onClick={addWorkExperience}>
                Añadir Experiencia
              </Button>
            </div>
            {workExperience.map((exp, index) => (
              <WorkExperienceSection
                key={index}
                workExperience={exp}
                index={index}
                onChange={updateWorkExperience}
                onRemove={removeWorkExperience}
                errors={formErrors}
              />
            ))}
            {workExperience.length === 0 && (
              <p className="empty-section">No hay experiencia agregada. Haz clic en "Añadir Experiencia" para agregar.</p>
            )}
          </section>

          <section className="form-section">
            <h2>CV</h2>
            <FileUpload file={cvFile} onChange={setCvFile} error={formErrors.cv} />
          </section>

          <div className="form-actions">
            <Button type="submit" loading={loading}>
              Guardar Candidato
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

