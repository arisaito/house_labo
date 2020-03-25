let modalbg;
let modal01;
let btn01;
let generator;

let ui;
let uiParts;

let audio01;

let lightupFlag = false;
let yakanFlag = false;
let ojiImg;
let ojiPhoto;

window.addEventListener("load", () => {
  modalbg = document.getElementById("modal-bg");
  modal01 = document.getElementById("modal01");
  btn01 = document.getElementById("btn01");
  audio01 = document.getElementById("");
  generator = document.getElementById("generator");
  ui = document.querySelector(".ui");
  uiParts = document.querySelectorAll(".ui-parts");
  ojiPhoto = [1, 2, 3, 4, 5, 6, 7];

  let sphere = "<a-sphere color='pink' scale='0.8 0.8 0.8'>";

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      for (let k = 0; k < 5; k++) {
        let sphere = document.createElement("a-sphere");
        sphere.setAttribute("color", "#fcfefe");
        sphere.setAttribute("scale", "0.3 0.3 0.3");
        sphere.setAttribute("position", i * -4 + " " + j * -4 + " " + k * -4);
        generator.appendChild(sphere);
      }
    }
  }

  btn01.addEventListener("click", () => {
    modalbg.classList.add("is-hidden");
    modal01.classList.add("is-hidden");
    ui.style.filter = "blur(0px)";
    // audio.muted = true;
    // audio.play();
    // audio.pause();
    // audio.muted = false;
    // audio.currentTime = 0;
    if (
      DeviceMotionEvent &&
      DeviceMotionEvent.requestPermission &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    if (
      DeviceOrientationEvent &&
      DeviceOrientationEvent.requestPermission &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission();
    }
  });

  for (let i = 0; i < uiParts.length; i++) {
    uiParts[i].addEventListener("click", () => {
      if (i === 0) {
        console.log("くま");
        kumaFul(20);
      } else if (i === 1) {
        console.log("雨雲");
      } else if (i === 2) {
        console.log("ヤカン");
        yakanAlert();
      } else if (i === 3) {
        console.log("拡声器");
      } else if (i === 4) {
        console.log("おじさん");
        oji();
      } else if (i === 5) {
        console.log("りす");
      } else if (i === 6) {
        console.log("東大");
        lightup();
      } else if (i === 7) {
        console.log("house");
      } else if (i === 8) {
        console.log("car");
        carAnim();
      }
    });
  }
});

kumaFul = n => {
  let pinkkuma = document.createElement("img");
  pinkkuma.classList.add("pink-kuma");
  pinkkuma.setAttribute("src", "./img/kuma-pink.png");
  for (let i = 0; i < n; i++) {
    kumaSet(pinkkuma);
  }
};

kumaSet = clone => {
  let kumaClone = clone.cloneNode(true);
  let kumaStyle = kumaClone.style;
  kumaStyle.left = 100 * Math.random() + "%";
  kumaStyle.animationDelay = 8 * Math.random() + "s";
  document.body.appendChild(kumaClone);
  //   kumaClone.addEventListener(
  //     "animationend",
  //     function() {
  //       this.parentNode.removeChild(this);
  //       let pinkkuma = document.createElement("img");
  //       pinkkuma.className = "kuma";
  //       pinkkuma.setAttribute("src", "./img/kuma-pink.png");
  //       kumaSet(pinkkuma);
  //     },
  //     false
  //   );
};

lightup = () => {
  let sky = document.getElementById("sky");
  if (lightupFlag === false) {
    sky.setAttribute("color", "#364f6b");
    lightupFlag = true;
  } else {
    sky.setAttribute("color", "#fcfefe");
    lightupFlag = false;
  }
};

yakanAlert = () => {
  const waita = () => {
    window.alert("お湯わいた");
    yakanFlag = false;
  };
  if (yakanFlag === false) {
    setTimeout(waita, 3000);
    yakanFlag = true;
  } else {
    return;
  }
};

oji = () => {
  let modalMan = document.getElementById("modal-man");
  let btnMan = document.getElementById("btn-man");
  let randomNum = Math.floor(Math.random() * ojiPhoto.length);
  ojiImg = document.getElementById("oji-img");
  modalbg.classList.remove("is-hidden");
  modalMan.classList.remove("is-hidden");
  ojiImg.setAttribute("src", `./img/man/0${randomNum}.jpg`);
  btnMan.addEventListener("click", () => {
    modalMan.classList.add("is-hidden");
    modalbg.classList.add("is-hidden");
    setTimeout(() => {
      ojiImg.setAttribute("src", ``);
    }, 200);
  });
};

carAnim = () => {
  let ui09 = document.getElementById("ui09");
  let width = window.innerWidth + 200;
  console.log(width);
  ui09.style.transition = "2s";
  ui09.style.transform = "translateX(" + width + "px)";
};
