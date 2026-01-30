import { css } from '@nutsloop/neonjsx';

import { buildEnrollmentMessage } from '../scripts/form-mail';
import {
  clearFieldError,
  showFieldSuccess,
  prepareFormData,
  showFieldError,
  validateEmail,
  validateField,
  validatePassword,
  validatePhone,
} from '../scripts/form-validation';
import { submitFormWithFeedback } from '../scripts/neonjsx/form-submission';

/* Country codes for phone */
const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+33', country: 'FR' },
  { code: '+49', country: 'DE' },
  { code: '+39', country: 'IT' },
  { code: '+34', country: 'ES' },
  { code: '+354', country: 'IS' },
  { code: '+46', country: 'SE' },
  { code: '+47', country: 'NO' },
  { code: '+45', country: 'DK' },
];

/* Mock products list */
const PRODUCTS = [
  'Website Development',
  'Mobile App Development',
  'UI/UX Design',
  'API Integration',
  'Database Design',
  'DevOps Services',
  'Consulting',
  'Maintenance & Support',
];

/**
 * Validate form fields
 */
function validateForm( form: HTMLFormElement ): boolean {
  let isValid = true;

  /* Name */
  const nameField = form.querySelector( '[name="name"]' ) as HTMLInputElement;
  if ( nameField ) {
    const validation = validateField( nameField.value.trim(), {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\u00C0-\u017F'-]+$/,
      errorMessage: 'Name must contain only letters, spaces, hyphens, and apostrophes',
    } );
    if ( ! validation.valid ) {
      showFieldError( nameField, validation.error || 'Invalid name' );
      isValid = false;
    }
    else {
      clearFieldError( nameField );
    }
  }

  /* Last Name */
  const lastNameField = form.querySelector( '[name="lastName"]' ) as HTMLInputElement;
  if ( nameField ) {
    const validation = validateField( lastNameField.value.trim(), {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\u00C0-\u017F'-]+$/,
      errorMessage: 'Last Name must contain only letters, spaces, hyphens, and apostrophes',
    } );
    if ( ! validation.valid ) {
      showFieldError( lastNameField, validation.error || 'Invalid name' );
      isValid = false;
    }
    else {
      clearFieldError( lastNameField );
    }
  }

  /* Email */
  const emailField = form.querySelector( '[name="email"]' ) as HTMLInputElement;
  if ( emailField ) {
    const email = emailField.value.trim();
    if ( ! email ) {
      showFieldError( emailField, 'Email is required' );
      isValid = false;
    }
    else if ( ! validateEmail( email ) ) {
      showFieldError( emailField, 'Please enter a valid email address' );
      isValid = false;
    }
    else {
      clearFieldError( emailField );
    }
  }

  /* Phone */
  const phoneField = form.querySelector( '[name="phone"]' ) as HTMLInputElement;
  if ( phoneField ) {
    const phone = phoneField.value.trim();
    if ( ! phone ) {
      showFieldError( phoneField, 'Phone number is required' );
      isValid = false;
    }
    else if ( ! validatePhone( phone ) ) {
      showFieldError( phoneField, 'Please enter a valid phone number' );
      isValid = false;
    }
    else {
      clearFieldError( phoneField );
    }
  }

  /* Address fields */
  const streetField = form.querySelector( '[name="street"]' ) as HTMLInputElement;
  if ( streetField ) {
    const validation = validateField( streetField.value.trim(), {
      required: true,
      minLength: 3,
      errorMessage: 'Street address is required',
    } );
    if ( ! validation.valid ) {
      showFieldError( streetField, validation.error || 'Invalid street' );
      isValid = false;
    }
    else {
      clearFieldError( streetField );
    }
  }

  const cityField = form.querySelector( '[name="city"]' ) as HTMLInputElement;
  if ( cityField ) {
    const validation = validateField( cityField.value.trim(), {
      required: true,
      minLength: 2,
    } );
    if ( ! validation.valid ) {
      showFieldError( cityField, validation.error || 'City is required' );
      isValid = false;
    }
    else {
      clearFieldError( cityField );
    }
  }

  const zipField = form.querySelector( '[name="zip"]' ) as HTMLInputElement;
  if ( zipField ) {
    const validation = validateField( zipField.value.trim(), {
      required: true,
      minLength: 3,
    } );
    if ( ! validation.valid ) {
      showFieldError( zipField, validation.error || 'ZIP/Postal code is required' );
      isValid = false;
    }
    else {
      clearFieldError( zipField );
    }
  }

  const countryField = form.querySelector( '[name="country"]' ) as HTMLInputElement;
  if ( countryField ) {
    const validation = validateField( countryField.value.trim(), {
      required: true,
      minLength: 2,
    } );
    if ( ! validation.valid ) {
      showFieldError( countryField, validation.error || 'Country is required' );
      isValid = false;
    }
    else {
      clearFieldError( countryField );
    }
  }

  /* Password */
  const passwordField = form.querySelector( '[name="password"]' ) as HTMLInputElement;
  const confirmField = form.querySelector( '[name="confirmPassword"]' ) as HTMLInputElement;

  if ( passwordField ) {
    const password = passwordField.value;
    const passwordValidation = validatePassword( password );

    if ( ! passwordValidation.valid ) {
      const message = passwordValidation.errors?.length
        ? `• ${passwordValidation.errors.join( '\n• ' )}`
        : ( passwordValidation.error ? `• ${passwordValidation.error}` : '• Invalid password' );
      showFieldError( passwordField, message );
      isValid = false;
    }
    else {
      clearFieldError( passwordField );
    }

    if ( confirmField ) {
      const confirm = confirmField.value;
      if ( ! confirm ) {
        showFieldError( confirmField, 'Please confirm your password' );
        isValid = false;
      }
      else if ( password !== confirm ) {
        showFieldError( confirmField, 'Passwords do not match' );
        isValid = false;
      }
      else {
        showFieldSuccess( confirmField, 'good job, ', '𓂀' );
      }
    }
  }

  /* SSN */
  const ssnField = form.querySelector( '[name="ssn"]' ) as HTMLInputElement;
  if ( ssnField ) {
    const validation = validateField( ssnField.value.trim(), {
      required: true,
      minLength: 9,
      maxLength: 20,
      errorMessage: 'Please enter a valid SSN',
    } );
    if ( ! validation.valid ) {
      showFieldError( ssnField, validation.error || 'SSN is required' );
      isValid = false;
    }
    else {
      clearFieldError( ssnField );
    }
  }

  /* Checkboxes */
  const privacyCheck = form.querySelector( '[name="privacyAccepted"]' ) as HTMLInputElement;
  if ( privacyCheck && ! privacyCheck.checked ) {
    showFieldError( privacyCheck, 'You must accept the privacy policy' );
    isValid = false;
  }
  else if ( privacyCheck ) {
    clearFieldError( privacyCheck );
  }

  const termsCheck = form.querySelector( '[name="termsAccepted"]' ) as HTMLInputElement;
  if ( termsCheck && ! termsCheck.checked ) {
    showFieldError( termsCheck, 'You must accept the terms and conditions' );
    isValid = false;
  }
  else if ( termsCheck ) {
    clearFieldError( termsCheck );
  }

  /* Products */
  const productsField = form.querySelector( '[name="products"]' ) as HTMLSelectElement;
  if ( productsField && ! productsField.value ) {
    showFieldError( productsField, 'Please select at least one product' );
    isValid = false;
  }
  else if ( productsField ) {
    clearFieldError( productsField );
  }

  return isValid;
}

