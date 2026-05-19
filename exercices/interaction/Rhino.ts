import gsap from "gsap";
import { Mesh, MeshStandardMaterial, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class Rhino {
  mesh = new Object3D();

  constructor() {
    console.log("rhino");
    this.init();
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  async init() {
    const gltfLoader = new GLTFLoader();
    const gltf = await gltfLoader.loadAsync("./models/rhino.glb");

    const material = new MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.35,
      roughness: 0.5,
    });

    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = material;
      }
    });

    this.mesh.add(gltf.scene);
  }

  onMouseMove(e: MouseEvent) {
    const normalized = (e.clientX / window.innerWidth) * 2 - 1;
    gsap.to(this.mesh.rotation, {
      y: (normalized * Math.PI) / 2,
    });
  }
}
