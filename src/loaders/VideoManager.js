export class VideoManager {
  constructor() {
    this.activeVideo = null;
  }

  createVideoElement(assetId) {
    this.dispose();

    const video = document.createElement('video');
    video.src = `/assets/video/${assetId}.mp4`;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    this.activeVideo = video;

    return video;
  }

  dispose() {
    if (this.activeVideo) {
      this.activeVideo.pause();
      this.activeVideo.src = '';
      this.activeVideo.load();
      this.activeVideo = null;
    }
  }
}
