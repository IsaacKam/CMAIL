import * as THREE from 'three';

export class SphereLayout {
  constructor(count, radius = 10) {
    this.radius = radius;
    this.totalCount = count;
    this.positions = [];
    this.quaternions = [];

    this.calculate(count);
  }

  calculate(count, visibleIndices = null) {
    const indices = visibleIndices || Array.from({length: count}, (_, i) => i);
    const totalVisible = indices.length;

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    // Initialize all to hidden
    this.positions = new Array(count).fill(null).map(() => new THREE.Vector3(0, 0, -9999));
    this.quaternions = new Array(count).fill(null).map(() => new THREE.Quaternion());

    indices.forEach((originalIndex, i) => {
      const t = totalVisible > 1 ? i / (totalVisible - 1) : 0.5;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = Math.sin(inclination) * Math.cos(azimuth) * this.radius;
      const y = Math.sin(inclination) * Math.sin(azimuth) * this.radius;
      const z = Math.cos(inclination) * this.radius;

      const position = new THREE.Vector3(x, y, z);
      this.positions[originalIndex] = position;

      const dummy = new THREE.Object3D();
      dummy.position.copy(position);
      dummy.lookAt(0, 0, 0);
      dummy.rotateY(Math.PI);
      this.quaternions[originalIndex] = dummy.quaternion.clone();
    });

    return this;
  }
}
