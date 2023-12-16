let mobileFlag = false;
let loadingbg;
let modalbg;
let modal01;
let btn01;
let generator;
let frame01;
let frame02;

let container;

let ui;
let uiParts;

let audio;
let audio01;
let audio02;
let audio03;
let audio04;
let audio05;
let audio06;

let lightupFlag = false;
let yakanFlag = false;
let ojiImg;
let ojiPhoto;
let diaFlag = false;
let sumahoFlag = false;
let shinFlag = 0;

window.addEventListener("load", () => {
  initDevice();
  loadingbg = document.getElementById("loading-bg");
  modalbg = document.getElementById("modal-bg");
  modal01 = document.getElementById("modal01");
  btn01 = document.getElementById("btn01");
  generator = document.getElementById("generator");
  container = document.getElementById("container");
  frame01 = document.getElementById("frame01");
  frame02 = document.getElementById("frame02");
  ui = document.querySelector(".ui");
  uiParts = document.querySelectorAll(".ui-parts");
  audio01 = document.getElementById("audio01");
  audio02 = document.getElementById("audio02");
  audio03 = document.getElementById("audio03");
  audio04 = document.getElementById("audio04");
  audio05 = document.getElementById("audio05");
  audio06 = document.getElementById("audio06");
  ojiPhoto = [1, 2, 3, 4, 5, 6, 7];

  setTimeout(() => {
    loadingbg.style.transition = "1.5s";
    loadingbg.classList.add("is-hidden");
  }, 300);

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
    audio01.muted = true;
    audio01.play();
    audio01.pause();
    audio01.muted = false;
    audio01.currentTime = 0;
  });

  for (let i = 0; i < uiParts.length; i++) {
    uiParts[i].addEventListener("click", () => {
      if (i === 0) {
        kumaFul(20);
      } else if (i === 1) {
        sumaho();
      } else if (i === 2) {
        yakanAlert();
      } else if (i === 3) {
        phon();
      } else if (i === 4) {
        oji();
      } else if (i === 5) {
        diamond();
      } else if (i === 6) {
        lightup();
      } else if (i === 7) {
        shinControl();
      } else if (i === 8) {
        carAnim();
      } else if (i === 9) {
        penControl();
      } else if (i === 10) {
        run();
      }
    });
  }
});

const initDevice = () => {
  let regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  windowWidth = document.documentElement.clientWidth;
  windowHeight = document.documentElement.clientHeight;
  if (
    window.navigator.userAgent.search(regexp) !== -1 ||
    windowWidth < windowHeight
  ) {
    mobileFlag = true;
    console.log("📱");
  } else {
    mobileFlag = false;
    console.log("💻");
  }
};

kumaFul = (n) => {
  let pinkkuma = document.createElement("img");
  pinkkuma.classList.add("pink-kuma");
  pinkkuma.setAttribute("src", "./img/kuma-pink.png");
  for (let i = 0; i < n; i++) {
    kumaSet(pinkkuma);
  }
};

kumaSet = (clone) => {
  let kumaClone = clone.cloneNode(true);
  let kumaStyle = kumaClone.style;
  kumaStyle.left = 100 * Math.random() + "%";
  kumaStyle.animationDelay = 8 * Math.random() + "s";
  container.appendChild(kumaClone);
};

lightup = () => {
  let sky = document.getElementById("sky");
  if (lightupFlag === false) {
    generator.setAttribute("visible", true);
    sky.setAttribute("visible", true);
    ui06.style.pointerEvents = "none";
    lightupFlag = true;
  } else {
    generator.setAttribute("visible", false);
    sky.setAttribute("visible", false);
    ui06.style.pointerEvents = "auto";
    lightupFlag = false;
  }
};

yakanAlert = () => {
  const waita = () => {
    window.alert("お湯が湧きました");
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
  let width = window.innerWidth + 1000;
  console.log(width);
  ui09.style.transition = "6s";
  ui09.style.transform = "translateX(" + width + "px)";
};

diamond = () => {
  let ambientLight = document.getElementById("ambient-light");
  let dia = document.getElementById("dia");
  if (diaFlag === false) {
    dia.setAttribute("visible", true);
    ambientLight.setAttribute("intensity", 0.5);
    ui07.style.pointerEvents = "none";
    diaFlag = true;
  } else {
    dia.setAttribute("visible", false);
    ambientLight.setAttribute("intensity", 1.0);
    ui07.style.pointerEvents = "auto";
    diaFlag = false;
  }
};

phon = () => {
  audio = [audio01, audio02, audio03, audio04, audio05, audio06];
  let num = Math.floor(Math.random() * audio.length);
  console.log(num);
  audio[num].play();
};

run = () => {
  let modalRun = document.getElementById("modal-run");
  modalRun.classList.remove("is-hidden");
  let bg = document.getElementById("progress-bg");
  let txt = document.getElementById("modal-run__txt");
  let btnRun = document.getElementById("btn-run");
  let btnRunClose = document.getElementById("btn-run-close");
  let motionCount = 0;
  if (mobileFlag === false) {
    txt.innerText = "このボタンはスマホ限定で遊べます";
  }
  modalRun.style.top = "0%";
  btnRunClose.classList.add("is-hidden");
  btnRun.addEventListener("click", () => {
    modalRun.classList.add("is-hidden");
  });
  window.addEventListener("devicemotion", function (e) {
    let accX = e.acceleration.x;
    if (accX > 3) {
      motionCount++;
      modalRun.style.top = `-${motionCount}%`;
      btnRunClose.classList.add("is-hidden");
      if (motionCount >= 100) {
        modalRun.style.top = `-100%`;
        btnRunClose.classList.remove("is-hidden");
      }
    }
  });
  btnRunClose.addEventListener("click", () => {
    modalRun.classList.add("is-hidden");
  });
};

sumaho = () => {
  let sumahoBg = document.getElementById("sumaho-bg");
  if (sumahoFlag === false) {
    ui11.style.opacity = 0.3;
    ui11.style.pointerEvents = "none";
    sumahoBg.style.opacity = 1.0;
    frame01.style.opacity = 0.0;
    frame02.style.opacity = 0.0;
    container.style.zoom = "45%";
    container.style.zoom = "45%";
    container.style.width = "45%";
    container.style.height = "45%";
    sumahoFlag = true;
  } else {
    ui11.style.opacity = 1.0;
    ui11.style.pointerEvents = "auto";
    sumahoBg.style.opacity = 0.0;
    frame01.style.opacity = 1.0;
    frame02.style.opacity = 1.0;
    container.style.zoom = "100%";
    container.style.zoom = "100%";
    container.style.width = "100%";
    container.style.height = "100%";
    sumahoFlag = false;
  }
};

penControl = () => {
  let modalPen = document.getElementById("modal-pen");
  let modalPenBtn = document.getElementById("btn-pen");
  let penOutput = document.getElementById("pen-output");
  modalPen.classList.remove("is-hidden");
  penInputSend = () => {
    let penInput = document.getElementById("pen-input").value;
    penOutput.innerText = penInput;
    penInput = "";
    modalPen.classList.add("is-hidden");
  };
};

shinControl = () => {
  let ui08 = document.getElementById("ui08");
  if (shinFlag === 0) {
    ui08.classList.add("shin-anim1");
    shinFlag = 1;
  } else if (shinFlag === 1) {
    ui08.classList.remove("shin-anim1");
    ui08.classList.add("shin-anim2");
    shinFlag = 2;
  } else {
    ui08.classList.remove("shin-anim2");
    shinFlag = 0;
  }
};
