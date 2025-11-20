export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'El email es obligatorio' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'El formato del email no es válido' };
  }

  return { isValid: true };
};

export const validateRequired = (value: string | undefined | null, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} es obligatorio` };
  }
  return { isValid: true };
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationResult => {
  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} debe tener al menos ${minLength} caracteres` };
  }
  return { isValid: true };
};

export const validateDateRange = (startDate: string | null | undefined, endDate: string | null | undefined): ValidationResult => {
  if (!startDate || !endDate) {
    return { isValid: true }; // Si alguna fecha falta, no validar rango
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Las fechas deben tener un formato válido' };
  }

  if (end < start) {
    return { isValid: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio' };
  }

  return { isValid: true };
};

export const validateFile = (file: Express.Multer.File | undefined): ValidationResult => {
  if (!file) {
    return { isValid: true }; // Archivo es opcional
  }

  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword' // .doc (por si acaso)
  ];

  const allowedExtensions = ['.pdf', '.docx', '.doc'];

  // Validar tipo MIME
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { isValid: false, error: 'El archivo debe ser PDF o DOCX' };
  }

  // Validar extensión
  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    return { isValid: false, error: 'El archivo debe tener extensión .pdf o .docx' };
  }

  // Validar tamaño (10MB = 10 * 1024 * 1024 bytes)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'El archivo no puede exceder 10MB' };
  }

  return { isValid: true };
};

export const validateDate = (dateString: string | null | undefined): ValidationResult => {
  if (!dateString) {
    return { isValid: true }; // Fecha es opcional
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'La fecha debe tener un formato válido' };
  }

  return { isValid: true };
};

