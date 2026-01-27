import { render } from '@nutsloop/neonjsx';

import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Enroll } from './pages/Enroll';
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

  /* contact route check */
  if ( neonPath === '/contact.html' ) {
    render( <Contact />, root );

    return;
  }

  /* enroll route check */
  if ( neonPath === '/enroll.html' ) {
    render( <Enroll />, root );

    return;
  }

  /* about route check */
  if ( neonPath === '/about.html' || neonPath === '/about' ) {
    render( <About />, root );

    return;
  }

  const App = () => <Index />;
  render( <App />, document.getElementById( 'root' )! );
}

document.addEventListener( 'DOMContentLoaded', () => {
  bootstrap();
} );
