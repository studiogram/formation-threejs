import { Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

export class Ground {
  mesh: Mesh;
  gui!: dat.GUI;
  material!: MeshStandardMaterial;

  constructor(gui?: dat.GUI) {
    const geometry = new PlaneGeometry(3, 3);
    this.material = new MeshStandardMaterial({
      color: 0xff0000,
    });
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;

    if (import.meta.env.VITE_ENVIRONMENT == "development" && gui) {
      this.gui = gui;
      this.initGUI();
    }
  }

  initGUI() {
    // this.gui.add(this.mesh.sca, "y").min(0).max(5).step(1);
  }
}
