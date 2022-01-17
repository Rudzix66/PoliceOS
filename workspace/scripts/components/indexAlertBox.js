function indexAlertBox ()
{
  const div = document.createElement( "div" );
  const html = `
  <div class="alert-box">
    <div class="box">
      <div class="box-bar">
      </div>
      <div class="box-content">
        <label>
          <span>Wpisz imię i nazwisko:</span>
          <input data-name="name" type="text" autocomplete="name">
        </label>
        <label>
          <span>Wpisz stopień:</span>
          <input data-name="status" type="text" autocomplete="status">
        </label>
        <button class="disabled" type="submit">Zapisz</button>
      </div>
    </div>
  </div>
  `;
  div.innerHTML = html;
  const alertBox = div.querySelector( ".alert-box" );
  const inputName = div.querySelector( "input[data-name=name]" );
  const inputStatus = div.querySelector( "input[data-name=status]" );
  const submit = div.querySelector( "button[type=submit]" );
  const userName = document.querySelector( "#user-name" );
  const userStatus = document.querySelector( "#user-status" );
  const hide = {
    targets: alertBox,
    duration: 300,
    opacity: [ 1, 0 ],
    easing: "linear",
    complete: () =>
    {
      alertBox.remove();
    }
  };
  const show = { ...hide };
  show.opacity = [ 0, 1 ];
  show.complete = null;

  [ inputName, inputStatus ].forEach( ( input ) =>
  {
    input.addEventListener( "keyup", debounce( alertInputEvent ) );
    input.addEventListener( "change", debounce( alertInputEvent ) );
  } );

  submit.addEventListener( "click", function ()
  {
    const nameVal = inputName.value.trim();
    const statusVal = inputStatus.value.trim();

    userName.textContent = nameVal;
    userStatus.textContent = statusVal;

    localStorage.setItem(
      "user",
      JSON.stringify( { name: nameVal, status: statusVal } )
    );

    anime( hide );
  } );

  u( alertBox ).on( "click", function ( e )
  {
    if ( e.target === e.currentTarget )
      anime( hide );
  } )

  document.body.append( alertBox );

  anime( show );

  function alertInputEvent ()
  {
    const isEmpty = [ inputName, inputStatus ].every( ( el ) => el.value.trim() );

    if ( !isEmpty )
    {
      submit.classList.add( "disabled" );
    } else
    {
      submit.classList.remove( "disabled" );
    }
  }
}

export default indexAlertBox;