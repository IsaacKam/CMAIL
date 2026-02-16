import * as THREE from 'three';
import { easeInOutCubic } from '../utils/easing.js';

export class LayoutAnimator {
  constructor(paperMesh, sphereLayout, gridLayout) {
    this.paperMesh = paperMesh;
    this.sphereLayout = sphereLayout;
    this.gridLayout = gridLayout;
    this.mode = 'sphere'; // 'sphere' | 'grid'
    this.animating = false;
    this.progress = 0; // 0 = sphere, 1 = grid
    this.duration = 1.8;
    this.elapsed = 0;
    this.direction = 1; // 1 = to grid, -1 = to sphere
    this.onComplete = null;

    // Current interpolated transforms
    this.count = paperMesh.count;
    this.currentPositions = [];
    this.currentQuaternions = [];

    for (let i = 0; i < this.count; i++) {
      this.currentPositions.push(new THREE.Vector3());
      this.currentQuaternions.push(new THREE.Quaternion());
    }

    // Initialize to sphere
    this.applyLayout(0);
    this.paperMesh.updateTransforms(this.currentPositions, this.currentQuaternions);
  }

  toggle() {
    if (this.animating) return;
    this.animating = true;
    this.elapsed = 0;
    if (this.mode === 'sphere') {
      this.direction = 1;
      this.mode = 'grid';
    } else {
      this.direction = -1;
      this.mode = 'sphere';
    }
    return this.mode;
  }

  applyLayout(t) {
    // t: 0 = sphere, 1 = grid
    for (let i = 0; i < this.count; i++) {
      this.currentPositions[i].lerpVectors(
        this.sphereLayout.positions[i],
        this.gridLayout.positions[i],
        t
      );
      this.currentQuaternions[i].slerpQuaternions(
        this.sphereLayout.quaternions[i],
        this.gridLayout.quaternions[i],
        t
      );
    }
  }

  update(deltaTime) {
    if (!this.animating) return;

    this.elapsed += deltaTime;
    let rawT = this.elapsed / this.duration;

    if (rawT >= 1) {
      rawT = 1;
      this.animating = false;
    }

    const easedT = easeInOutCubic(rawT);

    if (this.direction === 1) {
      this.progress = easedT;
    } else {
      this.progress = 1 - easedT;
    }

    this.applyLayout(this.progress);
    this.paperMesh.updateTransforms(this.currentPositions, this.currentQuaternions);

    if (!this.animating && this.onComplete) {
      this.onComplete(this.mode);
    }
  }

  // For when grid layout changes due to filtering
  updateGridLayout(gridLayout) {
    this.gridLayout = gridLayout;
    if (this.mode === 'grid' && !this.animating) {
      this.applyLayout(1);
      this.paperMesh.updateTransforms(this.currentPositions, this.currentQuaternions);
    }
  }
}
