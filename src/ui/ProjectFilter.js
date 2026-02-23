export class ProjectFilter {
  constructor(manifest) {
    this.sidebar = document.getElementById('filter-sidebar');
    this.content = document.getElementById('filter-content');
    this.toggleBtn = document.getElementById('filter-toggle');
    this.closeBtn = document.getElementById('filter-close');
    this.manifest = manifest;

    this.activeType = 'all'; // 'all' | 'image' | 'video'
    this.activeProject = 'all';
    this.onChange = null;

    // Count media by type
    const videoCount = manifest.filter(a => a.type === 'video').length;
    const imageCount = manifest.filter(a => a.type === 'image').length;

    // Count media by project
    const projectCounts = {};
    manifest.forEach(a => {
      projectCounts[a.project] = (projectCounts[a.project] || 0) + 1;
    });
    const projects = Object.keys(projectCounts).sort();

    // Build sidebar content
    this.content.innerHTML = '';

    // Type section
    const typeSection = this._createSection('Type');
    this._addItem(typeSection, 'all', 'All', manifest.length, 'type');
    this._addItem(typeSection, 'image', 'Images', imageCount, 'type');
    this._addItem(typeSection, 'video', 'Videos', videoCount, 'type');
    this.content.appendChild(typeSection);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'filter-divider';
    this.content.appendChild(divider);

    // Project section
    const projectSection = this._createSection('Project');
    this._addItem(projectSection, 'all', 'All', manifest.length, 'project');
    projects.forEach(p => {
      this._addItem(projectSection, p, p, projectCounts[p], 'project');
    });
    this.content.appendChild(projectSection);

    // Toggle open/close
    this.toggleBtn.addEventListener('click', () => this._open());
    this.closeBtn.addEventListener('click', () => this._close());

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.sidebar.classList.contains('open') &&
          !this.sidebar.contains(e.target)) {
        this._close();
      }
    });
  }

  _createSection(label) {
    const section = document.createElement('div');
    section.className = 'filter-section';
    const labelEl = document.createElement('div');
    labelEl.className = 'filter-label';
    labelEl.textContent = label;
    section.appendChild(labelEl);
    return section;
  }

  _addItem(section, value, label, count, group) {
    const btn = document.createElement('button');
    btn.className = 'filter-item';
    btn.dataset.group = group;
    btn.dataset.value = value;

    const isActive = (group === 'type' && value === this.activeType) ||
                     (group === 'project' && value === this.activeProject);
    if (isActive) btn.classList.add('active');

    btn.innerHTML = `<span class="filter-dot"></span>${label}<span class="filter-count">${count}</span>`;

    btn.addEventListener('click', () => {
      if (group === 'type') {
        this.activeType = value;
      } else {
        this.activeProject = value;
      }
      this._updateActive();
      this._updateCounts();
      if (this.onChange) this.onChange();
    });

    section.appendChild(btn);
  }

  _updateActive() {
    this.content.querySelectorAll('.filter-item').forEach(item => {
      const group = item.dataset.group;
      const value = item.dataset.value;
      const isActive = (group === 'type' && value === this.activeType) ||
                       (group === 'project' && value === this.activeProject);
      item.classList.toggle('active', isActive);
    });
  }

  _updateCounts() {
    // Recalculate counts based on cross-filter
    this.content.querySelectorAll('.filter-item').forEach(item => {
      const group = item.dataset.group;
      const value = item.dataset.value;
      const countEl = item.querySelector('.filter-count');

      let filtered;
      if (group === 'type') {
        // Count for type items: apply project filter
        filtered = this.manifest.filter(a => {
          const projectMatch = this.activeProject === 'all' || a.project === this.activeProject;
          const typeMatch = value === 'all' || a.type === value;
          return projectMatch && typeMatch;
        });
      } else {
        // Count for project items: apply type filter
        filtered = this.manifest.filter(a => {
          const typeMatch = this.activeType === 'all' || a.type === this.activeType;
          const projectMatch = value === 'all' || a.project === value;
          return typeMatch && projectMatch;
        });
      }
      countEl.textContent = filtered.length;
    });
  }

  _open() {
    this.sidebar.classList.add('open');
  }

  _close() {
    this.sidebar.classList.remove('open');
  }

  getVisibleIndices() {
    return this.manifest
      .map((asset, i) => ({ asset, i }))
      .filter(({ asset }) => {
        const typeMatch = this.activeType === 'all' || asset.type === this.activeType;
        const projectMatch = this.activeProject === 'all' || asset.project === this.activeProject;
        return typeMatch && projectMatch;
      })
      .map(({ i }) => i);
  }
}
