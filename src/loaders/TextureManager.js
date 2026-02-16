import * as THREE from 'three';

export class TextureManager {
  constructor(onProgress) {
    this.onProgress = onProgress || (() => {});
    this.atlasTexture = null;
    this.atlasMap = null;
    this.loader = new THREE.TextureLoader();
  }

  async loadAtlas() {
    const base = import.meta.env.BASE_URL;
    const [texture, map] = await Promise.all([
      this._loadTexture(`${base}assets/atlas.webp`),
      this._loadMap(`${base}assets/atlas-map.json`)
    ]);

    this.atlasTexture = texture;
    this.atlasTexture.flipY = false;
    this.atlasMap = map;

    return { texture: this.atlasTexture, map: this.atlasMap };
  }

  _loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          this.onProgress(1.0);
          resolve(texture);
        },
        (event) => {
          if (event.lengthComputable) {
            this.onProgress(event.loaded / event.total);
          }
        },
        reject
      );
    });
  }

  async _loadMap(url) {
    const response = await fetch(url);
    return response.json();
  }

  getUVs(assetId) {
    if (!this.atlasMap) return { u: 0, v: 0, w: 0, h: 0 };
    const entry = this.atlasMap[assetId] || this.atlasMap[String(assetId)];
    if (!entry) return { u: 0, v: 0, w: 0, h: 0 };
    return entry;
  }
}
