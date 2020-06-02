let bg;
let en;
let collider;

window.onload = () => {
  bg = document.getElementById("360bg");
  en = document.getElementById("en01");
  collider = document.getElementById("collider01");
};

AFRAME.registerComponent("cursor-listener", {
  init: function () {
    this.el.addEventListener("click", function (evt) {
      console.log("click");
      bg.emit("foo");
      en.parentNode.removeChild(en);
      collider.parentNode.removeChild(collider);
    });
  },
});
