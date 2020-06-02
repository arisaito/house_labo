let loading;
let mobileFlag = false;
let tabFlag = false;

const getDevice = (function () {
  var ua = navigator.userAgent;
  if (
    ua.indexOf("iPhone") > 0 ||
    ua.indexOf("iPod") > 0 ||
    (ua.indexOf("Android") > 0 && ua.indexOf("Mobile") > 0)
  ) {
    mobileFlag = true;
    console.log("📱");
    return "sp";
  } else if (ua.indexOf("iPad") > 0 || ua.indexOf("Android") > 0) {
    tabFlag = true;
    console.log("たぶ");
    return "tab";
  } else {
    return "other";
  }
})();

window.addEventListener("load", function init() {
  loading = document.getElementById("loading-bg");
  loading.classList.add("is-hidden");

  const width = window.innerWidth;
  const height = window.innerHeight;
  // const randomColor = ["0xf67280", "0x6c5b7b", "0x35477d"];
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    alpha: true,
    antialias: true,
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

  document.addEventListener("mousemove", (event) => {
    mouseX = event.pageX;
  });

  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("./src/");
  mtlLoader.load("thebox.mtl", (materials) => {
    materials.preload();

    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("./src/");
    objLoader.load("thebox.obj", (object) => {
      const mesh = object;
      mesh.position.z = 995;
      mesh.position.x = 9;
      mesh.scale.set(70, 35, 110);
      if (mobileFlag === true || tabFlag === true) {
        mesh.scale.x = 23;
        mesh.position.x = 0;
      }
      scene.add(mesh);
    });
  });

  // light
  const directionalLight = new THREE.PointLight(0xfdfdfd, 1.6);
  directionalLight.position.set(-3, 1, 1000);
  scene.add(directionalLight);
  const pointLight2 = new THREE.PointLight(0xfdfdfd, 1.6);
  pointLight2.position.set(10, 1, 1000);
  scene.add(pointLight2);
  const hemisphere = new THREE.HemisphereLight(0x666666, 0xeeeeee, 0.2);
  scene.add(hemisphere);

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
    console.log(width);
  }
});
