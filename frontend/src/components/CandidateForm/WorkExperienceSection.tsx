import React from 'react';
import { WorkExperience } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import './WorkExperienceSection.css';

interface WorkExperienceSectionProps {
  workExperience: WorkExperience;
  index: number;
  onChange: (index: number, field: keyof WorkExperience, value: string | boolean) => void;
  onRemove: (index: number) => void;
  errors?: { [key: string]: string };
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  workExperience,
  index,
  onChange,
  onRemove,
  errors = {}
}) => {
  return (
    <div className="work-experience-section">
      <div className="section-header">
        <h3>Experiencia {index + 1}</h3>
        <Button
          type="button"
          variant="danger"
          onClick={() => onRemove(index)}
          className="remove-button"
        >
          Eliminar
        </Button>
      </div>
      <div className="section-fields">
        <Input
          label="Empresa"
          name={`work-${index}-company`}
          value={workExperience.company || ''}
          onChange={(e) => onChange(index, 'company', e.target.value)}
          error={errors[`work-${index}-company`]}
          required
        />
        <Input
          label="Puesto"
          name={`work-${index}-position`}
          value={workExperience.position || ''}
          onChange={(e) => onChange(index, 'position', e.target.value)}
          error={errors[`work-${index}-position`]}
          required
        />
        <div className="textarea-field">
          <label htmlFor={`work-${index}-description`} className="input-label">
            Descripción
          </label>
          <textarea
            id={`work-${index}-description`}
            name={`work-${index}-description`}
            value={workExperience.description || ''}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            className="textarea-input"
            rows={4}
            placeholder="Describe tus responsabilidades y logros..."
          />
          {errors[`work-${index}-description`] && (
            <span className="input-error-message">{errors[`work-${index}-description`]}</span>
          )}
        </div>
        <div className="date-fields">
          <Input
            label="Fecha inicio"
            name={`work-${index}-startDate`}
            type="date"
            value={workExperience.startDate || ''}
            onChange={(e) => onChange(index, 'startDate', e.target.value)}
            error={errors[`work-${index}-startDate`]}
          />
          <Input
            label="Fecha fin"
            name={`work-${index}-endDate`}
            type="date"
            value={workExperience.endDate || ''}
            onChange={(e) => onChange(index, 'endDate', e.target.value)}
            error={errors[`work-${index}-endDate`]}
          />
        </div>
        <div className="checkbox-field">
          <label>
            <input
              type="checkbox"
              checked={workExperience.isCurrent || false}
              onChange={(e) => onChange(index, 'isCurrent', e.target.checked)}
            />
            Trabajo actual
          </label>
        </div>
      </div>
    </div>
  );
};

