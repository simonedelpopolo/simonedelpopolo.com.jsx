import { css, eject, inject } from '@nutsloop/neonjsx';

import { Spinner } from './Spinner';

/**
 * RFC 5322 compliant email regex
 */
const EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

/**
 * Validation rules
 */
const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\u00C0-\u017F'-]+$/,
    errorMessage: 'Name must contain only letters, spaces, hyphens, and apostrophes',
  },
  email: {
    maxLength: 254,
    pattern: EMAIL_REGEX,
    errorMessage: 'Please enter a valid email address',
  },
  subject: {
    minLength: 3,
    maxLength: 200,
    pattern: /^[a-zA-Z0-9\s\u00C0-\u017F.,:;!?'"()\-]+$/,
    errorMessage: 'Subject contains invalid characters',
  },
  message: {
    minLength: 10,
    maxLength: 5000,
    errorMessage: 'Message must be between 10 and 5000 characters',
  },
};

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput( value: string ): string {
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
function escapeForDatabase( value: string ): string {
  return value
    .replace( /\\/g, '\\\\' )
    .replace( /'/g, '\\\'' )
    .replace( /"/g, '\\"' )
    .replace( /\n/g, '\\n' )
    .replace( /\r/g, '\\r' )
    .replace( /\t/g, '\\t' );
}

/**
 * Validate field
 */
function validateField( name: string, value: string ): { valid: boolean; error?: string } {
  const rules = VALIDATION_RULES[ name as keyof typeof VALIDATION_RULES ] as { minLength: number; maxLength: number; pattern: RegExp; errorMessage: string; };
  if ( ! rules ) {
    return { valid: true };
  }

  if ( ! value || value.trim().length === 0 ) {
    return { valid: false, error: 'This field is required' };
  }

  if ( rules.minLength && value.length < rules.minLength ) {
    return { valid: false, error: `Must be at least ${rules.minLength} characters` };
  }

  if ( rules.maxLength && value.length > rules.maxLength ) {
    return { valid: false, error: `Must be less than ${rules.maxLength} characters` };
  }

  if ( rules.pattern && ! rules.pattern.test( value ) ) {
    return { valid: false, error: rules.errorMessage };
  }

  return { valid: true };
}

/**
 * Show error message
 */
function showError( field: HTMLInputElement | HTMLTextAreaElement, message: string ): void {
  field.classList.add( 'contact__input--error' );

  const existingError = field.parentElement?.querySelector( '.contact__error-message' );
  if ( existingError ) {
    existingError.remove();
  }

  const errorElement = document.createElement( 'span' );
  errorElement.className = 'contact__error-message';
  errorElement.textContent = message;
  field.parentElement?.appendChild( errorElement );
}

/**
 * Clear error message
 */
function clearError( field: HTMLInputElement | HTMLTextAreaElement ): void {
  field.classList.remove( 'contact__input--error' );
  const errorMessage = field.parentElement?.querySelector( '.contact__error-message' );
  if ( errorMessage ) {
    errorMessage.remove();
  }
}

/**
 * Validate all form fields
 */
function validateForm( form: HTMLFormElement ): boolean {
  let isValid = true;
  const fields = [ 'name', 'email', 'subject', 'message' ];

  for ( const fieldName of fields ) {
    const field = form.querySelector( `[name="${fieldName}"]` ) as HTMLInputElement | HTMLTextAreaElement;
    if ( ! field ) {
      continue;
    }

    const value = sanitizeInput( field.value );
    const validation = validateField( fieldName, value );

    if ( ! validation.valid ) {
      showError( field, validation.error || 'Invalid input' );
      isValid = false;
    }
    else {
      clearError( field );
    }
  }

  return isValid;
}

/**
 * Prepare sanitized form data
 */
function prepareFormData( form: HTMLFormElement ): Record<string, string> {
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

/**
 * Initialize form validation and submission
 */
function initFormBehavior( containerSelector: string ): void {
  const form = document.querySelector( `${containerSelector} .contact__form` ) as HTMLFormElement;
  if ( ! form ) {
    return;
  }

  /* Real-time validation on blur */
  const fields = form.querySelectorAll( '.contact__input, .contact__textarea' );
  fields.forEach( ( field ) => {
    field.addEventListener( 'blur', () => {
      const input = field as HTMLInputElement | HTMLTextAreaElement;
      const value = sanitizeInput( input.value );
      const validation = validateField( input.name, value );

      if ( value.length > 0 && ! validation.valid ) {
        showError( input, validation.error || 'Invalid input' );
      }
      else {
        clearError( input );
      }
    } );

    field.addEventListener( 'input', () => {
      clearError( field as HTMLInputElement | HTMLTextAreaElement );
    } );
  } );

  /* Form submission with inject/eject pattern */
  form.addEventListener( 'submit', async ( e: Event ) => {
    e.preventDefault();

    /* Validate all fields */
    if ( ! validateForm( form ) ) {
      return;
    }

    /* Prepare secure form data */
    const _sanitizedData = prepareFormData( form );

    /* Get container for spinner injection */
    const container = document.querySelector( containerSelector ) as HTMLElement | null;
    if ( ! container ) {
      return;
    }

    /* Eject current form */
    await eject( container );

    /* Inject spinner */
    await inject( <Spinner message="Sending your message..." />, container );

    /* Simulate API call with setTimeout (2 seconds) */
    setTimeout( async () => {
      try {
        /* In production, uncomment this and remove setTimeout:
        const response = await fetch( '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( _sanitizedData ),
        } );

        if ( ! response.ok ) {
          throw new Error( 'Submission failed' );
        }
        */

        /* Success - eject spinner, inject success message */
        await eject( container );
        await inject(
          <div class="contact__success">
            <div class="contact__success-icon">✓</div>
            <h3 class="contact__success-title">Message Sent!</h3>
            <p class="contact__success-message">
              Thank you for reaching out. I'll get back to you within 24-48 hours.
            </p>
          </div>,
          container
        );

        /* After 3 seconds, replace with fresh form */
        setTimeout( async () => {
          await eject( container );
          await inject( <ContactForm />, container );
          initFormBehavior( containerSelector );
        }, 3000 );

      }
      catch ( _error ) {
        /* Error - eject spinner, inject error message */
        await eject( container );
        await inject(
          <div class="contact__error-state">
            <div class="contact__error-icon">✗</div>
            <h3 class="contact__error-title">Submission Failed</h3>
            <p class="contact__error-text">
              Something went wrong. Please try again or email directly.
            </p>
            <button
              class="contact__retry-button"
              onClick={async () => {
                await eject( container );
                await inject( <ContactForm />, container );
                initFormBehavior( containerSelector );
              }}
            >
              Try Again
            </button>
          </div>,
          container
        );
      }
    }, 2000 ); /* Fake 2-second delay */
  } );
}

export const ContactForm = () => {
  css( './css/components/contact-form.css' );

  /* Initialize form behavior after render */
  if ( typeof document !== 'undefined' ) {
    setTimeout( () => {
      initFormBehavior( '.contact__form-section' );
    }, 0 );
  }

  return (
    <form class="contact__form" action="/api/contact" method="POST">
      <div class="contact__field">
        <label for="name" class="contact__label">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          class="contact__input"
          required
          minlength="2"
          placeholder="Your name"
        />
      </div>

      <div class="contact__field">
        <label for="email" class="contact__label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          class="contact__input"
          required
          placeholder="your@email.com"
        />
      </div>

      <div class="contact__field">
        <label for="subject" class="contact__label">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          class="contact__input"
          required
          minlength="3"
          placeholder="What's this about?"
        />
      </div>

      <div class="contact__field">
        <label for="message" class="contact__label">Message</label>
        <textarea
          id="message"
          name="message"
          class="contact__textarea"
          rows="6"
          required
          minlength="10"
          placeholder="Your message..."
        />
      </div>

      <button type="submit" class="contact__submit">
        Send Message
      </button>
    </form>
  );
};
