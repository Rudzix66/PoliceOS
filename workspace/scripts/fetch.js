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
const get = ( url, object = {}, type = null ) =>
{
  if ( Object.keys( object ).length )
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
  }
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
const post = ( url, object = {}, type = null ) =>
{
  return fetch( url, {
    method: "POST",
    body: URLParams( object )
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
