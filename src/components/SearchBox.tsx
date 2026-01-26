import { css } from '@nutsloop/neonjsx';

export const SearchBox = () => {
  /* component styles */
  css( './css/components/search-box.css' );

  return (
    <div class="search-box">
      <label class="search-box__label" for="search-input">
        Search
      </label>
      <input
        id="search-input"
        class="search-box__input"
        type="search"
        placeholder="Search..."
        aria-label="Search site"
        disabled
      />
      <span class="search-box__icon">⌕</span>
    </div>
  );
};
