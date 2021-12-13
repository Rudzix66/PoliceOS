const policeManName = document.getElementById("policeManName");
const policeManRank = document.getElementById("policeManRank");

let userName = "";
let userRank = "";

function checkUserData() {
  while(userName === null || userRank === null || userName === "" || userRank === "")
  if (userName == "" || userRank == "") {
    userName = prompt("Podaj swoje imię");
    userRank = prompt("Podaj swoją rangę");
    if (userName === null || userRank === null) {
      alert("Nie podano danych!");
    }

    policeManRank.innerHTML = `Stopień: ${userRank}`;
    policeManName.innerHTML = `Funkcjnariusz: ${userName}`;
  }
}
checkUserData();

const lookedPearson = document.getElementById("SearchPearson").value;
const pearson = lookedPearson.toString();
