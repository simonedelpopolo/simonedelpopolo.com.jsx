import { css } from '@nutsloop/neonjsx';

import { initMailAuthNotice, type MailAuthNoticeOptions } from '../scripts/mail-auth-notice';

export const MailAuthNotice = ( options: MailAuthNoticeOptions = {} ) => {
  css( './css/components/mail-auth-notice.css' );

  if ( typeof document !== 'undefined' ) {
    setTimeout( () => {
      initMailAuthNotice( options );
    }, 0 );
  }

  return null;
};
