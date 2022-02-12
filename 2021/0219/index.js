let windowWidth = 0;
let windowHeight = 0;
let video = null;
let videoStream = null;
let videoInput = null;
let canvas = null;
let context = null;
let arcWidth = 0;
let canvasWidth = 0;
let colorPreviewArc = null;
let currentColorCode = null;
let headerText = null;
let isFirst = true;

let isPC = false;
let isTab = false;
const cameraSize = { w: 1080, h: 1080 };

let headerTextTimer = null;
let colorCodeText;
let tapText;
let isFirstTap = true;

const initDevice = () => {
  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.enumerateDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    console.log("このブラウザには対応していません。");
  }
  if (navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i)) {
    return;
  } else if (
    navigator.userAgent.match(/(iPad|(?!(Android.*Mobile)+)Android)/i)
  ) {
    isTab = true;
  } else {
    isPC = true;
    // canvas = document.querySelector("canvas");
    // canvas.style.top = "10%";
    // colorPreviewArc = document.getElementById("color-preview");
    // colorPreviewArc.style.bottom = "10%";
  }
};

const initSetup = () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  isPC ? (canvasWidth = windowHeight / 1.8) : (canvasWidth = windowWidth);
  isPC ? (arcWidth = canvasWidth) : (arcWidth = canvasWidth - 10);
  if (isTab) arcWidth = canvasWidth / 1.3;
  if (!isPC && !isTab) {
    const contaconta = document.getElementById("container-in-container");
    console.log(contaconta);
    contaconta.style.maxHeight = "730px";
  }
  tapText = document.getElementById("tap-text-text");
  if (isPC) {
    tapText.innerText = "Click";
  }
  document.body.style.minHeight = window.innerHeight + "px";
};

const initVideoAsync = (status) => {
  video = document.getElementById("video");
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      videoInput = devices.filter((device) => device.kind === "videoinput");
      getVideo(status.isFirst);
    })
    .catch(function (error) {});
};

const getVideo = (isFirst) => {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }
  navigator.mediaDevices
    .getUserMedia(setVideo())
    .then(function (stream) {
      console.log(stream);
      video.srcObject = stream;
      video.play();
      videoStream = stream;
      canvasSetup();
      renderCanvas();
      getColorFromCanvas();
      setInterval(() => {
        getColorFromCanvas();
      }, 100);
      if (!isFirst) {
        isFinishInit.video = true;
      }
    })
    .catch(function (error) {});
};

const setVideo = () => {
  return {
    audio: false,
    video: {
      deviceId: videoInput,
      facingMode: "environment",
      width: { ideal: 500 },
      height: { ideal: 500 },
    },
  };
};

const canvasSetup = () => {
  canvas = document.getElementById("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasWidth;
  context = canvas.getContext("2d");
  context.beginPath();
  if (isFirst) setArcStyle();
  isFirst = false;
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    arcWidth / 2,
    (0 * Math.PI) / 180,
    (360 * Math.PI) / 180
  );
  context.clip();
};

const renderCanvas = () => {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(renderCanvas);
};

const setArcStyle = () => {
  colorPreviewArc.style.width = arcWidth + "px";
  colorPreviewArc.style.height = arcWidth + "px";
};

const getColorFromCanvas = () => {
  let x = canvasWidth / 2;
  let y;
  y = canvasWidth / 2;
  let imagedata = context.getImageData(x, y, 1, 1);
  let r = imagedata.data[0];
  let g = imagedata.data[1];
  let b = imagedata.data[2];
  colorPreviewArc.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 1)`;
  currentColorCode = rgbToHex([r, g, b]);
};

const rgbToHex = (rgb) => {
  return (
    "#" +
    rgb
      .map(function (value) {
        return ("0" + value.toString(16)).slice(-2);
      })
      .join("")
  );
};

const initAtachTrigger = () => {
  colorPreviewArc = document.getElementById("color-preview");
  colorPreviewArc.addEventListener("click", () => {
    if (isFirstTap) {
      isFirstTap = false;
      hideTapText();
    }
    createArcInstance();
    showHeaderText();
  });

  colorCodeText = document.getElementById("color-code-text");
  headerText = document.getElementById("header-text");
};

const hideTapText = () => {
  tapText.classList.add("is-hidden");
};

const showHeaderText = () => {
  clearTimeout(headerTextTimer);
  if (currentColorCode) {
    colorCodeText.innerText = currentColorCode;
    headerText.classList.remove("is-hidden");
    navigator.clipboard.writeText(currentColorCode);
  }
  headerTextTimer = setTimeout(() => {
    hideHeaderText();
  }, 1000);
};

const hideHeaderText = () => {
  headerText.classList.add("is-hidden");
};

const createArcInstance = () => {
  const newArc = document.createElement("div");
  newArc.classList.add("new-arc");
  newArc.style.background = currentColorCode;
  newArc.style.width = arcWidth + "px";
  newArc.style.height = arcWidth + "px";
  newArc.classList.add("bound");
  colorPreviewArc.appendChild(newArc);
  setTimeout(() => {
    colorPreviewArc.removeChild(newArc);
  }, 2000);
};

window.addEventListener("load", () => {
  initDevice();
  initSetup();
  initAtachTrigger();
  initVideoAsync({ isFirst: true });
});

// 以下　おまじない系

const disableDefaultScale = (e) => {
  if (e.touches.length >= 2) e.preventDefault();
};
window.addEventListener("touchstart", disableDefaultScale, { passive: false });

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    window.location.reload();
  }
});
