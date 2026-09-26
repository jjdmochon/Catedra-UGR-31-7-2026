// Genera el CV completo en formato Anexo IV (BOE-A-2026-16414) a partir de
// js/data.js y de "Diaz-Mochon scientific production 2026_0626.md".
// Uso: cd cv && npm install && npm run build
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow,
  TableCell, WidthType, ShadingType, BorderStyle, LevelFormat, Footer, Header, PageNumber,
  TableOfContents, PageBreak, ExternalHyperlink, ImageRun,
} = require("docx");

const ROOT = path.resolve(__dirname, "..");
global.window = {};
require(path.join(ROOT, "js/data.js"));
const D = window.APP_DATA;
const PROD = fs.readFileSync(path.join(ROOT, "Diaz-Mochon scientific production 2026_0626.md"), "utf8");

// ---------- Parsing de la producción científica ----------
function section(name) {
  const re = new RegExp(`^### ${name} \\(\\d+\\)\\s*$([\\s\\S]*?)(?=^### |(?![\\s\\S]))`, "m");
  const m = PROD.match(re);
  if (!m) throw new Error(`Sección no encontrada: ${name}`);
  return m[1].split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
}

// Listas de autores truncadas en el fichero fuente (se cortan en el primer carácter acentuado).
const AUTHOR_FIX = JSON.parse(fs.readFileSync(path.join(__dirname, "authors_fix.json"), "utf8"));

const clean = (s) =>
  s.replace(/\$\\less\$\/?i\$\\greater\$/g, "").replace(/\\&amp\$\\mathsemicolon\$/g, "&").replace(/\\&/g, "&")
   .replace(/--/g, "–").replace(/\\~o/g, "ó").replace(/D\?az/g, "Díaz").replace(/\?(?=\.,)/g, "Á").replace(/-\?122/g, "-122").replace(/\\"o/g, "ö")
   .replace(/(\s)\?([^?]{10,}?)\?(\s)/g, "$1«$2»$3");

function parseRef(raw) {
  const line = clean(raw);
  const m = line.match(/^(.*?)\.\s\*\*(.+?)\*\*\.?\s*(?:\*(.+?)\*\.?)?\s*(.*)$/);
  if (!m) return { authors: "", title: line, source: "", rest: "", year: 0 };
  const [, authors, title, source = "", rest] = m;
  const y = (source.match(/\((\d{4})\)/) || rest.match(/(\d{4})/) || [])[1];
  const doi = (rest.match(/\[DOI:\s*([^\]]+)\]/) || [])[1];
  const fixed = doi && AUTHOR_FIX[doi.toLowerCase()];
  return { authors: (fixed || authors).trim(), title: title.trim(), source: source.trim(), rest: rest.trim(), year: +y || 0, doi };
}

const byYearDesc = (a, b) => b.year - a.year;
const articles = section("Articles").map(parseRef).sort(byYearDesc);
const chapters = section("Book Chapters").map(parseRef).sort(byYearDesc);
const abstracts = section("Meeting Abstracts").map(parseRef).sort(byYearDesc);
const preprints = section("Preprints").map(parseRef).sort(byYearDesc);
const patents = section("Patents").map((l) => {
  const r = parseRef(l);
  const get = (k) => (l.match(new RegExp(`${k}:\\s*([^|.]+?)(?:\\s*\\||\\.\\s|$)`)) || [])[1];
  return {
    inventors: r.authors,
    title: r.title.replace(/\s*\(Machine-Translation.*?\)/i, ""),
    applicants: r.source.replace(/^Applicants:\s*/, ""),
    regions: get("Regions"),
    granted: /\*\*Granted\*\*/.test(l),
    numbers: (l.match(/\[([A-Z]{2}[^\]]+)\]/) || [])[1],
    priority: get("Priority"),
    published: get("Published"),
    grantDate: get("Granted"),
  };
});

