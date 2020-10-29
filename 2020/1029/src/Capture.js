const Capture = (
  camera,
  scene,
  windowWidth,
  windowHeight,
  cameraWidth,
  cameraHeight,
  cameraMode,
  previewImage
) => {
  if ((camera, scene)) {
    let sceneWidth = scene.offsetWidth;
    let sceneHeight = scene.offsetHeight;
    let debug = document.getElementById("debug");
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    canvas.width = windowWidth * window.devicePixelRatio;
    canvas.height = windowHeight * window.devicePixelRatio;
    let x = 0;
    let y = 0;
    let w = cameraWidth;
    let h = cameraHeight;
    let cameraAspect = cameraWidth / cameraHeight;
    let windowAspect = windowWidth / windowHeight;
    if (cameraAspect > windowAspect) {
      w = cameraHeight * windowAspect;
      x = (cameraWidth - w) / 2;
    } else {
      h = cameraWidth / windowAspect;
      y = (cameraHeight - h) / 2;
    }
    if (cameraMode === "environment") {
      context.drawImage(camera, x, y, w, h, 0, 0, canvas.width, canvas.height);
    } else {
      let reverseCamera = document.createElement("canvas");
      let reverseContext = canvas.getContext("2d");
      reverseCamera.width = canvas.width;
      reverseCamera.height = canvas.height;
      reverseContext.translate(canvas.width, 0);
      reverseContext.scale(-1, 1);
      reverseContext.drawImage(
        camera,
        x,
        y,
        w,
        h,
        0,
        0,
        canvas.width,
        canvas.height
      );
      context.translate(canvas.width, 0);
      context.scale(-1, 1);

      context.drawImage(
        reverseCamera,
        x,
        y,
        w,
        h,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    // A-Frameの映像をsnapshotに描画
    // components.screenshotの大きさを現在のwidthとheightに指定
    // scene.setAttribute(
    //   "screenshot",
    //   "width:" + sceneWidth + "; height: " + sceneHeight + ";"
    // );
    var capture = scene.components.screenshot.getCanvas("perspective");
    context.drawImage(capture, 0, 0, canvas.width, canvas.height);

    // debug.appendChild(canvas);
    // context.drawImage(
    //   konvaLayer.canvas._canvas,
    //   0,
    //   0,
    //   canvas.width,
    //   canvas.height
    // );
    previewImage.src = canvas.toDataURL("image/jpeg", 1.0);
    context.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    return;
  }
};

export { Capture };

// A-Frameの映像をsnapshotに描画
// components.screenshotの大きさを現在のwidthとheightに指定
// scene.setAttribute(
//   "screenshot",
//   "width:" + width + "; height: " + height + ";"
// );
// var capture = scene.components.screenshot.getCanvas("perspective");
// context.drawImage(capture, 0, 0, width, height);
