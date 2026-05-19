import "@/style.css";
import "./style.css";
import {
  AmbientLight,
  AxesHelper,
  CameraHelper,
  DirectionalLight,
  GridHelper,
  PCFShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { Cube } from "./Cube";
import * as dat from "dat.gui";
import { Ground } from "./Ground";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import { ThreePerf } from "three-perf";
import { Rhino } from "./Rhino";

class App {
  canvas: HTMLCanvasElement;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  scene!: Scene;
  gui!: dat.GUI;
  controls!: OrbitControls;
  mouse!: Vector2;
  raycaster!: Raycaster;
  perf!: ThreePerf;
  rhino!: Rhino;

  constructor(canvas: HTMLCanvasElement) {
    this.onResize = this.onResize.bind(this);
    this.animate = this.animate.bind(this);
    this.canvas = canvas;
    this.initRenderer();
    this.initCamera();
    this.initScene();
    if (import.meta.env.VITE_ENVIRONMENT == "development") {
      this.initHelpers();
      this.initGUI();
    }
    this.initLights();
    this.initObjects();
    this.animate();

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

  initScene() {
    this.scene = new Scene();
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
    this.rhino = new Rhino();
    this.scene.add(this.rhino.mesh);
  }

  initGUI() {
    this.gui = new dat.GUI();
  }

  animate() {
    if (this.perf) this.perf.begin();
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    /* objects animation */

    requestAnimationFrame(this.animate);
    if (this.perf) this.perf.end();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  new App(canvas);
});