// ---------- Estilo ----------
const FONT = "Calibri";
const ACCENT = "0F5C5C";
const MUTED = "5A6B6B";
const LIGHT = "E6F0F0";
const W = 9638; // ancho útil A4 con márgenes de 2 cm (DXA)

const SELF = /(D\S{0,2}az[\s‐-]*Moch\S{0,3}n(?:,\s*J(?:uan)?[\s.-]*(?:J(?:os[eé])?\.?|Jos[eé])?(?:\s*J\.)?)?(?:\s+Juan(?:\s+Jos[eé]|\s+J)?)?|DIAZ-MOCHON,\s*JJ?|DIAZ,\s*JJ|Diaz,\s*Juan J\.)/gi;

function authorRuns(text, size = 20) {
  const runs = [];
  let last = 0;
  for (const m of text.matchAll(SELF)) {
    if (m.index > last) runs.push(new TextRun({ text: text.slice(last, m.index), size }));
    runs.push(new TextRun({ text: m[0], bold: true, size }));
    last = m.index + m[0].length;
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last), size }));
  return runs;
}

const p = (text, opts = {}) =>
  new Paragraph({ spacing: { after: 80 }, ...opts, children: [new TextRun({ text, ...(opts.run || {}) })] });

const runsP = (children, opts = {}) => new Paragraph({ spacing: { after: 80 }, ...opts, children });

const kv = (k, v) =>
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: `${k}: `, bold: true }), new TextRun(v)],
  });

const bullet = (children) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: typeof children === "string" ? [new TextRun(children)] : children,
  });

const h1 = (num, text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: `${num}. ${text}` })],
  });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
const na = () => p("No aplicable (plaza no vinculada a institución sanitaria).", { run: { italics: true, color: MUTED } });

function numbered(ref, children) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 90 },
    children,
  });
}

function refRuns(r, { withDoi = true } = {}) {
  const out = [...authorRuns(`${r.authors}. `), new TextRun({ text: `${r.title}. `, bold: true, size: 20 })];
  if (r.source) out.push(new TextRun({ text: r.source, italics: true, size: 20 }));
  if (withDoi && r.doi) {
    out.push(new TextRun({ text: " DOI: ", size: 20 }));
    out.push(
      new ExternalHyperlink({
        link: `https://doi.org/${r.doi}`,
        children: [new TextRun({ text: r.doi, style: "Hyperlink", size: 20 })],
      })
    );
  }
  return out;
}

const border = { style: BorderStyle.SINGLE, size: 4, color: "B7CCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function table(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const cell = (text, w, head = false) =>
    new TableCell({
      width: { size: w, type: WidthType.DXA },
      borders,
      margins: { top: 50, bottom: 50, left: 80, right: 80 },
      shading: head ? { fill: ACCENT, type: ShadingType.CLEAR, color: "auto" } : undefined,
      children: [
        new Paragraph({
          children: [new TextRun({ text: String(text ?? ""), size: 17, bold: head, color: head ? "FFFFFF" : undefined })],
        }),
      ],
    });
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, widths[i], true)) }),
      ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, widths[i])) })),
    ],
  });
}

const eur = (n) => n.toLocaleString("es-ES", { maximumFractionDigits: 0, useGrouping: "always" }) + " €";
const spacer = () => new Paragraph({ spacing: { after: 120 }, children: [] });

// ---------- Datos derivados ----------
const projects = D.projects;
const publicProjects = projects.filter((x) => x.category !== "transferencia");
const contracts = projects.filter((x) => x.category === "transferencia");
const sum = (arr) => arr.reduce((a, x) => a + (x.amount_val || 0), 0);
const ipProjects = projects.filter((x) => x.is_ip);
const grantedPatents = patents.filter((x) => x.granted);
const catOrder = { internacional: 0, nacional: 1, regional: 2 };
publicProjects.sort((a, b) => catOrder[a.category] - catOrder[b.category] || (b.is_ip - a.is_ip) || (b.amount_val - a.amount_val));
const q1 = D.kpis.porcentaje_q1;

