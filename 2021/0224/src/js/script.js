const mainPhrase = "＊　うざいくま があらわれた。<br>＊　ただの クソザコ。";
let actArray = [
  {
    action: "ぶんせき",
    phrase: "＊　うざいくま - ATK 1 DEF 1<br>＊　そのへんに よくいる くま。",
  },
  {
    action: "くどく",
    phrase: "＊　うざいくまをくどいてみた。<br>＊　まんざらでもなさそうだ。",
  },
  {
    action: "ナデナデ",
    phrase: "＊　くまをナデナデしてみた。<br>＊　「コレガ…ヒトノ…ココロ…」",
  },
  {
    action: "ひっぱたく",
    phrase:
      "＊　くまをひっぱたいた。<br>＊　おこってるようだが<br>　　なにを言ってるかわからない。",
  },
];
const endingPhrase =
  "＊　YOU WIN！<br>＊　0EXPと2ゴールドを　かくとく！<br>＊　（おわり）";
const itemPhrase =
  "＊　どうやら かいはつしゃは<br>　　これを　じっそうする　よゆうが<br>　　なかったようだ…";
const gameoverPhrase =
  "あきらめては　いけない…<br>リロードして<br>ケツイをちからに　かえるんだ…";
let choiceButtons = null;
let choiceButtonsIcon = [
  {
    normal: "./static/image/fight.png",
    selected: "./static/image/fight_selected.png",
  },
  {
    normal: "./static/image/act.png",
    selected: "./static/image/act_selected.png",
  },
  {
    normal: "./static/image/item.png",
    selected: "./static/image/item_selected.png",
  },
  {
    normal: "./static/image/mercy.png",
    selected: "./static/image/mercy_selected.png",
  },
];

let mainWindow = null;
let typeTextTimeout = null;
let typeGameoverTimeout = null;
let fightModeTimeout = null;
let enemyAttackEndReset = null;
let inputHeartMoveInterval = null;
let currentType = "command";
let intervalArray = [];

let enemyImg = null;
let enemyLife = 200;
let enemyLifeDisplay = null;
let fightBg = null;
let movingLine = null;

let enemyAttackTimer = 5000;
let newHeartImg = null;

let isUndying = false;

// ------------------------------
// main window conts
// ------------------------------
let typeConts = null;
let actText = null;
let actTextItem = null;

// ------------------------------
// button index
// ------------------------------
let typePhraseIndex = 0;
let commandButtonIndex = 0;
let actButtonIndex = 0;

const initDevice = () => {
  const mobileWindow = document.getElementById("mobile-window");
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    mobileWindow.classList.remove("is-hidden");
  }
};

const initAttach = () => {
  mainWindow = document.getElementById("main-window");
  typeConts = document.getElementById("type-anim");
  actText = document.getElementById("act-text");
  itemText = document.getElementById("item-text");
  choiceButtons = document.querySelectorAll(".button-list-item-button");
  fightBg = document.getElementById("fight-bg");
};

const typeText = (phrase) => {
  typeConts.innerHTML = phrase.substring(0, typePhraseIndex++);
  if (typePhraseIndex <= phrase.length) {
    typeTextTimeout = setTimeout(() => {
      typeText(phrase);
    }, 50);
  } else {
    typePhraseIndex = 0;
  }
};

const initCommandEvent = () => {
  window.addEventListener("keydown", (e) => {
    if (currentType === "command") {
      if (e.keyCode === 39 || e.keyCode === 37) commandButtonSelect(e.keyCode);
      if (e.keyCode === 13) commandButtonSelectEnter();
    } else if (currentType === "act") {
      if (e.keyCode > 36 && e.keyCode < 41) actButtonSelect(e.keyCode);
      if (e.keyCode === 13) actButtonSelectEnter();
    } else if (currentType === "act-phrase") {
      if (e.keyCode === 13) {
        clearMainWindow();
        enemysAttackFunc();
      }
    } else if (currentType === "enemy-attack") {
      if (e.keyCode > 36 && e.keyCode < 41) inputHeartMove(e.keyCode);
    } else if (currentType === "fight") {
      if (e.keyCode === 13) {
        attackEnter();
      }
    } else if (currentType === "item" || currentType === "mercy") {
      if (e.keyCode === 13) {
        resetMainWindow();
      }
    }
  });
  window.addEventListener("keyup", (e) => {
    if (currentType === "enemy-attack" && intervalArray.length > 0) {
      for (let i = 0; i < intervalArray.length; i++) {
        clearInterval(intervalArray[i]);
      }
      intervalArray.splice(0);
    }
  });
};

