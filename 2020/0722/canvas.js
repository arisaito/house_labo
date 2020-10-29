window.addEventListener("load", init);

function init() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
  });
}
