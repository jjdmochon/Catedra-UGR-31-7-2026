// ============================================================
// CHARTS.JS — Interactive Data Analytics with Chart.js 4.4
// Cátedra UGR Concurso 31/7/2026 · Prof. Juan José Díaz-Mochón
// ============================================================

window.ChartEngine = {
  charts: {},

  init() {
    this.renderPublicationsByYear();
    this.renderQuartilesChart();
    this.renderResearchAxesChart();
    this.renderCitationsChart();
  },

  getThemeColors() {
    const isDark = document.body.classList.contains('dark-theme');
    return {
      text: isDark ? '#94a3b8' : '#475569',
      grid: isDark ? 'rgba(0, 166, 166, 0.12)' : 'rgba(0, 128, 128, 0.08)',
      teal: '#008080',
      tealLight: '#00a6a6',
      mint: '#3EB489',
      coral: '#FF7F50',
      accent: '#38bdf8'
    };
  },

  renderPublicationsByYear() {
    const ctx = document.getElementById('chart-pub-years');
    if (!ctx) return;

    // Aggregate articles by year
    const articles = (window.APP_DATA && window.APP_DATA.articles) || [];
    const yearCounts = {};
    articles.forEach(a => {
      const yr = a.year || 2020;
      yearCounts[yr] = (yearCounts[yr] || 0) + 1;
    });

    const years = Object.keys(yearCounts).sort();
    const counts = years.map(y => yearCounts[y]);

    const colors = this.getThemeColors();

    if (this.charts.pubYears) this.charts.pubYears.destroy();

    this.charts.pubYears = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: 'Artículos Publicados',
          data: counts,
          backgroundColor: colors.tealLight,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: colors.mint
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 15, 18, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#5eead4',
            borderColor: 'rgba(0, 166, 166, 0.3)',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: { color: colors.grid },
            ticks: { color: colors.text, font: { family: 'Space Grotesk', size: 11 } }
          },
          y: {
            grid: { color: colors.grid },
            ticks: { color: colors.text, font: { family: 'Space Grotesk', size: 11 }, stepSize: 2 },
            beginAtZero: true
          }
        }
      }
    });
  },

  renderQuartilesChart() {
    const ctx = document.getElementById('chart-quartiles');
    if (!ctx) return;

    const colors = this.getThemeColors();

    if (this.charts.quartiles) this.charts.quartiles.destroy();

    this.charts.quartiles = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Primer Cuartil (Q1)', 'Segundo Cuartil (Q2)', 'Otros (Q3/Q4)'],
        datasets: [{
          data: [71, 18, 9],
          backgroundColor: [colors.teal, colors.mint, colors.coral],
          borderWidth: 2,
          borderColor: document.body.classList.contains('dark-theme') ? '#0e1414' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.text,
              font: { family: 'Montserrat', size: 11, weight: '600' },
              padding: 14
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 15, 18, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#5eead4',
            padding: 10
          }
        }
      }
    });
  },

  renderResearchAxesChart() {
    const ctx = document.getElementById('chart-axes');
    if (!ctx) return;

    const colors = this.getThemeColors();

    if (this.charts.axes) this.charts.axes.destroy();

    this.charts.axes = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: [
          'Química Dinámica & PNA',
          'Biopsia Líquida & miRs',
          'Nanotecnología & Teranóstica',
          'Aplicaciones PoC / Clínicas',
          'Biomateriales & Arrays',
          'Síntesis Orgánica & Purinas'
        ],
        datasets: [{
          data: [25, 20, 22, 15, 15, 10],
          backgroundColor: [
            'rgba(0, 128, 128, 0.75)',
            'rgba(62, 180, 137, 0.75)',
            'rgba(255, 127, 80, 0.75)',
            'rgba(56, 189, 248, 0.75)',
            'rgba(168, 85, 247, 0.75)',
            'rgba(234, 179, 8, 0.75)'
          ],
          borderWidth: 1,
          borderColor: colors.grid
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.text,
              font: { family: 'Space Grotesk', size: 10 },
              padding: 8
            }
          }
        },
        scales: {
          r: {
            grid: { color: colors.grid },
            ticks: { display: false }
          }
        }
      }
    });
  },

  renderCitationsChart() {
    const ctx = document.getElementById('chart-citations');
    if (!ctx) return;

    const colors = this.getThemeColors();

    // Cumulative citation approximation curve based on WOS citation profile
    const years = ['2004', '2007', '2010', '2013', '2016', '2019', '2022', '2024', '2026'];
    const citations = [45, 180, 490, 850, 1280, 1710, 2120, 2350, 2420];

    if (this.charts.citations) this.charts.citations.destroy();

    this.charts.citations = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Citaciones Acumuladas',
          data: citations,
          borderColor: colors.mint,
          backgroundColor: 'rgba(62, 180, 137, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: colors.mint
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 15, 18, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#5eead4',
            padding: 10
          }
        },
        scales: {
          x: {
            grid: { color: colors.grid },
            ticks: { color: colors.text, font: { family: 'Space Grotesk', size: 11 } }
          },
          y: {
            grid: { color: colors.grid },
            ticks: { color: colors.text, font: { family: 'Space Grotesk', size: 11 } }
          }
        }
      }
    });
  },

  updateAll() {
    this.init();
  }
};