// ------------------------------
// command
// ------------------------------

const commandButtonSelect = (keyCode) => {
  choiceButtons[commandButtonIndex].classList.remove("is-selected");
  choiceButtons[commandButtonIndex].firstElementChild.src =
    choiceButtonsIcon[commandButtonIndex].normal;
  if (keyCode === 39) {
    if (commandButtonIndex < 3) {
      commandButtonIndex += 1;
    } else if (commandButtonIndex === 3) {
      commandButtonIndex = 0;
    }
  } else if (keyCode === 37) {
    if (commandButtonIndex > 0) {
      commandButtonIndex -= 1;
    } else if (commandButtonIndex === 0) {
      commandButtonIndex = 3;
    }
  }
  choiceButtons[commandButtonIndex].classList.add("is-selected");
  choiceButtons[commandButtonIndex].firstElementChild.src =
    choiceButtonsIcon[commandButtonIndex].selected;
};

const commandButtonSelectEnter = () => {
  if (commandButtonIndex === 0) fightFunc();
  if (commandButtonIndex === 1) actFunc();
  if (commandButtonIndex === 2) itemFunc();
  if (commandButtonIndex === 3) mercyFunc();
};

// ------------------------------
// FIGHT
// ------------------------------

const fightFunc = () => {
  clearMainWindow();
  currentType = "fight";
  fightBg.classList.remove("is-hidden");
  movingLine = document.getElementById("moving-line");
  movingLine.classList.add("is-moved");
  fightModeTimeout = setTimeout(() => {
    clearMainWindow();
    enemysAttackFunc();
  }, 1500);
};

const attackEnter = () => {
  clearTimeout(fightModeTimeout);
  const windowWidth = document.body.clientWidth;

  let lineRect = movingLine.getBoundingClientRect();
  let lineX = lineRect.left;
  movingLine.style.animation =
    "movingLineAnim 1.5s linear forwards paused, movingLineColorAnim 0.2s linear infinite";
  // 50%の時が一番　大きい数字がでる計算式をどうにか用意
  let damege = (lineX / windowWidth) * 100;
  if (damege > 50) {
    damege = 50 - (damege - 50);
  }
  showEnemyLifeGage(damege);
};

const showEnemyLifeGage = (damege) => {
  damege = parseInt(damege);
  enemyLife -= damege;
  const damegeText = document.getElementById("damege-text");
  const enemyLifeDisplayGage = document.getElementById("enemy-life-gage");
  let enemyAttackTimer = null;
  enemyImg = document.getElementById("enemy-img");
  enemyLifeDisplay = document.getElementById("enemy-life");
  enemyLifeDisplay.classList.remove("is-hidden");
  enemyImg.classList.add("is-dameged");
  damegeText.innerText = damege;
  // width 500px // 500 / 200 = 2.5
  // damegeが100のとき width側では 100 * 2.5　減らせばいい
  let enemyLifeDisplayDamege = damege * 2.5;
  let enemyLifeDisplayWidth = getComputedStyle(enemyLifeDisplayGage).width;
  enemyLifeDisplayWidth = Number(enemyLifeDisplayWidth.replace(/px/g, ""));

  enemyAttackTimer = setTimeout(() => {
    hideEnemyLifeGage();
    clearMainWindow();
    // resetMainWindow();
    enemysAttackFunc();
    damegeText.innerText = "";
    movingLine.style.animation = "";
    enemyImg.classList.remove("is-dameged");
  }, 2000);

  if (enemyLifeDisplayWidth - enemyLifeDisplayDamege >= 0) {
    enemyLifeDisplayGage.style.width =
      enemyLifeDisplayWidth - enemyLifeDisplayDamege + "px";
  } else {
    enemyLifeDisplayGage.style.width = "0px";
    clearTimeout(enemyAttackTimer);
    setTimeout(() => {
      hideEnemyLifeGage();
      hideEnemyImage();
      clearMainWindow();
      typeConts.classList.remove("is-hidden");
      typeText(endingPhrase);
      currentType = "ending";
    }, 1000);
  }
};

const hideEnemyLifeGage = () => {
  enemyLifeDisplay.classList.add("is-hidden");
};

// ------------------------------
// ACT
// ------------------------------

