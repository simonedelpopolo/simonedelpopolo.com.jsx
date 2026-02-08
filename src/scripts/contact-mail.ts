import { sanitizeInput } from './form-validation';

export const CONTACT_MAIL_ENDPOINT = '/api/mail/contact';
export const CONTACT_MAIL_GENERATE_COOKIE_ENDPOINT = '/api/mail/generate_cookie';
export const CONTACT_FORM_SOURCE = 'contact.html';
export const CONTACT_COOKIE_NAME = 'neon-mail';
export const CONTACT_COOKIE_TTL_MS = 15 * 60 * 1000;

const AUTH_WINDOW_STORAGE_PREFIX = 'mail-auth-expiry:';

export interface ContactPayload {
  form: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type EnsureContactMailAuthWindowResult =
  | {
    ok: true;
    source: 'cache' | 'network';
    expiresAt: number;
  }
  | {
    ok: false;
    reason: 'http_error' | 'network_error';
    message: string;
    status?: number;
  };

const ensureAuthInFlight = new Map<string, Promise<EnsureContactMailAuthWindowResult>>();

function readFieldValue( formData: FormData, key: string ): string {
  const value = formData.get( key );
  if ( typeof value !== 'string' ) {
    return '';
  }

  return sanitizeInput( value );
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
    // Plain-text response, keep as-is.
  }

  return bodyText;
}

export function getAuthWindowStorageKey( cookieName: string = CONTACT_COOKIE_NAME ): string {
  return `${AUTH_WINDOW_STORAGE_PREFIX}${cookieName}`;
}

export function getAuthWindowExpiry( cookieName: string = CONTACT_COOKIE_NAME ): number | null {
  if ( typeof sessionStorage === 'undefined' ) {
    return null;
  }

  const storageKey = getAuthWindowStorageKey( cookieName );
  const stored = sessionStorage.getItem( storageKey );
  if ( ! stored ) {
    return null;
  }

  const parsed = Number( stored );
  if ( ! Number.isFinite( parsed ) ) {
    sessionStorage.removeItem( storageKey );

    return null;
  }

  if ( parsed <= Date.now() ) {
    sessionStorage.removeItem( storageKey );

    return null;
  }

  return parsed;
}

export function markAuthWindowActive(
  cookieName: string = CONTACT_COOKIE_NAME,
  ttlMs: number = CONTACT_COOKIE_TTL_MS,
): number {
  const expiresAt = Date.now() + ttlMs;
  if ( typeof sessionStorage !== 'undefined' ) {
    sessionStorage.setItem( getAuthWindowStorageKey( cookieName ), String( expiresAt ) );
  }

  return expiresAt;
}

export function hasActiveAuthWindow( cookieName: string = CONTACT_COOKIE_NAME ): boolean {
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

export async function ensureContactMailAuthWindow(
  endpoint: string = CONTACT_MAIL_GENERATE_COOKIE_ENDPOINT,
  cookieName: string = CONTACT_COOKIE_NAME,
  ttlMs: number = CONTACT_COOKIE_TTL_MS,
): Promise<EnsureContactMailAuthWindowResult> {
  const cachedExpiry = getAuthWindowExpiry( cookieName );
  if ( cachedExpiry ) {
    return {
      ok: true,
      source: 'cache',
      expiresAt: cachedExpiry,
    };
  }

  const ensureKey = getEnsureAuthKey( endpoint, cookieName, ttlMs );
  const inFlight = ensureAuthInFlight.get( ensureKey );
  if ( inFlight ) {
    return inFlight;
  }

  const requestPromise = ( async (): Promise<EnsureContactMailAuthWindowResult> => {
    try {
      const response = await fetch( endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'same-origin',
      } );

      if ( response.ok ) {
        return {
          ok: true,
          source: 'network',
          expiresAt: markAuthWindowActive( cookieName, ttlMs ),
        };
      }

      return {
        ok: false,
        reason: 'http_error',
        message: await readErrorMessage( response ),
        status: response.status,
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