// ---------- Contenido ----------
const body = [];

// Portada
const photo = path.join(ROOT, "assets/foto_mochon.jpg");
if (fs.existsSync(photo)) {
  body.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 200 },
      children: [new ImageRun({ type: "jpg", data: fs.readFileSync(photo), transformation: { width: 130, height: 160 } })],
    })
  );
}
body.push(
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "CURRICULUM VITAE", size: 44, bold: true, color: ACCENT })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: "Prof. Dr. Juan José Díaz-Mochón", size: 34, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "Concurso de acceso al Cuerpo de Catedráticos de Universidad", size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: `Plaza ${D.concurso.codigo} · Área de ${D.concurso.area}`, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: `${D.concurso.departamento} · ${D.concurso.universidad}`, size: 22, color: MUTED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: `${D.concurso.boe_id} · Estructura del Anexo IV (base 5.2)`, size: 22, color: MUTED })] }),
);

// Indicadores
body.push(
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "Indicadores principales", bold: true, size: 24, color: ACCENT })] }),
  table(
    ["Indicador", "Valor"],
    [
      ["Artículos en revistas indexadas (JCR/Scopus)", `${articles.length} (${q1} en Q1)`],
      ["Índice h · citas", `${D.kpis.h_index} · >${D.kpis.citas.toLocaleString("es-ES")}`],
      ["Familias de patentes", `${patents.length} (${grantedPatents.length} con concesión en Espacenet)`],
      ["Tesis doctorales dirigidas", `${D.theses.length}`],
      ["Proyectos y contratos de I+D+i", `${projects.length} (${ipProjects.length} como IP)`],
      ["Financiación total captada · como IP", `${eur(sum(projects))} · ${eur(sum(ipProjects))}`],
      ["Sexenios de investigación · transferencia", `${D.kpis.sexenios_investigacion} · ${D.kpis.sexenios_transferencia}`],
      ["Quinquenios docentes · DOCENTIA", `${D.kpis.quinquenios_docentes} · ${D.kpis.docentia_score}`],
    ],
    [6200, 3438]
  ),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Índice")] }),
  new TableOfContents("Índice", { hyperlink: true, headingStyleRange: "1-1" }),
  new Paragraph({ children: [new PageBreak()] })
);

// 1. Datos personales
body.push(
  h1(1, "Datos personales"),
  kv("Apellidos y nombre", "Díaz-Mochón, Juan José"),
  kv("Categoría actual", "Profesor Titular de Universidad (desde 2019), dedicación a tiempo completo"),
  kv("Organismo", "Universidad de Granada"),
  kv("Departamento", D.concurso.departamento),
  kv("Área de conocimiento", "Química Orgánica"),
  kv("Centro", D.concurso.facultad),
  kv("Centro de investigación", "GENYO. Centro Pfizer – Universidad de Granada – Junta de Andalucía de Genómica e Investigación Oncológica. Avda. de la Ilustración 114, PTS, 18016 Granada"),
  kv("Grupo de investigación", "NanoChemBio (co-director)"),
  kv("Correo electrónico", "juandiaz@ugr.es · juanjose.diaz@genyo.es"),
  kv("Acreditación", "Catedrático de Universidad, rama de Ciencias (ANECA, resolución de 22/10/2024)")
);

// 2. Títulos
body.push(
  h1(2, "Títulos académicos"),
  bullet([new TextRun({ text: "Licenciado en Farmacia. ", bold: true }), new TextRun("Facultad de Farmacia, Universidad de Granada, 1996. Nota media: Sobresaliente (3,3 sobre 4).")]),
  bullet([new TextRun({ text: "Doctor en Farmacia (Química Médica). ", bold: true }), new TextRun("Universidad de Granada, 2001. Sobresaliente cum laude por unanimidad.")])
);

