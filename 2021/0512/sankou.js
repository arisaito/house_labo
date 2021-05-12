var video = document.createElement("video");
video.setAttribute("style", "display: none");
document.body.appendChild(video);

var constraints = { audio: false, video: { width: 320, height: 240 } };
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (mediaStream) {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function (e) {
      video.play();
    };
  })
  .catch(function (err) {
    console.log(err.name + ": " + err.message);
  });

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var glitch = document.createElement("canvas");
document.body.appendChild(glitch);

function compR(a, b) {
  return (b >> 16) - (a >> 16);
}

function compG(a, b) {
  return ((b >> 8) & 0xff) - ((a >> 8) & 0xff);
}

function compB(a, b) {
  return (b & 0xff) - (a & 0xff);
}

function capture() {
  var c1 = canvas.getContext("2d");
  var width = (canvas.width = glitch.width = constraints.video.width);
  var height = (canvas.height = glitch.height = constraints.video.height);
  c1.drawImage(video, 0, 0, width, height);

  var bars = [];
  for (var i = 0; i < width; i++) {
    bars.push(new Uint32Array(height));
  }

  var image = c1.getImageData(0, 0, width, height);
  for (var i = 0, len = image.data.length, buf; i < len; i += 4) {
    buf = bars[Math.floor((i % (4 * width)) / 4)];
    buf[Math.floor(i / (4 * width))] =
      (image.data[i] << 16) + (image.data[i + 1] << 8) + image.data[i + 2];
  }

  for (var i = 0; i < width; i++) {
    bars[i].sort(compR);

    for (var j = 0, b; j < height; j++) {
      b = j * 4 * width + 4 * i;
      image.data[b] = bars[i][j] >> 16;
      image.data[b + 1] = (bars[i][j] >> 8) & 0xff;
      image.data[b + 2] = bars[i][j] & 0xff;
      image.data[b + 3] = 255;
    }
  }

  var c2 = glitch.getContext("2d");
  c2.putImageData(image, 0, 0);
}

function periodic() {
  capture();
  setTimeout(periodic, 100);
}

var button = document.createElement("input");
button.setAttribute("type", "button");
button.setAttribute("value", "Start");
button.addEventListener("click", periodic, false);
document.body.appendChild(button);
