import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.mode = 'sphere';
    this._scrollHandler = null;

    this.setSphereMode();
  }

  setSphereMode() {
    this.mode = 'sphere';
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.enableRotate = true;
    this.camera.position.set(0, 0, 30);
    this.controls.target.set(0, 0, 0);
    this._removeScrollHandler();
  }

  setGridMode() {
    this.mode = 'grid';
    this.controls.autoRotate = false;
    this.controls.enablePan = true;
    this.controls.enableZoom = false;
    this.controls.enableRotate = false;
    this.controls.screenSpacePanning = true;
    this.camera.position.set(0, 0, 22);
    this.controls.target.set(0, 0, 0);
    this._addScrollHandler();
  }

  _addScrollHandler() {
    this._removeScrollHandler();
    this._scrollHandler = (e) => {
      e.preventDefault();
      // Map scroll wheel to horizontal pan
      const panSpeed = 0.8;
      const dx = (e.deltaY || e.deltaX) * panSpeed * 0.01;
      this.camera.position.x += dx;
      this.controls.target.x += dx;
    };
    this.domElement.addEventListener('wheel', this._scrollHandler, { passive: false });
  }

  _removeScrollHandler() {
    if (this._scrollHandler) {
      this.domElement.removeEventListener('wheel', this._scrollHandler);
      this._scrollHandler = null;
    }
  }

  update() {
    // In grid mode, lock Y position to prevent vertical drift from drag
    if (this.mode === 'grid') {
      this.camera.position.y = 0;
      this.camera.position.z = 22;
      this.controls.target.y = 0;
      this.controls.target.z = 0;
    }
    this.controls.update();
  }
}
