function AlterBox ( o = {} )
{
  const html = `
  <div class="alert-box">
      <div class="box">
          <div class="box-bar">
              ${ o.title }
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
  </div>`;
}