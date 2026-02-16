import { SceneManager } from './scene/SceneManager.js';
import { PaperMesh } from './scene/PaperMesh.js';
import { SphereLayout } from './scene/SphereLayout.js';
import { GridLayout } from './scene/GridLayout.js';
import { LayoutAnimator } from './scene/LayoutAnimator.js';
import { TextureManager } from './loaders/TextureManager.js';
import { CameraController } from './interaction/CameraController.js';
import { RaycasterManager } from './interaction/RaycasterManager.js';
import { DetailView } from './interaction/DetailView.js';
import { ToggleButton } from './ui/ToggleButton.js';
import { LoadingScreen } from './ui/LoadingScreen.js';

async function init() {
  const loadingScreen = new LoadingScreen();
  loadingScreen.show();

  const canvas = document.getElementById('canvas');
  const sceneManager = new SceneManager(canvas);

  const response = await fetch('/assets/manifest.json');
  const manifest = await response.json();
  const count = manifest.length;

  const textureManager = new TextureManager((progress) => {
    loadingScreen.setProgress(progress * 100);
  });
  const { texture: atlasTexture, map: atlasMap } = await textureManager.loadAtlas();

  const sphereLayout = new SphereLayout(count, 10);
  const gridLayout = new GridLayout(count, 4);

  const paperMesh = new PaperMesh(count, atlasTexture, atlasMap, manifest);
  sceneManager.scene.add(paperMesh.mesh);

  const layoutAnimator = new LayoutAnimator(paperMesh, sphereLayout, gridLayout);

  const cameraController = new CameraController(sceneManager.camera, sceneManager.renderer.domElement);

  const raycasterManager = new RaycasterManager(sceneManager.camera, paperMesh, sceneManager.renderer.domElement);

  const detailView = new DetailView(manifest);
  raycasterManager.onClick = (instanceId) => {
    detailView.open(instanceId);
  };

  const toggleButton = new ToggleButton();
  toggleButton.onClick = () => {
    const newMode = layoutAnimator.toggle();
    if (newMode === 'grid') {
      toggleButton.setMode('grid');
      cameraController.setGridMode();
    } else {
      toggleButton.setMode('sphere');
      cameraController.setSphereMode();
    }
  };

  loadingScreen.hide();

  // Real-time clock with milliseconds
  const clockEl = document.getElementById('clock');
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let lastTime = performance.now();
  function animate(time) {
    requestAnimationFrame(animate);
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    // Update clock every frame
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    clockEl.textContent = `${h}:${m}:${s}.${ms} ${tz}`;

    paperMesh.updateTime(time * 0.001);
    layoutAnimator.update(dt);
    cameraController.update();
    raycasterManager.update();
    sceneManager.render();
  }
  requestAnimationFrame(animate);
}

init().catch(console.error);
