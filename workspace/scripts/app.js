import finesSelectBox from "./components/finesSelectBox.js";
import indexAlertBox from "./components/indexAlertBox.js";
( function ()
{
  const userName = document.querySelector( "#user-name" );
  const userStatus = document.querySelector( "#user-status" );
  const localUser = localStorage.getItem( "user" );
  const userData = document.querySelector( ".user-data" );
  const editUserInfo = document.querySelector( ".edit-user-info" );
  const mainView = document.querySelector( ".main-view" );
  const search = document.querySelector( '#search' );
  const addPearson = document.querySelector( ".add" )
  const nav = u( ".nav-btn" );
  const backArrow = u( '.back-arrow' )

  backArrow.on( "click", back )

  nav.on( "click", function ()
  {
    const btn = u( this );
    const view = btn.data( "view" );
    const userWrapper = u( ".user-wrapper.active" );
    const userId = parseInt( userWrapper.data( "id" ) );
    const boxes = userWrapper.find( ".box" );
    const length = userWrapper.nodes.length;

    if ( !length )
      return;

    nav.removeClass( "active" );
    btn.addClass( "active" );
    boxes.removeClass( "active" );
    userWrapper.find( `.box.${ view }` ).addClass( "active" );
    loadUserInfo.call( userWrapper, view, userId );
  } )

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

  u( search ).on( "keyup search", debounce( () =>
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
  }, 300 ) )

  loadUsers();

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
          loadUsers();
        } else
        {
          console.log( "użytkownik nie został stworzony" )
        }
      }
      )
    } );

  } )

} )();

function loadUserInfo ( name = "", id = 0 )
{
  if ( !id || isNaN( id ) )
    return;
  get( "/usersInfo", { name, id }, "json" ).then( e =>
  {
    console.log( e )
  } )
}

function loadUsers ()
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
}
function back ()
{
  const mainView = u( ".main-view" );
  const userView = mainView.find( ".wrapper[view=users]" );
  const wrappers = mainView.find( ".wrapper" );
  const nav = u( ".nav-btn" );
  const backArrow = u( ".back-arrow" );

  wrappers.removeClass( "active" );
  userView.addClass( "active" );
  nav.removeClass( "active" );
  backArrow.addClass( "hidden" );
}
function checkUserWrapper ( id )
{
  id = parseInt( id );
  const btn = this;
  const backArrow = u( '.back-arrow' )
  const mainView = u( ".main-view" );
  const wrappers = mainView.find( ".wrapper" );
  const userWrapper = mainView.find( `.user-wrapper[data-id='${ id }']` );
  const length = userWrapper.nodes.length;
  const nav = u( ".nav-btn" );

  if ( length )
  {
    wrappers.removeClass( "active" );
    userWrapper.addClass( "active" );
    u( nav.first() ).trigger( "click" );
  } else
  {
    createUserWrapper( id )
  }

  backArrow.removeClass( "hidden" );

}
function createUserWrapper ( id = 1 )
{

  if ( !id )
    return;

  const nav = u( u( ".nav-btn" ).first() );
  const mainView = u( ".main-view" );
  const content = mainView.find( ".content" );
  const wrappers = content.find( ".wrapper" );
  const wrapper = u( "<div>" )
    .addClass( "wrapper user-wrapper" )
    .data( {
      id
    } ).append( ( prop ) =>
    {
      const className = `box ${ prop.class }`;
      const header = u( "<h1>" ).text( prop.header ).first();
      const hr = u( "<hr>" ).first();
      const br = u( "</br>" ).first();
      const add = u( `
      <div class="name col add">
        <i class="icons" style="font-size: 75px;">add</i>
        <p style="font-size: 20px;">Dodaj</p>
      </div>
      ` ).first(); //Nazwij to tutaj inacze niż wrapper //ok

      add.addEventListener( "click", () =>
      {
        const div = finesSelectBox();
        const finesWrapper = div.first();
        const submit = div.find( "button[type=submit]" );
        const hide = {
          targets: finesWrapper,
          duration: 300,
          opacity: [ 1, 0 ],
          easing: "linear",
          complete: () =>
          {
            finesWrapper.remove();
          }
        };

        div.on( "click", function ( e )
        {
          if ( e.target === e.currentTarget )
            anime( hide );
        } )

        submit.on( "click", function ()
        {
          post( "/usersInfo", {
            action: "add",
            view: "fines",
            name: "test",
            description: "test",
            reason: "test",
            id: 1
          } )
        } )
        u( mainView ).append( div.nodes )
      } )
      return u( "<div>" ).addClass( className ).append( [ header, hr, br, add ] );
    }, [ { class: "fines", header: "Mandaty" }, { class: "arrest", header: "Aresztowania" }, { class: "notes", header: "Notatki" } ] );

  wrappers.removeClass( "active" );
  wrapper.addClass( "active" );
  content.append( wrapper );
  nav.trigger( "click" );
}


function createUsersSelector ( value, users = [] )
{
  const content = u( ".main-view .content" );
  const usersView = content.find( ".wrapper[view=users]" );

  u( usersView ).addClass( "active" ).removeClass( "grid empty" );

  u( usersView ).find( ".name[data-id]" ).remove();
  if ( users.length )
  {
    usersView.addClass( "grid" );
    let filter = users;
    if ( value )
    {
      filter = filter.filter( user => user.fullname.toLowerCase().includes( value ) );
    }
    for ( const user of filter )
    {
      const id = user.id;
      const fullname = user.fullname;
      const html = u( `
      <div class="name col" data-id="${ id }">
        <p class="fullname">${ fullname }</p>
        <div class="row" style="background-color: #333333e6; padding: 8px; letter-spacing: 3px;">
          <i class="icons mandate-icon">Receipt</i>:${ user.fines } | 
          <i class="icons material-icons-outlined">gavel</i>:${ user.arrest }
        </div>
      </div>`)
        .on( "click", () =>
        {
          checkUserWrapper( id );
        } );
      usersView.append( html );
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

// post( "/usersInfo", {
//   action: "add",
//   view: "fines",
//   name: "test",
//   description: "test",
//   reason: "test",
//   id: 1
// } )
// post( "/usersInfo", {
//   action: "update",
//   view: "fines",
//   name: "name",
//   value: 1234,
//   id: 2
// } )
// post( "/usersInfo", {
//   action: "delete",
//   view: "fines",
//   id: 2
// } )