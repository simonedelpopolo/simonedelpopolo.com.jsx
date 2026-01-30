import { css } from '@nutsloop/neonjsx';

import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { initMailAuthNotice } from '../scripts/mail-auth-notice';

export const Contact = () => {
  /* fonts */
  css( './css/fonts/orbitron.css' );
  css( './css/fonts/share-tech-mono.css' );
  css( './css/fonts/intel-one-mono.css' );
  /* theme */
  css( './css/theme.css' );
  css( './css/components/mail-auth-notice.css' );
  /* component styles */
  css( './css/pages/contact.css' );

  if ( typeof document !== 'undefined' ) {
    setTimeout( () => initMailAuthNotice(), 0 );
  }

  return (
    <>
      <Header />
      <main class="contact">
        <div class="contact__container">
          {/* Left column: Contact info */}
          <aside class="contact__info">
            <h1 class="contact__title">Get In Touch</h1>
            <p class="contact__intro">
              Looking to collaborate on a project, discuss web technologies,
              or just say hello? Feel free to reach out through the form or
              via the channels below.
            </p>

            <div class="contact__details">
              <div class="contact__detail-group">
                <h3 class="contact__detail-title">Email</h3>
                <a href="mailto:inbox@simonedelpopolo.com" class="contact__email">
                  inbox@simonedelpopolo.com
                </a>
              </div>

              <div class="contact__detail-group">
                <h3 class="contact__detail-title">Social</h3>
                <ul class="contact__social-list">
                  <li>
                    <a
                      href="https://github.com/simonedelpopolo"
                      class="contact__social-link"
                      target="_blank"
                      rel="noopener"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/simonedelpopolo"
                      class="contact__social-link"
                      target="_blank"
                      rel="noopener"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/delpopolosimone"
                      class="contact__social-link"
                      target="_blank"
                      rel="noopener"
                    >
                      X
                    </a>
                  </li>
                </ul>
              </div>

              <div class="contact__detail-group">
                <h3 class="contact__detail-title">Availability</h3>
                <p class="contact__availability">
                  Timezone: Atlantic/Reykjavík (GMT/UTC+0)<br />
                  Response time: Usually within 24-48 hours<br />
                  Currently open to freelance opportunities and collaborations.
                </p>
              </div>
            </div>
          </aside>

          {/* Right column: Contact form */}
          <section class="contact__form-section">
            <ContactForm />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
