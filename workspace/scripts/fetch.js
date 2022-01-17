function URLParams ( object = {} )
{
  const params = new URLSearchParams();

  for ( const key in object )
  {
    params.append( key, object[ key ] )
  }
  return params;
}
var a = 0
const get = ( url, object = null, type = null ) =>
{
  if ( object instanceof Object )
  {
    const params = [];
    if ( !/\/$/gi.test( url ) )
      url += "/";
    url += "?";
    for ( const key in object )
    {
      params.push( `${ key }=${ object[ key ] }` );
    }
    url += params.join( "&" );
  } else
    type = object;
  return fetch( url, {
    method: "GET",
  } ).then( e =>
  {
    switch ( type )
    {
      case "blob":
        return e.blob();
      case "json":
        return e.json();
      default:
        return e.text();
    }
  } );
};
const post = ( url, object = null, type = null ) =>
{
  const body = object instanceof Object ? URLParams( object ) : null;
  if ( body )
    type = object;
  return fetch( url, {
    method: "POST",
    body
  } ).then( e =>
  {
    switch ( type )
    {
      case "blob":
        return e.blob();
      case "json":
        return e.json();
      default:
        return e.text();
    }
  } );
};
