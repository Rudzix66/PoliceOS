const policeManName = document.getElementById("policeManName");
const policeManRank = document.getElementById("policeManRank");

let userName = "";
let userRank = "";

function checkUserData() {
  if (userName == "" || userRank == "") {
    userName = prompt("Podaj swoje imię");
    userRank = prompt("Podaj swoją rangę");
  }
  if (userName === null || userRank === null) {
      alert("Nie podano danych!");

    policeManRank.innerHTML = `Stopień: ${userRank}`;
    policeManName.innerHTML = `Funkcjnariusz: ${userName}`;
  } else{
    policeManRank.innerHTML = `Stopień: ${userRank}`;
    policeManName.innerHTML = `Funkcjnariusz: ${userName}`;
  }
}
checkUserData();

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout)
  };
}
const processChange = debounce(() => {
  const lookedPearson = document.getElementById("SearchPearson").value;
  const pearson = lookedPearson.toString();
  console.log(lookedPearson);
});