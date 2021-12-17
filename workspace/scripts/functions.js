function debounce ( fn = () => { }, delay = 300 )
{
  let timer;
  return ( ...args ) =>
  {
    window.clearTimeout( timer );
    setTimeout( fn.call( ...args ), delay );
  };
}
