(function () {
  const userName = document.querySelector("#user-name");
  const userStatus = document.querySelector("#user-status");
  const localUser = localStorage.getItem("user");
  const userData = document.querySelector(".user-data");
  const editUserInfo = document.querySelector(".edit-user-info");

  if (localUser) {
    const userData = JSON.parse(localUser);
    userName.textContent = userData.name;
    userStatus.textContent = userData.status;
  } else {
    indexAlertBox();
  }

  editUserInfo.addEventListener("click", () => {
    indexAlertBox();
  });

  userData.addEventListener("click", () => {
    const coppiedText = navigator.clipboard.writeText(`Funkcjonariusz: ${userName.value} Stopień: ${userStatus.value}`)
    alert(coppiedText)
  })
  
})();

function indexAlertBox() {
  const div = document.createElement("div");
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
        <button type="submit">Zapisz</button>
      </div>
    </div>
  </div>
  `;
  div.innerHTML = html;
  const alertBox = div.querySelector(".alert-box");
  const inputName = div.querySelector("input[data-name=name]");
  const inputStatus = div.querySelector("input[data-name=status]");
  const submit = div.querySelector("button[type=submit]");
  const userName = document.querySelector("#user-name");
  const userStatus = document.querySelector("#user-status");

  [inputName, inputStatus].forEach((input) => {
    input.addEventListener("keyup", debounce(alertInputEvent));
    input.addEventListener("change", debounce(alertInputEvent));
  });

  submit.addEventListener("click", function () {
    const nameVal = inputName.value.trim();
    const statusVal = inputStatus.value.trim();

    userName.textContent = nameVal;
    userStatus.textContent = statusVal;

    localStorage.setItem(
      "user",
      JSON.stringify({ name: nameVal, status: statusVal })
    );

    alertBox.remove();
  });

  document.body.append(alertBox);

  function alertInputEvent() {
    const isEmpty = [inputName, inputStatus].every((el) => el.value.trim());

    if (!isEmpty) {
      submit.classList.add("disabled");
    } else {
      submit.classList.remove("disabled");
    }
  }
}
