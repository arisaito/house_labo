let mainPhrase = "＊　うざいくま があらわれた。<br>＊　ただの クソザコ。";
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
let inputHeartMoveInterval = null;
let currentType = "command";
let intervalArray = [];

let enemyLife = 200;
let enemyLifeDisplay = null;
let fightBg = null;
let movingLine = null;

let enemyAttackTimer = 5000;

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

const initAttach = () => {
  mainWindow = document.getElementById("main-window");
  typeConts = document.getElementById("type-anim");
  actText = document.getElementById("act-text");
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
    i = 0;
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
};

const attackEnter = () => {
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
  const enemyImg = document.getElementById("enemy-img");
  enemyLifeDisplay = document.getElementById("enemy-life");
  enemyLifeDisplay.classList.remove("is-hidden");
  enemyImg.classList.add("is-dameged");
  damegeText.innerText = damege;
  // width 500px // 500 / 200 = 2.5
  // damegeが100のとき width側では 100 * 2.5　減らせばいい
  let enemyLifeDisplayDamege = damege * 2.5;
  let enemyLifeDisplayWidth = getComputedStyle(enemyLifeDisplayGage).width;
  enemyLifeDisplayWidth = Number(enemyLifeDisplayWidth.replace(/px/g, ""));
  if (enemyLifeDisplayWidth - enemyLifeDisplayDamege >= 0) {
    enemyLifeDisplayGage.style.width =
      enemyLifeDisplayWidth - enemyLifeDisplayDamege + "px";
  } else {
    enemyLifeDisplayGage.style.width = "0px";
  }

  setTimeout(() => {
    hideEnemyLifeGage();
    clearMainWindow();
    // resetMainWindow();
    enemysAttackFunc();
    damegeText.innerText = "";
    movingLine.style.animation = "";
    enemyImg.classList.remove("is-dameged");
  }, 2000);
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
  // currentType = "item";
  // clearMainWindow();
  return;
};

// ------------------------------
// mercy
// ------------------------------

const mercyFunc = () => {
  // currentType = "mercy";
  // clearMainWindow();
  return;
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
    choiceButtonsIcon[commandButtonIndex].selected;
  // choiceButtons[0].firstElementChild.src = "./static/image/heart.png";
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

let newHeartImg = null;

// ------------------------------
// enemy attack
// ------------------------------

const enemysAttackFunc = () => {
  currentType = "enemy-attack";
  mainWindow.classList.add("will-be-attacked");
  newHeartImg = document.createElement("img");
  newHeartImg.setAttribute("src", "./static/image/heart.png");
  newHeartImg.setAttribute("width", "30px");
  newHeartImg.setAttribute("height", "30px");
  newHeartImg.style.position = "absolute";
  newHeartImg.style.top = "50%";
  newHeartImg.style.left = "calc(50% - 15px)";
  mainWindow.appendChild(newHeartImg);
  instanceEnemyAttack();
  setTimeout(() => {
    newHeartImg.remove();
    hideEnemysAttack();
  }, enemyAttackTimer);
  setTimeout(() => {
    resetMainWindow();
  }, enemyAttackTimer + 500);
};

let bulletWrapper = null;

const instanceEnemyAttack = () => {
  bulletWrapper = document.createElement("div");
  bulletWrapper.classList.add("bullet-wrapper");
  mainWindow.appendChild(bulletWrapper);
  instanceEmenyAttackChild();
  setTimeout(() => {
    mainWindow.removeChild(bulletWrapper);
  }, enemyAttackTimer);
};

const instanceEmenyAttackChild = () => {
  let bulletNum = 20;
  let newBullet = document.createElement("img");
  newBullet.setAttribute("src", "./static/image/bullet.png");
  newBullet.classList.add("bullet");
  for (var i = 0; i < bulletNum; i++) {
    setBullet(newBullet);
  }
};

const setBullet = (clone) => {
  let bulletClone = clone.cloneNode(true);
  let bulletStyle = bulletClone.style;
  bulletStyle.left = 100 * Math.random() - "7" + "%";
  bulletStyle.animationDelay = 2 * Math.random() + "s";
  bulletWrapper.appendChild(bulletClone);
  bulletClone.addEventListener("animationend", () => {
    bulletWrapper.removeChild(bulletClone);
    let newBullet = document.createElement("img");
    newBullet.setAttribute("src", "./static/image/bullet.png");
    newBullet.classList.add("bullet");
    setBullet(newBullet);
  });
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

window.addEventListener("load", () => {
  initAttach();
  initCommandEvent();
  typeText(mainPhrase);
});
