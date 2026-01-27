import { css, lazyOnDemand, Suspense } from '@nutsloop/neonjsx';

import { Spinner } from './Spinner.js';

/* Lazy load NodeTransmission on demand */
const NodeTransmission = lazyOnDemand( () => import( './animation/NodeTransmission.js' ) );

export const AnimationBox = () => {
  /* fonts */
  css( './css/fonts/share-tech-mono.css' );
  /* theme */
  css( './css/theme.css' );
  /* component styles */
  css( './css/components/animation-box.css' );

  if ( typeof document !== 'undefined' ) {
    const body = document.body;
    if ( body && body.dataset.animationBoxBound !== 'true' ) {
      body.dataset.animationBoxBound = 'true';

      const open = () => {
        const overlay = document.getElementById( 'animation-box' );
        if ( ! overlay ) {
          return;
        }
        overlay.classList.add( 'animation-box--visible' );
        overlay.setAttribute( 'aria-hidden', 'false' );
        body.classList.add( 'animation-box--active' );

        /* Trigger lazy load */
        NodeTransmission.__load();
      };

      const close = () => {
        const overlay = document.getElementById( 'animation-box' );
        if ( ! overlay ) {
          return;
        }
        overlay.classList.remove( 'animation-box--visible' );
        overlay.setAttribute( 'aria-hidden', 'true' );
        body.classList.remove( 'animation-box--active' );
      };

      document.addEventListener( 'click', ( e: MouseEvent ) => {
        const target = e.target as HTMLElement | null;
        if ( ! target ) {
          return;
        }

        if ( target.closest( '[data-animation-trigger="nodes"]' ) ) {
          open();

          return;
        }

        if ( target.closest( '[data-animation-close]' ) ) {
          close();
        }
      } );

      document.addEventListener( 'keydown', ( e: KeyboardEvent ) => {
        if ( e.key === 'Escape' ) {
          close();
        }
      } );
    }
  }

  return (
    <div id="animation-box" class="animation-box" aria-hidden="true">
      <div class="animation-box__backdrop" data-animation-close="true"></div>
      <div class="animation-box__panel" role="dialog" aria-modal="true" aria-label="Node communication animation">
        <button class="animation-box__close" type="button" data-animation-close="true" aria-label="Close animation">
          ✕
        </button>
        <div class="animation-box__content">
          <Suspense fallback={<Spinner message="Loading animation..." />}>
            <NodeTransmission />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
