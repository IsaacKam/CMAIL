import * as THREE from 'three';

const BASE_SIZE = 1.8;
const CELL_W = 256;
const CELL_H = 192;
const ATLAS_SIZE = 4096;

export class PaperMesh {
  constructor(count, atlasTexture, atlasMap, manifest) {
    this.count = count;
    this.scales = [];

    // Use a 1x1 unit plane - per-instance scale handles aspect ratio
    const geometry = new THREE.PlaneGeometry(1, 1);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uAtlas: { value: atlasTexture },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute vec4 aUvRegion;
        attribute float aHover;
        attribute float aIndex;

        varying vec2 vUv;
        varying vec4 vUvRegion;
        varying float vHover;

        uniform float uTime;

        void main() {
          vUv = uv;
          vUvRegion = aUvRegion;
          vHover = aHover;

          vec3 pos = position;
          float oscillation = sin(uTime * 0.8 + aIndex * 1.618) * 0.015;
          pos.y += oscillation;

          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uAtlas;

        varying vec2 vUv;
        varying vec4 vUvRegion;
        varying float vHover;

        void main() {
          // Flip Y to correct upside-down atlas sampling
          vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
          vec2 atlasUv = vUvRegion.xy + uv * vUvRegion.zw;
          vec4 color = texture2D(uAtlas, atlasUv);

          // Hover glow only, no border
          float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
          float glow = vHover * smoothstep(0.0, 0.08, edgeDist) * 0.3;
          color.rgb += glow;

          gl_FragColor = color;
        }
      `,
      side: THREE.FrontSide,
      transparent: false,
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, count);
    this.mesh.frustumCulled = false;
    // Set a huge bounding sphere on the geometry so the raycaster's
    // preliminary check never rejects. Without this, only cards near
    // origin are clickable because the default 1x1 plane bounding sphere is tiny.
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1000);

    const uvRegions = new Float32Array(count * 4);
    const hovers = new Float32Array(count);
    const indices = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const asset = manifest[i];
      const id = asset.id;

      // Original dimensions (default 1080x1920 for videos / unknown)
      const origW = asset.width || 1080;
      const origH = asset.height || 1920;
      const aspect = origW / origH;

      // Per-instance scale: normalize so longer side = BASE_SIZE
      let scaleX, scaleY;
      if (aspect >= 1) {
        scaleX = BASE_SIZE;
        scaleY = BASE_SIZE / aspect;
      } else {
        scaleY = BASE_SIZE;
        scaleX = BASE_SIZE * aspect;
      }
      this.scales.push(new THREE.Vector3(scaleX, scaleY, 1));

      // Compute tight atlas UVs (crop out contain-fit padding)
      const cellRegion = atlasMap[id] || atlasMap[String(id)];
      if (cellRegion) {
        const fitScale = Math.min(CELL_W / origW, CELL_H / origH);
        const renderedW = origW * fitScale;
        const renderedH = origH * fitScale;
        const offsetX = (CELL_W - renderedW) / 2;
        const offsetY = (CELL_H - renderedH) / 2;

        uvRegions[i * 4 + 0] = cellRegion.u + (offsetX / ATLAS_SIZE);
        uvRegions[i * 4 + 1] = cellRegion.v + (offsetY / ATLAS_SIZE);
        uvRegions[i * 4 + 2] = renderedW / ATLAS_SIZE;
        uvRegions[i * 4 + 3] = renderedH / ATLAS_SIZE;
      } else {
        uvRegions[i * 4 + 0] = 0;
        uvRegions[i * 4 + 1] = 0;
        uvRegions[i * 4 + 2] = CELL_W / ATLAS_SIZE;
        uvRegions[i * 4 + 3] = CELL_H / ATLAS_SIZE;
      }

      hovers[i] = 0;
      indices[i] = i;
    }

    geometry.setAttribute('aUvRegion', new THREE.InstancedBufferAttribute(uvRegions, 4));
    geometry.setAttribute('aHover', new THREE.InstancedBufferAttribute(hovers, 1));
    geometry.setAttribute('aIndex', new THREE.InstancedBufferAttribute(indices, 1));

    this.hoverAttribute = geometry.getAttribute('aHover');
    this.dummy = new THREE.Object3D();
  }

  updateTransforms(positions, quaternions) {
    for (let i = 0; i < this.count; i++) {
      this.dummy.position.copy(positions[i]);
      this.dummy.quaternion.copy(quaternions[i]);
      this.dummy.scale.copy(this.scales[i]);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  setHoverGlow(instanceId, intensity) {
    this.hoverAttribute.setX(instanceId, intensity);
    this.hoverAttribute.needsUpdate = true;
  }

  clearAllHover() {
    for (let i = 0; i < this.count; i++) {
      this.hoverAttribute.setX(i, 0);
    }
    this.hoverAttribute.needsUpdate = true;
  }

  updateTime(time) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}
