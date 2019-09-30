window.addEventListener(
  "load",
  (init = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const loading = document.getElementById("loading");

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("canvas"),
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xf7f7f7);

    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, 0);

    let rot = 0;
    let mouseX = 0;

    // radian変換
    const radian = (rot * Math.PI) / 180;
    // 角度に応じてカメラ位置を設定
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);

    document.addEventListener("mousemove", event => {
      mouseX = event.pageX;
    });

    // obj 01

    const group = new THREE.Group();
    scene.add(group);

    const num = 130;
    for (let i = 0; i < num; i++) {
      const material = new THREE.MeshNormalMaterial({
        wireframe: false
      });
      const geometry = new THREE.TetrahedronBufferGeometry(1.5);

      const obj = new THREE.Mesh(geometry, material);
      obj.position.x = Math.random() * (150 + 150) - 150;
      obj.position.y = Math.random() * (15 + 15) - 15;
      obj.position.z = Math.random() * (150 + 150) - 150;
      obj.rotation.x = (Math.random() - 0.1) * 10;
      obj.rotation.y = (Math.random() - 0.1) * 10;
      group.add(obj);
    }

    // obj 02

    let loader = new THREE.OBJLoader();
    let object;

    // load a resource
    loader.load(
      // resource URL
      "./shoes.obj",
      // called when resource is loaded
      function(object) {
        object.scale.set(0.25, 0.25, 0.25);
        object.position.set(0, -20, 0);
        object.rotation.set(0, -1, -0.4);

        if (width < height) {
          object.scale.set(0.18, 0.18, 0.18);
          object.position.set(0, -10, 5);
        }

        const material02 = new THREE.MeshPhongMaterial({
          color: 0x2866d8,
          blending: THREE.AdditiveBlending // ブレンドモード
        });

        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = material02;
          }
        });
        scene.add(object);
        loading.style.display = "none";
      },
      // called when loading is in progresses
      function(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function(error) {
        console.log("An error happened");
      }
    );

    // light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    ambientLight.position.set(-1, -1, -1);
    scene.add(ambientLight);

    let tick = () => {
      group.rotation.y -= 0.0007;
      group.rotation.x = 0.2;

      let targetRot = (mouseX / width) * 360;
      if (width < height) {
        targetRot = 360;
      }
      // const targetRot = 360;
      // easing
      rot += (targetRot - rot) * 0.0005;

      const radian = (rot * Math.PI) / 180;
      camera.position.x = 100 * Math.sin(radian);
      camera.position.z = 150 * Math.cos(radian);
      camera.position.y = -10 * Math.sin(radian);

      camera.lookAt(new THREE.Vector3(10, 0, 0));

      renderer.render(scene, camera);

      requestAnimationFrame(tick);
    };

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
    }
  })
);
