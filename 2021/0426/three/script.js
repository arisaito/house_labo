window.onload = () => init();
let theta = 0;
const init = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラー
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーン
  const scene = new THREE.Scene();

  // カメラ
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1000);

  // box
  const boxScale = width / 2;
  const geometry = new THREE.IcosahedronGeometry(boxScale);
  const material = new THREE.MeshNormalMaterial();
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);

  // composer
  const composer = new EffectComposer(renderer);

  const tick = () => {
    // 角度　つまりはスピード
    theta += 0.04;
    // let amplitude = 10;
    box.rotation.y += 0.01;
    box.rotation.x += 0.01;
    // 振り幅
    let amplitude = 0.1;
    let scale = 0.5 + Math.sin(theta) * amplitude;
    box.scale.set(scale, scale, scale);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
};
