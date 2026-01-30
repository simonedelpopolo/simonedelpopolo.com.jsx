export function buildEnrollmentMessage( data: Record<string, string> ): string {
  const lines: string[] = [];
  const used = new Set<string>();
  const exclude = new Set<string>( [ 'password', 'confirmPassword' ] );

  const fullName = [ data.name, data.lastName ].filter( Boolean ).join( ' ' ).trim();
  if ( fullName ) {
    lines.push( `Name: ${fullName}` );
    used.add( 'name' );
    used.add( 'lastName' );
  }

  if ( data.email ) {
    lines.push( `Email: ${data.email}` );
    used.add( 'email' );
  }

  const phone = [ data.countryCode, data.phone ].filter( Boolean ).join( ' ' ).trim();
  if ( phone ) {
    lines.push( `Phone: ${phone}` );
    used.add( 'countryCode' );
    used.add( 'phone' );
  }

  if ( data.street ) {
    lines.push( `Street: ${data.street}` );
    used.add( 'street' );
  }
  if ( data.city ) {
    lines.push( `City: ${data.city}` );
    used.add( 'city' );
  }
  if ( data.zip ) {
    lines.push( `ZIP/Postal: ${data.zip}` );
    used.add( 'zip' );
  }
  if ( data.country ) {
    lines.push( `Country: ${data.country}` );
    used.add( 'country' );
  }

  if ( data.vat ) {
    lines.push( `VAT: ${data.vat}` );
    used.add( 'vat' );
  }
  if ( data.ssn ) {
    lines.push( `SSN/Tax ID: ${data.ssn}` );
    used.add( 'ssn' );
  }
  if ( data.products ) {
    lines.push( `Products: ${data.products}` );
    used.add( 'products' );
  }

  if ( 'privacyAccepted' in data ) {
    lines.push( `Privacy Accepted: ${data.privacyAccepted ? 'yes' : 'no'}` );
    used.add( 'privacyAccepted' );
  }
  if ( 'termsAccepted' in data ) {
    lines.push( `Terms Accepted: ${data.termsAccepted ? 'yes' : 'no'}` );
    used.add( 'termsAccepted' );
  }
  if ( 'mailingList' in data ) {
    lines.push( `Mailing List: ${data.mailingList ? 'yes' : 'no'}` );
    used.add( 'mailingList' );
  }

  for ( const [ key, value ] of Object.entries( data ) ) {
    if ( ! value || exclude.has( key ) || used.has( key ) ) {
      continue;
    }
    lines.push( `${key}: ${value}` );
  }

  return lines.join( '\n' );
}