const actButtonSelect = (keyCode) => {
  actTextItem[actButtonIndex].classList.remove("is-selected");
  if (keyCode === 39 || keyCode === 37) {
    if (actButtonIndex === 0) {
      actButtonIndex = 1;
    } else if (actButtonIndex === 1) {
      actButtonIndex = 0;
    } else if (actButtonIndex === 2) {
      actButtonIndex = 3;
    } else if (actButtonIndex === 3) {
      actButtonIndex = 2;
    }
  } else if (keyCode === 38 || keyCode === 40) {
    if (actButtonIndex === 0) {
      actButtonIndex = 2;
    } else if (actButtonIndex === 1) {
      actButtonIndex = 3;
    } else if (actButtonIndex === 2) {
      actButtonIndex = 0;
    } else if (actButtonIndex === 3) {
      actButtonIndex = 1;
    }
  }
  actTextItem[actButtonIndex].classList.add("is-selected");
};

const actFunc = () => {
  currentType = "act";
  clearMainWindow();
  actText.classList.remove("is-hidden");
  for (let i = 0; i < actArray.length; i++) {
    let newAct = document.createElement("span");
    newAct.classList.add("act-text-item");
    newAct.innerText = "＊　" + actArray[i].action;
    actText.appendChild(newAct);
  }
  actTextItem = document.querySelectorAll(".act-text-item");
  actTextItem[0].classList.add("is-selected");
};

const actButtonSelectEnter = () => {
  clearMainWindow();
  showActPhrase(actButtonIndex);
  actButtonIndex = 0;
  currentType = "act-phrase";
};

const showActPhrase = (index) => {
  actText.innerHTML = "";
  typeConts.classList.remove("is-hidden");
  typeText(actArray[index].phrase);
};

// ------------------------------
// item
// ------------------------------

const itemFunc = () => {
  currentType = "item";
  clearMainWindow();
  typeConts.classList.remove("is-hidden");
  typeText(itemPhrase);
};

// ------------------------------
// mercy
// ------------------------------

const mercyFunc = () => {
  currentType = "mercy";
  clearMainWindow();
  typeConts.classList.remove("is-hidden");
  typeText(itemPhrase);
};

// ------------------------------
// reset
// ------------------------------

const resetMainWindow = () => {
  clearMainWindow();
  typeConts.classList.remove("is-hidden");
  currentType = "command";
  choiceButtons.forEach((el) => {
    el.classList.remove("is-selected");
  });
  choiceButtons[0].classList.add("is-selected");
  choiceButtons[commandButtonIndex].firstElementChild.src =
    choiceButtonsIcon[commandButtonIndex].normal;
  choiceButtons[0].firstElementChild.src = choiceButtonsIcon[0].selected;
  commandButtonIndex = 0;
  typeText(mainPhrase);
};

const clearMainWindow = () => {
  clearTimeout(typeTextTimeout);
  typePhraseIndex = 0;
  typeConts.innerHTML = "";
  typeConts.classList.add("is-hidden");
  actText.classList.add("is-hidden");
  fightBg.classList.add("is-hidden");
};

// ------------------------------
// enemy attack
// ------------------------------

const enemysAttackFunc = () => {
  currentType = "enemy-attack";
  mainWindow.classList.add("will-be-attacked");
  newHeartImg = document.createElement("img");
  createNewHeartImg(newHeartImg);
  const gif = document.createElement("img");
  let newCollisionTimer = collisionTimer();
  addEnemyAttackGif(gif);
  setTimeout(() => {
    newHeartImg.remove();
    gif.remove();
    clearInterval(newCollisionTimer);
    hideEnemysAttack();
  }, enemyAttackTimer);
  enemyAttackEndReset = setTimeout(() => {
    resetMainWindow();
  }, enemyAttackTimer + 500);
};

const createNewHeartImg = () => {
  newHeartImg.setAttribute("src", "./static/image/heart.png");
  newHeartImg.setAttribute("width", "30px");
  newHeartImg.setAttribute("height", "30px");
  newHeartImg.setAttribute("id", "enemy-attack-player");
  newHeartImg.style.position = "absolute";
  newHeartImg.style.top = "50%";
  newHeartImg.style.left = "calc(50% - 15px)";
  mainWindow.appendChild(newHeartImg);
};

const addEnemyAttackGif = (gif) => {
  gif.setAttribute("src", "./static/image/kuma.gif");
  gif.classList.add("enemy-attack-gif");
  mainWindow.appendChild(gif);
};

const collisionTimer = () => {
  return setInterval(() => {
    collisionCheck();
  }, 100);
};

const collisionCheck = () => {
  if (isUndying) return;
  let [gifX, gifY] = enemyPosition();
  let [playerX, playerY] = playerPosition();

  const limitDistance = 15;
  if (
    difference(gifX, playerX) < limitDistance ||
    difference(gifY, playerY) < limitDistance
  ) {
    isUndying = true;
    playerDamageAnim();
    playerDamageGage();
    playerHPNumDisplay();
  }
};

