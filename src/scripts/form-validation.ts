/**
 * Form Validation Utilities
 * Reusable validation, sanitization, and form handling functions
 */

/**
 * RFC 5322 compliant email regex
 */
export const EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

/**
 * Phone number regex (international format)
 */
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

/**
 * Password strength regex (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_NUMBER_REGEX = /\d/;
export const PASSWORD_SPECIAL_REGEX = /[^A-Za-z0-9]/;

/**
 * Validation rule interface
 */
export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  errorMessage?: string;
  required?: boolean;
  custom?: ( value: string ) => boolean;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  errors?: string[];
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput( value: string ): string {
  return value
    .trim()
    .replace( /[<>]/g, '' )
    .replace( /javascript:/gi, '' )
    .replace( /on\w+\s*=/gi, '' )
    .replace( /\0/g, '' );
}

/**
 * Escape for database safety
 */
export function escapeForDatabase( value: string ): string {
  return value
    .replace( /\\/g, '\\\\' )
    .replace( /'/g, '\\\'' )
    .replace( /"/g, '\\"' )
    .replace( /\n/g, '\\n' )
    .replace( /\r/g, '\\r' )
    .replace( /\t/g, '\\t' );
}

/**
 * Validate email address
 */
export function validateEmail( email: string ): boolean {
  if ( ! email || email.length > 254 ) {
    return false;
  }

  return EMAIL_REGEX.test( email.toLowerCase() );
}

/**
 * Validate phone number
 */
export function validatePhone( phone: string ): boolean {
  const cleaned = phone.replace( /[\s\-()]/g, '' );

  return PHONE_REGEX.test( cleaned );
}

/**
 * Validate password strength
 */
export function validatePassword( password: string ): ValidationResult {
  if ( PASSWORD_REGEX.test( password ) ) {
    return { valid: true };
  }

  const errors: string[] = [];

  if ( password.length < 8 ) {
    errors.push( 'Password must be at least 8 characters' );
  }
  if ( ! PASSWORD_LOWERCASE_REGEX.test( password ) ) {
    errors.push( 'Password must contain at least one lowercase letter' );
  }
  if ( ! PASSWORD_UPPERCASE_REGEX.test( password ) ) {
    errors.push( 'Password must contain at least one uppercase letter' );
  }
  if ( ! PASSWORD_NUMBER_REGEX.test( password ) ) {
    errors.push( 'Password must contain at least one number' );
  }
  if ( ! PASSWORD_SPECIAL_REGEX.test( password ) ) {
    errors.push( 'Password must contain at least one special character' );
  }

  if ( errors.length === 0 ) {
    errors.push( 'Password must meet complexity requirements' );
  }

  return { valid: false, error: errors[ 0 ], errors };
}

/**
 * Validate field based on rules
 */
export function validateField( value: string, rules: ValidationRule ): ValidationResult {
  // Check required
  if ( rules.required && ( ! value || value.trim().length === 0 ) ) {
    return { valid: false, error: 'This field is required' };
  }

  // If not required and empty, skip other validations
  if ( ! rules.required && ( ! value || value.trim().length === 0 ) ) {
    return { valid: true };
  }

  // Check min length
  if ( rules.minLength && value.length < rules.minLength ) {
    return { valid: false, error: `Must be at least ${rules.minLength} characters` };
  }

  // Check max length
  if ( rules.maxLength && value.length > rules.maxLength ) {
    return { valid: false, error: `Must be less than ${rules.maxLength} characters` };
  }

  // Check pattern
  if ( rules.pattern && ! rules.pattern.test( value ) ) {
    return { valid: false, error: rules.errorMessage || 'Invalid format' };
  }

  // Check custom validator
  if ( rules.custom && ! rules.custom( value ) ) {
    return { valid: false, error: rules.errorMessage || 'Invalid value' };
  }

  return { valid: true };
}

/**
 * Show error message on field
 */
export function showFieldError( field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string ): void {
  field.classList.add( 'form__input--error' );
  field.classList.remove( 'form__input--success' );

  const existingError = field.parentElement?.querySelector( '.form__error-message' );
  if ( existingError ) {
    existingError.remove();
  }
  const existingSuccess = field.parentElement?.querySelector( '.form__field-success-message' );
  if ( existingSuccess ) {
    existingSuccess.remove();
  }

  const errorElement = document.createElement( 'span' );
  errorElement.className = 'form__error-message';
  errorElement.textContent = message;
  field.parentElement?.appendChild( errorElement );
}

/**
 * Clear error message from field
 */
export function clearFieldError( field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement ): void {
  field.classList.remove( 'form__input--error' );
  const errorMessage = field.parentElement?.querySelector( '.form__error-message' );
  if ( errorMessage ) {
    errorMessage.remove();
  }
}

/**
 * Show success message on field
 */
export function showFieldSuccess(
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  message: string,
  emphasis?: string,
): void {
  field.classList.remove( 'form__input--error' );

  const existingError = field.parentElement?.querySelector( '.form__error-message' );
  if ( existingError ) {
    existingError.remove();
  }
  const existingSuccess = field.parentElement?.querySelector( '.form__field-success-message' );
  if ( existingSuccess ) {
    existingSuccess.remove();
  }

  const successElement = document.createElement( 'span' );
  successElement.className = 'form__field-success-message';
  if ( emphasis ) {
    successElement.appendChild( document.createTextNode( message ) );
    const emphasisElement = document.createElement( 'span' );
    emphasisElement.className = 'form__field-success-message-emphasis';
    emphasisElement.textContent = emphasis;
    successElement.appendChild( emphasisElement );
  }
  else {
    successElement.textContent = message;
  }
  field.parentElement?.appendChild( successElement );
}

/**
 * Clear success message from field
 */
export function clearFieldSuccess( field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement ): void {
  const successMessage = field.parentElement?.querySelector( '.form__field-success-message' );
  if ( successMessage ) {
    successMessage.remove();
  }
}

/**
 * Prepare sanitized form data
 */
export function prepareFormData( form: HTMLFormElement ): Record<string, string> {
  const formData = new FormData( form );
  const sanitized: Record<string, string> = {};

  for ( const [ key, value ] of formData.entries() ) {
    if ( typeof value === 'string' ) {
      const cleaned = sanitizeInput( value );
      sanitized[ key ] = escapeForDatabase( cleaned );
    }
  }

  return sanitized;
}
