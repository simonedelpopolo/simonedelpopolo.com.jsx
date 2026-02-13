import { sanitizeInput } from './form-validation';

export const CONTACT_MAIL_ENDPOINT = '/api/mail/contact';
export const ENROLL_MAIL_ENDPOINT = '/api/mail/enroll';
export const MAIL_GENERATE_COOKIE_ENDPOINT = '/api/mail/generate_cookie';
export const CONTACT_FORM_SOURCE = 'contact.html';
export const ENROLL_FORM_SOURCE = 'enroll.html';
export const MAIL_COOKIE_NAME = 'neon-mail';
export const MAIL_COOKIE_TTL_MS = 15 * 60 * 1000;

const AUTH_WINDOW_STORAGE_PREFIX = 'mail-auth-expiry:';
const AUTH_WINDOW_CODE_STORAGE_PREFIX = 'mail-auth-code:';
const ensureAuthInFlight = new Map<string, Promise<EnsureMailAuthWindowResult>>();

export interface ContactPayload {
  form: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EnrollPayload {
  form: string;
  name: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  password: string;
  vat: string;
  ssn: string;
  products: string;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  mailingList: boolean;
}

export type EnsureMailAuthWindowResult =
  | {
    ok: true;
    source: 'cache' | 'network';
    expiresAt: number;
    authCode: string | null;
  }
  | {
    ok: false;
    reason: 'http_error' | 'network_error';
    message: string;
    status?: number;
  };

function readFieldValue(
  formData: FormData,
  key: string,
  options: { sanitize?: boolean } = {},
): string {
  const rawValue = formData.get( key );
  if ( typeof rawValue !== 'string' ) {
    return '';
  }

  if ( options.sanitize === false ) {
    return rawValue;
  }

  return sanitizeInput( rawValue );
}

function readCheckboxValue( form: HTMLFormElement, key: string ): boolean {
  const input = form.querySelector( `[name="${key}"]` );

  return input instanceof HTMLInputElement ? input.checked : false;
}

function getEnsureAuthKey(
  endpoint: string,
  cookieName: string,
  ttlMs: number,
): string {
  return `${endpoint}|${cookieName}|${ttlMs}`;
}

async function readErrorMessage( response: Response ): Promise<string> {
  let bodyText = '';
  try {
    bodyText = await response.text();
  }
  catch {
    return `Request failed (${response.status})`;
  }

  if ( ! bodyText ) {
    return `Request failed (${response.status})`;
  }

  try {
    const parsed = JSON.parse( bodyText ) as Record<string, unknown>;
    const error = typeof parsed.error === 'string' ? parsed.error : null;
    const message = typeof parsed.message === 'string' ? parsed.message : null;
    if ( error ) {
      return error;
    }
    if ( message ) {
      return message;
    }
  }
  catch {
    // Keep plain text as-is.
  }

  return bodyText;
}

function clearAuthWindowExpiry( cookieName: string ): void {
  if ( typeof sessionStorage === 'undefined' ) {
    return;
  }

  try {
    sessionStorage.removeItem( getAuthWindowStorageKey( cookieName ) );
    sessionStorage.removeItem( getAuthWindowCodeStorageKey( cookieName ) );
  }
  catch {
    // Ignore storage failures in restricted browser contexts.
  }
}

export function getAuthWindowStorageKey( cookieName: string = MAIL_COOKIE_NAME ): string {
  return `${AUTH_WINDOW_STORAGE_PREFIX}${cookieName}`;
}

export function getAuthWindowCodeStorageKey( cookieName: string = MAIL_COOKIE_NAME ): string {
  return `${AUTH_WINDOW_CODE_STORAGE_PREFIX}${cookieName}`;
}

export function getAuthWindowExpiry( cookieName: string = MAIL_COOKIE_NAME ): number | null {
  if ( typeof sessionStorage === 'undefined' ) {
    return null;
  }

  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem( getAuthWindowStorageKey( cookieName ) );
  }
  catch {
    return null;
  }

  if ( ! stored ) {
    return null;
  }

  const parsed = Number( stored );
  if ( ! Number.isFinite( parsed ) ) {
    clearAuthWindowExpiry( cookieName );

    return null;
  }

  if ( parsed <= Date.now() ) {
    clearAuthWindowExpiry( cookieName );

    return null;
  }

  return parsed;
}

export function getAuthWindowDisplayCode( cookieName: string = MAIL_COOKIE_NAME ): string | null {
  if ( typeof sessionStorage === 'undefined' ) {
    return null;
  }

  let storedCode: string | null = null;
  try {
    storedCode = sessionStorage.getItem( getAuthWindowCodeStorageKey( cookieName ) );
  }
  catch {
    return null;
  }

  if ( ! storedCode ) {
    return null;
  }

  const trimmed = storedCode.trim();
  if ( trimmed.length === 0 ) {
    return null;
  }

  return trimmed;
}

