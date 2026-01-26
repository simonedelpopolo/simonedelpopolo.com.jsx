import { render } from '@nutsloop/neonjsx';

import { Index } from './pages/Index';
import { NotFound } from './pages/NotFound';

function bootstrap() {

  const root = document.getElementById( 'root' );
  if ( ! root ) {
    return;
  }

  const neonStatus = ( window as any ).__NEON_STATUS;
  const neonPath = ( window as any ).__NEON_PATH || window.location.pathname;

  if ( neonStatus === 404 ) {
    render( <NotFound path={neonPath} />, root );

    return;
  }

  const App = () => <Index />;
  render( <App />, document.getElementById( 'root' )! );
}

document.addEventListener( 'DOMContentLoaded', () => {
  bootstrap();
} );
