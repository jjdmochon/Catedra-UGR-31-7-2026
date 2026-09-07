// ============================================================
// GRAPH.JS — Scientific Co-authorship & Domain Network (D3.js v7)
// Cátedra UGR Concurso 31/7/2026 · Prof. Juan José Díaz-Mochón
// ============================================================

window.ScientificGraph = {
  svg: null,
  simulation: null,
  data: null,

  init() {
    const container = document.getElementById('network-graph-container');
    if (!container) return;

    // Clear previous SVG if any
    container.innerHTML = '';

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 600;

    this.data = this.getGraphData();

    const isDark = document.body.classList.contains('dark-theme');

    const svg = d3.select('#network-graph-container')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    // Zoom setup
    const zoom = d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.4, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Color scale for clusters (Genyo Fusion Palette)
    const clusterColors = {
      center: '#00a6a6',
      coauthor: '#3EB489',
      institution: '#38bdf8',
      topic: '#FF7F50',
      spinoff: '#eab308'
    };

    // Force simulation with generous spacing & anti-collision
    this.simulation = d3.forceSimulation(this.data.nodes)
      .force('link', d3.forceLink(this.data.links)
        .id(d => d.id)
        .distance(d => (d.distance ? d.distance * 1.55 : 130)))
      .force('charge', d3.forceManyBody().strength(-520))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + 24));

    // Links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.data.links)
      .join('line')
      .attr('stroke', isDark ? 'rgba(0, 166, 166, 0.25)' : 'rgba(0, 128, 128, 0.22)')
      .attr('stroke-width', d => Math.sqrt(d.value || 1) * 1.8)
      .attr('stroke-linecap', 'round');

    // Nodes container
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.data.nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) this.simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Circles
    node.append('circle')
      .attr('r', d => d.radius || 12)
      .attr('fill', d => clusterColors[d.type] || '#64748b')
      .attr('stroke', isDark ? '#10171a' : '#ffffff')
      .attr('stroke-width', 2.5);

    // Labels with crisp anti-collision halo
    node.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('y', d => -(d.radius + 7))
      .attr('fill', isDark ? '#f1f5f9' : '#0f172a')
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-size', d => d.type === 'center' ? '13px' : '10.5px')
      .attr('font-weight', d => d.type === 'center' ? '700' : '600')
      .style('paint-order', 'stroke fill')
      .style('stroke', isDark ? '#0a0f12' : '#ffffff')
      .style('stroke-width', '3.5px')
      .style('stroke-linejoin', 'round')
      .attr('pointer-events', 'none');

    // Tooltip & Interactive Highlighting
    const tooltip = d3.select('#graph-tooltip');
    
    // Set of connected nodes lookup
    const linkedByIndex = {};
    this.data.links.forEach(d => {
      const s = typeof d.source === 'object' ? d.source.id : d.source;
      const t = typeof d.target === 'object' ? d.target.id : d.target;
      linkedByIndex[`${s},${t}`] = true;
      linkedByIndex[`${t},${s}`] = true;
    });

    const isConnected = (a, b) => a.id === b.id || linkedByIndex[`${a.id},${b.id}`];

    node.on('mouseover', (event, d) => {
      // Highlight connected elements
      node.style('opacity', o => isConnected(d, o) ? 1 : 0.22);
      link
        .style('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1)
        .style('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? '#00a6a6' : (isDark ? 'rgba(0, 166, 166, 0.15)' : 'rgba(0, 128, 128, 0.12)'))
        .style('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? 3 : 1);

      if (tooltip.node()) {
        tooltip.style('opacity', 1)
          .style('left', (event.pageX + 16) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(`<strong>${d.label}</strong><br><span style="color:#00a6a6">${d.role || d.type}</span><br><small>${d.details || ''}</small>`);
      }
    }).on('mouseout', () => {
      node.style('opacity', 1);
      link
        .style('stroke-opacity', 1)
        .style('stroke', isDark ? 'rgba(0, 166, 166, 0.25)' : 'rgba(0, 128, 128, 0.22)')
        .style('stroke-width', d => Math.sqrt(d.value || 1) * 1.8);

      if (tooltip.node()) tooltip.style('opacity', 0);
    });

    this.simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  },

  getGraphData() {
    return {
      nodes: [
        { id: 'jjd', label: 'J. J. Díaz-Mochón', type: 'center', radius: 24, role: 'Candidato a Cátedra UGR', details: '98 Publicaciones · 16 Patentes · 11 Tesis · 30 Proyectos I+D' },
        
        // Co-authors
        { id: 'bradley', label: 'Prof. Mark Bradley', type: 'coauthor', radius: 16, role: 'Univ. of Edinburgh', details: '>25 publicaciones conjuntas · Microarrays & PNA' },
        { id: 'pernagallo', label: 'Dr. Salvatore Pernagallo', type: 'coauthor', radius: 15, role: 'DestiNA Genomics / GENYO', details: 'Co-inventor DCL · SMART Bases' },
        { id: 'sanchez_martin', label: 'Prof. Rosario M. Sánchez-Martín', type: 'coauthor', radius: 15, role: 'UGR / GENYO', details: 'Co-directora NanoChemBio · Nanotecnología' },
        { id: 'dear', label: 'Prof. James W. Dear', type: 'coauthor', radius: 13, role: 'Univ. of Edinburgh', details: 'Clínica & Biomarcador miR-122 (DILI)' },
        { id: 'martin', label: 'Dr. Francisco Martín', type: 'coauthor', radius: 12, role: 'GENYO', details: 'CRISPR-Cas13 dual guide · Edición génica' },
        { id: 'unciti', label: 'Prof. Asier Unciti-Broceta', type: 'coauthor', radius: 13, role: 'Univ. of Edinburgh', details: 'Química bioortogonal & Purinas' },
        { id: 'orte', label: 'Prof. Ángel Orte', type: 'coauthor', radius: 12, role: 'UGR', details: 'Fluorimetría resuelta en tiempo & Time-gated' },
        { id: 'serrano', label: 'Dra. María José Serrano', type: 'coauthor', radius: 12, role: 'GENYO / ISLB', details: 'Biopsia líquida & Células tumorales circulantes' },
        { id: 'cuerva', label: 'Prof. Juan Manuel Cuerva', type: 'coauthor', radius: 13, role: 'UGR (Química Orgánica)', details: 'Catálisis, cristales supramoleculares y nanotubos' },

        // Institutions
        { id: 'ugr', label: 'Universidad de Granada', type: 'institution', radius: 18, role: 'Institución Académica', details: 'Dpto. Química Farmacéutica y Orgánica' },
        { id: 'genyo', label: 'Centro GENYO', type: 'institution', radius: 16, role: 'Centro de Investigación', details: 'Grupo NanoChemBio' },
        { id: 'edinburgh', label: 'University of Edinburgh', type: 'institution', radius: 16, role: 'Reino Unido', details: 'Estancia postdoctoral & Research Fellow (2005-2010)' },
        { id: 'southampton', label: 'Univ. of Southampton', type: 'institution', radius: 13, role: 'Reino Unido', details: 'Estancia postdoctoral (2003-2005)' },

        // Research Topics & Platforms (Updated: Líneas consolidadas de investigación)
        { id: 'dcl', label: 'Química Dinámica (DCL)', type: 'topic', radius: 16, role: 'Línea Consolidada', details: 'Detección PCR-free con resolución de un solo nucleótido' },
        { id: 'liquid_biopsy', label: 'Biopsia Líquida & miR-122', type: 'topic', radius: 15, role: 'Línea Consolidada', details: 'Diagnóstico no invasivo de daño hepático y cáncer' },
        { id: 'nanobiosensors', label: 'Nanobiosensores & PoC', type: 'topic', radius: 14, role: 'Línea Consolidada', details: 'Dispositivos Point-of-Care (CoVradar, Spin-Tube)' },
        { id: 'smart_pna', label: 'Sondas SMART & PNA', type: 'topic', radius: 15, role: 'Línea Consolidada', details: 'Química bioorgánica de ácidos nucleicos peptídicos y fluoróforos' },

        // Spinoffs & Entities
        { id: 'destina', label: 'DESTINA Genomics Ltd.', type: 'spinoff', radius: 15, role: 'Empresa Spin-Off (UK/ES)', details: 'Fundada en 2010 · Licencias con Millipore, Quanterix, Optoi' },
        { id: 'crispna_co', label: 'CRISPNA S.L.', type: 'spinoff', radius: 12, role: 'Spin-Off Diagnóstico', details: 'Tecnología Cas13 y sondas PNA' },
        { id: 'islb', label: 'Intl. Society Liquid Biopsy', type: 'spinoff', radius: 14, role: 'Sociedad Científica', details: 'Co-fundador & Tesorero (2017-2021)' }
      ],
      links: [
        { source: 'jjd', target: 'ugr', distance: 75, value: 5 },
        { source: 'jjd', target: 'genyo', distance: 70, value: 5 },
        { source: 'jjd', target: 'edinburgh', distance: 100, value: 4 },
        { source: 'jjd', target: 'southampton', distance: 115, value: 3 },
        { source: 'jjd', target: 'bradley', distance: 90, value: 5 },
        { source: 'jjd', target: 'pernagallo', distance: 75, value: 5 },
        { source: 'jjd', target: 'sanchez_martin', distance: 75, value: 5 },
        { source: 'jjd', target: 'dear', distance: 100, value: 4 },
        { source: 'jjd', target: 'martin', distance: 95, value: 3 },
        { source: 'jjd', target: 'unciti', distance: 95, value: 4 },
        { source: 'jjd', target: 'orte', distance: 95, value: 3 },
        { source: 'jjd', target: 'serrano', distance: 90, value: 4 },
        { source: 'jjd', target: 'cuerva', distance: 90, value: 4 },
        
        { source: 'jjd', target: 'dcl', distance: 75, value: 5 },
        { source: 'jjd', target: 'liquid_biopsy', distance: 80, value: 5 },
        { source: 'jjd', target: 'nanobiosensors', distance: 85, value: 4 },
        { source: 'jjd', target: 'smart_pna', distance: 80, value: 5 },

        { source: 'jjd', target: 'destina', distance: 80, value: 5 },
        { source: 'jjd', target: 'crispna_co', distance: 95, value: 3 },
        { source: 'jjd', target: 'islb', distance: 85, value: 4 },

        // Inter-node links
        { source: 'pernagallo', target: 'destina', distance: 55, value: 4 },
        { source: 'bradley', target: 'edinburgh', distance: 55, value: 4 },
        { source: 'sanchez_martin', target: 'genyo', distance: 55, value: 4 },
        { source: 'serrano', target: 'islb', distance: 55, value: 4 },
        { source: 'dcl', target: 'destina', distance: 60, value: 4 },
        { source: 'dcl', target: 'liquid_biopsy', distance: 65, value: 3 },
        { source: 'dear', target: 'liquid_biopsy', distance: 65, value: 4 },
        { source: 'cuerva', target: 'ugr', distance: 55, value: 4 },
        { source: 'smart_pna', target: 'destina', distance: 60, value: 4 }
      ]
    };
  }
};
