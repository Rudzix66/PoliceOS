function addUserMessage ()
{
  const html = u(`
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
          <label>
            <span>Wpisz Wiek:</span>
            <input type="number" name="age" id="age">
          </label>
          <label>
            <span>Wybierz Płeć:</span>
            <select id="gender" name="gender">
              <option>Kobieta</option>
              <option>Mężczyzna</option>
            </select>
          </label>
          <label>
            <span>Poszukiwany:</span>
            <input type="text" name="status" id="status">
          </label>
          <label>
            <span>Ile razy zatrzymany:</span>
            <input type="number" name="stopped" id="stopped">
          </label>
          <label>
            <span>Pozwolenie na broń:</span>
            <input type="text" name="gun-permit" id="gun-permit">
          </label>
        </div>
        <button type="submit">Dodaj</button>
      </div>
    </div>
    `);
  return html;
}

export default addUserMessage;