/**
 * Initialize form behavior
 */
function initFormBehavior( containerSelector: string ): void {
  const form = document.querySelector( `${containerSelector} .enroll__form` ) as HTMLFormElement;
  if ( ! form ) {
    return;
  }
  if ( form.dataset.bound === 'true' ) {
    return;
  }
  form.dataset.bound = 'true';

  /* Real-time validation on blur */
  const fields = form.querySelectorAll( '.enroll__input, .enroll__textarea, .enroll__select' );
  fields.forEach( ( field ) => {
    field.addEventListener( 'blur', () => {
      /* Only validate if field has value */
      const input = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if ( input.value.length > 0 ) {
        validateForm( form );
      }
    } );

    field.addEventListener( 'input', () => {
      clearFieldError( field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement );
    } );
  } );

  /* Form submission */
  form.addEventListener( 'submit', async ( e: Event ) => {
    e.preventDefault();

    /* Validate all fields */
    if ( ! validateForm( form ) ) {
      return;
    }

    /* Prepare secure form data */
    const sanitizedData = prepareFormData( form );
    const fullName = [ sanitizedData.name, sanitizedData.lastName ]
      .filter( Boolean )
      .join( ' ' )
      .trim();
    const payload = {
      name: fullName || sanitizedData.name || '',
      email: sanitizedData.email || '',
      subject: 'Enrollment request',
      message: buildEnrollmentMessage( sanitizedData ),
      form: 'enroll.html',
    };

    /* Submit with feedback */
    await submitFormWithFeedback( {
      _endpoint: '/api/mail',
      _data: payload,
      containerSelector,
      FormComponent: EnrollForm,
      successMessage: {
        title: 'Enrollment Request Sent!',
        body: 'Thanks for reaching out. We will review your request and follow up soon.',
      },
      errorMessage: {
        title: 'Enrollment Failed',
        body: 'Something went wrong. Please try again or contact support.',
      },
    } );
  } );
}

