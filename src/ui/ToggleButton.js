export class ToggleButton {
  constructor() {
    this.button = document.getElementById('toggle-btn');
    this.mode = 'sphere';
    this.onClick = null;

    this.button.addEventListener('click', () => {
      if (this.onClick) this.onClick();
    });

    this.updateLabel();
  }

  setMode(mode) {
    this.mode = mode;
    this.updateLabel();
  }

  updateLabel() {
    if (this.mode === 'sphere') {
      this.button.textContent = '[ Grid ]';
    } else {
      this.button.textContent = '[ Sphere ]';
    }
  }
}
