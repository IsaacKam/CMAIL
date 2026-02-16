export class DetailView {
  constructor(manifest) {
    this.manifest = manifest;
    this.overlay = document.getElementById('detail-overlay');
    this.content = document.getElementById('detail-content');
    this.closeBtn = document.getElementById('detail-close');
    this.projectLabel = document.getElementById('detail-project');
    this.currentAssetId = null;
    this.videoElement = null;

    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open(instanceId) {
    const asset = this.manifest[instanceId];
    if (!asset) return;

    this.currentAssetId = instanceId;
    this.content.innerHTML = '';

    const base = import.meta.env.BASE_URL;
    if (asset.type === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('webkit-playsinline', '');
      video.muted = true;
      video.preload = 'auto';
      video.className = 'detail-media';
      this.content.appendChild(video);
      this.videoElement = video;
      video.src = `${base}assets/video/${asset.id}.mp4`;
      video.load();
      video.play().then(() => {
        // Unmute after autoplay starts (user-initiated tap allows this)
        video.muted = false;
      }).catch(() => {});
    } else {
      const img = document.createElement('img');
      img.src = `${base}assets/full/${asset.id}.webp`;
      img.alt = asset.filename;
      img.className = 'detail-media';
      this.content.appendChild(img);
    }

    if (this.projectLabel) {
      this.projectLabel.textContent = asset.project || '';
    }

    this.overlay.classList.add('active');
  }

  close() {
    this.overlay.classList.remove('active');
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      this.videoElement = null;
    }
    this.content.innerHTML = '';
    this.currentAssetId = null;
  }
}
