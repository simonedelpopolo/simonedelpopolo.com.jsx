import { css } from '@nutsloop/neonjsx';

interface TocSection {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: TocSection[];
}

export const TableOfContents = ( props: TableOfContentsProps ) => {
  /* component styles */
  css( './css/components/index/table-of-contents.css' );

  /* toggle functionality */
  if ( typeof document !== 'undefined' ) {
    document.addEventListener( 'click', ( e: MouseEvent ) => {
      const target = e.target as HTMLElement;
      if ( target && target.id === 'toc-toggle' ) {
        const nav = document.querySelector( '.toc__nav' );
        if ( nav ) {
          const isOpen = nav.classList.toggle( 'toc__nav--open' );
          target.textContent = isOpen ? '\u25BE' : '\u25B8'; // ▾ or ▸
          target.setAttribute( 'aria-expanded', String( isOpen ) );
        }
      }
    } );
  }

  return (
    <aside class="toc" aria-label="Table of contents">
      <button
        id="toc-toggle"
        class="toc__toggle"
        type="button"
        aria-label="Toggle table of contents"
        aria-expanded="false"
      >
        ▸
      </button>
      <nav class="toc__nav">
        <h2 class="toc__title">On this page</h2>
        <ul class="toc__list">
          {props.sections.map( section => (
            <li class="toc__item">
              <a href={`#${section.id}`} class="toc__link">
                {section.title}
              </a>
            </li>
          ) )}
        </ul>
      </nav>
    </aside>
  );
};
