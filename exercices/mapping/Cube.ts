import { BoxGeometry, MathUtils, Mesh, MeshStandardMaterial } from "three";
import * as dat from "dat.gui";

export class Cube {
  mesh: Mesh;
  gui!: dat.GUI;

  constructor(gui?: dat.GUI) {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0,
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotation.y = MathUtils.degToRad(45);

    this.mesh.castShadow = true;
    this.mesh.position.y = 0.5;

    if (import.meta.env.VITE_ENVIRONMENT == "development" && gui) {
      this.gui = gui;
      this.initGUI();
    }
  }

  initGUI() {
    this.gui.add(this.mesh.position, "y").min(0).max(5).step(0.1);
  }

  animate() {
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.01;
    // this.mesh.rotation.z += 0.01;
  }
}
