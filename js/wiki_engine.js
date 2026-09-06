// ============================================================
// WIKI_ENGINE.JS — Markdown Rendering, Obsidian Links & Search
// Cátedra UGR Concurso 31/7/2026 · Prof. Juan José Díaz-Mochón
// ============================================================

window.WikiEngine = {
  currentPath: null,
  history: [],

  init() {
    this.configureMarked();
    this.initMermaid();
    this.setupSearch();
  },

  configureMarked() {
    if (typeof marked === 'undefined') return;

    // Configure marked options
    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true,
      mangle: false
    });
  },

  initMermaid() {
    if (typeof mermaid === 'undefined') return;

    const isDark = document.body.classList.contains('dark-theme');
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        primaryColor: '#008080',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#00a6a6',
        lineColor: isDark ? '#5edcae' : '#008080',
        secondaryColor: '#3EB489',
        tertiaryColor: '#FF7F50'
      },
      securityLevel: 'loose'
    });
  },

  async loadPage(relPath) {
    if (!relPath) return;

    // Normalize path
    let cleanPath = relPath.replace(/^wiki\//, '').replace(/^\.\.\//, '').replace(/\\/g, '/');

    const readerContainer = document.getElementById('wiki-reader-content');
    const pathIndicator = document.getElementById('wiki-path-indicator');
    if (!readerContainer) return;

    // Show loading skeleton
    readerContainer.innerHTML = '<div class="wiki-skeleton"><div class="sk-line sk-title"></div><div class="sk-line"></div><div class="sk-line"></div><div class="sk-line sk-short"></div></div>';
    if (pathIndicator) pathIndicator.textContent = cleanPath;

    let mdText = '';

    // 1. Try in-memory cache first (Zero-CORS, instant)
    if (window.WIKI_PAGES && window.WIKI_PAGES[cleanPath]) {
      mdText = window.WIKI_PAGES[cleanPath];
    } else if (window.WIKI_PAGES && window.WIKI_PAGES[cleanPath + '.md']) {
      mdText = window.WIKI_PAGES[cleanPath + '.md'];
    } else {
      // 2. Fallback to fetch
      try {
        const fetchUrl = 'wiki/' + cleanPath;
        const res = await fetch(fetchUrl);
        if (res.ok) {
          mdText = await res.text();
        } else {
          throw new Error('HTTP ' + res.status);
        }
      } catch (err) {
        // Try searching by basename if path has subfolder mismatch
        const baseName = cleanPath.split('/').pop();
        let foundInCache = false;
        if (window.WIKI_PAGES) {
          for (const k in window.WIKI_PAGES) {
            if (k.endsWith('/' + baseName) || k === baseName) {
              mdText = window.WIKI_PAGES[k];
              cleanPath = k;
              foundInCache = true;
              break;
            }
          }
        }
        if (!foundInCache) {
          readerContainer.innerHTML = `
            <div class="wiki-error-card">
              <h3>📄 Documento no encontrado</h3>
              <p>No se pudo cargar la ruta solicitada: <code>${cleanPath}</code></p>
              <p><small>Verifique si el fichero existe o seleccione otra página en el índice del LLM-Wiki.</small></p>
              <button class="btn btn-sm btn-primary" onclick="WikiEngine.loadPage('concurso/Convocatoria_BOE_31_7_2026.md')">🏛️ Volver a Bases Concurso</button>
            </div>
          `;
          return;
        }
      }
    }

    this.currentPath = cleanPath;
    this.history.push(cleanPath);

    // Parse and render markdown
    this.renderMarkdown(mdText, readerContainer);
  },

  renderMarkdown(rawMd, container) {
    // 1. Strip YAML frontmatter
    let content = rawMd.replace(/^---[\s\S]*?---\s*/, '');

    // 2. Transform Obsidian wiki links: [[Target]] or [[Target|Alias]] (stripping backticks if present)
    content = content.replace(/`?\[\[([^|\]\n]+)(?:\|([^\]\n]+))?\]\]`?/g, (match, target, alias) => {
      const displayText = (alias || target).trim();
      const safeTarget = target.trim().replace(/['"\\]/g, '');
      return `<a href="javascript:void(0)" class="wiki-internal-link" onclick="WikiEngine.resolveInternalLink('${safeTarget}')">🔗 ${displayText}</a>`;
    });

    // 3. Transform markdown links targeting .md files (stripping backticks if present)
    content = content.replace(/`?\[(.*?)\]\((.*?\.md)\)`?/g, (match, text, url) => {
      const safeUrl = url.trim().replace(/['"\\]/g, '');
      return `<a href="javascript:void(0)" class="wiki-internal-link" onclick="WikiEngine.loadPage('${safeUrl}')">📄 ${text}</a>`;
    });

    // 4. Render HTML via marked
    let html = marked.parse(content);

    // 5. Inject into container
    container.innerHTML = html;

    // 6. Post-process Mermaid codeblocks
    this.renderMermaidDiagrams(container);
  },

  renderMermaidDiagrams(container) {
    if (typeof mermaid === 'undefined') return;

    const mermaidBlocks = container.querySelectorAll('code.language-mermaid, pre code.language-mermaid');
    if (mermaidBlocks.length === 0) return;

    mermaidBlocks.forEach((block, idx) => {
      const pre = block.closest('pre') || block;
      const code = block.textContent;
      const div = document.createElement('div');
      div.className = 'mermaid-chart';
      div.id = 'mermaid-chart-' + idx + '-' + Date.now();
      div.textContent = code;
      pre.parentNode.replaceChild(div, pre);
    });

    try {
      mermaid.run({
        querySelector: '.mermaid-chart'
      });
    } catch (e) {
      console.warn('Mermaid rendering notice:', e);
    }
  },

  resolveInternalLink(target) {
    // Try to locate target in WIKI_PAGES
    if (!window.WIKI_PAGES) return;

    const norm = target.toLowerCase().replace(/ /g, '_');
    for (const p in window.WIKI_PAGES) {
      const pNorm = p.toLowerCase();
      if (pNorm.includes(norm) || pNorm.endsWith(norm + '.md')) {
        this.loadPage(p);
        return;
      }
    }

    // Default to search if not exact match
    const searchInput = document.getElementById('wiki-search-input');
    if (searchInput) {
      searchInput.value = target;
      this.performSearch(target);
    }
  },

  setupSearch() {
    const input = document.getElementById('wiki-search-input');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.performSearch(e.target.value.trim());
      }, 200);
    });
  },

  performSearch(query) {
    const resultsContainer = document.getElementById('wiki-search-results');
    if (!resultsContainer) return;

    if (!query || query.length < 2) {
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'none';
      return;
    }

    const qLower = query.toLowerCase();
    const matches = [];

    // Search in articles
    const articles = (window.WIKI_DATA && window.WIKI_DATA.articles) || [];
    articles.forEach(a => {
      if ((a.title && a.title.toLowerCase().includes(qLower)) ||
          (a.authors && a.authors.toLowerCase().includes(qLower)) ||
          (a.preview && a.preview.toLowerCase().includes(qLower))) {
        matches.push({
          type: 'Artículo',
          title: a.title,
          subtitle: `${a.year} · ${a.authors ? a.authors.split(',')[0] : ''}`,
          link: a.summary_link || a.full_text_link
        });
      }
    });

    // Search in patents
    const patents = (window.WIKI_DATA && window.WIKI_DATA.patents) || [];
    patents.forEach(p => {
      if ((p.title && p.title.toLowerCase().includes(qLower)) ||
          (p.assignee && p.assignee.toLowerCase().includes(qLower))) {
        matches.push({
          type: 'Patente',
          title: p.title,
          subtitle: `${p.publication || p.publication_number} · ${p.assignee || ''}`,
          link: p.summary_link
        });
      }
    });

    // Search in markdown pages
    if (window.WIKI_PAGES) {
      for (const path in window.WIKI_PAGES) {
        if (path.toLowerCase().includes(qLower) || window.WIKI_PAGES[path].toLowerCase().includes(qLower)) {
          const title = path.split('/').pop().replace('.md', '').replace(/_/g, ' ');
          matches.push({
            type: path.startsWith('concurso') ? '🏛️ Concurso' : path.startsWith('courses') ? '🎓 Docencia' : '📄 Wiki',
            title: title,
            subtitle: path,
            link: path
          });
        }
      }
    }

    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const m of matches) {
      const key = m.title + m.link;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(m);
      }
      if (unique.length >= 25) break;
    }

    if (unique.length === 0) {
      resultsContainer.innerHTML = '<div class="search-item text-muted">No se encontraron coincidencias</div>';
    } else {
      resultsContainer.innerHTML = unique.map(u => `
        <div class="search-item" onclick="WikiEngine.loadPage('${u.link}'); document.getElementById('wiki-search-results').style.display='none';">
          <span class="search-item-badge">${u.type}</span>
          <div class="search-item-title">${u.title}</div>
          <div class="search-item-sub">${u.subtitle || ''}</div>
        </div>
      `).join('');
    }
    resultsContainer.style.display = 'block';
  }
};
