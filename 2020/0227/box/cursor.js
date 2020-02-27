window.addEventListener("load", function() {
  $.scrollify({ section: ".box" });

  let bg = document.getElementById("body");
  document.addEventListener("mousemove", event => {
    let x = Math.round(event.pageX / 50);
    let y = Math.round(event.pageY / 100);

    bg.style.marginLeft = -x + "px";
  });

  //   let cursor = document.getElementById("cursor");
  let cursor = $(".cursor");
  let cWidth = 8;
  let fWidth = 40;
  delay = 10;
  mouseX = 0;
  mouseY = 0;
  posX = 0;
  posY = 0;

  if (getDevice == "sp" || getDevice == "tab") {
    cursor.css("display", "none");
  }

  TweenMax.to({}, 0.001, {
    repeat: -1,
    onRepeat: function() {
      posX += (mouseX - posX) / delay;
      posY += (mouseY - posY) / delay;

      TweenMax.set(cursor, {
        css: {
          left: mouseX - cWidth / 2,
          top: mouseY - cWidth / 2
        }
      });
    }
  });

  // get mouse position
  $(document).on("mousemove", function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  });

  $("a").on({
    mouseenter: function() {
      cursor.addClass("is-active");
      cursor.css({
        background: "grey",
        transform: "scale(5)"
      });
    },
    mouseleave: function() {
      cursor.removeClass("is-active");
      cursor.css({
        background: "grey",
        transform: "scale(1)"
      });
    }
  });
});