// 3. Puestos docentes
body.push(
  h1(3, "Puestos docentes desempeñados"),
  table(
    ["Periodo", "Categoría", "Institución", "Régimen"],
    [
      ["2019 – actualidad", "Profesor Titular de Universidad", "Universidad de Granada", "Tiempo completo"],
      ["2017 – 2019", "Profesor Contratado Doctor", "Universidad de Granada", "Tiempo completo"],
      ["2011 – 2017", "Investigador Ramón y Cajal (RYC-2010-06637)", "Universidad de Granada", "Tiempo completo"],
      ["2008 – 2010", "Research Fellow", "The University of Edinburgh (Reino Unido)", "Tiempo completo"],
      ["2005 – 2008", "Postdoctoral Research Assistant", "The University of Edinburgh (Reino Unido)", "Tiempo completo"],
      ["2003 – 2005", "Postdoctoral Research Assistant", "University of Southampton (Reino Unido)", "Tiempo completo"],
    ],
    [1700, 3300, 3238, 1400]
  )
);

// 4. Becas y premios
body.push(
  h1(4, "Becas, ayudas y premios recibidos"),
  bullet("Contrato Ramón y Cajal, convocatoria 2010 (RYC-2010-06637), Ministerio de Ciencia e Innovación. Incorporación en 2011."),
  bullet("Marie Curie Career Integration Grant (FP7-PEOPLE-2012-CIG, ref. 322276), Comisión Europea, 2012–2016."),
  bullet("Beca postdoctoral en el extranjero: University of Southampton y University of Edinburgh (2003–2008)."),
  bullet("Sello de Excelencia EIC Accelerator (Comisión Europea), financiado vía CDTI, 2025, como CEO de DESTINA Genomics.")
);

// 5
body.push(h1(5, "Puestos asistenciales desempeñados"), na());

// 6. Actividad docente
body.push(
  h1(6, "Actividad docente desempeñada"),
  h2("Enseñanzas regladas (Universidad de Granada)"),
  table(
    ["Titulación", "Asignaturas"],
    [
      ["Grado en Farmacia", "Química Orgánica I · Química Orgánica II · Química Farmacéutica I · Química Farmacéutica II"],
      ["Grado en Ciencia y Tecnología de los Alimentos", "Química Orgánica · Química de los Fármacos y Marcadores Orgánicos de los Alimentos. Trazabilidad"],
      ["Grado en Nutrición Humana y Dietética", "Química General"],
      ["Máster Universitario en Medicina Traslacional (TRANSMED)", "Diagnóstico molecular y teranóstica"],
    ],
    [3600, 6038]
  ),
  spacer(),
  h2("Evaluación de la actividad docente"),
  bullet(`${D.kpis.quinquenios_docentes} quinquenios docentes reconocidos por la Universidad de Granada.`),
  bullet(`Calificación media en las encuestas del Programa DOCENTIA (UGR): ${D.kpis.docentia_score.replace(".", ",")}.`),
  h2("Enseñanzas no regladas"),
  bullet("Cursos de especialización en química de ácidos nucleicos, microarrays poliméricos y biopsia líquida.")
);

// 7. Contribuciones docentes
const inted = abstracts.find((a) => /LABSKILLS/i.test(a.title));
body.push(
  h1(7, "Contribuciones de carácter docente"),
  bullet("Proyectos de Innovación Docente en la Facultad de Farmacia (UGR): herramientas digitales y evaluación continua formativa."),
  bullet("Plataformas web interactivas para Química Farmacéutica I y II (ecosistema Genyo Fusion): hubs de evaluación continua, bancos de casos y modelos moleculares 3D."),
  bullet("Guiones de prácticas de química orgánica y farmacéutica a microescala."),
  bullet("Modelo pedagógico «La Química como Software Molecular»: reconocimiento molecular, síntesis orgánica y modelización computacional integrados en el aula.")
);
if (inted) body.push(bullet([new TextRun("Comunicación docente: "), ...refRuns(inted)]));

// 8
body.push(h1(8, "Actividad asistencial desempeñada"), na());

