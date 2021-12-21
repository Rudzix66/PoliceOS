( function ()
{
  const userName = document.querySelector( "#user-name" );
  const userStatus = document.querySelector( "#user-status" );
  const localUser = localStorage.getItem( "user" );
  const userData = document.querySelector( ".user-data" );
  const editUserInfo = document.querySelector( ".edit-user-info" );
  const search = document.querySelector( '#search' );

  if ( localUser )
  {
    const userData = JSON.parse( localUser );
    userName.textContent = userData.name;
    userStatus.textContent = userData.status;
  } else
  {
    indexAlertBox();
  }

  editUserInfo.addEventListener( "click", () =>
  {
    indexAlertBox();
  } );

  userData.addEventListener( "click", () =>
  {
    const copied = `Funkcjonariusz: ${ userName.textContent.trim() } Stopień: ${ userStatus.textContent.trim() }`;
    navigator.clipboard.writeText( copied );

    indexCoppyMessage()
  } );

  search.addEventListener( "keyup", debounce( () =>
  {
    get( "/users/*", "json" ).then( data =>
    {
      if ( data.code === 200 )
      {
        createUsersSelector( search.value.trim().toLowerCase(), data.data );
      } else
      {
        createUsersSelector( search.value.trim().toLowerCase(), [] );
      }
    } );
  }, 600 ) )

  get( "/users/*", "json" ).then( data =>
  {
    if ( data.code === 200 )
    {
      createUsersSelector( search.value.trim().toLowerCase(), data.data );
    } else
    {
      createUsersSelector( search.value.trim().toLowerCase(), [] );
    }
  } );

} )();

function createUsersSelector ( value, users = [] )
{
  const content = document.querySelector( ".main-view .content" );
  const usersView = content.querySelector( ".wrapper[view=users]" );
  usersView.classList.add( "active" );
  usersView.classList.remove( "grid" );
  usersView.classList.remove( "empty" );
  while ( usersView.firstElementChild )
  {
    usersView.firstElementChild.remove();
  }

  if ( users.length )
  {
    usersView.classList.add( "grid" );
    let filter = users;
    if ( value )
    {
      filter = filter.filter( user => user.fullname.toLowerCase().includes( value ) );
    }
    for ( const user of filter )
    {
      const id = user.id;
      const fullname = user.fullname;
      const html = `<div class="name" data-id="${ id }">${ fullname }</div>`;
      usersView.insertAdjacentHTML( "beforeend", html );
    }
  } else
  {
    usersView.classList.add( "empty" );
    const html = `<div class="empty">Nie znaleziono użytkowników</div>`;
    usersView.insertAdjacentHTML( "beforeend", html );
  }
}
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
        <button type="submit">Zapisz</button>
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

    alertBox.remove();
  } );

  document.body.append( alertBox );

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

function indexCoppyMessage ()
{
  const div = document.createElement( "div" );
  const coppyMess = `
  <div class="coppy-message">
  <div class="box">
    <div class="box-bar">
    </div>
    <div class="box-content">
      <span><strong>Skopiowano dane</strong></span>
      </div>
    </div>
  </div>`;

  div.innerHTML = coppyMess;
  const coppyBoxMessage = div.querySelector( ".coppy-message" );

  setTimeout( () =>
  {
    coppyBoxMessage.remove()
  }, 3000 );

  document.body.append( coppyBoxMessage );
}
