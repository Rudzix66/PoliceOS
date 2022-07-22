function indexCoppyMessage() {
  const div = document.createElement("div");
  const coppyMess = `
  <div class="coppy-message">
  <div class="box">
    <div class="box-bar">
    </div>
    <div class="box-content">
      <span>Skopiowano dane</span>
      </div>
    </div>
  </div>`;

  div.innerHTML = coppyMess;
  const coppyBoxMessage = div.querySelector(".coppy-message");

  anime({
    targets: coppyBoxMessage,
    duration: 600,
    opacity: [0, 1],
    easing: "linear",
    begin: () => {
      document.body.append(coppyBoxMessage);
    },
    complete: function () {
      anime({
        targets: coppyBoxMessage,
        opacity: [1, 0],
        duration: 600,
        delay: 2000,
        complete: () => {
          coppyBoxMessage.remove();
        },
        easing: "linear",
      });
    },
  });
}

export default indexCoppyMessage;