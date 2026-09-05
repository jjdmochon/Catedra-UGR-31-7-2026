// ============================================================
// APP.JS — Master Application Controller
// Cátedra UGR Concurso 31/7/2026 · Prof. Juan José Díaz-Mochón
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  currentTab: 'concurso',
  currentYearFilter: 'all',
  currentCategoryFilter: 'all',
  searchQuery: '',
  currentProjectFilter: 'all',
  projectSearchQuery: '',

  init() {
    this.initTheme();
    this.renderConcursoDetails();
    this.renderAnexoIV();
    this.renderProjects();
    this.renderPublications();
    this.renderPatents();
    this.renderTheses();
    this.setupEventListeners();

    // Initialize visualization engines
    if (window.ChartEngine) window.ChartEngine.init();
    if (window.ScientificGraph) window.ScientificGraph.init();
    if (window.WikiEngine) {
      window.WikiEngine.init();
      // Load initial document in wiki reader
      window.WikiEngine.loadPage('concurso/Convocatoria_BOE_31_7_2026.md');
    }
  },

  // ── Theme Switcher (Robust Light & Dark Dual-Mode) ──
  initTheme() {
    const savedTheme = localStorage.getItem('jjd_theme') || 'dark';
    this.setTheme(savedTheme);
  },

  setTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    localStorage.setItem('jjd_theme', theme);
    this.updateThemeButton();

    // Refresh charts and graphs for high-contrast light/dark palette
    if (window.ChartEngine) window.ChartEngine.updateAll();
    if (window.ScientificGraph) window.ScientificGraph.init();
    if (window.WikiEngine) window.WikiEngine.initMermaid();
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || (document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  },

  updateThemeButton() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const isDark = (document.documentElement.getAttribute('data-theme') === 'dark') || document.body.classList.contains('dark-theme');
    btn.innerHTML = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
  },

  // ── Concurso 31/7/2026 & Tribunal ──
  renderConcursoDetails() {
    const data = window.APP_DATA && window.APP_DATA.concurso;
    if (!data) return;

    // Tribunal Titular
    const titularGrid = document.getElementById('tribunal-titular-grid');
    if (titularGrid && data.tribunal_titular) {
      titularGrid.innerHTML = data.tribunal_titular.map(m => `
        <div class="tribunal-card">
          <div class="tribunal-header">
            <span class="tribunal-icon">${m.icon || '🎓'}</span>
            <span class="tribunal-badge">${m.cargo}</span>
          </div>
          <h4 class="tribunal-name">${m.nombre}</h4>
          <div class="tribunal-uni">${m.categoria} · ${m.universidad}</div>
          <div class="tribunal-area">${m.area}</div>
          <p class="tribunal-desc">${m.especialidad}</p>
        </div>
      `).join('');
    }

    // Tribunal Suplente
    const suplenteList = document.getElementById('tribunal-suplente-list');
    if (suplenteList && data.tribunal_suplente) {
      suplenteList.innerHTML = data.tribunal_suplente.map(s => `
        <div class="suplente-item">
          <div class="suplente-cargo">${s.cargo}:</div>
          <div class="suplente-nombre"><strong>${s.nombre}</strong> (${s.categoria}, ${s.universidad})</div>
        </div>
      `).join('');
    }
  },

  // ── Anexo IV (25 Official Sections) ──
  renderAnexoIV() {
    const grid = document.getElementById('anexo-iv-grid');
    const sections = (window.APP_DATA && window.APP_DATA.anexo_iv) || [];
    if (!grid) return;

    grid.innerHTML = sections.map(s => `
      <div class="anexo-card" onclick="App.openAnexoDetail(${s.num})">
        <div class="anexo-num">${s.num}</div>
        <div class="anexo-info">
          <div class="anexo-title">${s.titulo}</div>
          <div class="anexo-count">${s.count}</div>
          <p class="anexo-desc">${s.desc}</p>
        </div>
      </div>
    `).join('');
  },

  openAnexoDetail(num) {
    // Switch to wiki tab and load baremo page
    this.switchTab('wiki');
    if (window.WikiEngine) {
      window.WikiEngine.loadPage('concurso/Baremo_Anexo_IV_BOE.md');
    }
  },

  // ── Publications Catalog ──
  renderPublications() {
    const container = document.getElementById('publications-list');
    if (!container) return;

    const articles = (window.APP_DATA && window.APP_DATA.articles) || [];

    // Filter by search, year, and category
    const filtered = articles.filter(a => {
      const matchYear = this.currentYearFilter === 'all' || a.year == this.currentYearFilter;
      const matchSearch = !this.searchQuery || 
        (a.title && a.title.toLowerCase().includes(this.searchQuery)) ||
        (a.authors && a.authors.toLowerCase().includes(this.searchQuery)) ||
        (a.journal && a.journal.toLowerCase().includes(this.searchQuery));
      return matchYear && matchSearch;
    });

    const countIndicator = document.getElementById('pub-count-badge');
    if (countIndicator) countIndicator.textContent = `${filtered.length} de ${articles.length} artículos`;

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state">No se encontraron artículos con los criterios seleccionados.</div>';
      return;
    }

    container.innerHTML = filtered.map((a, idx) => `
      <div class="pub-card reveal">
        <div class="pub-meta">
          <span class="pub-year">${a.year}</span>
          <span class="pub-journal">${a.journal || 'Revista Indexada (JCR/Scopus)'}</span>
          ${a.doi ? `<span class="pub-doi"><a href="${a.doi.startsWith('http') ? a.doi : 'https://doi.org/' + a.doi}" target="_blank" rel="noopener">DOI ↗</a></span>` : ''}
        </div>
        <h3 class="pub-title">${a.title}</h3>
        <div class="pub-authors">${a.authors}</div>
        ${a.preview ? `<p class="pub-preview">${a.preview.substring(0, 220)}...</p>` : ''}
        <div class="pub-actions">
          ${a.summary_link ? `<button class="btn btn-sm btn-outline" onclick="App.openArticleSummary('${a.summary_link}')">📄 Ver Ficha / Abstract</button>` : ''}
          ${a.full_text_link ? `<button class="btn btn-sm btn-subtle" onclick="App.openArticleSummary('${a.full_text_link}')">🔗 Texto Completo</button>` : ''}
        </div>
      </div>
    `).join('');
  },

  openArticleSummary(link) {
    this.switchTab('wiki');
    if (window.WikiEngine) window.WikiEngine.loadPage(link);
  },

  // ── Patents Matrix ──
  renderPatents() {
    const container = document.getElementById('patents-list');
    if (!container) return;

    const patents = (window.APP_DATA && window.APP_DATA.patents) || [];
    container.innerHTML = patents.map(p => `
      <div class="patent-card reveal">
        <div class="patent-header">
          <span class="patent-tag">Patente Internacional</span>
          <span class="patent-prio">Prioridad: ${p.priority || 'Concedida'}</span>
        </div>
        <h4 class="patent-title">${p.title}</h4>
        <div class="patent-nums"><strong>Publicación:</strong> <code>${p.publication || p.publication_number || 'PCT/EP'}</code></div>
        <div class="patent-assignee"><strong>Cesionario:</strong> ${p.assignee || 'DestiNA Genomics / Univ. Edinburgh / UGR'}</div>
        <div class="patent-inventors"><strong>Inventores:</strong> ${p.inventors || 'J. J. Díaz-Mochón et al.'}</div>
      </div>
    `).join('');
  },

  // ── Research Projects & Contracts I+D ──
  renderProjects() {
    const container = document.getElementById('projects-list');
    const countBadge = document.getElementById('project-count-badge');
    if (!container) return;

    const allProjects = (window.APP_DATA && (window.APP_DATA.projects || window.APP_DATA.proyectos)) || [];

    const filtered = allProjects.filter(p => {
      // Category filter
      let matchesCategory = true;
      if (this.currentProjectFilter === 'ip') {
        matchesCategory = p.is_ip === true;
      } else if (this.currentProjectFilter !== 'all') {
        matchesCategory = p.category === this.currentProjectFilter;
      }

      // Search query
      let matchesSearch = true;
      if (this.projectSearchQuery) {
        const q = this.projectSearchQuery;
        const text = `${p.title} ${p.code} ${p.agency} ${p.call || ''} ${p.role || ''} ${p.year || ''}`.toLowerCase();
        matchesSearch = text.includes(q);
      }

      return matchesCategory && matchesSearch;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} de ${allProjects.length} proyectos`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-secondary);">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">🔍</div>
          <h4 style="color: var(--text-primary); margin-bottom: 8px;">No se encontraron proyectos con los criterios actuales</h4>
          <p>Pruebe a seleccionar otra categoría o a limpiar el buscador</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const isIp = p.is_ip;
      const roleBadge = isIp 
        ? '<span class="badge badge-ip">⭐ Investigador Principal (IP)</span>' 
        : '<span class="badge badge-member">👥 Investigador Participante</span>';

      let catBadgeClass = 'badge-secondary';
      if (p.category === 'internacional') catBadgeClass = 'badge-intl';
      else if (p.category === 'nacional') catBadgeClass = 'badge-nat';
      else if (p.category === 'regional') catBadgeClass = 'badge-reg';
      else if (p.category === 'transferencia') catBadgeClass = 'badge-trans';

      return `
        <div class="project-card reveal ${isIp ? 'card-ip' : ''}">
          <div class="project-card-header">
            <div class="project-badges">
              ${roleBadge}
              <span class="badge ${catBadgeClass}">${p.category_label || p.category}</span>
            </div>
            <span class="project-dates">📅 ${p.dates || p.year}</span>
          </div>

          <h4 class="project-title">${p.title}</h4>

          <div class="project-meta-grid">
            <div class="project-meta-item">
              <span class="pm-label">🔖 Código / Referencia:</span>
              <code class="pm-code">${p.code}</code>
            </div>
            <div class="project-meta-item">
              <span class="pm-label">🏛️ Entidad Financiadora:</span>
              <span class="pm-value">${p.agency}</span>
            </div>
            ${p.call ? `
              <div class="project-meta-item">
                <span class="pm-label">📋 Convocatoria:</span>
                <span class="pm-value">${p.call}</span>
              </div>
            ` : ''}
          </div>

          ${p.description ? `
            <p class="project-description">${p.description}</p>
          ` : ''}

          <div class="project-card-footer">
            <div class="project-amount-wrap">
              <span class="amount-label">Presupuesto / Financiación:</span>
              <strong class="project-amount">${p.amount}</strong>
            </div>
            <button class="btn btn-xs btn-outline" onclick="App.switchTab('wiki'); WikiEngine.loadPage('outputs/summaries_projects/Summary_of_DiazMochon_20161013_PLAN_DE_TRABAJO.md')">📄 Ver en Wiki</button>
          </div>
        </div>
      `;
    }).join('');
  },

  // ── Doctoral Theses & Researcher Mentorship ──
  renderTheses() {
    const container = document.getElementById('theses-list');
    if (!container) return;

    const theses = (window.APP_DATA && window.APP_DATA.theses) || [];
    container.innerHTML = theses.map((t, idx) => `
      <div class="thesis-card reveal">
        <div class="thesis-card-top">
          <span class="thesis-badge">Tesis Doctoral #${theses.length - idx}</span>
          <span class="thesis-year-badge">📅 ${t.year || 'Defendida'}</span>
        </div>
        <h4 class="thesis-title">${t.title}</h4>
        <div class="thesis-meta-grid">
          <div class="thesis-meta-item">
            <span class="meta-label">👨‍🎓 Doctorando/a:</span>
            <span class="meta-value candidate-name">${t.student}</span>
          </div>
          <div class="thesis-meta-item">
            <span class="meta-label">👥 Directores de Tesis:</span>
            <span class="meta-value directors-name">${t.directors}</span>
          </div>
          <div class="thesis-meta-item">
            <span class="meta-label">🏛️ Universidad / Entidad:</span>
            <span class="meta-value">${t.university}</span>
          </div>
        </div>
        ${t.mention ? `
          <div class="thesis-honors">
            <span class="thesis-honor-badge">🎖️ ${t.mention}</span>
          </div>
        ` : ''}
        ${t.preview ? `
          <p class="thesis-preview-text">${t.preview}</p>
        ` : ''}
        <div class="thesis-footer-actions">
          <button class="btn btn-xs btn-subtle" onclick="App.switchTab('wiki'); WikiEngine.loadPage('${t.summary_link}')">📄 Resumen en Wiki</button>
        </div>
      </div>
    `).join('');
  },

  // ── Navigation & Tabs ──
  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
    });

    // Update tab view visibility
    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${tabId}`);
    });

    // Refresh components on tab switch
    if (tabId === 'analitica' && window.ChartEngine) window.ChartEngine.updateAll();
    if (tabId === 'grafo' && window.ScientificGraph) window.ScientificGraph.init();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setupEventListeners() {
    // Nav links tab switching
    document.querySelectorAll('[data-tab]').forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = elem.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    // Publication year filters
    document.querySelectorAll('.btn-filter-year').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-filter-year').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentYearFilter = btn.getAttribute('data-year');
        this.renderPublications();
      });
    });

    // Publication search input
    const pubSearch = document.getElementById('pub-search-input');
    if (pubSearch) {
      pubSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderPublications();
      });
    }

    // Project category filters
    document.querySelectorAll('.btn-filter-project').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-filter-project').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentProjectFilter = btn.getAttribute('data-category');
        this.renderProjects();
      });
    });

    // Project search input
    const projectSearch = document.getElementById('project-search-input');
    if (projectSearch) {
      projectSearch.addEventListener('input', (e) => {
        this.projectSearchQuery = e.target.value.toLowerCase().trim();
        this.renderProjects();
      });
    }

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }
  }
};
