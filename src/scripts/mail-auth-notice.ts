import {
  ensureMailAuthWindow,
  getAuthWindowDisplayCode,
  getAuthWindowExpiry,
  MAIL_COOKIE_NAME,
  MAIL_COOKIE_TTL_MS,
} from './form-mail';

type MailAuthNoticeOptions = {
  cookieName?: string;
  ttlMs?: number;
};

let countdownTimer: number | null = null;

function formatCountdown( ms: number ): string {
  const clamped = Math.max( 0, ms );
  const totalSeconds = Math.floor( clamped / 1000 );
  const minutes = Math.floor( totalSeconds / 60 );
  const seconds = totalSeconds % 60;

  return `${minutes}:${String( seconds ).padStart( 2, '0' )}`;
}

function clearCountdownTimer(): void {
  if ( countdownTimer !== null ) {
    window.clearInterval( countdownTimer );
    countdownTimer = null;
  }
}

function ensureContainer(): HTMLElement | null {
  const existing = document.querySelector( '.mail-auth-notice' ) as HTMLElement | null;
  if ( existing ) {
    if ( existing.parentElement === document.body && document.body.firstElementChild !== existing ) {
      document.body.prepend( existing );
    }

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
        <span class="mail-auth-notice__label">Cookie:</span>
        <span class="mail-auth-notice__token" data-token></span>
      </div>
    </div>
  `;
  document.body.prepend( container );

  return container;
}

function removeContainer(): void {
  const existing = document.querySelector( '.mail-auth-notice' );
  if ( existing ) {
    existing.remove();
  }
}

export async function initMailAuthNotice( options: MailAuthNoticeOptions = {} ): Promise<void> {
  if ( typeof document === 'undefined' ) {
    return;
  }

  const cookieName = options.cookieName ?? MAIL_COOKIE_NAME;
  const ttlMs = options.ttlMs ?? MAIL_COOKIE_TTL_MS;

  const ensureResult = await ensureMailAuthWindow( undefined, cookieName, ttlMs );
  if ( ! ensureResult.ok ) {
    clearCountdownTimer();
    removeContainer();

    return;
  }

  const container = ensureContainer();
  if ( ! container ) {
    return;
  }

  const countdownEl = container.querySelector( '[data-countdown]' ) as HTMLElement | null;
  const tokenEl = container.querySelector( '[data-token]' ) as HTMLElement | null;
  const initialCode = ensureResult.authCode || getAuthWindowDisplayCode( cookieName );
  if ( tokenEl ) {
    tokenEl.textContent = initialCode ? `(${initialCode})` : `(${cookieName})`;
  }

  const update = () => {
    const expiry = getAuthWindowExpiry( cookieName );
    if ( ! expiry ) {
      clearCountdownTimer();
      removeContainer();

      return;
    }

    if ( countdownEl ) {
      countdownEl.textContent = formatCountdown( expiry - Date.now() );
    }
  };

  update();
  clearCountdownTimer();
  countdownTimer = window.setInterval( () => {
    if ( ! document.body.contains( container ) ) {
      clearCountdownTimer();

      return;
    }

    update();
  }, 1000 );
}

export type { MailAuthNoticeOptions };
