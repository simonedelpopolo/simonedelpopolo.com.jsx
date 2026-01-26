import { css, inject, eject } from '@nutsloop/neonjsx';

import { Spinner } from './Spinner.js';

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

      let contentLoaded = false;

      const loadContent = async () => {
        const contentEl = document.querySelector( '.animation-box__content' );
        if ( ! contentEl || contentLoaded ) {
          return;
        }

        await inject( <Spinner message="Loading animation..." />, contentEl as HTMLElement, { mode: 'replace' } );

        try {
          const { default: NodeTransmission } = await import( './animation/NodeTransmission.js' );
          await inject( <NodeTransmission />, contentEl as HTMLElement, { mode: 'replace' } );
          contentLoaded = true;
        }
        catch ( err ) {
          contentEl.innerHTML = '<div class="animation-box__error">Failed to load animation</div>';
          console.error( 'Failed to load NodeTransmission:', err );
        }
      };

      const open = () => {
        const overlay = document.getElementById( 'animation-box' );
        if ( ! overlay ) {
          return;
        }
        overlay.classList.add( 'animation-box--visible' );
        overlay.setAttribute( 'aria-hidden', 'false' );
        body.classList.add( 'animation-box--active' );
        loadContent();
      };

      const close = async () => {
        const overlay = document.getElementById( 'animation-box' );
        if ( ! overlay ) {
          return;
        }
        overlay.classList.remove( 'animation-box--visible' );
        overlay.setAttribute( 'aria-hidden', 'true' );
        body.classList.remove( 'animation-box--active' );

        const contentEl = document.querySelector( '.animation-box__content' );
        if ( contentEl ) {
          await eject( contentEl as HTMLElement );
          contentLoaded = false;
        }
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
        <div class="animation-box__content"></div>
      </div>
    </div>
  );
};
