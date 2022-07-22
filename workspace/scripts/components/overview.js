function overview( o = {
    first_name: "",
    last_name: "",
    birth_date: "",
    age: "",
    gender: "",
    status: "",
    stopped: "",
    gun_permit: "",
  }
) {
  const html = u(`
    <div class="overview">
        <label>
            <span>Imię:</span>
            <input type="text" name="person_name" id="person_name" value="${o.first_name}">
        </label>
        <label>
            <span>Nazwisko:</span>
            <input type="text" name="person_lastname" id="person_lastname" value="${o.last_name}">
        </label>
        <label>
            <span>Data Urodzenia:</span>
            <input type="text" name="person_birth" id="person_birth" value="${o.birth_date}">
        </label>
        <label>
            <span>Wiek:</span>
            <input type="text" name="person_age" id="person_age" value="${o.age}">
        </label>
        <label>
            <span>Płeć:</span>
            <input type="text" name="person_gender" id="person_gender" value="${o.gender}">
        </label>
        ------
        <label>
            <span>Poszukiwany:</span>
            <input type="text" name="person_warrant" id="person_warrant" value="${o.status}">
        </label>
        <label>
            <span>Zatrzymania:</span>
            <input type="text" name="person_stopped" id="person_stapped" value="${o.stopped}">
        </label>
        <label>
            <span>Pozwolenie na broń:</span>
            <input type="text" name="pearson_gun-permit" id="person_gun-permit" value="${o.gun_permit}">
        </label>
    </div>
    `);
    return html;
}

export default overview;