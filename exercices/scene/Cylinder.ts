import { CylinderGeometry, MeshStandardMaterial, Mesh } from "three";

export class Cylinder {
  mesh: Mesh;
  gui!: dat.GUI;

  constructor(x = 0, z = 0, gui?: dat.GUI) {
    const height = 0.2;
    const geometry = new CylinderGeometry(0.2, height, 0.3, 20);
    const material = new MeshStandardMaterial({ color: 0x888888 });
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(x, height / 2, z);
    this.mesh.castShadow = true;

    // if (import.meta.env.VITE_ENVIRONMENT == "development" && gui) {
    //   this.gui = gui;
    //   this.initGUI();
    // }
  }

  initGUI() {
    this.gui.add(this.mesh.position, "x").min(-5).max(5).step(0.1);
    this.gui.add(this.mesh.position, "z").min(-5).max(5).step(0.1);
  }
}
