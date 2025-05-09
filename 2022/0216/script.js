(() => {
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      init();
      run = true;
      render();
    },
    false
  );

  const isMobile = () => {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      return true;
    } else {
      return false;
    }
  };

  let run = true;
  let scene;
  let camera;
  let renderer;
  let geometry;
  let material;
  let ground;
  let directionalLight;
  let ambientLight;

  let scrollAmount = 0;
  let photoGroup;

  let container;
  let photoNum = 14;
  let scrollUnit = 970;
  let scrollLimit;

  console.log(isMobile());

  const CAMERA_PARAM = {
    fovy: 60,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 30.0,
    x: isMobile() ? 9.0 : 6.0,
    y: 0.0,
    z: isMobile() ? 10.0 : 10.0,
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };

  const RENDERER_PARAM = {
    clearColor: 0xbac8d3,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const MATERIAL_PARAM = {
    color: 0x495f7c,
    specular: 0xffffff,
  };

  const DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1,
    x: 1.0,
    y: 1.0,
    z: 1.0,
  };

  const AMBIENT_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 0.2,
  };

  const getScrollAmount = () => {
    scrollAmount = container.scrollTop;
    photoGroup.position.z = scrollAmount * 0.01;
  };

  const init = () => {
    scene = new THREE.Scene();

    container = document.getElementById("container");
    const scrollFilter = document.getElementById("scroll-filter");
    scrollLimit = scrollUnit * (photoNum + 0.5);
    console.log(scrollLimit);
    scrollFilter.style.height = scrollLimit + "px";

    container.addEventListener("scroll", getScrollAmount, false);

    scene.fog = new THREE.Fog(0xbac8d3, 10, 20);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
    renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
    renderer.setPixelRatio(window.devicePixelRatio);

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

    material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);

    // プレーンジオメトリの生成とメッシュ化
    geometry = new THREE.PlaneGeometry(40.0, 40.0);
    ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2.0;
    ground.position.set(0.0, -3.0, 0.0);
    scene.add(ground);

    // 画像を読み込む
    photoGroup = new THREE.Group();
    for (let i = 0; i <= 13; i++) {
      let num = i >= 10 ? i : "0" + i;
      const texture = new THREE.TextureLoader().load(
        `./image/${num}.jpg`,
        (tex) => {
          const w = 0.5;
          const h = tex.image.height / (tex.image.width / w);
          const z = Number(num) * 10;
          const geo = new THREE.PlaneGeometry(20.0, 20.0);
          const mat = new THREE.MeshPhongMaterial({ map: tex });
          const plane = new THREE.Mesh(geo, mat);
          plane.scale.set(w, h, 1);
          plane.position.set(0, 0, -z);
          photoGroup.add(plane);
        }
      );
    }
    scene.add(photoGroup);

    directionalLight = new THREE.DirectionalLight(
      DIRECTIONAL_LIGHT_PARAM.color,
      DIRECTIONAL_LIGHT_PARAM.intensity
    );
    directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
    directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
    directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
    scene.add(directionalLight);

    ambientLight = new THREE.AmbientLight(
      AMBIENT_LIGHT_PARAM.color,
      AMBIENT_LIGHT_PARAM.intensity
    );
    scene.add(ambientLight);
  };

  const onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  window.addEventListener("resize", () => {
    onResize();
  });

  const render = () => {
    if (run === true) {
      requestAnimationFrame(render);
    }

    renderer.render(scene, camera);
  };
})();
