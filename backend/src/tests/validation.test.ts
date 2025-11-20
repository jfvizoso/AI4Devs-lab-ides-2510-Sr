import {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateDateRange,
  validateFile
} from '../utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return valid for correct email format', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for missing email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('obligatorio');
    });

    it('should return invalid for invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('formato');
    });

    it('should return invalid for email without domain', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for email without @', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should return valid for non-empty string', () => {
      const result = validateRequired('test', 'Field');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty string', () => {
      const result = validateRequired('', 'Field');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('obligatorio');
    });

    it('should return invalid for whitespace-only string', () => {
      const result = validateRequired('   ', 'Field');
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for null', () => {
      const result = validateRequired(null, 'Field');
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for undefined', () => {
      const result = validateRequired(undefined, 'Field');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateMinLength', () => {
    it('should return valid for string meeting minimum length', () => {
      const result = validateMinLength('test', 2, 'Field');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for string exactly at minimum length', () => {
      const result = validateMinLength('te', 2, 'Field');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for string below minimum length', () => {
      const result = validateMinLength('t', 2, 'Field');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('al menos');
    });
  });

  describe('validateDateRange', () => {
    it('should return valid when endDate is after startDate', () => {
      const result = validateDateRange('2020-01-01', '2024-01-01');
      expect(result.isValid).toBe(true);
    });

    it('should return valid when dates are equal', () => {
      const result = validateDateRange('2020-01-01', '2020-01-01');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid when endDate is before startDate', () => {
      const result = validateDateRange('2024-01-01', '2020-01-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('posterior');
    });

    it('should return valid when startDate is missing', () => {
      const result = validateDateRange(null, '2024-01-01');
      expect(result.isValid).toBe(true);
    });

    it('should return valid when endDate is missing', () => {
      const result = validateDateRange('2020-01-01', null);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for invalid date format', () => {
      const result = validateDateRange('invalid', '2024-01-01');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('should return valid for null file (optional)', () => {
      const result = validateFile(undefined);
      expect(result.isValid).toBe(true);
    });

    // Nota: Los tests de archivos reales requerirían mocks más complejos
    // Estos tests validan la lógica básica de la función
  });
});

