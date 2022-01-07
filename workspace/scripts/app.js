( function ()
{
  const userName = document.querySelector( "#user-name" );
  const userStatus = document.querySelector( "#user-status" );
  const localUser = localStorage.getItem( "user" );
  const userData = document.querySelector( ".user-data" );
  const editUserInfo = document.querySelector( ".edit-user-info" );
  const mainView = document.querySelector( ".main-view" );
  const content = mainView.querySelector( ".content" );
  const search = document.querySelector( '#search' );
  const addPearson = document.querySelector( ".add" )

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
    const content = u( ".main-view .content" );
    const usersView = content.find( ".wrapper[view=users]" );
    const users = u( usersView ).find( ".name[data-id]" );
    const lookingFor = search.value.trim().toLowerCase();

    users.each( user =>
    {
      const userU = u( user );
      const fullname = userU.find( ".fullname" ).text();
      if ( !lookingFor )
        userU.removeClass( "hidden" );
      else
      {
        if ( fullname.toLowerCase().includes( lookingFor ) )
        {
          userU.removeClass( "hidden" );
        } else
        {
          userU.addClass( "hidden" );

        }
      }
    } )
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

  addPearson.addEventListener( "click", () =>
  {
    const html = `
    <div class="add-user-message-wrapper">
      <div class="add-user-message">
        <div class="col">
          <label>
            <span>Wpisz imię:</span>
            <input type="text" name="first_name" id="first_name">
          </label>
          <label>
            <span>Wpisz nazwisko:</span>
            <input type="text" name="last_name" id="last_name">
          </label>
          <label>
            <span>Wybierz datę urodzenia:</span>
            <input type="date" name="birth_date" id="birth_date">
          </label>
        </div>
        <button type="submit">Dodaj</button>
      </div>
    </div>
    `;
    const element = u( html );
    const first_name = element.find( "#first_name" ).first();
    const last_name = element.find( "#last_name" ).first();
    const birth_date = element.find( "#birth_date" ).first();
    const options = {
      targets: element.nodes,
      duration: 300,
      easing: "linear",
    };

    anime( {
      ...options,
      opacity: [ 0, 1 ],
      begin: () =>
      {
        u( mainView ).append( element );
      }
    } )

    element.on( "click", e =>
    {
      if ( e.target === e.currentTarget )
      {
        anime( {
          ...options,
          opacity: [ 1, 0 ],
          complete: () =>
          {
            element.remove();
          }
        } )
      }
    } );

    element.find( "button[type=submit]" ).on( "click", function ()
    {
      const params = {
        action: "add",
        first_name: first_name.value,
        status: "undefined",
        last_name: last_name.value,
        birth_date: birth_date.value,
      };
      console.log( params )
      anime( {
        ...options,
        opacity: [ 1, 0 ],
        complete: () =>
        {
          element.remove();
        }
      } )
      post( "/users", params ).then( data =>
      {
        if ( data.code === 200 )
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
        } else
        {
          console.log( "użytkownik nie został stworzony" )
        }
      }
      )
    } );

  } )

} )();

function createUsersSelector ( value, users = [] )
{
  const content = document.querySelector( ".main-view .content" );
  const usersView = content.querySelector( ".wrapper[view=users]" );

  u( usersView ).addClass( "active" ).removeClass( "grid empty" );

  u( usersView ).find( ".name[data-id]" ).remove();

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
      const html = `
      <div class="name col" data-id="${ id }">
        <p class="fullname">${ fullname }</p>
        <div class="row" style="background-color: #333333e6; padding: 8px; letter-spacing: 3px;">
          <i class="icons mandate-icon">Receipt_long</i>:${ user.fines } | 
          <i class="icons material-icons-outlined">gavel</i>:${ user.arrest }
        </div>
        <!--<span class="user-id"></span>-->
      </div>`;
      usersView.insertAdjacentHTML( "beforeend", html );
    }
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
    console.log( submit );
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

  anime( {
    targets: coppyBoxMessage,
    duration: 600,
    opacity: [ 0, 1 ],
    easing: "linear",
    begin: () =>
    {
      document.body.append( coppyBoxMessage );
    },
    complete: function ()
    {
      anime( {
        targets: coppyBoxMessage,
        opacity: [ 1, 0 ],
        duration: 600,
        delay: 2000,
        complete: () =>
        {
          coppyBoxMessage.remove()
        },
        easing: "linear"
      } )
    }
  } )
}