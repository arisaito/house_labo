let windowWidth = 0;
let windowHeight = 0;
let cameraInput = null;
let cameraStream = null;
let cameraCount = 0;
let cameraMode = "environment";
let cameraIsInitialized = false;
let cameraIsUser = false;
let devices = null;
let cameraWidth = 0;
let cameraHeight = 0;

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

const SwitchCamera = () => {
  GetCamera();
};

export { GetCamera, SwitchCamera };
