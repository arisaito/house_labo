import * as THREE from "./three.module.js";
import { EffectComposer } from "./postprocessing/EffectComposer.js";
import { RenderPass } from "./postprocessing/RenderPass.js";
import { BloomPass } from "./postprocessing/BloomPass.js";
import { FilmPass } from "./postprocessing/FilmPass.js";
import { ShaderPass } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/ShaderPass.js";
import { PixelShader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/shaders/PixelShader.js";

const init = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1000);

  let geoScale = 0;
  if (width > height) {
    geoScale = height / 2.5;
  } else {
    geoScale = width / 2.5;
  }

  const vertex = 1;
  const geometry = new THREE.SphereGeometry(geoScale, vertex, vertex);
  const material = new THREE.MeshNormalMaterial();
  const alphaMat = new THREE.MeshNormalMaterial({
    opacity: 0.3,
    transparent: true,
  });

  const ico = new THREE.Mesh(geometry, alphaMat);
  scene.add(ico);

  const obj2 = new THREE.Mesh(geometry, alphaMat);
  scene.add(obj2);

  const obj3 = new THREE.Mesh(geometry, alphaMat);
  scene.add(obj3);

  // post process
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // bloom
  const bloomPass = new BloomPass(
    4, // strength
    25, // kernel size
    4, // sigma ?
    256 // blur render target resolution
  );
  // bloomPass.renderToScreen = true;
  composer.addPass(bloomPass);

  const filmPass = new FilmPass(
    0.3, // noise intersity
    0.025, // scanline intensity
    648, // scanline count
    false
  );
  filmPass.renderToScreen = true;
  composer.addPass(filmPass);

  let params = {
    pixelSize: 16,
    postprocessing: true,
  };

  const pixelPass = new ShaderPass(PixelShader);
  pixelPass.uniforms["pixelSize"].value = params.pixelSize;
  pixelPass.uniforms["resolution"].value = new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  );
  pixelPass.uniforms["resolution"].value.multiplyScalar(
    window.devicePixelRatio
  );
  composer.addPass(pixelPass);

  const resizeRendererToDisplaySize = (renderer) => {
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  };

  let then = 0;
  let theta = 0;

  const tick = (now) => {
    // pp
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;

    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      composer.setSize(canvas.width, canvas.height);
    }

    let randomNum = 1 + Math.random() / 10;
    ico.rotation.y += 0.01;
    ico.rotation.x += 0.01;
    ico.scale.x = randomNum;
    ico.scale.y = randomNum;
    ico.scale.z = randomNum;

    obj2.rotation.y += Math.sin(theta);
    obj2.rotation.x -= 0.007;
    obj2.scale.x = randomNum;
    obj2.scale.y = randomNum;
    obj2.scale.z = randomNum;
    theta += 0.005;

    obj3.rotation.z += 0.01;
    obj3.rotation.x += 0.001;
    obj3.scale.x = randomNum;
    obj3.scale.y = randomNum;
    obj3.scale.z = randomNum;

    // renderer.render(scene, camera);
    composer.render(deltaTime);

    requestAnimationFrame(tick);
  };
  // requestAnimationFrame(tick);

  tick();
};

window.onload = () => {
  init();
};
