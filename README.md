# Candidatura a Cátedra de Universidad · Área de Química Orgánica
## Concurso 31/7/2026 · BOE-A-2026-16414 · Universidad de Granada

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Dossier-008080?style=for-the-badge&logo=github)](https://jjdmochon.github.io/Catedra-UGR-31-7-2026/)
[![UGR](https://img.shields.io/badge/Universidad%20de%20Granada-Farmacia%20%26%20GENYO-3EB489?style=for-the-badge)](https://www.ugr.es)
[![BOE](https://img.shields.io/badge/BOE-A--2026--16414-FF7F50?style=for-the-badge)](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-16414)

Bienvenido al repositorio oficial y **LLM-Wiki de la Candidatura** del **Prof. Dr. Juan José Díaz-Mochón** para el concurso de acceso al cuerpo docente de **Catedrático de Universidad** convocado por la Universidad de Granada (Resolución de 22 de julio de 2026, BOE núm. 183 de 28 de julio de 2026).

---

## 🏛️ 1. Ficha Oficial de la Convocatoria

- **Código de Concurso**: `31/7/2026`
- **Cuerpo Docente**: Catedrático de Universidad (Promoción Interna).
- **Área de Conocimiento**: Química Orgánica.
- **Departamento**: Departamento de Química Farmacéutica y Orgánica.
- **Centro**: Facultad de Farmacia, Universidad de Granada.
- **Centro de Investigación**: Centro Pfizer - Universidad de Granada - Junta de Andalucía de Genómica e Investigaciones Oncológicas (GENYO).
- **Perfil Docente Oficial**:
  - *Química Orgánica 1 y 2* (Grado en Farmacia).
  - *Química Farmacéutica 1 y 2* (Grado en Farmacia).
  - *Química Orgánica* y *Química de los Fármacos y Marcadores Orgánicos de los Alimentos. Trazabilidad* (Grado en Ciencia y Tecnología de los Alimentos - CTA).
  - *Química General* (Grado en Nutrición Humana y Dietética - NHD).
  - *Máster Oficial en Medicina Traslacional* (TRANSMED).
- **Perfil de Investigación Oficial**:
  - *"Desarrollo de estrategias químicas basadas en química dinámica para la detección de ácidos nucleicos como herramienta de diagnóstico."*

---

## 👥 2. Comisión de Selección Oficial (Anexo III BOE)

### Comisión Titular
1. **Presidenta titular**: **Dra. Laura Rodríguez Raurell** (Catedrática de Universidad, Universidad de Barcelona).
2. **Secretario titular**: **Dr. Juan Manuel Cuerva Carvajal** (Catedrático de Universidad, Universidad de Granada).
3. **Vocal titular 1º**: **Dra. Eva María Talavera Rodríguez** (Catedrática de Universidad, Universidad de Granada).
4. **Vocal titular 2º**: **Dr. Manuel Nogueras Montiel** (Catedrático de Universidad, Universidad de Jaén).
5. **Vocal titular 3º**: **Dra. M. Jesús Ortega Agüera** (Catedrática de Universidad, Universidad de Cádiz).

### Comisión Suplente
- **Presidenta suplente**: Dra. Rosario Hernández Galán (Universidad de Cádiz).
- **Secretaria suplente**: Dra. Alegría Carrasco Pancorbo (Universidad de Granada).
- **Vocal suplente 1º**: Dr. Manuel Sánchez Polo (Universidad de Granada).
- **Vocal suplente 2º**: Dr. Ramón Martínez Máñez (Universidad Politécnica de Valencia).
- **Vocal suplente 3º**: Dra. Marina Gordaliza Escobar (Universidad de Salamanca).

---

## 📊 3. Resumen Cuantitativo de la Candidatura

- **Publicaciones Científicas**: **98 artículos** indexados en JCR / Scopus (>72% en el primer cuartil Q1).
- **Impacto y Citaciones**: Índice **H = 29** | Más de **2.400 citaciones**.
- **Propiedad Industrial**: **16 familias de patentes internacionales** (12 concedidas en EE.UU., Europa y Japón; 4 en explotación comercial activa con acuerdos de licencia con compañías globales como *MilliporeSigma*, *Quanterix* y *Optoi*).
- **Tesis Doctorales**: **11 tesis doctorales dirigidas y defendidas** con la máxima calificación (*Sobresaliente cum laude*, menciones internacionales y premios extraordinarios).
- **Quinquenios Docentes**: **5 Quinquenios reconocidos** (25 años de docencia evaluada positivamente ininterrumpida).
- **Evaluación Docente**: Calificación media histórica de **4.78 sobre 5.00** en el Programa DOCENTIA de la Universidad de Granada.
- **Sexenios Reconocidos**: **3 Sexenios de Investigación** + **1 Sexenio de Transferencia** (CNEAI / ANECA).
- **Proyectos de I+D+i**: Más de 30 proyectos y contratos de investigación financiados (UE FP7, Horizon Europe, EIC Accelerator 2025, Plan Nacional, Retos, EQC2024 infraestructuras, contratos art. 83/60 LOSU).
- **Transferencia y Liderazgo**: Co-fundador y CSO/CEO de **DESTINA Genomics Ltd.** (2010–2025), co-fundador de **CRISPNA S.L.** y **NanoGetic S.L.**, y co-fundador y tesorero de la **International Society of Liquid Biopsy (ISLB)** (2017–2021).

---

## 🧠 4. Arquitectura del LLM-Wiki y Aplicación Web

La aplicación web ha sido construida como una Single Page Application (SPA) reactiva y modular que implementa el sistema de diseño **Genyo Fusion**:
- **Cero dependencias de servidor backend**: Base de datos pre-compilada en memoria (`js/data.js` y `js/wiki_data.js`) con más de 280 documentos indexados, garantizando un funcionamiento instantáneo y 100% compatible con CORS tanto en `file:///` como en GitHub Pages.
- **Renderizador Markdown & Obsidian**: Soporte nativo para enlaces `[[Tema]]`, tablas científicas, bloques de código y mapas mentales dinámicos generados en tiempo real mediante **Mermaid.js**.
- **Visualización Analítica Interactiva**: Gráficos de tendencias temporales y cuartiles en **Chart.js 4.4**, junto con un grafo de red científica de coautorías e instituciones en **D3.js v7** con simulación de fuerzas dirigidas.
- **Navegador del Anexo IV BOE**: Selector interactivo de los **25 apartados oficiales** exigidos en la memoria/currículum del concurso, permitiendo a los miembros de la comisión acceder directamente a cada mérito con enlaces probatorios a DOIs, patentes y títulos.
- **Selector de Tema Dinámico**: Modo Oscuro (*Dark Slate / Cyberpunk Teal*) y Modo Claro (*Clean Academic Slate*), con persistencia en `localStorage`.

---

## 🚀 5. Despliegue en GitHub Pages

El repositorio está configurado para desplegarse automáticamente en GitHub Pages mediante dos vías:

1. **Despliegue directo desde la rama `main`**: Al contar con el archivo `.nojekyll` y una estructura estática pura (`index.html` en raíz), basta con activar GitHub Pages en `Settings > Pages > Branch: main > / (root)`.
2. **GitHub Actions Workflow**: Incluido en `.github/workflows/deploy.yml` para despliegue automatizado en cada push.

---

## 📁 6. Estructura de Ficheros del Repositorio

```text
Catedra-UGR-31-7-2026/
├── index.html                    # Aplicación Web Unificada (Cátedra + Analítica + LLM-Wiki)
├── README.md                     # Memoria oficial y documentación del repositorio
├── .nojekyll                     # Deshabilita el parser Jekyll en GitHub Pages
├── build_data_bundle.py          # Script de consolidación e indexación de la base de conocimiento
├── assets/                       # Logotipos, fotografía oficial y graphical abstracts
├── css/
│   ├── design-system.css         # Variables Genyo Fusion, tipografía, temas y reset
│   ├── main.css                  # Estilos estructurales, hero, tribunal, KPIs y catálogo
│   └── wiki.css                  # Estilos del visor LLM-Wiki, markdown y Mermaid
├── js/
│   ├── data.js                   # Base de datos unificada (concurso, KPIs, 98 papers, 16 patentes)
│   ├── wiki_data.js              # Base de conocimiento estructurada y caché de 280 páginas markdown
│   ├── charts.js                 # Gráficos Chart.js de publicaciones, cuartiles y citas
│   ├── graph.js                  # Grafo interactivo D3.js de coautoría y temas
│   ├── wiki_engine.js            # Motor de búsqueda y renderizado markdown (Marked + Mermaid)
│   └── app.js                    # Controlador SPA, navegación por tabs y selector de tema
└── wiki/                         # Base documental en Markdown (Obsidian Vault)
    ├── concurso/                 # Bases BOE, Tribunal, Proyecto Docente e Investigador, Anexo IV
    ├── courses/                  # Docencia UGR (QFUNO, QFDOS, QO, CTA, NHD, TRANSMED)
    ├── methods/                  # DCL, SMART Probes, RiboTACs, drug2cell, DEL, Micro-C
    ├── profile/                  # Perfil académico, 6 ejes de investigación, biografía
    ├── entities/                 # DESTINA, CRISPNA, GENYO, UGR, Edinburgh, Southampton, ISLB
    └── concepts/                 # Glosario ontológico y conceptos biológicos y químicos
```

---

## 📄 7. Licencia y Contacto

- **Candidato**: Prof. Dr. Juan José Díaz-Mochón
- **Correo Institucional**: `juanjose.diaz@genyo.es` / `juandiaz@go.ugr.es`
- **Departamento de Química Farmacéutica y Orgánica**, Facultad de Farmacia, Universidad de Granada.
- **Centro GENYO**, Parque Tecnológico de la Salud (PTS), Avda. de la Ilustración 114, 18016 Granada, España.