export function markAuthWindowActive(
  cookieName: string = MAIL_COOKIE_NAME,
  ttlMs: number = MAIL_COOKIE_TTL_MS,
  authCode: string | null = null,
): number {
  const expiresAt = Date.now() + ttlMs;
  if ( typeof sessionStorage !== 'undefined' ) {
    try {
      sessionStorage.setItem( getAuthWindowStorageKey( cookieName ), String( expiresAt ) );
      if ( authCode && authCode.trim().length > 0 ) {
        sessionStorage.setItem( getAuthWindowCodeStorageKey( cookieName ), authCode.trim() );
      }
      else {
        sessionStorage.removeItem( getAuthWindowCodeStorageKey( cookieName ) );
      }
    }
    catch {
      // Ignore storage failures in restricted browser contexts.
    }
  }

  return expiresAt;
}

export function hasActiveAuthWindow( cookieName: string = MAIL_COOKIE_NAME ): boolean {
  return getAuthWindowExpiry( cookieName ) !== null;
}

export function buildContactPayload( form: HTMLFormElement ): ContactPayload {
  const formData = new FormData( form );

  return {
    form: CONTACT_FORM_SOURCE,
    name: readFieldValue( formData, 'name' ),
    email: readFieldValue( formData, 'email' ),
    subject: readFieldValue( formData, 'subject' ),
    message: readFieldValue( formData, 'message' ),
  };
}

export function buildEnrollPayload( form: HTMLFormElement ): EnrollPayload {
  const formData = new FormData( form );

  return {
    form: ENROLL_FORM_SOURCE,
    name: readFieldValue( formData, 'name' ),
    lastName: readFieldValue( formData, 'lastName' ),
    email: readFieldValue( formData, 'email' ),
    countryCode: readFieldValue( formData, 'countryCode' ),
    phone: readFieldValue( formData, 'phone' ),
    street: readFieldValue( formData, 'street' ),
    city: readFieldValue( formData, 'city' ),
    zip: readFieldValue( formData, 'zip' ),
    country: readFieldValue( formData, 'country' ),
    password: readFieldValue( formData, 'password', { sanitize: false } ),
    vat: readFieldValue( formData, 'vat' ),
    ssn: readFieldValue( formData, 'ssn' ),
    products: readFieldValue( formData, 'products' ),
    privacyAccepted: readCheckboxValue( form, 'privacyAccepted' ),
    termsAccepted: readCheckboxValue( form, 'termsAccepted' ),
    mailingList: readCheckboxValue( form, 'mailingList' ),
  };
}

export async function ensureMailAuthWindow(
  endpoint: string = MAIL_GENERATE_COOKIE_ENDPOINT,
  cookieName: string = MAIL_COOKIE_NAME,
  ttlMs: number = MAIL_COOKIE_TTL_MS,
): Promise<EnsureMailAuthWindowResult> {
  const cachedExpiry = getAuthWindowExpiry( cookieName );
  if ( cachedExpiry ) {
    return {
      ok: true,
      source: 'cache',
      expiresAt: cachedExpiry,
      authCode: getAuthWindowDisplayCode( cookieName ),
    };
  }

  const ensureKey = getEnsureAuthKey( endpoint, cookieName, ttlMs );
  const inFlightRequest = ensureAuthInFlight.get( ensureKey );
  if ( inFlightRequest ) {
    return inFlightRequest;
  }

  const requestPromise = ( async (): Promise<EnsureMailAuthWindowResult> => {
    try {
      const response = await fetch( endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'same-origin',
      } );

      if ( ! response.ok ) {
        return {
          ok: false,
          reason: 'http_error',
          message: await readErrorMessage( response ),
          status: response.status,
        };
      }

      let authCode: string | null = null;
      try {
        const payload = await response.json() as Record<string, unknown>;
        if ( typeof payload.authCode === 'string' && payload.authCode.trim().length > 0 ) {
          authCode = payload.authCode.trim();
        }
      }
      catch {
        authCode = null;
      }

      return {
        ok: true,
        source: 'network',
        expiresAt: markAuthWindowActive( cookieName, ttlMs, authCode ),
        authCode,
      };
    }
    catch ( error ) {
      return {
        ok: false,
        reason: 'network_error',
        message: error instanceof Error ? error.message : 'Network request failed',
      };
    }
    finally {
      ensureAuthInFlight.delete( ensureKey );
    }
  } )();

  ensureAuthInFlight.set( ensureKey, requestPromise );

  return requestPromise;
}
