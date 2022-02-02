function overview() {
    const html = u( `
    <div class="overview">
        <label>
            <span>Imię:</span>
            <input type="text" name="person_name" id="person_name" value="${ o.name }">
        </label>
        <label>
            <span>Nazwisko:</span>
            <input type="text" name="person_lastname" id="person_lastname" value="${ o.name }">
        </label>
        <label>
            <span>Data Urodzenia:</span>
            <input type="text" name="person_birth" id="person_birth" value="${ o.birth }">
        </label>
        <label>
            <span>Wiek:</span>
            <input type="text" name="person_age" id="person_age" value="${ o.age }">
        </label>
        <label>
            <span>Płeć:</span>
            <input type="text" name="person_gender" id="person_gender" value="${ o.gender }">
        </label>
        ------
        <label>
            <span>Nakaz Aresztowania:</span>
            <input type="text" name="person_warrant" id="person_warrant" value="${ o.status }">
        </label>
        <label>
            <span>Zatrzymania:</span>
            <input type="text" name="person_stopped" id="person_stapped" value="${ o.stopped }">
        </label>
        <label>
            <span>Zawieszenie:</span>
            <input type="text" name="person_suspension" id="person_suspension" value="${ o.suspension }">
        </label>
        <label>
            <span>Zwolnienie warunkowe:</span>
            <input type="text" name="person_parole" id="person_parole" value="${ o.parole }">
        </label>
    </div>
    `);
    return html
}

export default overview;