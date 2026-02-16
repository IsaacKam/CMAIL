import * as THREE from 'three';

export class SphereLayout {
  constructor(count, radius = 10) {
    this.positions = [];
    this.quaternions = [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = Math.sin(inclination) * Math.cos(azimuth) * radius;
      const y = Math.sin(inclination) * Math.sin(azimuth) * radius;
      const z = Math.cos(inclination) * radius;

      const position = new THREE.Vector3(x, y, z);
      this.positions.push(position);

      const dummy = new THREE.Object3D();
      dummy.position.copy(position);
      dummy.lookAt(0, 0, 0);
      dummy.rotateY(Math.PI);
      this.quaternions.push(dummy.quaternion.clone());
    }
  }
}
