export class ProjectFilter {
  constructor(projects) {
    this.container = document.getElementById('project-filter');
    this.activeProject = 'All';
    this.onChange = null; // callback(projectName)

    // Create "All" + each project pill
    const allProjects = ['All', ...projects];

    allProjects.forEach(project => {
      const pill = document.createElement('button');
      pill.className = 'filter-pill' + (project === 'All' ? ' active' : '');
      pill.textContent = project;
      pill.addEventListener('click', () => {
        this.setActive(project);
        if (this.onChange) this.onChange(project);
      });
      this.container.appendChild(pill);
    });
  }

  setActive(project) {
    this.activeProject = project;
    const pills = this.container.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
      pill.classList.toggle('active', pill.textContent === project);
    });
  }

  getVisibleIndices(manifest) {
    if (this.activeProject === 'All') {
      return manifest.map((_, i) => i);
    }
    return manifest
      .map((asset, i) => ({ asset, i }))
      .filter(({ asset }) => asset.project === this.activeProject)
      .map(({ i }) => i);
  }
}
