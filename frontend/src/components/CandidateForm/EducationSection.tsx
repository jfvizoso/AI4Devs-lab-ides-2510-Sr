import React from 'react';
import { Education } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import './EducationSection.css';

interface EducationSectionProps {
  education: Education;
  index: number;
  onChange: (index: number, field: keyof Education, value: string | boolean) => void;
  onRemove: (index: number) => void;
  errors?: { [key: string]: string };
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  index,
  onChange,
  onRemove,
  errors = {}
}) => {
  return (
    <div className="education-section">
      <div className="section-header">
        <h3>Educación {index + 1}</h3>
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
          label="Institución"
          name={`education-${index}-institution`}
          value={education.institution || ''}
          onChange={(e) => onChange(index, 'institution', e.target.value)}
          error={errors[`education-${index}-institution`]}
          required
        />
        <Input
          label="Título/Degree"
          name={`education-${index}-degree`}
          value={education.degree || ''}
          onChange={(e) => onChange(index, 'degree', e.target.value)}
          error={errors[`education-${index}-degree`]}
          required
        />
        <Input
          label="Campo de estudio"
          name={`education-${index}-fieldOfStudy`}
          value={education.fieldOfStudy || ''}
          onChange={(e) => onChange(index, 'fieldOfStudy', e.target.value)}
          error={errors[`education-${index}-fieldOfStudy`]}
        />
        <div className="date-fields">
          <Input
            label="Fecha inicio"
            name={`education-${index}-startDate`}
            type="date"
            value={education.startDate || ''}
            onChange={(e) => onChange(index, 'startDate', e.target.value)}
            error={errors[`education-${index}-startDate`]}
          />
          <Input
            label="Fecha fin"
            name={`education-${index}-endDate`}
            type="date"
            value={education.endDate || ''}
            onChange={(e) => onChange(index, 'endDate', e.target.value)}
            error={errors[`education-${index}-endDate`]}
          />
        </div>
        <div className="checkbox-field">
          <label>
            <input
              type="checkbox"
              checked={education.isCurrent || false}
              onChange={(e) => onChange(index, 'isCurrent', e.target.checked)}
            />
            En curso
          </label>
        </div>
      </div>
    </div>
  );
};

