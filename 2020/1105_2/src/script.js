let fontArray = [
  "kosugi",
  "kosugi-maru",
  "mplus",
  "mplus-round",
  "notosans",
  "notoserif",
  "sawarabi-gothic",
  "sawarabi-mincho",
  "arial",
  "serif",
  "bold",
  "hiragino",
  "hiragino-bold",
  "hiragino-mincho",
  "hiragino-mincho-alpha",
  "yumincho",
  "notosans-bold",
  "notosans-thin",
];

let text = null;
let previousFont = null;

const setTimer = () => {
  setInterval(shuffle, 50);
};

const shuffle = () => {
  console.log();
  for (let i = 0; i < fontArray.length; i++) {
    text.forEach((el) => {
      el.classList.remove(fontArray[i]);
    });
  }
  let random = fontArray[Math.floor(Math.random() * fontArray.length)];
  if (random == previousFont) {
    random = fontArray[Math.floor(Math.random() * fontArray.length)];
    if (random == previousFont) {
      random = fontArray[Math.floor(Math.random() * fontArray.length)];
      if (random == previousFont) {
        random = fontArray[Math.floor(Math.random() * fontArray.length)];
      }
    }
  }
  text.forEach((el) => {
    el.classList.add(random);
  });
  previousFont = random;
};

const inputManager = () => {
  const input = document.getElementById("input");
  const btn = document.getElementById("btn");
  const modal = document.getElementById("modal");
  btn.addEventListener("click", () => {
    text.forEach((el) => {
      el.innerText = input.value;
    });
    modal.classList.add("is-hidden");
    setTimer();
  });
};

window.onload = () => {
  text = document.querySelectorAll(".main-txt");
  inputManager();
};