// 9. Actividad investigadora
body.push(
  h1(9, "Actividad investigadora desempeñada"),
  p("Co-director del grupo NanoChemBio (GENYO). Perfil de la plaza: «" + D.concurso.perfil_investigador.replace(/^["«]|["»]$/g, "") + "»."),
  h2("Líneas de investigación"),
  bullet("Química dinámica covalente y marcaje químico dinámico (Dynamic Chemical Labeling, DCL) para la detección directa de ácidos nucleicos sin PCR, con sondas PNA abásicas (SMART)."),
  bullet("Biopsia líquida y biomarcadores circulantes: miR-122 en hepatotoxicidad inducida por fármacos (DILI) y paracetamol, miR-21, células tumorales circulantes y exosomas."),
  bullet("Nanosistemas y química click bioortogonal para diagnóstico, teranóstica y dispositivos point-of-care; integración en plataformas Luminex xMAP, Simoa, citometría y biosensores."),
  bullet("Química médica: síntesis de purinas y pirimidinas polisustituidas como inhibidores de quinasas y ligandos del receptor A1 de adenosina; química de PNAs y quimiotecas codificadas."),
  bullet("CRISPR–Cas13 con guías duales (CRISPNA) para la detección de variantes de un solo nucleótido.")
);

// 10. Proyectos
const catLabel = { internacional: "Internacionales", nacional: "Nacionales", regional: "Autonómicos y locales" };
body.push(h1(10, "Proyectos de investigación subvencionados en convocatorias públicas"));
body.push(p(`${publicProjects.length} proyectos, ${publicProjects.filter((x) => x.is_ip).length} como Investigador Principal. Financiación total: ${eur(sum(publicProjects))}; como IP: ${eur(sum(publicProjects.filter((x) => x.is_ip)))}.`));
for (const cat of ["internacional", "nacional", "regional"]) {
  const list = publicProjects.filter((x) => x.category === cat);
  if (!list.length) continue;
  body.push(h2(`Proyectos ${catLabel[cat].toLowerCase()}`));
  body.push(
    table(
      ["Referencia", "Título / Convocatoria / Entidad", "Periodo", "Papel", "Importe"],
      list.map((x) => [x.code, `${x.title}. ${x.call}. ${x.agency}`, x.dates.replace(" - ", " – "), x.is_ip ? "IP" : "Equipo", x.amount]),
      [1500, 4838, 1300, 800, 1200]
    ),
    spacer()
  );
}

// 11. Contratos
body.push(
  h1(11, "Otros proyectos y contratos de investigación (art. 83 LOU / 60 LOSU)"),
  p(`${contracts.length} contratos con empresas como Investigador Principal. Importe total: ${eur(sum(contracts))}.`),
  table(
    ["Referencia", "Objeto / Empresa", "Periodo", "Importe"],
    contracts.map((x) => [x.code, `${x.title}. ${x.agency}`, x.dates.replace(" - ", " – "), x.amount]),
    [2200, 4838, 1400, 1200]
  )
);

// 12. Tesis
body.push(
  h1(12, "Trabajos de investigación dirigidos"),
  h2(`Tesis doctorales (${D.theses.length})`),
  table(
    ["Año", "Doctorando/a · Título", "Universidad", "Dirección", "Calificación / mención"],
    D.theses.map((t) => [t.year, `${t.student}. «${t.title}»`, t.university, t.directors, t.mention]),
    [650, 3300, 2000, 2200, 1488]
  ),
  spacer(),
  h2("Trabajos Fin de Grado y Fin de Máster"),
  bullet("Dirección de más de 30 TFG y TFM en Farmacia, Biotecnología y Medicina Traslacional.")
);

// 13. Artículos
body.push(
  h1(13, "Publicaciones: artículos en revistas"),
  p(`${articles.length} artículos. Índice h = ${D.kpis.h_index}; más de ${D.kpis.citas.toLocaleString("es-ES")} citas; ${q1} en el primer cuartil. Orden cronológico inverso; el nombre del candidato aparece en negrita.`, { run: { color: MUTED } })
);
let lastYear = null;
for (const a of articles) {
  if (a.year !== lastYear) {
    body.push(new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: String(a.year || "s. f."), bold: true, color: ACCENT, size: 22 })] }));
    lastYear = a.year;
  }
  body.push(numbered("articles", refRuns(a)));
}

