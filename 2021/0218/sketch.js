// let dotSize = 5;
// let scaling = 2;
// let color_white = "white";
// let color_black = "black";
// let color_red = "red";

let photo = null;
let pixel = 5;
let speed = 0.5;

function preload() {
  photo = loadImage("img.png");
}

// パピルスの戦闘音楽　永遠リピートしながらやってられる
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  console.log(photo.width);
  console.log(photo.height);
  let xScale = photo.width / Math.pow(10, String(photo.width).length - 1);
  let yScale = photo.height / Math.pow(10, String(photo.height).length - 1);
  console.log(xScale);
  console.log(yScale);
  let newPhotoWidth = 0;
  let newPhotoHeight = 0;

  if (photo.width > photo.height) {
    if (windowWidth > windowHeight) {
      // pc
      // hightが決まってる状態
      // photo.width : photo.height = x : windowHeight;
      // photo.width * windowWidth = photo.height * x;
      newPhotoHeight = windowHeight;
      newPhotoWidth = photo.width + windowWidth / photo.height;
      console.log("photo width");
      console.log(newPhotoHeight);
      console.log(newPhotoWidth);

      // if ()
    } else {
      // pc
      // hightが決まってる状態
      // photo.width : photo.height = x : windowHeight;
      // photo.width * windowWidth = photo.height * x;
      newPhotoHeight = windowHeight;
      newPhotoWidth = photo.width + windowWidth / photo.height;
    }
  }

  image(photo, windowWidth / 2, windowHeight / 2, windowWidth, newPhotoHeight);
}

function draw() {
  // background(220);
  // createMainCharacter();
  // ellipse(0, 0, 100);
}

// const createMainCharacter = () => {
//   // fill("gray");
//   // noStroke();

//   ellipse(0, 0, 100);
// };
