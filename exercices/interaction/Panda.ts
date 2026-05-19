import { Mesh, MeshStandardMaterial, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class Panda {
  mesh = new Object3D();

  constructor() {
    console.log("panda");
    this.init();
    this.update();
  }

  async init() {
    const gltfLoader = new GLTFLoader();
    const gltf = await gltfLoader.loadAsync("./models/panda.glb");

    const material = new MeshStandardMaterial({
      color: 0xff0000,
    });

    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = material;
      }
    });

    this.mesh.add(gltf.scene);
  }

  update() {
    this.mesh.scale.set(0.5, 0.5, 0.5);
  }
}
