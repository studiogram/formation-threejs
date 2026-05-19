import {
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  TextureLoader,
} from "three";

export class Ground {
  mesh: Mesh;
  gui!: dat.GUI;

  constructor(gui?: dat.GUI) {
    const geometry = new PlaneGeometry(3, 3);
    const material = new MeshStandardMaterial();
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;

    this.initTexture();

    if (import.meta.env.VITE_ENVIRONMENT == "development" && gui) {
      this.gui = gui;
      this.initGUI();
    }
  }

  initTexture() {
    const loader = new TextureLoader();
    const texture = loader.load("./motel.jpg");
    (this.mesh.material as MeshStandardMaterial).map = texture;
  }

  initGUI() {
    // this.gui.add(this.mesh.sca, "y").min(0).max(5).step(1);
  }
}
