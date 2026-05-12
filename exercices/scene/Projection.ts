import {
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  TextureLoader,
} from "three";

export class Projection {
  mesh: Mesh;
  gui!: dat.GUI;

  constructor(gui?: dat.GUI) {
    const height = 2;
    const geometry = new PlaneGeometry(3, height);
    const material = new MeshStandardMaterial();
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.y = height / 2;
    this.mesh.position.z = -2;
    this.mesh.castShadow = true;

    this.initTexture();

    if (import.meta.env.VITE_ENVIRONMENT == "development" && gui) {
      this.gui = gui;
      this.initGUI();
    }
  }

  initTexture() {
    const loader = new TextureLoader();
    const texture = loader.load("./textures/scene-1.jpg");
    (this.mesh.material as MeshStandardMaterial).map = texture;
  }

  initGUI() {
    // this.gui.add(this.mesh.sca, "y").min(0).max(5).step(1);
  }
}
