(() => {
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      // 初期化処理
      init();
      // 描画処理
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

  let run = true; // レンダリングループフラグ
  let isDown = false; // スペースキーが押されているかどうかのフラグ

  // three.js に関連するオブジェクト用の変数
  let scene; // シーン
  let camera; // カメラ
  let renderer; // レンダラ
  let geometry; // ジオメトリ
  let material; // マテリアル
  let ground; // プレーンメッシュ
  let directionalLight; // ディレクショナル・ライト（平行光源）
  let ambientLight; // アンビエントライト（環境光）

  let scrollAmount = 0;
  let photoGroup;

  console.log(isMobile());
  // カメラに関するパラメータ
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
  // レンダラに関するパラメータ
  const RENDERER_PARAM = {
    clearColor: 0xbac8d3,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  // マテリアルのパラメータ
  const MATERIAL_PARAM = {
    color: 0x495f7c, // マテリアル自体の色
    specular: 0xffffff, // スペキュラ成分（反射光）の色
  };
  // ポイント専用マテリアルのパラメータ @@@
  const MATERIAL_PARAM_POINT = {
    color: 0xffffff, // マテリアル自体の色
    size: 0.05, // 点の大きさ
  };
  // ライトに関するパラメータの定義
  const DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff, // 光の色
    intensity: 1, // 光の強度
    x: 1.0, // 光の向きを表すベクトルの X 要素
    y: 1.0, // 光の向きを表すベクトルの Y 要素
    z: 1.0, // 光の向きを表すベクトルの Z 要素
  };
  // アンビエントライトに関するパラメータの定義
  const AMBIENT_LIGHT_PARAM = {
    color: 0xffffff, // 光の色
    intensity: 0.2, // 光の強度
  };

  const getScrollAmount = () => {
    scrollAmount = window.pageYOffset;
  };

  const init = () => {
    // シーン
    scene = new THREE.Scene();

    window.addEventListener("scroll", getScrollAmount, false);

    scene.fog = new THREE.Fog(0xbac8d3, 10, 20);
    // レンダラ
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
    renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const wrapper = document.querySelector("#webgl");
    wrapper.appendChild(renderer.domElement);

    // カメラ
    camera = new THREE.PerspectiveCamera(
      CAMERA_PARAM.fovy,
      CAMERA_PARAM.aspect,
      CAMERA_PARAM.near,
      CAMERA_PARAM.far
    );
    camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
    camera.lookAt(CAMERA_PARAM.lookAt);

    // マテリアル（以下のメッシュ生成ではこのマテリアルを使いまわす）
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

    // ディレクショナルライト
    directionalLight = new THREE.DirectionalLight(
      DIRECTIONAL_LIGHT_PARAM.color,
      DIRECTIONAL_LIGHT_PARAM.intensity
    );
    directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
    directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
    directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
    scene.add(directionalLight);

    // アンビエントライト
    ambientLight = new THREE.AmbientLight(
      AMBIENT_LIGHT_PARAM.color,
      AMBIENT_LIGHT_PARAM.intensity
    );
    scene.add(ambientLight);

    // 軸ヘルパー
    //     axesHelper = new THREE.AxesHelper(5.0);
    //     scene.add(axesHelper);

    // コントロール
    //     controls = new THREE.OrbitControls(camera, renderer.domElement);
  };

  const onResize = () => {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーのサイズを調整する
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // カメラのアスペクト比を正す
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  window.addEventListener("resize", () => {
    onResize();
  });

  const render = () => {
    // 再帰呼び出し
    if (run === true) {
      requestAnimationFrame(render);
    }
    photoGroup.position.z = -scrollAmount * -0.01;

    // 描画
    renderer.render(scene, camera);
  };
})();
