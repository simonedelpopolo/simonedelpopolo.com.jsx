import { lazyOnDemand, render, Suspense } from '@nutsloop/neonjsx';

import { AnimationBox } from './components/AnimationBox';
import { Sonar } from './components/pointer/Sonar';
import { Spinner } from './components/Spinner';
import { markAssetsReady } from './scripts/assets-ready';
import { asDefaultExport } from './scripts/lazy-utils';

const About = lazyOnDemand( asDefaultExport( () => import( './pages/About.js' ), mod => mod.About ) );
const Chat = lazyOnDemand( asDefaultExport( () => import( './pages/Chat.js' ), mod => mod.Chat ) );
const Contact = lazyOnDemand( asDefaultExport( () => import( './pages/Contact.js' ), mod => mod.Contact ) );
const Enroll = lazyOnDemand( asDefaultExport( () => import( './pages/Enroll.js' ), mod => mod.Enroll ) );
const Index = lazyOnDemand( asDefaultExport( () => import( './pages/Index.js' ), mod => mod.Index ) );
const NotFound = lazyOnDemand( asDefaultExport( () => import( './pages/NotFound.js' ), mod => mod.NotFound ) );

function bootstrap() {

  console.trace( '[app] bootstrap:start' );
  const root = document.getElementById( 'root' );
  if ( ! root ) {
    console.trace( '[app] bootstrap:root-missing' );

    return;
  }

  const shouldDebugDom = () => {
    const params = new URLSearchParams( window.location.search );
    if ( params.get( 'debug' ) === 'dom' ) {
      return true;
    }
    try {
      return localStorage.getItem( 'sdp-debug-dom' ) === 'true';
    }
    catch {
      return false;
    }
  };

  const initRootObserver = ( target: HTMLElement ) => {
    const win = window as any;
    if ( win.__NEON_ROOT_OBSERVER ) {
      return;
    }

    const elementPath = ( node: Node | null ) => {
      if ( ! node || node.nodeType !== 1 ) {
        return '';
      }
      const parts: string[] = [];
      let el = node as HTMLElement | null;
      while ( el && el.nodeType === 1 && parts.length < 6 ) {
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className ? `.${String( el.className ).trim().replace( /\s+/g, '.' )}` : '';
        parts.unshift( `${el.tagName.toLowerCase()}${id}${cls}` );
        el = el.parentElement;
      }

      return parts.join( ' > ' );
    };

    const observer = new MutationObserver( ( mutations ) => {
      mutations.forEach( ( mutation ) => {
        const info: Record<string, unknown> = {
          type: mutation.type,
          target: elementPath( mutation.target ),
        };

        if ( mutation.type === 'attributes' ) {
          info.attributeName = mutation.attributeName || '';
          info.oldValue = mutation.oldValue || null;
          const el = mutation.target as HTMLElement;
          info.newValue = mutation.attributeName ? el.getAttribute( mutation.attributeName ) : null;
        }

        if ( mutation.type === 'childList' ) {
          info.added = Array.from( mutation.addedNodes || [] ).map( node => elementPath( node ) );
          info.removed = Array.from( mutation.removedNodes || [] ).map( node => elementPath( node ) );
        }

        if ( mutation.type === 'characterData' ) {
          info.text = mutation.target.textContent || '';
        }

        console.trace( '[observer] mutation', info );
      } );
    } );

    observer.observe( target, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
    } );

    win.__NEON_ROOT_OBSERVER = observer;
    console.trace( '[observer] started' );
  };

  if ( shouldDebugDom() ) {
    initRootObserver( root );
  }

  document.documentElement.setAttribute( 'data-assets-ready', 'false' );

  const neonStatus = ( window as any ).__NEON_STATUS;
  const neonPath = ( window as any ).__NEON_PATH || window.location.pathname;
  console.trace( '[app] bootstrap:route', { neonPath, neonStatus } );

  const resolveBootTheme = () => {
    const attributeTheme = document.documentElement.getAttribute( 'data-theme' );
    if ( attributeTheme === 'dark' || attributeTheme === 'light' ) {
      return attributeTheme;
    }

    let stored: string | null = null;
    try {
      stored = localStorage.getItem( 'sdp-theme' );
    }
    catch {
      stored = null;
    }

    if ( stored === 'dark' || stored === 'light' ) {
      return stored;
    }

    if ( stored === 'system' || ! stored ) {
      return window.matchMedia && window.matchMedia( '(prefers-color-scheme: light)' ).matches ? 'light' : 'dark';
    }

    return 'dark';
  };

  const ensureBootLoader = () => {
    let loader = document.getElementById( 'boot-loader' );
    if ( ! loader ) {
      const theme = resolveBootTheme();
      loader = document.createElement( 'div' );
      loader.id = 'boot-loader';
      loader.style.position = 'fixed';
      loader.style.inset = '0';
      loader.style.zIndex = '9999';
      loader.style.display = 'flex';
      loader.style.alignItems = 'center';
      loader.style.justifyContent = 'center';
      loader.style.background = theme === 'light' ? '#f0f0f5' : '#0a0a0f';
      loader.style.color = theme === 'light' ? '#1a1a2e' : '#e0e0f0';
      loader.style.pointerEvents = 'none';
      document.body.appendChild( loader );
      render( <Spinner message="Loading page..." />, loader );
    }

    return loader;
  };

  ensureBootLoader();

  const ensureOverlayRoot = () => {
    let overlayRoot = document.getElementById( 'overlay-root' );
    if ( ! overlayRoot ) {
      overlayRoot = document.createElement( 'div' );
      overlayRoot.id = 'overlay-root';
      document.body.appendChild( overlayRoot );
    }

    return overlayRoot;
  };

  render( [ <AnimationBox />, <Sonar /> ], ensureOverlayRoot() );

  const renderPage = ( Page: any, props: Record<string, unknown> = {} ) => {
    console.trace( '[app] renderPage:start', { Page, props, neonPath, neonStatus } );
    const loadPromise = Page && typeof Page.__load === 'function'
      ? Promise.resolve( Page.__load() )
      : Promise.resolve();
    console.trace( '[app] renderPage:load-called', { hasLoad: Page && typeof Page.__load === 'function' } );

    render(
      <Suspense fallback={<Spinner message="Loading page..." />}>
        <Page {...props} />
      </Suspense>,
      root
    );
    console.trace( '[app] renderPage:rendered' );

    loadPromise
      .then( ( resolved ) => {
        console.trace( '[app] renderPage:load:resolved', resolved );
      } )
      .catch( ( error ) => {
        console.trace( '[app] renderPage:load:rejected', error );
      } )
      .finally( () => {
        console.trace( '[app] renderPage:load:finalized' );
        void markAssetsReady().then( () => {
          const loader = document.getElementById( 'boot-loader' );
          if ( loader ) {
            loader.remove();
          }
        } );
      } );
  };

  if ( neonStatus === 404 ) {
    console.trace( '[app] route:404' );
    renderPage( NotFound, { path: neonPath } );

    return;
  }

  /* contact route check */
  if ( neonPath === '/contact.html' ) {
    console.trace( '[app] route:contact' );
    renderPage( Contact );

    return;
  }

  /* chat route check */
  if ( neonPath === '/chat.html' || neonPath === '/chat' ) {
    console.trace( '[app] route:chat' );
    renderPage( Chat );

    return;
  }

  /* enroll route check */
  if ( neonPath === '/enroll.html' ) {
    console.trace( '[app] route:enroll' );
    renderPage( Enroll );

    return;
  }

  /* about route check */
  if ( neonPath === '/about.html' || neonPath === '/about' ) {
    console.trace( '[app] route:about' );
    renderPage( About );

    return;
  }

  console.trace( '[app] route:index' );
  renderPage( Index );
}

document.addEventListener( 'DOMContentLoaded', () => {
  console.trace( '[app] dom:content-loaded' );
  bootstrap();
} );
