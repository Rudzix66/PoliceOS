function finesSelectBox ()
{
  const html = u( `
        <div class="add-fines-wrapper">
        <div class="add-fines">
          <div class="col">
            <label>
              <span>Wybierz</span>
            <label for="reasons"></label>
              <select id="reasons" name="reasonslist">
                <option value="spozywanie-alkoholu-w miejscu-publicznym">Spożywanie alkoholu w miejscu publiczny</option>
                <option>Jazda niesprawnym pojazdem</option>
                <option>License suspended / Jazda z zawieszonym prawem jazdy</option>
                <option>License expired / Jazda z przedawnionym prawem jazdy</option>
                <option>Korzystanie z telefonu na przejściu dla piszych</option>
                <option>Przechodzenie przez jezdnię / torowisko na czerwonym</option>
                <option>Spowodowanie kolizji z innym pojazdem</option>
                <option>Korzystanie z telefonu podczas jazdy</option>
                <option>Jazda pod wpływem alkoholu od 0.2 do 0.5</option>
                <option>Jazda pod wpływem środka odurzającego</option>
                <option>Kradzież poniżej 525 zł</option>
                <option>Utrudnianie funkcjonariuszom wykonywania interwencji</option>
                <option>Wandalizm</option>
                <option>Przejazd na czerwonym świetle (x1)</option>
                <option>Nieustąpienie pierwszeństwa pieszemu na pasach</option>
                <option>Palenie gumy</option>
              </select>
            </label>
            <label>
              <span>Dodaj krótki opis</span>
              <input type="text" name="description">
            </label>
          </div>
          <button type="submit">Dodaj</button>
        </div>
      </div>
      `).first();
  return html;
}

export default finesSelectBox;