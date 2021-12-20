function URLParams ( object = {} )
{
  const params = new URLSearchParams();

  for ( const key in object )
  {
    params.append( key, object[ key ] )
  }
  return params;
}

const get = ( url, object = {} ) =>
{
  return fetch( url, {
    method: "GET",
    body: URLParams( object )
  } ).then( e => e.json() );
};
const post = ( url, object = {} ) =>
{
  return fetch( url, {
    method: "POST",
    body: URLParams( object )
  } ).then( e => e.json() );
};
