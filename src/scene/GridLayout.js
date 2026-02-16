import * as THREE from 'three';

export class GridLayout {
  constructor(count, rows = 4) {
    this.rows = rows;
    this.cellWidth = 2.0;
    this.cellHeight = 2.2;
    this.gap = 0.15;
    this.positions = [];
    this.quaternions = [];

    this.calculate(count);
  }

  calculate(count, visibleIndices = null) {
    const indices = visibleIndices || Array.from({length: count}, (_, i) => i);
    const totalVisible = indices.length;
    const cols = Math.ceil(totalVisible / this.rows);
    const totalHeight = this.rows * (this.cellHeight + this.gap) - this.gap;

    this.positions = new Array(count).fill(null).map(() => new THREE.Vector3(0, 0, -9999));
    this.quaternions = new Array(count).fill(null).map(() => new THREE.Quaternion());

    indices.forEach((originalIndex, i) => {
      const row = i % this.rows;
      const col = Math.floor(i / this.rows);

      const x = col * (this.cellWidth + this.gap);
      const y = -(row * (this.cellHeight + this.gap) - totalHeight / 2 + this.cellHeight / 2);
      const z = 0;

      this.positions[originalIndex] = new THREE.Vector3(x, y, z);
      this.quaternions[originalIndex] = new THREE.Quaternion();
    });

    return this;
  }
}
