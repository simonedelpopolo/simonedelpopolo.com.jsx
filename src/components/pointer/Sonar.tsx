import { css } from '@nutsloop/neonjsx';

export const Sonar = () => {
  /* theme */
  css( './css/theme.css' );
  /* component styles */
  css( './css/components/pointer/sonar.css' );

  /* track mouse position - visibility controlled by CSS via body classes */
  if ( typeof document !== 'undefined' && ! ( document as unknown as { __sonarBound?: boolean } ).__sonarBound ) {
    ( document as unknown as { __sonarBound?: boolean } ).__sonarBound = true;

    const updatePosition = ( e: MouseEvent ) => {
      const pointer = document.getElementById( 'sonar' );
      if ( pointer ) {
        pointer.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    document.addEventListener( 'mousemove', updatePosition );
    document.addEventListener( 'click', updatePosition );
  }

  return <div id="sonar" class="sonar" aria-hidden="true"></div>;
};
