function URLParams ( object = {} )
{
  const params = new URLSearchParams();

  for ( const key in object )
  {
    params.append( key, object[ key ] )
  }
  return params;
}

const get = ( url, type = null ) =>
{
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
