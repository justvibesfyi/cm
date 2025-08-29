// Input validation utilities
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class Validator {
  static email(email: string): ValidationResult {
    const errors: ValidationError[] = [];
    
    if (!email) {
      errors.push(new ValidationError('Email is required', 'email', 'REQUIRED'));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push(new ValidationError('Invalid email format', 'email', 'INVALID_FORMAT'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static required(value: any, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    
    if (value === null || value === undefined || value === '') {
      errors.push(new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static minLength(value: string, minLength: number, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    
    if (value && value.length < minLength) {
      errors.push(new ValidationError(
        `${fieldName} must be at least ${minLength} characters long`,
        fieldName,
        'MIN_LENGTH'
      ));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static maxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
    const errors: ValidationError[] = [];
    
    if (value && value.length > maxLength) {
      errors.push(new ValidationError(
        `${fieldName} must be no more than ${maxLength} characters long`,
        fieldName,
        'MAX_LENGTH'
      ));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static combine(...results: ValidationResult[]): ValidationResult {
    const allErrors = results.flatMap(result => result.errors);
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }
}

// Sanitization utilities
export class Sanitizer {
  static email(email: string): string {
    return email.trim().toLowerCase();
  }

  static text(text: string): string {
    return text.trim();
  }

  static html(html: string): string {
    // Basic HTML sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  }
}