// 14. Capítulos
body.push(h1(14, "Publicaciones: libros y capítulos de libro"));
chapters.forEach((c) => body.push(numbered("chapters", refRuns(c))));

// 15. Congresos
const congress = abstracts.filter((a) => a !== inted);
body.push(
  h1(15, "Comunicaciones y ponencias en congresos"),
  p(`Relación de ${congress.length} comunicaciones publicadas como resumen en revistas indexadas. La comunicación docente de INTED 2015 figura en el apartado 7.`, { run: { color: MUTED } })
);
congress.forEach((c) => body.push(numbered("congress", refRuns(c))));

// 16. Otras publicaciones
body.push(h1(16, "Otras publicaciones"), h2(`Preprints (${preprints.length})`));
preprints.forEach((c) => body.push(numbered("preprints", refRuns({ ...c, source: c.source.replace("Unknown Journal/Book, ", "ChemRxiv, ") }))));
body.push(bullet("Documentos de consenso y perspectivas como co-fundador de la International Society of Liquid Biopsy (ISLB)."));

// 17. Otros trabajos
body.push(
  h1(17, "Otros trabajos de investigación"),
  bullet("Software y algoritmos para el análisis espectroscópico de micropartículas y el multiplexado fluorimétrico con resolución temporal."),
  bullet("Plataformas diagnósticas desarrolladas en colaboración industrial: Spin-Tube (tuberculosis), CoVradar (SARS-CoV-2) y ensayos DCL de miR-122 sobre Luminex y Simoa.")
);

// 18. Patentes
body.push(
  h1(18, "Patentes y modelos de utilidad"),
  p(`${patents.length} familias de patentes (fuente: Espacenet). ${grantedPatents.length} constan como concedidas: ${grantedPatents.map((x) => x.numbers.split(",").find((n) => /B\d?$/.test(n.trim())).trim()).join(", ")}.`, { run: { color: MUTED } }),
  table(
    ["Prioridad", "Título · Inventores", "Titular", "Publicación", "Estado"],
    patents.map((x) => [x.priority, `${x.title}. ${x.inventors}`, x.applicants, `${x.numbers} (${x.regions})`, x.granted ? `Concedida ${x.grantDate}` : "Solicitud publicada"]),
    [1100, 4138, 1700, 1600, 1100]
  )
);

// 19. Estancias
body.push(
  h1(19, "Estancias en centros de investigación"),
  table(
    ["Periodo", "Centro", "Duración"],
    [
      ["2005 – 2010", "School of Chemistry, The University of Edinburgh (Reino Unido). Grupo del Prof. Mark Bradley", "5 años"],
      ["2003 – 2005", "University of Southampton (Reino Unido)", "2 años"],
      ["Predoctoral", "Università degli Studi di Ferrara (Italia)", "—"],
      ["Predoctoral", "Università degli Studi di Perugia (Italia)", "—"],
    ],
    [1600, 6438, 1600]
  )
);

// 20. Gestión
body.push(
  h1(20, "Puestos de gestión y servicios prestados"),
  bullet("Co-director del grupo de investigación NanoChemBio, Centro GENYO."),
  bullet("Co-fundador y Tesorero de la International Society of Liquid Biopsy (ISLB), 2017–2021."),
  bullet("Miembro de comisiones académicas de la Facultad de Farmacia (UGR)."),
  bullet("Evaluador de agencias nacionales e internacionales: AEI, ANEP y Horizon Europe.")
);

// 21. Cursos
body.push(
  h1(21, "Cursos y seminarios recibidos"),
  bullet("Formación continuada en gestión de la propiedad industrial y transferencia de tecnología biotecnológica."),
  bullet("Formación en bioética y en metodologías docentes universitarias.")
);

