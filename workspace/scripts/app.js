(function () {
  const alertBox = document.querySelector(".alert-box");
  const alertInputs = alertBox.querySelectorAll("input");
  const alertBtn = alertBox.querySelector("button");
  const userName = document.querySelector("#user-name");
  const userStatus = document.querySelector("#user-status");
  const localUser = localStorage.getItem("user");
  const editUserInfo = document.querySelector(".edit-user-info");

  if (!localUser) {
    alertInputs.forEach((input) => {
      input.addEventListener("keyup", debounce(alertInputEvent));
      input.addEventListener("change", debounce(alertInputEvent));
    });

    alertBtn.addEventListener("click", function () {
      const name = [...alertInputs].filter(
        (input) => input.dataset.name === "name"
      );
      const status = [...alertInputs].filter(
        (input) => input.dataset.name === "status"
      );
      const nameVal = name[0].value.trim();
      const statusVal = status[0].value.trim();

      userName.textContent = nameVal;
      userStatus.textContent = statusVal;

      localStorage.setItem(
        "user",
        JSON.stringify({ name: nameVal, status: statusVal })
      );

      alertBox.remove();
    });
  } else {
    const userData = JSON.parse(localUser);
    userName.textContent = userData.name;
    userStatus.textContent = userData.status;
    alertBox.remove();
  }

  function alertInputEvent() {
    const isEmpty = [...alertInputs].every((el) => el.value);
    if (!isEmpty) {
      alertBtn.classList.add("disabled");
    } else {
      alertBtn.classList.remove("disabled");
    }
  }

  editUserInfo.addEventListener("click", () => {
    const html ='<div class="alert-box"><div class="box"><div class="box-bar">Wypełnij dane</div><div class="box-content"><label><span>Wpisz imię i nazwisko:</span><input data-name="name" type="text" autocomplete="name"></label><label><span>Wpisz stopień:</span><input data-name="status" type="text" autocomplete="status"></label><button type="submit">Zapisz</button></div></div></div>'
  })

  document.body.insertAdjacentHTML("beforeend",html);
})
();

function debounce(fn = () => {}, delay = 300) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    setTimeout(fn.call(...args), delay);
  };
}
