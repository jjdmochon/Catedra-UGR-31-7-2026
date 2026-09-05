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

  init() {
    this.initTheme();
    this.renderConcursoDetails();
    this.renderAnexoIV();
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

  // ── Theme Switcher ──
  initTheme() {
    const savedTheme = localStorage.getItem('jjd_theme') || 'dark';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    this.updateThemeButton();
  },

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('jjd_theme', isDark ? 'dark' : 'light');
    this.updateThemeButton();

    // Refresh charts and graphs
    if (window.ChartEngine) window.ChartEngine.updateAll();
    if (window.ScientificGraph) window.ScientificGraph.init();
    if (window.WikiEngine) window.WikiEngine.initMermaid();
  },

  updateThemeButton() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const isDark = document.body.classList.contains('dark-theme');
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

  // ── Doctoral Theses ──
  renderTheses() {
    const container = document.getElementById('theses-list');
    if (!container) return;

    const theses = (window.APP_DATA && window.APP_DATA.theses) || [];
    container.innerHTML = theses.map((t, idx) => `
      <div class="thesis-card reveal">
        <div class="thesis-badge">Tesis Doctoral #${theses.length - idx}</div>
        <h4 class="thesis-title">${t.title}</h4>
        <div class="thesis-meta">
          <span>🎓 <strong>Doctorando/a:</strong> ${t.advisors ? t.advisors.split(';')[0] : 'Investigador/a'}</span>
          <span>📅 <strong>Año:</strong> ${t.year || 'Defendida'}</span>
          <span>🏛️ <strong>Universidad:</strong> ${t.university || 'Universidad de Granada'}</span>
        </div>
        <div class="thesis-honor">Sobresaliente Cum Laude · Mención Internacional</div>
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
