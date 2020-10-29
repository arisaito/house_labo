// import { GetCamera, SwitchCamera } from "./module/CameraSetup";
// import { Capture } from "./module/Capture";

let widowWidth = null;
let windowHeight = null;
let scene = null;

let camera = null;
let cameraStream = null;
let cameraWidth = null;
let cameraHeight = null;

let cameraInput = null;
let cameraCount = 0;
let cameraMode = "environment";
let cameraIsInitialized = false;
let cameraIsUser = false;
let devices = null;

const initWindow = () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  scene = document.querySelector("a-scene");
  document.body.style.minHeight = window.innerHeight + "px";
  let errorUrl;
  errorUrl = "./error.html";
  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.enumerateDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    alert("このブラウザには対応していません");
    location.href = errorUrl;
    return;
  }
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // document.getElementById("preview__download").classList.add("is-hidden");
  } else {
    // document.getElementById("preview__text").classList.add("is-hidden");
  }
};

const resizeWindow = () => {
  clearTimeout(windowTimer);
  windowTimer = setTimeout(() => {
    document.body.style.minHeight = window.innerHeight + "px";
  }, 500);
};

// const capturePreview = () => {
//   Capture(
//     camera,
//     scene,
//     windowWidth,
//     windowHeight,
//     cameraWidth,
//     cameraHeight,
//     cameraMode,
//     previewImage
//   );
//   showPreview();
//   checkStampId();
// };

// ---------------------------
// カメラ
// ---------------------------

const initCamera = () => {
  console.log("init camera");
  camera = document.getElementById("camera");
  camera.addEventListener("loadedmetadata", adjustCamera);
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      cameraInput = devices.filter((device) => device.kind === "videoinput");
      GetCamera();
    })
    .catch(function (error) {
      console.log(error);
    });
};

const adjustCamera = () => {
  console.log("adjust camera");
  cameraWidth = camera.videoWidth;
  cameraHeight = camera.videoHeight;
  let cameraAspect = cameraWidth / cameraHeight;
  let windowAspect = windowWidth / windowHeight;
  if (windowAspect < cameraAspect) {
    let newWidth = cameraAspect * windowHeight;
    camera.style.width = newWidth + "px";
    camera.style.marginLeft = -(newWidth - windowWidth) / 2 + "px";
    camera.style.height = windowHeight + "px";
    camera.style.marginTop = "0px";
  } else {
    let newHeight = 1 / (cameraAspect / windowWidth);
    camera.style.height = newHeight + "px";
    camera.style.marginTop = -(newHeight - windowHeight) / 2 + "px";
    camera.style.width = windowWidth + "px";
    camera.style.marginLeft = "0px";
  }
};

const GetCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }
  navigator.mediaDevices
    .getUserMedia(setCamera())
    .then(function (stream) {
      camera.srcObject = stream;
      camera.play();
      cameraIsInitialized
        ? cameraIsUser
          ? camera.play().then(() => {
              cameraIsUser = false;
            })
          : camera.play().then(() => {
              cameraIsUser = true;
            })
        : camera.play().then(() => {
            cameraIsInitialized = true;
          });
      cameraStream = stream;
    })
    .catch(function (error) {
      console.log(error);
      location.href = "./camera-error.html";
    });
  devices.getTracks().forEach((track) => track.stop());
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      navigator.mediaDevices
        .getUserMedia(config)
        .then(function (stream) {
          camera.srcObject = stream;
          cameraIsInitialized
            ? cameraIsUser
              ? camera.play().then(() => {
                  cameraIsUser = false;
                })
              : camera.play().then(() => {
                  cameraIsUser = true;
                })
            : camera.play().then(() => {
                cameraIsInitialized = true;
              });
        })
        .catch(function (error) {
          // alert(error);
          console.log("getUserMedia ERROR");
          location.href = "./camera-error.html";
        });
    })
    .catch(function (error) {
      // alert(error);
      console.log("enumerateDevices ERROR");
      location.href = "./camera-error.html";
    });
};

const setCamera = () => {
  if (windowWidth <= 750) {
    if (cameraCount % 2 === 0) {
      cameraMode = "environment";
      camera.classList.remove("is-reverse");
    } else {
      cameraMode = "user";
      camera.classList.add("is-reverse");
    }
  }
  cameraCount++;
  return {
    audio: false,
    video: {
      deviceId: cameraInput,
      facingMode: cameraMode,
      width: { min: 1280, max: 1920 },
      height: { min: 720, max: 1080 },
    },
  };
};

window.addEventListener("load", () => {
  initWindow();
  initCamera();
});

window.addEventListener("resize", () => {
  resizeWindow();
  adjustCamera();
});