export const EnrollForm = () => {
  css( './css/components/enroll-form.css' );

  /* Initialize form behavior after render */
  if ( typeof document !== 'undefined' ) {
    setTimeout( () => {
      initFormBehavior( '.enroll__form-section' );
    }, 0 );
  }

  return (
    <form class="enroll__form" action="/api/mail" method="POST">

      <div class="enroll__field-group">
        {/* Name */}
        <div class="enroll__field">
          <label for="name" class="enroll__label">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            class="enroll__input"
            required
            placeholder="John"
          />
        </div>

        {/* Last Name */}
        <div class="enroll__field">
          <label for="lastName" class="enroll__label">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            class="enroll__input"
            required
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Email */}
      <div class="enroll__field">
        <label for="email" class="enroll__label">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          class="enroll__input"
          required
          placeholder="your@email.com"
        />
      </div>

      {/* Phone */}
      <div class="enroll__field-group">
        <div class="enroll__field enroll__field--small">
          <label for="countryCode" class="enroll__label">Code *</label>
          <select id="countryCode" name="countryCode" class="enroll__select" required>
            {COUNTRY_CODES.map( item => (
              <option value={item.code}>
                {item.code} ({item.country})
              </option>
            ) )}
          </select>
        </div>
        <div class="enroll__field enroll__field--grow">
          <label for="phone" class="enroll__label">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            class="enroll__input"
            required
            placeholder="1234567890"
          />
        </div>
      </div>

      {/* Address - Street (with Google Maps autocomplete placeholder) */}
      <div class="enroll__field">
        <label for="street" class="enroll__label">Street Address *</label>
        <input
          type="text"
          id="street"
          name="street"
          class="enroll__input"
          required
          placeholder="123 Main Street"
        />
        <span class="enroll__field-hint">Start typing to see suggestions (Google Maps integration)</span>
      </div>

      {/* Address - Other fields */}
      <div class="enroll__field-group">
        <div class="enroll__field">
          <label for="city" class="enroll__label">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            class="enroll__input"
            required
            placeholder="New York"
          />
        </div>
        <div class="enroll__field enroll__field--small">
          <label for="zip" class="enroll__label">ZIP/Postal *</label>
          <input
            type="text"
            id="zip"
            name="zip"
            class="enroll__input"
            required
            placeholder="10001"
          />
        </div>
      </div>

      <div class="enroll__field">
        <label for="country" class="enroll__label">Country *</label>
        <input
          type="text"
          id="country"
          name="country"
          class="enroll__input"
          required
          placeholder="United States"
        />
      </div>

      {/* Password */}
      <div class="enroll__field">
        <label for="password" class="enroll__label">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          class="enroll__input"
          required
          placeholder="Minimum 8 characters"
        />
        <span class="enroll__field-hint">Must include uppercase, lowercase, and number</span>
      </div>

      {/* Confirm Password */}
      <div class="enroll__field">
        <label for="confirmPassword" class="enroll__label">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          class="enroll__input"
          required
          placeholder="Re-enter your password"
        />
      </div>

      {/* VAT Number (optional) */}
      <div class="enroll__field">
        <label for="vat" class="enroll__label">VAT Number (optional)</label>
        <input
          type="text"
          id="vat"
          name="vat"
          class="enroll__input"
          placeholder="EU123456789"
        />
      </div>

      {/* SSN */}
      <div class="enroll__field">
        <label for="ssn" class="enroll__label">SSN/Tax ID *</label>
        <input
          type="text"
          id="ssn"
          name="ssn"
          class="enroll__input"
          required
          placeholder="123-45-6789"
        />
        <span class="enroll__field-hint">Required for both private and company registrations</span>
      </div>

      {/* Products */}
      <div class="enroll__field">
        <label for="products" class="enroll__label">Select Product/Service *</label>
        <select id="products" name="products" class="enroll__select" required>
          <option value="">Choose a product...</option>
          {PRODUCTS.map( product => (
            <option value={product}>{product}</option>
          ) )}
        </select>
      </div>

      {/* Checkboxes */}
      <div class="enroll__checkbox-group">
        <label class="enroll__checkbox-label">
          <input
            type="checkbox"
            name="privacyAccepted"
            class="enroll__checkbox"
            required
          />
          <span class="enroll__checkbox-text">
            I accept the <a href="privacy.html" target="_blank" class="enroll__link">Privacy Policy</a> *
          </span>
        </label>

        <label class="enroll__checkbox-label">
          <input
            type="checkbox"
            name="termsAccepted"
            class="enroll__checkbox"
            required
          />
          <span class="enroll__checkbox-text">
            I accept the <a href="terms.html" target="_blank" class="enroll__link">Terms & Conditions</a> *
          </span>
        </label>

        <label class="enroll__checkbox-label">
          <input
            type="checkbox"
            name="mailingList"
            class="enroll__checkbox"
          />
          <span class="enroll__checkbox-text">
            Subscribe to newsletter (optional)
          </span>
        </label>
      </div>

      <button type="submit" class="enroll__submit">
        Create Account
      </button>
    </form>
  );
};
