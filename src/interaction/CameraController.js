import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.mode = 'sphere';

    // Grid panning state
    this._gridX = 0;
    this._velocity = 0;
    this._dragging = false;
    this._dragStartX = 0;
    this._dragLastX = 0;
    this._boundHandlers = {};

    this.setSphereMode();
  }

  setSphereMode() {
    this.mode = 'sphere';
    this.controls.enabled = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.enableRotate = true;
    this.camera.position.set(0, 0, 30);
    this.controls.target.set(0, 0, 0);
    this._removeGridHandlers();
  }

  setGridMode() {
    this.mode = 'grid';
    // Disable OrbitControls entirely in grid mode — we handle panning manually
    this.controls.enabled = false;
    this.controls.autoRotate = false;
    this._gridX = 0;
    this._velocity = 0;
    this.camera.position.set(0, 0, 22);
    this.controls.target.set(0, 0, 0);
    this._addGridHandlers();
  }

  _addGridHandlers() {
    this._removeGridHandlers();
    const el = this.domElement;

    // Wheel → horizontal scroll
    this._boundHandlers.wheel = (e) => {
      e.preventDefault();
      const dx = (e.deltaY || e.deltaX) * 0.008;
      this._gridX += dx;
      this._velocity = dx;
    };

    // Mouse drag → horizontal pan
    this._boundHandlers.mousedown = (e) => {
      this._dragging = true;
      this._dragStartX = e.clientX;
      this._dragLastX = e.clientX;
    };
    this._boundHandlers.mousemove = (e) => {
      if (!this._dragging) return;
      const dx = (this._dragLastX - e.clientX) * 0.02;
      this._gridX += dx;
      this._velocity = dx;
      this._dragLastX = e.clientX;
    };
    this._boundHandlers.mouseup = () => {
      this._dragging = false;
    };

    // Touch drag → horizontal pan
    this._boundHandlers.touchstart = (e) => {
      if (e.touches.length !== 1) return;
      this._dragging = true;
      this._dragStartX = e.touches[0].clientX;
      this._dragLastX = e.touches[0].clientX;
    };
    this._boundHandlers.touchmove = (e) => {
      if (!this._dragging || e.touches.length !== 1) return;
      e.preventDefault();
      const dx = (this._dragLastX - e.touches[0].clientX) * 0.02;
      this._gridX += dx;
      this._velocity = dx;
      this._dragLastX = e.touches[0].clientX;
    };
    this._boundHandlers.touchend = () => {
      this._dragging = false;
    };

    el.addEventListener('wheel', this._boundHandlers.wheel, { passive: false });
    el.addEventListener('mousedown', this._boundHandlers.mousedown);
    el.addEventListener('mousemove', this._boundHandlers.mousemove);
    el.addEventListener('mouseup', this._boundHandlers.mouseup);
    el.addEventListener('touchstart', this._boundHandlers.touchstart, { passive: true });
    el.addEventListener('touchmove', this._boundHandlers.touchmove, { passive: false });
    el.addEventListener('touchend', this._boundHandlers.touchend);
  }

  _removeGridHandlers() {
    const el = this.domElement;
    for (const [evt, fn] of Object.entries(this._boundHandlers)) {
      el.removeEventListener(evt, fn);
    }
    this._boundHandlers = {};
  }

  // Detect if a mouse/touch interaction was a drag vs a click
  wasDrag() {
    return this._dragging;
  }

  update() {
    if (this.mode === 'grid') {
      // Apply momentum / deceleration
      if (!this._dragging) {
        this._velocity *= 0.92;
        if (Math.abs(this._velocity) < 0.0001) this._velocity = 0;
        this._gridX += this._velocity;
      }
      this.camera.position.set(this._gridX, 0, 22);
      this.controls.target.set(this._gridX, 0, 0);
    }
    this.controls.update();
  }
}
