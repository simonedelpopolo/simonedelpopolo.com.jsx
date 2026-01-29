import { css } from '@nutsloop/neonjsx';

import { Heart } from './Heart';
import { OrnamentalDiamond } from './OrnamentalDiamond';

declare const __SIMONEDELPOPOLO_TLD__: string;

export const Footer = () => {

  const tld = typeof __SIMONEDELPOPOLO_TLD__ !== 'undefined' ? __SIMONEDELPOPOLO_TLD__ : '.host';

  /* fonts */
  css( './css/fonts/orbitron.css' );
  css( './css/fonts/share-tech-mono.css' );
  css( './css/fonts/syncopate.css' );
  /* theme */
  css( './css/theme.css' );
  /* component styles */
  css( './css/components/footer.css' );

  return (
    <footer class="footer" aria-label="Site footer">
      <div class="footer__inner">
        <div class="footer__top">
          <div class="footer__brand">
            <a href={`index.html`} class="footer__logo-link" aria-label="Home">
              <picture class="footer__logo">
                <source srcset="./media/components/header/logo-light.svg" media="(prefers-color-scheme: light)" />
                <img src="./media/components/header/logo-dark.svg" alt="S logo" width="32" height="32" />
              </picture>
              <span class="footer__name">Simone Del Popolo</span>
            </a>
            <p class="footer__tagline">
              Neon-infused web experiences and experiments.
            </p>
          </div>

          <div class="footer__group">
            <h4 class="footer__group-title">Discover</h4>
            <ul class="footer__list">
              <li><a class="footer__link" href={`blog.html`}>Blog</a></li>
              <li><a class="footer__link" href={`projects.html`}>Projects</a></li>
              <li><a class="footer__link" href={`about.html`}>About</a></li>
            </ul>
          </div>

          <div class="footer__group">
            <h4 class="footer__group-title">Connect</h4>
            <ul class="footer__list">
              <li><a class="footer__link" href={`contact.html`}>Contact</a></li>
              <li><a class="footer__link" href={`https://neonsignal.nutsloop${tld}`} target="_blank" rel="noopener">NeonSignal</a></li>
              <li><a class="footer__link" href={`https://nutsloop${tld}`} target="_blank" rel="noopener">Nutsloop</a></li>
            </ul>
          </div>

          <div class="footer__group">
            <h4 class="footer__group-title">Follow</h4>
            <ul class="footer__list">
              <li><a class="footer__link" href="https://github.com/simonedelpopolo" target="_blank" rel="noopener">GitHub</a></li>
              <li><a class="footer__link" href="https://www.instagram.com/simonedelpopolo" target="_blank" rel="noopener">Instagram</a></li>
              <li><a class="footer__link" href="https://x.com/delpopolosimone" target="_blank" rel="noopener">X</a></li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <div class="footer__legal">
            <a class="footer__link footer__legal-link" href={`privacy.html`}>Privacy</a>
            <span class="footer__dot">•</span>
            <a class="footer__link footer__legal-link" href={`terms.html`}>Terms</a>
            <span class="footer__dot">•</span>
            <a class="footer__link footer__legal-link" href={`accessibility.html`}>Accessibility</a>
          </div>
          <div class="footer__credit">
            <span>Made with <Heart /> and </span>
            <span class="footer__credit-phrase">
              <a class="footer__link" href={`https://github.com/nutsloop/neonjsx.js#readme`} target="_blank" rel="noopener">
                NeonJSX
              </a>
              <OrnamentalDiamond />
              <span>riding</span>
              <a
                class="footer__link"
                href={`https://neonsignal.nutsloop${tld}/book/part1-philosophy/index.html`}
                target="_blank"
                rel="noopener"
              >
                neonsignal
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
