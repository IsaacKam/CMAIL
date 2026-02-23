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
    this.defaultDuration = 1.8;
    this.duration = this.defaultDuration;
    this.elapsed = 0;
    this.direction = 1; // 1 = to grid, -1 = to sphere
    this.onComplete = null;

    // For filter animations: lerp from snapshot to target
    this._snapshotPositions = null;
    this._snapshotQuaternions = null;

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
    this._snapshotPositions = null;
    this._snapshotQuaternions = null;
    this.animating = true;
    this.elapsed = 0;
    this.duration = this.defaultDuration;
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
    const fromPositions = this._snapshotPositions || this.sphereLayout.positions;
    const fromQuaternions = this._snapshotQuaternions || this.sphereLayout.quaternions;
    const toPositions = this._snapshotPositions ? this._targetPositions() : this.gridLayout.positions;
    const toQuaternions = this._snapshotQuaternions ? this._targetQuaternions() : this.gridLayout.quaternions;

    for (let i = 0; i < this.count; i++) {
      this.currentPositions[i].lerpVectors(fromPositions[i], toPositions[i], t);
      this.currentQuaternions[i].slerpQuaternions(fromQuaternions[i], toQuaternions[i], t);
    }
  }

  _targetPositions() {
    return this.mode === 'grid' ? this.gridLayout.positions : this.sphereLayout.positions;
  }

  _targetQuaternions() {
    return this.mode === 'grid' ? this.gridLayout.quaternions : this.sphereLayout.quaternions;
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

    if (this._snapshotPositions) {
      // Filter animation: lerp from snapshot to target
      this.progress = easedT;
    } else if (this.direction === 1) {
      this.progress = easedT;
    } else {
      this.progress = 1 - easedT;
    }

    this.applyLayout(this.progress);
    this.paperMesh.updateTransforms(this.currentPositions, this.currentQuaternions);

    if (!this.animating) {
      this._snapshotPositions = null;
      this._snapshotQuaternions = null;
      this.duration = this.defaultDuration;
      if (this.onComplete) this.onComplete(this.mode);
    }
  }

  // For when layouts change due to filtering
  updateLayouts(sphereLayout, gridLayout) {
    // Snapshot current positions
    this._snapshotPositions = this.currentPositions.map(p => p.clone());
    this._snapshotQuaternions = this.currentQuaternions.map(q => q.clone());

    this.sphereLayout = sphereLayout;
    this.gridLayout = gridLayout;

    this.animating = true;
    this.elapsed = 0;
    this.duration = 0.8;
    this.progress = 0;
  }
}
