type AssetsReadyOptions = {
  attribute?: string;
  root?: HTMLElement;
};

const waitForNextFrame = () => {
  console.trace( '[assets-ready] next-frame:start' );

  return new Promise<void>( ( resolve ) => {
    if ( typeof requestAnimationFrame === 'undefined' ) {
      console.trace( '[assets-ready] next-frame:raf-missing' );
      resolve();

      return;
    }
    requestAnimationFrame( () => {
      console.trace( '[assets-ready] next-frame:raf-fired' );
      resolve();
    } );
  } );
};

const waitForFonts = () => {
  console.trace( '[assets-ready] fonts:start' );
  if ( typeof document === 'undefined' ) {
    console.trace( '[assets-ready] fonts:document-missing' );

    return Promise.resolve();
  }

  if ( 'fonts' in document && document.fonts && document.fonts.ready ) {
    console.trace( '[assets-ready] fonts:ready-promise' );

    return document.fonts.ready.catch( () => undefined );
  }

  console.trace( '[assets-ready] fonts:unsupported' );

  return Promise.resolve();
};

const waitForStyleStability = ( idleMs = 120, timeoutMs = 3000 ) => {
  if ( typeof document === 'undefined' ) {
    return Promise.resolve();
  }

  console.trace( '[assets-ready] styles:stability:start', { idleMs, timeoutMs } );

  return new Promise<void>( ( resolve ) => {
    let idleTimer: number | undefined;
    let timeoutTimer: number | undefined;
    const done = () => {
      console.trace( '[assets-ready] styles:stability:done' );
      if ( idleTimer ) {
        window.clearTimeout( idleTimer );
      }
      if ( timeoutTimer ) {
        window.clearTimeout( timeoutTimer );
      }
      observer.disconnect();
      resolve();
    };

    const kick = () => {
      if ( idleTimer ) {
        window.clearTimeout( idleTimer );
      }
      idleTimer = window.setTimeout( done, idleMs );
    };

    const observer = new MutationObserver( ( mutations ) => {
      for ( const mutation of mutations ) {
        mutation.addedNodes.forEach( ( node ) => {
          if ( node instanceof HTMLLinkElement && node.rel === 'stylesheet' ) {
            console.trace( '[assets-ready] styles:added', node.href );
            kick();
          }
          if ( node instanceof HTMLStyleElement ) {
            console.trace( '[assets-ready] styles:inline-added' );
            kick();
          }
        } );
      }
    } );

    observer.observe( document.head, { childList: true } );
    kick();
    timeoutTimer = window.setTimeout( done, timeoutMs );
  } );
};

const isStylesheetReady = ( link: HTMLLinkElement ) => {
  const status = link.getAttribute( 'data-neon-css-status' );
  if ( status === 'loaded' || status === 'error' ) {
    console.trace( '[assets-ready] styles:status', link.href, status );

    return true;
  }

  if ( link.sheet ) {
    try {
      console.trace( '[assets-ready] styles:cssrules-check', link.href );
      void ( link.sheet as CSSStyleSheet ).cssRules;

      return true;
    }
    catch {
      console.trace( '[assets-ready] styles:cssrules-blocked', link.href );

      return false;
    }
  }

  console.trace( '[assets-ready] styles:pending-no-sheet', link.href );

  return false;
};

const waitForStyles = () => {
  console.trace( '[assets-ready] styles:start' );
  if ( typeof document === 'undefined' ) {
    console.trace( '[assets-ready] styles:document-missing' );

    return Promise.resolve();
  }

  return waitForStyleStability().then( () => {
    const links = Array.from( document.querySelectorAll( 'link[rel="stylesheet"]' ) ) as HTMLLinkElement[];
    if ( links.length === 0 ) {
      console.trace( '[assets-ready] styles:none' );

      return Promise.resolve();
    }

    const pending = links.map( ( link ) => {
      if ( isStylesheetReady( link ) ) {
        console.trace( '[assets-ready] styles:sheet-ready', link.href );

        return Promise.resolve();
      }

      return new Promise<void>( ( resolve ) => {
        console.trace( '[assets-ready] styles:pending', link.href );
        const done = () => resolve();
        link.addEventListener( 'load', done, { once: true } );
        link.addEventListener( 'error', done, { once: true } );
      } );
    } );

    return Promise.all( pending ).then( () => undefined );
  } );
};

const waitForImages = () => {
  console.trace( '[assets-ready] images:start' );
  if ( typeof document === 'undefined' ) {
    console.trace( '[assets-ready] images:document-missing' );

    return Promise.resolve();
  }

  const images = Array.from( document.images );
  if ( images.length === 0 ) {
    console.trace( '[assets-ready] images:none' );

    return Promise.resolve();
  }

  const pending = images.map( ( image ) => {
    if ( image.complete ) {
      console.trace( '[assets-ready] images:complete', image.src );

      return Promise.resolve();
    }

    if ( 'decode' in image && typeof image.decode === 'function' ) {
      console.trace( '[assets-ready] images:decode', image.src );

      return image.decode().catch( () => undefined );
    }

    return new Promise<void>( ( resolve ) => {
      console.trace( '[assets-ready] images:pending', image.src );
      const done = () => resolve();
      image.addEventListener( 'load', done, { once: true } );
      image.addEventListener( 'error', done, { once: true } );
    } );
  } );

  return Promise.all( pending ).then( () => undefined );
};

export const markAssetsReady = async ( options: AssetsReadyOptions = {} ) => {
  console.trace( '[assets-ready] mark:start' );
  if ( typeof document === 'undefined' ) {
    console.trace( '[assets-ready] mark:document-missing' );

    return;
  }

  const attribute = options.attribute ?? 'data-assets-ready';
  const target = options.root ?? document.documentElement;

  target.setAttribute( attribute, 'false' );
  console.trace( '[assets-ready] mark:attribute-false', attribute );

  await waitForNextFrame();
  await waitForStyles();
  await waitForNextFrame();
  await Promise.all( [
    waitForFonts(),
    waitForImages(),
  ] );

  target.setAttribute( attribute, 'true' );
  console.trace( '[assets-ready] mark:attribute-true', attribute );
};
