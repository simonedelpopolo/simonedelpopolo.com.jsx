const STORAGE_KEY_PREFIX = 'mail-auth-expiry:';
const DEFAULT_COOKIE_NAME = 'sdp-mail-auth';
const DEFAULT_COOKIE_TTL_MS = 5 * 60 * 1000;

type MailAuthNoticeOptions = {
  cookieName?: string;
  ttlMs?: number;
};

function getStorageKey( cookieName: string ): string {
  return `${STORAGE_KEY_PREFIX}${cookieName}`;
}

function getCookie( name: string ): string | null {
  const cookies = document.cookie ? document.cookie.split( ';' ) : [];
  for ( const raw of cookies ) {
    const trimmed = raw.trim();
    if ( trimmed.startsWith( `${name}=` ) ) {
      return decodeURIComponent( trimmed.slice( name.length + 1 ) );
    }
  }

  return null;
}

function formatCountdown( ms: number ): string {
  const clamped = Math.max( 0, ms );
  const totalSeconds = Math.floor( clamped / 1000 );
  const minutes = Math.floor( totalSeconds / 60 );
  const seconds = totalSeconds % 60;

  return `${minutes}:${String( seconds ).padStart( 2, '0' )}`;
}

function resolveExpiry( cookieName: string, ttlMs: number ): number | null {
  const storageKey = getStorageKey( cookieName );
  const cookie = getCookie( cookieName );
  if ( ! cookie ) {
    sessionStorage.removeItem( storageKey );

    return null;
  }

  const stored = sessionStorage.getItem( storageKey );
  if ( stored ) {
    const parsed = Number( stored );
    if ( Number.isFinite( parsed ) && parsed > Date.now() - ttlMs ) {
      return parsed;
    }
  }

  const expiresAt = Date.now() + ttlMs;
  sessionStorage.setItem( storageKey, String( expiresAt ) );

  return expiresAt;
}

function ensureContainer(): HTMLElement | null {
  const existing = document.querySelector( '.mail-auth-notice' ) as HTMLElement | null;
  if ( existing ) {
    return existing;
  }

  const container = document.createElement( 'div' );
  container.className = 'mail-auth-notice';
  container.innerHTML = `
    <div class="mail-auth-notice__inner">
      <div class="mail-auth-notice__title">Auth window active</div>
      <div class="mail-auth-notice__body">
        <span class="mail-auth-notice__label">Countdown:</span>
        <span class="mail-auth-notice__countdown" data-countdown></span>
        <span class="mail-auth-notice__divider">•</span>
        <span class="mail-auth-notice__label">Auth code:</span>
        <span class="mail-auth-notice__code">RECKLESS :D</span>
        <span class="mail-auth-notice__token" data-token></span>
      </div>
    </div>
  `;
  document.body.appendChild( container );

  return container;
}

function removeContainer(): void {
  const existing = document.querySelector( '.mail-auth-notice' );
  if ( existing ) {
    existing.remove();
  }
}

export function initMailAuthNotice( options: MailAuthNoticeOptions = {} ): void {
  if ( typeof document === 'undefined' ) {
    return;
  }

  const cookieName = options.cookieName ?? DEFAULT_COOKIE_NAME;
  const ttlMs = options.ttlMs ?? DEFAULT_COOKIE_TTL_MS;
  const storageKey = getStorageKey( cookieName );
  const cookie = getCookie( cookieName );
  if ( ! cookie ) {
    removeContainer();
    sessionStorage.removeItem( storageKey );

    return;
  }

  const expiresAt = resolveExpiry( cookieName, ttlMs );
  if ( ! expiresAt ) {
    removeContainer();

    return;
  }

  const container = ensureContainer();
  if ( ! container ) {
    return;
  }

  const countdownEl = container.querySelector( '[data-countdown]' ) as HTMLElement | null;
  const tokenEl = container.querySelector( '[data-token]' ) as HTMLElement | null;

  if ( tokenEl ) {
    tokenEl.textContent = `(${cookie.slice( 0, 12 )})`;
  }

  const update = () => {
    const remaining = expiresAt - Date.now();
    if ( remaining <= 0 || ! getCookie( cookieName ) ) {
      removeContainer();
      sessionStorage.removeItem( storageKey );

      return;
    }
    if ( countdownEl ) {
      countdownEl.textContent = formatCountdown( remaining );
    }
  };

  update();
  const timer = window.setInterval( () => {
    if ( ! document.body.contains( container ) ) {
      window.clearInterval( timer );

      return;
    }
    update();
  }, 1000 );
}
