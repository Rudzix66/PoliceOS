class AlterBox extends HTMLElement
{
  constructor ( data = {} )
  {
    super();
    this.innerHTML = `    
    <div class="alert-box">
            <div class="box">
                <div class="box-bar">
                    ${ replaceEmpty( data.title, "Jakiś tytuł jeśli nie będzie" ) }
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
                    <button type="submit">${ replaceEmpty( data.submit, "Nazwa przycisku" ) }</button>
                </div>
            </div>
        </div>`;
  }

  exampleEvent ()
  {
    this.querySelector( "button" ).addEventListener( "click", () =>
    {
      console.log( "button kliknięty" );
    } )
  }
}

function replaceEmpty ( value, replace )
{
  if ( !value )
  {
    return replace;
  }
  return value;
}

customElements.define( "alter-box", AlterBox );
