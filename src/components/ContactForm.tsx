import { css } from '@nutsloop/neonjsx';

import {
  buildContactPayload,
  CONTACT_MAIL_ENDPOINT,
  ensureMailAuthWindow,
} from '../scripts/form-mail';
import {
  clearFieldError,
  sanitizeInput,
  showFieldError,
  validateEmail,
  validateField,
  type ValidationRule,
} from '../scripts/form-validation';
import { submitFormWithFeedback } from '../scripts/neonjsx/form-submission';

type ContactFieldName = 'name' | 'email' | 'subject' | 'message';

type ContactFieldElement = HTMLInputElement | HTMLTextAreaElement;

const CONTACT_VALIDATION_RULES: Record<ContactFieldName, ValidationRule> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\u00C0-\u017F'-]+$/,
    errorMessage: 'Name must contain only letters, spaces, hyphens, and apostrophes',
  },
  email: {
    required: true,
    maxLength: 254,
    custom: ( value: string ) => validateEmail( value ),
    errorMessage: 'Please enter a valid email address',
  },
  subject: {
    required: true,
    minLength: 3,
    maxLength: 200,
    pattern: /^[a-zA-Z0-9\s\u00C0-\u017F.,:;!?\'"()\-]+$/,
    errorMessage: 'Subject contains invalid characters',
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    errorMessage: 'Message must be between 10 and 5000 characters',
  },
};

function asContactFieldName( value: string ): ContactFieldName | null {
  if ( value === 'name' || value === 'email' || value === 'subject' || value === 'message' ) {
    return value;
  }

  return null;
}

function validateContactForm( form: HTMLFormElement ): boolean {
  let isValid = true;

  const fields: ContactFieldName[] = [ 'name', 'email', 'subject', 'message' ];
  for ( const fieldName of fields ) {
    const field = form.querySelector( `[name="${fieldName}"]` ) as ContactFieldElement | null;
    if ( ! field ) {
      continue;
    }

    const value = sanitizeInput( field.value );
    const validation = validateField( value, CONTACT_VALIDATION_RULES[ fieldName ] );
    if ( ! validation.valid ) {
      showFieldError( field, validation.error || 'Invalid input' );
      isValid = false;
    }
    else {
      clearFieldError( field );
    }
  }

  return isValid;
}

function bindFieldValidation( form: HTMLFormElement ): void {
  const fields = form.querySelectorAll( '.contact__input, .contact__textarea' );
  fields.forEach( ( fieldNode ) => {
    if ( ! ( fieldNode instanceof HTMLInputElement || fieldNode instanceof HTMLTextAreaElement ) ) {
      return;
    }

    fieldNode.addEventListener( 'blur', () => {
      const fieldName = asContactFieldName( fieldNode.name );
      if ( ! fieldName ) {
        return;
      }

      const value = sanitizeInput( fieldNode.value );
      if ( value.length === 0 ) {
        clearFieldError( fieldNode );

        return;
      }

      const validation = validateField( value, CONTACT_VALIDATION_RULES[ fieldName ] );
      if ( ! validation.valid ) {
        showFieldError( fieldNode, validation.error || 'Invalid input' );
      }
      else {
        clearFieldError( fieldNode );
      }
    } );

    fieldNode.addEventListener( 'input', () => {
      clearFieldError( fieldNode );
    } );
  } );
}

function initFormBehavior( containerSelector: string ): void {
  const form = document.querySelector( `${containerSelector} .contact__form` ) as HTMLFormElement | null;
  if ( ! form ) {
    return;
  }
  if ( form.dataset.bound === 'true' ) {
    return;
  }
  form.dataset.bound = 'true';

  bindFieldValidation( form );

  form.addEventListener( 'submit', async ( event: Event ) => {
    event.preventDefault();

    if ( ! validateContactForm( form ) ) {
      return;
    }

    const payload = buildContactPayload( form );

    await submitFormWithFeedback( {
      _endpoint: CONTACT_MAIL_ENDPOINT,
      _data: payload,
      containerSelector,
      FormComponent: ContactForm,
      successMessage: {
        title: 'Message Sent!',
        body: 'Thank you for reaching out. I\'ll get back to you within 24-48 hours.',
      },
      errorMessage: {
        title: 'Submission Failed',
        body: 'Something went wrong. Please try again.',
      },
      beforeSubmit: async () => {
        const ensure = await ensureMailAuthWindow();
        if ( ensure.ok ) {
          return { ok: true };
        }

        return { ok: false, message: ensure.message };
      },
    } );
  } );
}

export const ContactForm = () => {
  css( './css/components/contact-form.css' );

  if ( typeof document !== 'undefined' ) {
    setTimeout( () => {
      initFormBehavior( '.contact__form-section' );
    }, 0 );
  }

  return (
    <form class="contact__form" action={CONTACT_MAIL_ENDPOINT} method="POST">
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
