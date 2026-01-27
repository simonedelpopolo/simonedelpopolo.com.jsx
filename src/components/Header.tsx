import { css } from '@nutsloop/neonjsx';

import { initTheme } from '../scripts/theme-toggler';
import { LanguageSelector } from './LanguageSelector';
import { SearchBox } from './SearchBox';

declare const __SIMONEDELPOPOLO_TLD__: string;

export const Header = () => {

  const _tld = typeof __SIMONEDELPOPOLO_TLD__ !== 'undefined' ? __SIMONEDELPOPOLO_TLD__ : '.host';

  /* detect current page */
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isContactPage = currentPath === '/contact.html' || currentPath === '/contact';

  /* fonts */
  css( './css/fonts/orbitron.css' );
  css( './css/fonts/share-tech-mono.css' );
  css( './css/fonts/syncopate.css' );
  /* theme */
  css( './css/theme.css' );
  /* component styles */
  css( './css/components/header.css' );

  /* initialize theme system */
  initTheme();

  /* mobile menu toggle - use event delegation */
  if ( typeof document !== 'undefined' ) {
    document.addEventListener( 'click', ( e: MouseEvent ) => {
      const target = e.target as HTMLElement;
      if ( target && target.id === 'menu-toggle' ) {
        const nav = document.getElementById( 'mobile-nav' );
        if ( nav ) {
          const isOpen = nav.classList.toggle( 'header__nav--open' );
          target.textContent = isOpen ? '\u25B8' : '\u25BC'; // ▸ or ▼
          target.setAttribute( 'aria-expanded', String( isOpen ) );
        }
      }
    } );
  }

  return (
    <header class="header" aria-label="Site header">
      <div class="header__brand">
        <a href={`index.html`} class="header__logo-link" aria-label="Home">
          <picture class="header__logo">
            <source srcset="./media/components/header/logo-light.svg" media="(prefers-color-scheme: light)" />
            <img src="./media/components/header/logo-dark.svg" alt="S logo" width="40" height="40" />
          </picture>
        </a>
        <a href={`index.html`} class="header__name">
          Simone Del Popolo
        </a>
      </div>

      <nav id="mobile-nav" class="header__nav" aria-label="Main navigation">
        <ul class="header__nav-list">
          <li><a href={`blog.html`} class="header__nav-link">Blog</a></li>
          <li><a href={`projects.html`} class="header__nav-link">Projects</a></li>
          <li><a href={`about.html`} class="header__nav-link">About</a></li>
        </ul>
      </nav>

      <SearchBox />

      <div class="header__actions">
        <LanguageSelector />
        <button
          id="theme-toggle"
          class="header__theme-toggle"
          type="button"
          aria-label="Toggle theme"
          title="System theme. Click for Dark."
        >
          ◐
        </button>
        <a
          href={isContactPage ? undefined : `contact.html`}
          class={`header__cta${isContactPage ? ' header__cta--disabled' : ''}`}
          aria-disabled={isContactPage ? 'true' : undefined}
          onClick={isContactPage ? ( e: MouseEvent ) => e.preventDefault() : undefined}
        >
          Contact
        </a>
        <button
          id="menu-toggle"
          class="header__menu-toggle"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="mobile-nav"
        >
          ▼
        </button>
      </div>
    </header>
  );
};
