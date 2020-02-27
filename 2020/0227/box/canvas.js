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
  const randomColor = ["0xf67280", "0x6c5b7b", "0x35477d"];
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

  let rot = 0;
  let mouseX = 0;
  const radian = (rot * Math.PI) / 180;
  // 角度に応じてカメラ位置を設定
  camera.position.x = 1000 * Math.sin(radian);
  camera.position.z = 1000 * Math.cos(radian);

  // 原点方向を見つめる
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  document.addEventListener("mousemove", event => {
    mouseX = event.pageX;
  });

  const planeGeo = new THREE.PlaneBufferGeometry(50, 160);
  const planeGeo2 = new THREE.PlaneBufferGeometry(300, 40);
  const planeMat = new THREE.MeshLambertMaterial({
    color: 0xeeeeee
  });

  // 01
  const plane01 = new THREE.Mesh(planeGeo, planeMat);
  plane01.rotation.y = 1;
  plane01.position.x = width / -10;
  plane01.position.z = 824;
  scene.add(plane01);

  // 02
  const plane02 = new THREE.Mesh(planeGeo, planeMat);
  plane02.rotation.y = -1.2;
  plane02.position.x = width / 8.7;

  if (getDevice == "sp") {
    console.log("スマホ");
  } else if (getDevice == "tab") {
    console.log("タブレット");
  } else if (getDevice == "other") {
    console.log("その他");
    if (width >= 1500) {
      plane02.position.z = 825;
    } else if (width < 1500 && width >= 500) {
      plane02.position.z = 827;
    } else {
      plane02.position.z = 828;
    }
  }

  scene.add(plane02);

  // 03
  const plane03 = new THREE.Mesh(planeGeo2, planeMat);
  plane03.rotation.x = 1;
  // plane03.rotation.z = 4.7;
  plane03.position.x = 0;
  plane03.position.z = 820;
  plane03.position.y = 70;
  scene.add(plane03);

  // 04
  const plane04 = new THREE.Mesh(planeGeo2, planeMat);
  plane04.rotation.x = -1;
  // plane03.rotation.z = 4.7;
  plane04.position.z = 820;
  plane04.position.y = -70;
  scene.add(plane04);

  // light
  const directionalLight = new THREE.PointLight(0xffffff, 1.6);
  directionalLight.position.set(0, 0, 1000);
  scene.add(directionalLight);

  function tick() {
    renderer.render(scene, camera);

    const targetRot = (mouseX / window.innerWidth) * 10;
    // easing
    // rot += (targetRot - rot) * 0.001;

    const radian = (targetRot * Math.PI) / 180;
    camera.position.x = 100 * Math.sin(radian);
    // camera.position.z = 600 * Math.sin(radian);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

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

    plane01.position.x = width / -10;
    // plane02.position.x = width / 8;
    plane02.position.x = width / 8.7;
    if (width >= 1500) {
      plane02.position.z = 825;
    } else if (width < 1500 && width >= 500) {
      plane02.position.z = 827;
    } else {
      plane02.position.z = 828;
    }
    console.log(width);
  }
});
