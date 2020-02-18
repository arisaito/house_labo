var getDevice = (function() {
  var ua = navigator.userAgent;
  if (
    ua.indexOf("iPhone") > 0 ||
    ua.indexOf("iPod") > 0 ||
    (ua.indexOf("Android") > 0 && ua.indexOf("Mobile") > 0)
  ) {
    return "sp";
  } else if (ua.indexOf("iPad") > 0 || ua.indexOf("Android") > 0) {
    return "tab";
  } else {
    return "other";
  }
})();

window.addEventListener("load", function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, 1000);

  // 原点方向を見つめる
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  if (getDevice == "sp") {
    console.log("スマホ");
  } else if (getDevice == "tab") {
    console.log("タブレット");
  } else if (getDevice == "other") {
    console.log("その他");
    if (width >= 1500) {
    } else if (width < 1500 && width >= 500) {
    } else {
    }
  }

  // light
  const directionalLight = new THREE.PointLight(0xffffff, 1.6);
  directionalLight.position.set(0, 0, 1000);
  scene.add(directionalLight);

  function tick() {
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }

  tick();

  onResize();
  window.addEventListener("resize", onResize);
  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    console.log(width);
  }
});
