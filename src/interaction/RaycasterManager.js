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

    domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
    domElement.addEventListener('click', (e) => this.onClickEvent(e));
    domElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onClickEvent(event) {
    if (!this.enabled) return;
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.performRaycast();
    if (this.hoveredId !== -1 && this.onClick) this.onClick(this.hoveredId);
  }

  onTouchEnd(event) {
    if (!this.enabled) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

    // Do a raycast immediately on touch
    this.performRaycast();
    if (this.hoveredId !== -1 && this.onClick) {
      this.onClick(this.hoveredId);
    }
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