// 22. Empresas
body.push(
  h1(22, "Actividad en empresas y profesión libre"),
  table(
    ["Periodo", "Empresa", "Cargo"],
    [
      ["2010 – 2020", "DESTINA Genomics Ltd. (Edimburgo, Reino Unido)", "Co-fundador y Director Científico (CSO)"],
      ["2020 – 2025", "DESTINA Genomics Ltd.", "Consejero Delegado (CEO)"],
      ["2025 – actualidad", "DESTINA Genomics Ltd.", "Asesor científico estratégico"],
      ["2013 – ", "Destina Genómica S.L. (Granada)", "Co-fundador"],
      ["—", "CRISPNA S.L.", "Co-fundador"],
      ["—", "NanoGetic S.L.", "Co-fundador"],
    ],
    [1800, 4238, 3600]
  ),
  spacer(),
  p("Acuerdos de licencia y desarrollo con MilliporeSigma, Quanterix, Luminex, Optoi Microelectronics, Mecwins y Vitro S.A.")
);

// 23. Periodos reconocidos
body.push(
  h1(23, "Periodos reconocidos de actividad investigadora y docente"),
  table(
    ["Tipo", "Número", "Organismo"],
    [
      ["Sexenios de investigación", String(D.kpis.sexenios_investigacion), "CNEAI / ANECA"],
      ["Sexenio de transferencia", String(D.kpis.sexenios_transferencia), "CNEAI / ANECA"],
      ["Quinquenios docentes", String(D.kpis.quinquenios_docentes), "Universidad de Granada"],
    ],
    [4638, 1500, 3500]
  )
);

// 24–25
body.push(
  h1(24, "Otros méritos docentes o de investigación"),
  bullet(`Calificación media DOCENTIA de ${D.kpis.docentia_score.replace(".", ",")}.`),
  bullet("Revisor de más de 20 revistas: Nature Communications, JACS, Angewandte Chemie, Biosensors and Bioelectronics, Analytical Chemistry, entre otras."),
  h1(25, "Otros méritos"),
  bullet("Divulgación científica y fomento de vocaciones en química y biomedicina en Andalucía y en el ámbito internacional."),
  spacer(),
  p("El candidato declara que los datos de este currículum son ciertos y se compromete a acreditarlos documentalmente cuando así se le requiera.", { run: { italics: true } }),
  p("Granada, a ____ de ______________ de 2026.", { spacing: { before: 240 } }),
  p("Fdo.: Juan José Díaz-Mochón", { spacing: { before: 720 } })
);

// ---------- Documento ----------
const numRef = (reference, fmt = LevelFormat.DECIMAL, text = "%1.") => ({
  reference,
  levels: [{ level: 0, format: fmt, text, alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 500, hanging: 500 } } } }],
});

const doc = new Document({
  creator: "Juan José Díaz-Mochón",
  title: "Curriculum Vitae · Juan José Díaz-Mochón · Concurso 31/7/2026",
  styles: {
    default: { document: { run: { font: FONT, size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: ACCENT, font: FONT },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, color: "222222", font: FONT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
      numRef("articles"), numRef("chapters"), numRef("congress"), numRef("preprints"),
    ],
  },
  features: { updateFields: true },
  sections: [
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `CV · J. J. Díaz-Mochón · Concurso ${D.concurso.codigo} · UGR`, size: 16, color: MUTED })] })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT, " / ", PageNumber.TOTAL_PAGES], size: 16, color: MUTED })] })] }),
      },
      children: body,
    },
  ],
});

const out = path.join(__dirname, "CV_Diaz-Mochon_Anexo_IV.docx");
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log(`OK ${path.relative(ROOT, out)} · ${articles.length} artículos · ${chapters.length} capítulos · ${congress.length} congresos · ${preprints.length} preprints · ${patents.length} patentes · ${D.theses.length} tesis · ${projects.length} proyectos`);
});
