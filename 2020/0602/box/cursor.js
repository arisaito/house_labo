window.addEventListener("load", function () {
  $.scrollify({ section: ".box" });

  let bg = document.getElementById("body");
  document.addEventListener("mousemove", (event) => {
    let x = Math.round(event.pageX / 50);
    let y = Math.round(event.pageY / 100);

    bg.style.marginLeft = -x + "px";
  });

  let cWidth = 8;
  let fWidth = 40;
  delay = 10;
  mouseX = 0;
  mouseY = 0;
  posX = 0;
  posY = 0;
  TweenMax.to({}, 0.001, {
    repeat: -1,
    onRepeat: function () {
      posX += (mouseX - posX) / delay;
      posY += (mouseY - posY) / delay;
    },
  });

  // get mouse position
  $(document).on("mousemove", function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  });
});
