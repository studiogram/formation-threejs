import "@/style.css";
import "./style.css";
import {
  AmbientLight,
  AxesHelper,
  Box3,
  CameraHelper,
  CubeTextureLoader,
  DirectionalLight,
  GridHelper,
  MathUtils,
  PCFShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { Cube } from "./Cube";
import * as dat from "dat.gui";
import { Ground } from "./Ground";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import { ThreePerf } from "three-perf";

class App {
  canvas: HTMLCanvasElement;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  scene!: Scene;
  cube!: Cube;
  ground!: Ground;
  gui!: dat.GUI;
  controls!: OrbitControls;
  mouse!: Vector2;
  raycaster!: Raycaster;
  perf!: ThreePerf;
  texture!: Texture;

  constructor(canvas: HTMLCanvasElement) {
    this.onResize = this.onResize.bind(this);
    this.animate = this.animate.bind(this);
    this.canvas = canvas;
    this.init();
  }

  async init() {
    this.initRenderer();
    this.initCamera();
    await this.initTexture();
    this.initScene();
    if (import.meta.env.VITE_ENVIRONMENT == "development") {
      this.initHelpers();
      this.initGUI();
    }
    this.initLights();
    this.initObjects();
    this.selectObjects();
    this.animate();
    this.fitScene();

    window.addEventListener("resize", this.onResize);
    // Retirer le zoom
    this.renderer.domElement.addEventListener("wheel", (e) => {
      e.preventDefault();
    });
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      // alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );
    this.camera.position.set(0, 2, 7);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minAzimuthAngle = 0;
    this.controls.maxAzimuthAngle = 0;
    this.controls.enableZoom = false;
  }

  async initTexture() {
    const loader = new CubeTextureLoader().setPath("./textures/");

    this.texture = await loader.loadAsync([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ]);
  }

  initScene() {
    this.scene = new Scene();
    // this.scene.background = this.texture;
  }

  initHelpers() {
    const cameraHelper = new CameraHelper(this.camera);
    this.scene.add(cameraHelper);
    const gridHelper = new GridHelper(10, 10);
    this.scene.add(gridHelper);
    const axesHelper = new AxesHelper(3);
    this.scene.add(axesHelper);

    this.perf = new ThreePerf({
      anchorX: "left",
      anchorY: "bottom",
      domElement: document.body,
      renderer: this.renderer,
    });
  }

  initLights() {
    console.log("initLights");
    const ambient = new AmbientLight(0xffffff, 1);
    this.scene.add(ambient);
    const dirLight = new DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    this.scene.add(dirLight);
  }

  initObjects() {
    this.cube = new Cube(this.texture, this.gui);
    this.scene.add(this.cube.mesh);
    this.ground = new Ground(this.gui);
    this.scene.add(this.ground.mesh);
  }

  selectObjects() {
    let rotation = 0;
    this.mouse = new Vector2();
    window.addEventListener("click", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster = new Raycaster();
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects([this.cube.mesh]);
      if (intersects.length > 0) {
        rotation += Math.PI * 2;
        gsap.to(this.cube.mesh.rotation, { duration: 1, y: rotation });
      }
    });
  }

  initGUI() {
    this.gui = new dat.GUI();
  }

  fitScene() {
    const box = new Box3();
    box.expandByObject(this.cube.mesh);
    box.expandByObject(this.ground.mesh);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    // D = (L / 2) / tan(FOV / 2)
    const fovRad = MathUtils.degToRad(this.camera.fov);
    const distanceY = size.y / 2 / Math.tan(fovRad / 2);
    const distanceX = size.x / 2 / Math.tan(fovRad / 2) / this.camera.aspect;
    const dist = Math.max(distanceY, distanceX) + size.z / 2;
    this.camera.position.set(center.x, center.y, center.z + dist);
    this.camera.lookAt(center);
  }

  animate() {
    if (this.perf) this.perf.begin();
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    /* objects animation */
    this.cube.animate();
    requestAnimationFrame(this.animate);
    if (this.perf) this.perf.end();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.fitScene();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  new App(canvas);
});