const difference = (a, b) => {
  return Math.abs(a - b);
};

const playerDamageAnim = () => {
  const player = document.getElementById("enemy-attack-player");
  player.style.animation = "playerDamageAnim 1s linear";
  setTimeout(() => {
    player.style.animation = "none";
    isUndying = false;
  }, 1000);
};

const playerDamageGage = () => {
  const gageDamage = 4;
  // const gageDamage = 50;
  const playerHP = document.getElementById("player-hp-box");
  const playerHPWidth = getComputedStyle(playerHP).width;
  const playerHPWidthNum = Number(playerHPWidth.replace(/px/g, ""));
  if (playerHPWidthNum - gageDamage >= 0) {
    playerHP.style.width = playerHPWidthNum - gageDamage + "px";
  } else {
    playerHP.style.width = "0px";
    showGameover();
    clearTimeout(enemyAttackEndReset);
    setTimeout(() => {
      typeGameover();
    }, 2300);
  }
};

const showGameover = () => {
  // resetMainWindow();
  const gameoverWindow = document.getElementById("gameover-window");
  const gameoverWindowText = document.getElementById("gameover-window-text");
  gameoverWindow.classList.remove("is-hidden");
  gameoverWindowText.classList.remove("is-hidden");
};

const typeGameover = () => {
  const gameoverTypeText = document.getElementById("gameover-type-anim");
  gameoverTypeText.innerHTML = gameoverPhrase.substring(0, typePhraseIndex++);
  if (typePhraseIndex <= gameoverPhrase.length) {
    typeTextTimeout = setTimeout(() => {
      typeGameover(gameoverPhrase);
    }, 50);
  } else {
    clearTimeout(typeTextTimeout);
    typePhraseIndex = 0;
  }
};

const playerHPNumDisplay = () => {
  const numDamage = 1.25;
  const hpNumNode = document.getElementById("player-status-hp-num");
  let hpNum = Number(hpNumNode.textContent);
  if (hpNum - numDamage >= 0) {
    hpNum -= numDamage;
    hpNumNode.innerText = Math.round(hpNum);
  } else {
    hpNumNode.innerText = 0;
  }
};

const enemyPosition = () => {
  const gif = document.getElementsByClassName("enemy-attack-gif")[0];
  let gifRect = gif.getBoundingClientRect();
  let x = Number(gifRect.left) + Number(gifRect.right) / 2;
  let y = Number(gifRect.top) + Number(gifRect.bottom) / 2;
  return [x, y];
};

const playerPosition = () => {
  const player = document.getElementById("enemy-attack-player");
  const playerRect = player.getBoundingClientRect();
  let x = Number(playerRect.left) + Number(playerRect.right) / 2;
  let y = Number(playerRect.top) + Number(playerRect.bottom) / 2;
  return [x, y];
};

const inputHeartMove = (keyCode) => {
  let heartPosX = getComputedStyle(newHeartImg).left;
  let heartPosY = getComputedStyle(newHeartImg).top;
  heartPosX = Number(heartPosX.replace(/px/g, ""));
  heartPosY = Number(heartPosY.replace(/px/g, ""));
  let speed = 5;

  intervalArray.push(
    (inputHeartMoveInterval = setInterval(() => {
      if (keyCode === 37 && heartPosX > -10) heartPosX = heartPosX - speed;
      if (keyCode === 38 && heartPosY > -10) heartPosY = heartPosY - speed;
      if (keyCode === 39 && heartPosX < 270) heartPosX = heartPosX + speed;
      if (keyCode === 40 && heartPosY < 185) heartPosY = heartPosY + speed;
      newHeartImg.style.left = heartPosX + "px";
      newHeartImg.style.top = heartPosY + "px";
    }, 20))
  );
  intervalArray.push(inputHeartMoveInterval);
};

const hideEnemysAttack = () => {
  mainWindow.style.animation =
    " windowScale 0.5s linear forwards, windowScale 0.5s linear reverse forwards";
  setTimeout(() => {
    mainWindow.classList.remove("will-be-attacked");
    mainWindow.style.animation = "";
  }, 1000);
};

// ------------------------------
// game end
// ------------------------------

const hideEnemyImage = () => {
  enemyImg.classList.add("is-hidden");
};

window.addEventListener("load", () => {
  initDevice();
  initAttach();
  initCommandEvent();
  typeText(mainPhrase);
});
