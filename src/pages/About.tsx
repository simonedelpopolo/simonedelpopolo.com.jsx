import { css } from '@nutsloop/neonjsx';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export const About = () => {
  /* fonts */
  css( './css/fonts/bungee.css' );
  css( './css/fonts/intel-one-mono.css' );
  css( './css/fonts/share-tech-mono.css' );
  /* theme */
  css( './css/theme.css' );
  /* page styles */
  css( './css/pages/about.css' );

  return (
    <>
      <Header />
      <main class="about">
        <section class="about__hero" aria-labelledby="about-hero-title">
          <div class="about__hero-media" role="img" aria-label="Portrait placeholder">
            <div class="about__hero-subject" aria-hidden="true" />
          </div>

          <div class="about__hero-overlay">
            <p class="about__role">Founder ▸ Systems Architect</p>
            <div id="about-hero-title" class="about__name">Simone Del Popolo</div>
            <p class="about__title">Designing quiet infrastructure for luminous interfaces.</p>
          </div>
        </section>

        <section class="about__bio" aria-labelledby="about-bio-title">
          <div class="about__bio-container">
            <h2 id="about-bio-title" class="about__section-title">Biography</h2>
            <p class="about__bio-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer quis lorem vel
              nisi feugiat convallis. Sed non purus ut libero posuere bibendum. Morbi dictum,
              erat a feugiat cursus, justo purus fermentum magna, vitae luctus massa neque sed
              neque.
            </p>
            <p class="about__bio-text">
              Vivamus commodo, neque ut facilisis tincidunt, nibh sapien varius velit, id
              laoreet arcu ipsum a justo. Curabitur porta, augue ac volutpat tempus, nibh elit
              volutpat eros, nec tristique mi turpis id lorem. Donec sit amet malesuada mi.
            </p>
            <p class="about__bio-text">
              Suspendisse potenti. Aliquam erat volutpat. Praesent at urna sed lectus viverra
              rhoncus. Duis varius, metus at tristique egestas, lorem sem dictum erat, non
              tempus risus dolor vitae odio. Pellentesque habitant morbi tristique senectus et
              netus et malesuada fames ac turpis egestas.
            </p>
          </div>
        </section>

        <section class="about__resources" aria-labelledby="about-resources-title">
          <div class="about__resources-container">
            <h2 id="about-resources-title" class="about__section-title">Resources</h2>
            <p class="about__resources-lead">Selected pathways into the system.</p>

            <div class="about__resources-grid">
              <a class="about__resource-card" href="field-guide.html">
                <h3 class="about__resource-title">Field Guide</h3>
                <p class="about__resource-caption">A compact map of signals, states, and flow.</p>
                <span class="about__resource-meta">Open →</span>
              </a>

              <a class="about__resource-card" href="control-room.html">
                <h3 class="about__resource-title">Control Room</h3>
                <p class="about__resource-caption">Observe the dashboard where decisions become light.</p>
                <span class="about__resource-meta">Enter →</span>
              </a>

              <a class="about__resource-card" href="blueprints.html">
                <h3 class="about__resource-title">Blueprints</h3>
                <p class="about__resource-caption">Reference diagrams for structure, scale, and timing.</p>
                <span class="about__resource-meta">View →</span>
              </a>

              <a class="about__resource-card" href="transmissions.html">
                <h3 class="about__resource-title">Transmissions</h3>
                <p class="about__resource-caption">Short dispatches from the edge of the network.</p>
                <span class="about__resource-meta">Listen →</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
