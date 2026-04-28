import { BoxGeometry, MathUtils, Mesh, MeshNormalMaterial } from "three";
import * as dat from "dat.gui";

export class Cube {
  mesh: Mesh;

  constructor(gui?: dat.GUI) {
    const geometry = new BoxGeometry(3, 3, 3);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotation.y = MathUtils.degToRad(45);
    this.mesh.scale.set(0.3, 0.3, 0.3);

    if (gui) {
      gui.add(this.mesh.position, "y").min(0).max(5).step(1);
    }
  }
}
