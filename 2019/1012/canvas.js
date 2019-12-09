window.addEventListener(
  "load",
  (init = () => {
    // サイズを指定
    const width = window.innerWidth;
    const height = window.innerHeight;
    const randomColor = ["0xf67280", "0x6c5b7b", "0x35477d"];

    // レンダラー作成
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("canvas"),
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xefefef);

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, 1000);

    let rot = 0;
    let mouseX = 0;

    // radian変換
    const radian = (rot * Math.PI) / 180;
    // 角度に応じてカメラ位置を設定
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);

    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    document.addEventListener("mousemove", event => {
      mouseX = event.pageX;
    });

    // 箱をつくりゅ
    const geometry = new THREE.TetrahedronBufferGeometry(15);

    const group = new THREE.Group();
    scene.add(group);
    let box;
    let boxNum = 2;

    const mat = new THREE.MeshPhongMaterial({
      color: 0x2d2d2d
    });

    // obj01
    const obj = new THREE.Mesh(geometry, mat);
    obj.position.x = 80;
    obj.position.y = -8;
    obj.position.z = 900;
    scene.add(obj);

    // obj02
    const obj02 = new THREE.Mesh(geometry, mat);
    obj02.position.x = 70;
    obj02.position.y = -20;
    obj02.position.z = 850;
    scene.add(obj02);

    // obj03
    const obj03 = new THREE.Mesh(geometry, mat);
    obj03.position.x = -70;
    obj03.position.y = 20;
    obj03.position.z = 800;
    scene.add(obj03);

    // obj04
    const obj04 = new THREE.Mesh(geometry, mat);
    obj04.position.x = -120;
    obj04.position.y = 50;
    obj04.position.z = 760;
    scene.add(obj04);

    // obj05
    const obj05 = new THREE.Mesh(geometry, mat);
    obj05.position.x = -40;
    obj05.position.y = 40;
    obj05.position.z = 900;
    scene.add(obj05);

    // obj06
    const obj06 = new THREE.Mesh(geometry, mat);
    obj06.position.x = 90;
    obj06.position.y = -10;
    obj06.position.z = 700;
    scene.add(obj06);

    // left
    // obj07
    const obj07 = new THREE.Mesh(geometry, mat);
    obj07.position.x = Math.random() * (10 + 150) - 150;
    obj07.position.y = Math.random() * (90 - 10) + 10;
    obj07.position.z = Math.random() * (800 - 500) + 500;
    scene.add(obj07);

    // obj08
    const obj08 = new THREE.Mesh(geometry, mat);
    obj08.position.x = Math.random() * (15 + 150) - 150;
    obj08.position.y = Math.random() * (90 - 10) + 10;
    obj08.position.z = Math.random() * (800 - 500) + 500;
    scene.add(obj08);

    // obj12
    const obj12 = new THREE.Mesh(geometry, mat);
    obj12.position.x = Math.random() * (50 + 150) - 150;
    obj12.position.y = Math.random() * (90 - 10) + 10;
    obj12.position.z = Math.random() * (800 - 500) + 500;
    scene.add(obj12);

    // obj13
    const obj13 = new THREE.Mesh(geometry, mat);
    obj13.position.x = Math.random() * (50 + 150) - 150;
    obj13.position.y = Math.random() * (90 - 10) + 10;
    obj13.position.z = Math.random() * (800 - 500) + 500;
    scene.add(obj13);

    // right
    // obj09
    const obj09 = new THREE.Mesh(geometry, mat);
    obj09.position.x = Math.random() * (-20 - 180) + 180;
    obj09.position.y = Math.random() * (-10 + 90) - 90;
    obj09.position.z = Math.random() * (800 - 500) + 500;
    scene.add(obj09);

    // obj10
    const obj10 = new THREE.Mesh(geometry, mat);
    obj10.position.x = Math.random() * (-30 - 180) + 180;
    obj10.position.y = Math.random() * (-15 + 90) - 90;
    obj10.position.z = Math.random() * (800 - 500) + 500;
    scene.add(obj10);

    // obj11
    const obj11 = new THREE.Mesh(geometry, mat);
    obj11.position.x = Math.random() * (-30 - 180) + 180;
    obj11.position.y = Math.random() * (-30 + 90) - 90;
    obj11.position.z = Math.random() * (800 - 500) + 500;
    scene.add(obj11);

    // for (let x = 0; x < boxNum; x++) {
    //   for (let y = 0; y < boxNum; y++) {
    //     for (let z = 0; z < boxNum; z++) {
    //       box = new THREE.Mesh(geometry, mat);
    //       box.position.x = Math.random() * (180 + 180) - 180;
    //       box.position.y = Math.random() * (80 + 80) - 80;
    //       box.position.z = Math.random() * (800 - 500) + 500;

    //       group.add(box);

    //       group.rotation.z = 100;
    //     }
    //   }
    // }
    // scene.add(box);

    const planeGeo = new THREE.PlaneBufferGeometry(40, 160);
    const planeGeo2 = new THREE.PlaneBufferGeometry(300, 40);
    const planeMat = new THREE.MeshLambertMaterial({
      color: 0xeeeeee
    });

    // 01
    const plane01 = new THREE.Mesh(planeGeo, planeMat);
    plane01.rotation.y = 1;
    plane01.position.x = -130;
    // plane01.position.x = width * -0.1;
    plane01.position.z = 820;
    scene.add(plane01);

    // 02
    const plane02 = new THREE.Mesh(planeGeo, planeMat);
    plane02.rotation.y = -1;
    plane02.position.x = 160;
    // plane01.position.x = width;
    plane02.position.z = 820;
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

    // ligh
    const directionalLight = new THREE.PointLight(0xffffff, 1.6);
    directionalLight.position.set(0, 0, 1000);
    scene.add(directionalLight);
    let tick = () => {
      obj.rotation.z += 0.015;
      obj.rotation.x -= 0.008;

      obj02.rotation.y -= 0.004;
      obj02.rotation.z += 0.004;

      obj03.rotation.z -= 0.01;
      obj03.rotation.x += 0.01;

      obj04.rotation.x -= 0.008;
      obj04.rotation.z += 0.008;

      obj05.rotation.y += 0.01;
      obj05.rotation.z += 0.01;

      obj06.rotation.y += 0.01;
      obj06.rotation.z += 0.01;

      obj07.rotation.x -= 0.01;
      obj07.rotation.z -= 0.01;

      obj08.rotation.y -= 0.009;
      obj08.rotation.z += 0.02;

      obj09.rotation.x -= 0.01;
      obj09.rotation.z -= 0.005;

      obj10.rotation.y += 0.008;
      obj10.rotation.x += 0.007;

      obj11.rotation.y -= 0.01;
      obj11.rotation.z -= 0.01;

      obj12.rotation.y -= 0.01;
      obj12.rotation.z -= 0.01;

      obj13.rotation.y -= 0.01;
      obj13.rotation.z -= 0.01;

      renderer.render(scene, camera);

      const targetRot = (mouseX / window.innerWidth) * 20;
      // easing
      // rot += (targetRot - rot) * 0.001;

      const radian = (targetRot * Math.PI) / 180;
      camera.position.x = 100 * Math.sin(radian);
      // camera.position.z = 600 * Math.sin(radian);

      camera.lookAt(new THREE.Vector3(0, 0, 0));

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

// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }
