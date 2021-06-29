(() => {
  window.addEventListener("DOMContentLoaded", () => {
    window.addEventListener(
      "resize",
      () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      },
      false
    );

    const loader = new THREE.TextureLoader();
    skyboxTexture = loader.load("./nebura4.png");
    sunTexture = loader.load("./sun.jpeg");
    earthTexture = loader.load("./earth.jpeg");
    moonTexture = loader.load("./moon.jpeg");
    init();
  });

  let startTime;

  let scene;
  let camera;
  let renderer;
  let geometry;
  let controls;
  let directionalLight;
  let ambientLight;

  let skybox;
  let skyboxMaterial;
  let skyboxTexture;

  let earth;
  let earthMaterial;
  let earthTexture;
  let earthGroup;
  let moon;
  let moonMaterial;
  let moonTexture;

  let sun;
  let sunMaterial;
  let sunTexture;

  let composer;
  let renderPass;

  let pixelPass;

  const EARTH_RANGE = 5;
  const MOON_RANGE = 1;

  const CAMERA_PARAM = {
    fovy: 60,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 30.0,
    x: 0.0,
    y: 5.0,
    z: 10.0,
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };

  const RENDERER_PARAM = {
    clearColor: 0x1920a0,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const MATERIAL_PARAM = {
    color: 0xffffff,
  };

  const DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 0.2,
    x: 1.0,
    y: 1.0,
    z: 1.0,
  };

  const AMBIENT_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.4,
  };

  const PIXEL_PARAM = {
    pixelSize: 8,
    postprocessing: true,
  };

  const init = () => {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
    const wrapper = document.querySelector("#webgl");
    wrapper.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
      CAMERA_PARAM.fovy,
      CAMERA_PARAM.aspect,
      CAMERA_PARAM.near,
      CAMERA_PARAM.far
    );

    camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
    camera.lookAt(CAMERA_PARAM.lookAt);

    geometry = new THREE.SphereGeometry(1.0, 64, 64);

    skyboxMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
    });
    skyboxMaterial.map = skyboxTexture;
    skybox = new THREE.Mesh(geometry, skyboxMaterial);
    skybox.scale.set(10, 10, 10);
    scene.add(skybox);

    sunMaterial = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
    sunMaterial.map = sunTexture;
    sun = new THREE.Mesh(geometry, sunMaterial);
    sun.scale.set(2, 2, 2);
    scene.add(sun);

    earthMaterial = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
    earth = new THREE.Mesh(geometry, earthMaterial);
    earthMaterial.map = earthTexture;
    earth.scale.setScalar(0.4);

    moonMaterial = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
    moonMaterial.map = moonTexture;
    moon = new THREE.Mesh(geometry, moonMaterial);
    moon.scale.setScalar(0.15);
    moon.position.x = 1;

    earthGroup = new THREE.Group();
    earthGroup.add(earth);
    earthGroup.add(moon);
    scene.add(earthGroup);

    earthGroup.position.set(EARTH_RANGE, 0.0, 0.0);

    directionalLight = new THREE.DirectionalLight(
      DIRECTIONAL_LIGHT_PARAM.color,
      DIRECTIONAL_LIGHT_PARAM.intensity
    );
    directionalLight.position.set(
      DIRECTIONAL_LIGHT_PARAM.x,
      DIRECTIONAL_LIGHT_PARAM.y,
      DIRECTIONAL_LIGHT_PARAM.z
    );
    scene.add(directionalLight);

    ambientLight = new THREE.AmbientLight(
      AMBIENT_LIGHT_PARAM.color,
      AMBIENT_LIGHT_PARAM.intensity
    );
    scene.add(ambientLight);

    //     postprocess
    composer = new THREE.EffectComposer(renderer);
    renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    // let glitchPass = new THREE.GlitchPass();
    // composer.addPass(glitchPass);
    // // 4. グリッチパスまで終わったら画面に描画結果を出すよう指示する
    // glitchPass.renderToScreen = true;

    // let pixelshader = ();
    pixelPass = new THREE.ShaderPass(THREE.PixelShader);
    pixelPass.uniforms["pixelSize"].value = PIXEL_PARAM.pixelSize;
    pixelPass.uniforms["resolution"].value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    );
    pixelPass.uniforms["resolution"].value.multiplyScalar(
      window.devicePixelRatio
    );
    composer.addPass(pixelPass);
    pixelPass.renderToScreen = true;

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    startTime = Date.now();
    render();
  };

  const render = () => {
    requestAnimationFrame(render);

    const nowTime = (Date.now() - startTime) / 1000;
    const earthSin = Math.sin(nowTime / 1);
    const earthCos = Math.cos(nowTime / 1);
    const moonSin = Math.sin(nowTime * 2.3);
    const moonCos = Math.cos(nowTime * 2.3);

    earthGroup.rotation.y += 0.001;
    earthGroup.rotation.z += 0.005;
    sun.rotation.y -= 0.005;
    sun.rotation.x += 0.001;

    moon.position.set(moonCos * MOON_RANGE, 0.0, moonSin * MOON_RANGE);
    earthGroup.position.set(
      earthCos * EARTH_RANGE,
      0.0,
      earthSin * EARTH_RANGE
    );

    composer.render();
    // renderer.render(scene, camera);
  };
})();
