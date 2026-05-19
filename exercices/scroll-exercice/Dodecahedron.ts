import { DodecahedronGeometry, Mesh, MeshStandardMaterial } from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

export class Dodecahedron {
  mesh: Mesh;
  gui!: dat.GUI;

  constructor(gui?: dat.GUI) {
    const geometry = new DodecahedronGeometry();
    const material = new MeshStandardMaterial({
      color: 0x0000ff,
    });
    this.mesh = new Mesh(geometry, material);
    if (import.meta.env.VITE_ENVIRONMENT == "development" && gui) {
      this.gui = gui;
      this.initGUI();
    }
    this.update();
    this.scrollEvents();
  }

  initGUI() {
    this.gui.add(this.mesh.position, "y").min(0).max(5).step(0.1);
  }

  animate() {
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.01;
    // this.mesh.rotation.z += 0.01;
  }

  update() {
    this.mesh.scale.set(2, 2, 2);
  }

  scrollEvents() {
    gsap.to(this.mesh.rotation, {
      x: Math.PI * 2,
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: true,
      },
    });
  }
}
