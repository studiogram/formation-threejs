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
  Scene,
  WebGLRenderer,
} from "three";
import * as dat from "dat.gui";
import { Ground } from "./Ground";
import { Cylinder } from "./Cylinder";
import { Projection } from "./Projection";

const cylinderPositions = [
  { x: 1, z: 1 },
  { x: -2, z: 0.5 },
  { x: -0.7, z: 0.5 },
  { x: 2, z: 1 },
];

class App {
  canvas: HTMLCanvasElement;
  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  scene!: Scene;
  ground!: Ground;
  projection!: Projection;
  gui!: dat.GUI;

  constructor(canvas: HTMLCanvasElement) {
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
  }

  initLights() {
    console.log("initLights");
    const ambient = new AmbientLight(0xffffff, 1);
    this.scene.add(ambient);
    const dirLight = new DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 5, -5);
    dirLight.castShadow = true;
    this.scene.add(dirLight);
  }

  initObjects() {
    cylinderPositions.forEach(({ x, z }) => {
      const cylinder = new Cylinder(x, z, this.gui);
      this.scene.add(cylinder.mesh);
    });
    this.projection = new Projection(this.gui);
    this.scene.add(this.projection.mesh);
    this.ground = new Ground(this.gui);
    this.scene.add(this.ground.mesh);
  }

  initGUI() {
    this.gui = new dat.GUI();
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  new App(canvas);
});
