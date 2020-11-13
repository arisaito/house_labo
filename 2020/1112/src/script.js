// //動画流す準備
// var video = document.getElementById("camera");
// // getUserMedia によるカメラ映像の取得
// var media = navigator.mediaDevices.getUserMedia({
//   video: true, //ビデオを取得する
//   //使うカメラをインカメラか背面カメラかを指定する場合には
//   //video: { facingMode: "environment" },//背面カメラ
//   //video: { facingMode: "user" },//インカメラ
//   audio: false, //音声が必要な場合はture
// });
// //リアルタイムに再生（ストリーミング）させるためにビデオタグに流し込む
// media.then((stream) => {
//   video.srcObject = stream;
// });

let cameraDeviceIds = [
  /* { deviceId, label } */
];
navigator.mediaDevices.enumerateDevices().then(function (mediaDevices) {
  for (let len = mediaDevices.length, i = 0; i < len; i++) {
    const item = mediaDevices[i];
    // NOTE: カメラデバイスの場合、 kind プロパティには "videoinput" が入っている:
    if (item.kind === "videoinput") {
      const deviceId = item.deviceId;
      const label = item.label;
      // NOTE: ここでデバイスID（とラベル）を適当な変数に保存しておく
      cameraDeviceIds.push({ deviceId, label });
    }
  }
});

//
// Webカメラを選択
// //
// const video = document.querySelector("#camera");
// navigator.mediaDevices
//   .getUserMedia({
//     audio: false,
//     video: {
//       // ここにカメラのデバイスIDをセット(ここではindex:0のカメラデバイスをセットしました):
//       deviceId: cameraDeviceIds[0],
//     },
//   })
//   .then(function (stream) {
//     video.srcObject = stream;
//   })
//   .catch(function (e) {
//     alert("ERROR: Webカメラの起動に失敗しました: " + e.message);
//   });

// navigator.mediaDevices
//   .enumerateDevices()
//   .then((devices) => {
//     cameraInput = devices.filter((device) => device.kind === "videoinput");
//     // GetCamera();
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
window.onload = () => {
  initCamera();
};

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

const initCamera = () => {
  console.log("init camera");
  camera = document.getElementById("camera");
  // camera.addEventListener("loadedmetadata", adjustCamera);
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
      // location.href = "./camera-error.html";
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
