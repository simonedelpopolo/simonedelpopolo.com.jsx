import { css } from '@nutsloop/neonjsx';

declare const __SIMONEDELPOPOLO_TLD__: string;

export const Hero = () => {

  const _tld = typeof __SIMONEDELPOPOLO_TLD__ !== 'undefined' ? __SIMONEDELPOPOLO_TLD__ : '.host';

  /* fonts */
  css( './css/fonts/orbitron.css' );
  css( './css/fonts/share-tech-mono.css' );
  css( './css/fonts/syncopate.css' );
  css( './css/fonts/audiowide.css' );
  /* theme */
  css( './css/theme.css' );
  /* component styles */
  css( './css/components/index/hero.css' );

  /* show custom pointer on hero__art-frame hover */
  if ( typeof document !== 'undefined' && ! ( document as unknown as { __heroArtFrameHover?: boolean } ).__heroArtFrameHover ) {
    ( document as unknown as { __heroArtFrameHover?: boolean } ).__heroArtFrameHover = true;

    document.addEventListener( 'mouseover', ( e: Event ) => {
      const target = e.target as HTMLElement;
      if ( target?.closest( '.hero__art-frame' ) ) {
        document.body.classList.add( 'hero-art-hover' );
      }
    } );

    document.addEventListener( 'mouseout', ( e: Event ) => {
      const target = e.target as HTMLElement;
      const related = ( e as MouseEvent ).relatedTarget as HTMLElement | null;
      if ( target?.closest( '.hero__art-frame' ) && ! related?.closest( '.hero__art-frame' ) ) {
        document.body.classList.remove( 'hero-art-hover' );
      }
    } );
  }

  return (
    <section class="hero" aria-label="Hero">
      <div class="hero__inner">
        <div class="hero__content">
          <p class="hero__eyebrow">Neon Signal Lab</p>
          <h1 class="hero__title">
            Interlinked nodes for bold, luminous web systems.
          </h1>
          <p class="hero__lead">
            Simone Del Popolo builds synth-wave interfaces with clear structure,
            sharp typography, and human-centered motion.
          </p>
          <div class="hero__actions">
            <a class="hero__cta hero__cta--primary" href={`enroll.html`}>
              Start a project
            </a>
            <a class="hero__cta hero__cta--ghost" href={`projects.html`}>
              View projects
            </a>
          </div>
          <div class="hero__meta">
            <div class="hero__meta-item">
              <span class="hero__meta-label">Base</span>
              <span class="hero__meta-value">Rome · Remote</span>
            </div>
            <div class="hero__meta-item">
              <span class="hero__meta-label">Focus</span>
              <span class="hero__meta-value">NeonJSX · UI Systems</span>
            </div>
          </div>
        </div>

        <div class="hero__art">
          <button
            class="hero__art-trigger"
            type="button"
            data-animation-trigger="nodes"
            aria-label="Trigger node communication animation"
          >
            <div class="hero__art-frame">
              <div class="hero__artwork" role="img" aria-label="Interlinked node constellation">
                <img
                  class="hero__artwork-img hero__artwork-img--dark"
                  src="./media/components/index/hero-nodes-dark.svg"
                  alt=""
                  width="520"
                  height="420"
                />
                <img
                  class="hero__artwork-img hero__artwork-img--light"
                  src="./media/components/index/hero-nodes-light.svg"
                  alt=""
                  width="520"
                  height="420"
                />
              </div>
              <div class="hero__art-glow"></div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
