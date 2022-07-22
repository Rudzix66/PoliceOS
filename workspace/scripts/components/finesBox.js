function finesBox ( o = {
  name: "",
  reason: "",
  description: ""
} )
{
  return u( `
      <div class="fines-box">
        <label>
          <span>Typ:</span>
          <input type="text" name="fines_name" id="fines_name" value="${ o.name }">
        </label>
        <label>
          <span>Wykroczenie:</span>
          <input type="text" name="fines_reason" id="fines_reason" value="${ o.reason }">
        </label>
        <label>
          <span>Notatka:</span>
          <input type="text" name="fines_description" id="fines_description" value="${ o.description }">
        </label>
      </div>
    ` );
}

export default finesBox;