import * as THREE from 'three';

export class RaycasterManager {
  constructor(camera, paperMesh, domElement) {
    this.camera = camera;
    this.paperMesh = paperMesh;
    this.domElement = domElement;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredId = -1;
    this.onClick = null; // callback(instanceId)
    this.enabled = true;
    this.lastRaycastTime = 0;
    this.raycastInterval = 33; // ~30fps throttle

    // Track drag distance to distinguish clicks from drags
    this._pointerDownPos = { x: 0, y: 0 };
    this._dragThreshold = 5; // pixels

    domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
    domElement.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    domElement.addEventListener('pointerup', (e) => this._onPointerUp(e));
    domElement.addEventListener('touchstart', (e) => this._onTouchStart(e), { passive: true });
    domElement.addEventListener('touchend', (e) => this._onTouchEnd(e));
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  _onPointerDown(event) {
    this._pointerDownPos.x = event.clientX;
    this._pointerDownPos.y = event.clientY;
  }

  _onPointerUp(event) {
    if (!this.enabled) return;
    // Only treat as click if pointer didn't move much (not a drag)
    const dx = event.clientX - this._pointerDownPos.x;
    const dy = event.clientY - this._pointerDownPos.y;
    if (Math.sqrt(dx * dx + dy * dy) > this._dragThreshold) return;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.performRaycast();
    if (this.hoveredId !== -1 && this.onClick) this.onClick(this.hoveredId);
  }

  _onTouchStart(event) {
    if (event.touches.length !== 1) return;
    this._pointerDownPos.x = event.touches[0].clientX;
    this._pointerDownPos.y = event.touches[0].clientY;
  }

  _onTouchEnd(event) {
    if (!this.enabled) return;
    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - this._pointerDownPos.x;
    const dy = touch.clientY - this._pointerDownPos.y;
    if (Math.sqrt(dx * dx + dy * dy) > this._dragThreshold) return;

    this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    this.performRaycast();
    if (this.hoveredId !== -1 && this.onClick) this.onClick(this.hoveredId);
  }

  performRaycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.paperMesh.mesh);

    const prevHovered = this.hoveredId;

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;
      this.hoveredId = instanceId;
      this.domElement.style.cursor = 'pointer';

      // Update hover glow
      if (prevHovered !== -1 && prevHovered !== instanceId) {
        this.paperMesh.setHoverGlow(prevHovered, 0);
      }
      this.paperMesh.setHoverGlow(instanceId, 1);
    } else {
      if (prevHovered !== -1) {
        this.paperMesh.setHoverGlow(prevHovered, 0);
      }
      this.hoveredId = -1;
      this.domElement.style.cursor = 'default';
    }
  }

  update() {
    if (!this.enabled) return;
    const now = performance.now();
    if (now - this.lastRaycastTime < this.raycastInterval) return;
    this.lastRaycastTime = now;
    this.performRaycast();
  }
}
