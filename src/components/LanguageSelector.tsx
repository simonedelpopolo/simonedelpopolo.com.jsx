import { css } from '@nutsloop/neonjsx';

export const LanguageSelector = () => {
  /* component styles */
  css( './css/components/lang-selector.css' );

  return (
    <div class="lang-selector">
      <button
        class="lang-selector__button"
        type="button"
        aria-label="Select language"
        aria-haspopup="true"
        disabled
      >
        <span class="lang-selector__icon">◆</span>
        <span class="lang-selector__current">EN</span>
        <span class="lang-selector__arrow">▾</span>
      </button>
    </div>
  );
};
