/**
 * Form Submission Utilities
 * Reusable form submission handling with spinner and feedback
 */

import { eject, inject } from '@nutsloop/neonjsx';

import { Spinner } from '../../components/Spinner';

/**
 * Submission options interface
 */
export interface SubmissionOptions {
  _endpoint: string;
  _data: Record<string, any>;
  containerSelector: string;
  FormComponent: any;
  successMessage?: {
    title: string;
    body: string;
  };
  errorMessage?: {
    title: string;
    body: string;
  };
  onSuccess?: () => void;
  onError?: ( error: Error ) => void;
  simulateDelay?: number;
  beforeSubmit?: () => Promise<{ ok: boolean; message?: string }> | { ok: boolean; message?: string };
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

async function injectErrorState(
  container: HTMLElement,
  title: string,
  body: string,
  FormComponent: any,
): Promise<void> {
  await eject( container );
  await inject(
    <div class="form__error-state">
      <div class="form__error-icon">✗</div>
      <h3 class="form__error-title">{title}</h3>
      <p class="form__error-text">{body}</p>
      <button
        class="form__retry-button"
        onClick={async () => {
          await eject( container );
          await inject( <FormComponent />, container );
        }}
      >
        Try Again
      </button>
    </div>,
    container
  );
}

/**
 * Submit form with spinner and feedback
 */
export async function submitFormWithFeedback( options: SubmissionOptions ): Promise<void> {
  const {
    _endpoint,
    _data,
    containerSelector,
    FormComponent,
    successMessage = {
      title: 'Success!',
      body: 'Your submission has been received.',
    },
    errorMessage = {
      title: 'Submission Failed',
      body: 'Something went wrong. Please try again.',
    },
    onSuccess,
    onError,
    simulateDelay = 0,
    beforeSubmit,
  } = options;

  const container = document.querySelector( containerSelector ) as HTMLElement | null;
  if ( ! container ) {
    return;
  }

  if ( beforeSubmit ) {
    const beforeSubmitResult = await beforeSubmit();
    if ( ! beforeSubmitResult.ok ) {
      const message = beforeSubmitResult.message || errorMessage.body;
      await injectErrorState( container, errorMessage.title, message, FormComponent );
      if ( onError ) {
        onError( new Error( message ) );
      }

      return;
    }
  }

  /* Eject current form */
  await eject( container );

  /* Inject spinner */
  await inject( <Spinner message="Processing your request..." />, container );

  try {
    const start = performance.now();
    const response = await fetch( _endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify( _data ),
    } );

    if ( ! response.ok ) {
      throw new Error( await readErrorMessage( response ) );
    }

    if ( simulateDelay > 0 ) {
      const elapsed = performance.now() - start;
      if ( elapsed < simulateDelay ) {
        await new Promise( resolve => setTimeout( resolve, simulateDelay - elapsed ) );
      }
    }

    /* Success - eject spinner, inject success message */
    await eject( container );
    await inject(
      <div class="form__success">
        <div class="form__success-icon">✓</div>
        <h3 class="form__success-title">{successMessage.title}</h3>
        <p class="form__success-message">{successMessage.body}</p>
      </div>,
      container
    );

    if ( onSuccess ) {
      onSuccess();
    }

    /* After 3 seconds, replace with fresh form */
    setTimeout( async () => {
      await eject( container );
      await inject( <FormComponent />, container );
    }, 3000 );
  }
  catch ( error ) {
    const errorBody =
      error instanceof Error && error.message
        ? error.message
        : errorMessage.body;

    /* Error - eject spinner, inject error message */
    await injectErrorState( container, errorMessage.title, errorBody, FormComponent );

    if ( onError ) {
      onError( error as Error );
    }
  }
}
