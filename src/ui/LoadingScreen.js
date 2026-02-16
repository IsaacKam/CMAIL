export class LoadingScreen {
  constructor() {
    this.overlay = document.getElementById('loading-screen');
    this.progressBar = document.getElementById('loading-progress-bar');
    this.progressText = document.getElementById('loading-text');
  }

  setProgress(pct) {
    if (this.progressBar) {
      this.progressBar.style.width = `${pct}%`;
    }
    if (this.progressText) {
      this.progressText.textContent = `Loading ${Math.round(pct)}%`;
    }
  }

  hide() {
    this.overlay.style.opacity = '0';
    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 600);
  }

  show() {
    this.overlay.style.display = 'flex';
    this.overlay.style.opacity = '1';
  }
}
