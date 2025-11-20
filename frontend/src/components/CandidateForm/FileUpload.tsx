import React from 'react';
import { validateFile } from '../../utils/validation';
import './FileUpload.css';

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, onChange, error }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (!validation.isValid) {
        onChange(null);
        return;
      }
    }
    
    onChange(selectedFile);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="file-upload-group">
      <label className="file-upload-label">
        CV (PDF o DOCX)
        <span className="file-upload-hint"> - Máximo 10MB</span>
      </label>
      <div className="file-upload-container">
        <input
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFileChange}
          className="file-upload-input"
          id="cv-upload"
        />
        <label htmlFor="cv-upload" className="file-upload-button">
          Seleccionar archivo
        </label>
        {file && (
          <div className="file-upload-preview">
            <span className="file-name">{file.name}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="file-remove-button"
              aria-label="Eliminar archivo"
            >
              ×
            </button>
          </div>
        )}
      </div>
      {error && <span className="file-upload-error">{error}</span>}
    </div>
  );
};

