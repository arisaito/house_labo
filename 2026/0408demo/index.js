import { scenes } from "./script.js";

const CHAR_INTERVAL = 0.12; // 文字表示間隔（秒）
const EN_CHAR_INTERVAL = CHAR_INTERVAL * 0.5;
const WAIT_AFTER = 3.5; // 全文表示後の待機（秒）
const FADE_DURATION = 0.0; // フェードアウト時間（秒）
const CURSOR_BLINK = 0.5;

let cursorTimer = null;

// dom
const getAllScenes = () => document.querySelectorAll(".scene");
const showScene = (scene) => (scene.style.opacity = "1");
const hideAllScenes = () =>
  getAllScenes().forEach((s) => (s.style.opacity = "0"));

// triangle
const showCursor = (el) => {
  el.style.opacity = "1";
  cursorTimer = setInterval(() => {
    el.style.opacity = el.style.opacity === "0" ? "1" : "0";
  }, CURSOR_BLINK * 1000);
};

const hideCursor = (el) => {
  clearInterval(cursorTimer);
  cursorTimer = null;
  el.style.opacity = "0";
};

// anim
const typewriterTimeline = (spans, onComplete) => {
  const tl = gsap.timeline({
    onComplete,
  });
  spans.forEach((span, i) => {
    tl
      //
      .to(
        span,
        {
          opacity: 1,
          duration: 0,
        },
        i * CHAR_INTERVAL,
      );
  });
  return tl;
};

const fadeOutSerif = (serifEl, onComplete) => {
  gsap.to(serifEl, {
    opacity: 0,
    duration: FADE_DURATION,
    onComplete: () => {
      serifEl.style.opacity = "1";
      onComplete();
    },
  });
};

const splitWordToSpans = (wordEl) => {
  const text = wordEl.textContent.trim();
  wordEl.innerHTML = text
    .split("")
    .map((ch) => `<span style="opacity:0">${ch}</span>`)
    .join("");
  return wordEl.querySelectorAll("span");
};

// loop
const buildScene = (index) => {
  const sceneData = scenes[index % scenes.length];
  const scenesEl = getAllScenes();
  const scene = scenesEl[index % scenesEl.length];

  hideAllScenes();
  showScene(scene);

  // まず単語要素を組み立てる
  scene.innerHTML = sceneData.jp
    .map((word) => `<span class="word size-${word.size}">${word.text}</span>`)
    .join("");

  // 単語ごとにspanに分割して、全spanをフラットに集める
  const allSpans = [...scene.querySelectorAll(".word")].flatMap((wordEl) => [
    ...splitWordToSpans(wordEl),
  ]);

  const cursor = document.querySelector(".next-cursor");
  const nextIndex = (index + 1) % scenes.length;

  // EN
  const enEl = document.querySelector(".scene-en");
  enEl.innerHTML = sceneData.en
    .split("")
    .map((ch) => `<span style="opacity:0">${ch}</span>`)
    .join("");
  const enSpans = enEl.querySelectorAll("span");

  const jpTl = typewriterTimeline(allSpans, null);
  const enTl = gsap.timeline({
    onComplete: () => {
      showCursor(cursor);
      gsap.delayedCall(WAIT_AFTER, () => {
        hideCursor(cursor);
        fadeOutSerif(enEl, () => {});
        fadeOutSerif(scene, () => buildScene(nextIndex));
      });
    },
  });
  enSpans.forEach((span, i) => {
    enTl.to(span, { opacity: 1, duration: 0 }, i * EN_CHAR_INTERVAL);
  });
};

window.addEventListener("DOMContentLoaded", () => {
  buildScene(0);
});
