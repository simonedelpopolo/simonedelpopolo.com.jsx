import { css } from '@nutsloop/neonjsx';

import { EnrollForm } from '../components/EnrollForm';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { initMailAuthNotice } from '../scripts/mail-auth-notice';

declare const __SIMONEDELPOPOLO_TLD__: string;

export const Enroll = () => {
  const _tld = typeof __SIMONEDELPOPOLO_TLD__ !== 'undefined' ? __SIMONEDELPOPOLO_TLD__ : '.host';

  /* fonts */
  css( './css/fonts/orbitron.css' );
  css( './css/fonts/share-tech-mono.css' );
  css( './css/fonts/intel-one-mono.css' );
  /* theme */
  css( './css/theme.css' );
  css( './css/components/mail-auth-notice.css' );
  /* component styles */
  css( './css/pages/enroll.css' );

  if ( typeof document !== 'undefined' ) {
    setTimeout( () => initMailAuthNotice(), 0 );
  }

  return (
    <>
      <Header />
      <main class="enroll">
        <div class="enroll__container">
          {/* Left column: Information */}
          <aside class="enroll__info">
            <h1 class="enroll__title">Start Your Project</h1>
            <p class="enroll__intro">
              Join our platform to collaborate on cutting-edge web projects.
              Create an account to get started with your journey.
            </p>

            <div class="enroll__benefits">
              <h3 class="enroll__benefits-title">What you get</h3>
              <ul class="enroll__benefits-list">
                <li class="enroll__benefit">
                  <span class="enroll__benefit-icon">✓</span>
                  <span class="enroll__benefit-text">Access to exclusive projects</span>
                </li>
                <li class="enroll__benefit">
                  <span class="enroll__benefit-icon">✓</span>
                  <span class="enroll__benefit-text">Direct collaboration tools</span>
                </li>
                <li class="enroll__benefit">
                  <span class="enroll__benefit-icon">✓</span>
                  <span class="enroll__benefit-text">Priority support</span>
                </li>
                <li class="enroll__benefit">
                  <span class="enroll__benefit-icon">✓</span>
                  <span class="enroll__benefit-text">Project management dashboard</span>
                </li>
              </ul>
            </div>

            <div class="enroll__help">
              <p class="enroll__help-text">
                Already have an account?{' '}
                <a href="login.html" class="enroll__help-link">
                  Sign in
                </a>
              </p>
              <p class="enroll__help-text">
                Need help?{' '}
                <a href={`contact.html`} class="enroll__help-link">
                  Contact us
                </a>
              </p>
            </div>
          </aside>

          {/* Right column: Registration form */}
          <section class="enroll__form-section">
            <EnrollForm />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
