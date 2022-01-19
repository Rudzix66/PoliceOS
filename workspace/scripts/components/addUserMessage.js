function addUserMessage ()
{
  const html = u( `
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
    `);
  return html;
}

export default addUserMessage;