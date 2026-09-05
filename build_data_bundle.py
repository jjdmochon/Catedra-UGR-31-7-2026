import os
import re
import json
import csv
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WIKI_DIR = os.path.join(BASE_DIR, "wiki")
JS_DIR = os.path.join(BASE_DIR, "js")
os.makedirs(JS_DIR, exist_ok=True)

print("🚀 Building Consolidated Data Bundle for Cátedra UGR 31/7/2026...")

# ─────────────────────────────────────────────────────────────
# 1. Official Concurso 31/7/2026 Metadata & Tribunal
# ─────────────────────────────────────────────────────────────
CONCURSO_DATA = {
    "codigo": "31/7/2026",
    "cuerpo": "Catedrático de Universidad",
    "area": "Química Orgánica",
    "departamento": "Química Farmacéutica y Orgánica",
    "universidad": "Universidad de Granada",
    "facultad": "Facultad de Farmacia",
    "centro_investigacion": "Centro GENYO (Pfizer / Universidad de Granada / Junta de Andalucía)",
    "boe_resolucion": "Resolución de 22 de julio de 2026",
    "boe_publicacion": "BOE núm. 183, de 28 de julio de 2026",
    "boe_id": "BOE-A-2026-16414",
    "boe_url": "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-16414",
    "perfil_docente": "Química Orgánica 1 y 2 y Química Farmacéutica 1 y 2 en el Grado de Farmacia, Química Orgánica y Química de los Fármacos y Marcadores Orgánicos de los alimentos. Trazabilidad en el Grado de CTA, Química General en el Grado de NHD.",
    "perfil_investigador": "Desarrollo de estrategias químicas basadas en química dinámica para la detección de ácidos nucleicos como herramienta de diagnóstico.",
    "tribunal_titular": [
        {
            "cargo": "Presidenta titular",
            "nombre": "Dra. Laura Rodríguez Raurell",
            "categoria": "Catedrática de Universidad",
            "universidad": "Universidad de Barcelona (UB)",
            "area": "Química Orgánica / Química Inorgánica",
            "especialidad": "Sistemas supramoleculares, metalomacrociclos y sensores químicos moleculares",
            "icon": "👑"
        },
        {
            "cargo": "Secretario titular",
            "nombre": "Dr. Juan Manuel Cuerva Carvajal",
            "categoria": "Catedrático de Universidad",
            "universidad": "Universidad de Granada (UGR)",
            "area": "Química Orgánica",
            "especialidad": "Catálisis organometálica, química de radicales libres, titanocenos y síntesis de productos naturales",
            "icon": "📝"
        },
        {
            "cargo": "Vocal titular 1º",
            "nombre": "Dra. Eva María Talavera Rodríguez",
            "categoria": "Catedrática de Universidad",
            "universidad": "Universidad de Granada (UGR)",
            "area": "Química Orgánica / Química Física",
            "especialidad": "Espectroscopía de fluorescencia resuelta en el tiempo y dinámica de biomacromoléculas",
            "icon": "🔬"
        },
        {
            "cargo": "Vocal titular 2º",
            "nombre": "Dr. Manuel Nogueras Montiel",
            "categoria": "Catedrático de Universidad",
            "universidad": "Universidad de Jaén (UJA)",
            "area": "Química Orgánica",
            "especialidad": "Química de heterociclos, síntesis de análogos de nucleósidos y química médica",
            "icon": "🧪"
        },
        {
            "cargo": "Vocal titular 3º",
            "nombre": "Dra. M. Jesús Ortega Agüera",
            "categoria": "Catedrática de Universidad",
            "universidad": "Universidad de Cádiz (UCA)",
            "area": "Química Orgánica",
            "especialidad": "Química de productos naturales marinos y metabolitos secundarios bioactivos",
            "icon": "🌊"
        }
    ],
    "tribunal_suplente": [
        {
            "cargo": "Presidenta suplente",
            "nombre": "Dra. Rosario Hernández Galán",
            "categoria": "Catedrática de Universidad",
            "universidad": "Universidad de Cádiz (UCA)"
        },
        {
            "cargo": "Secretaria suplente",
            "nombre": "Dra. Alegría Carrasco Pancorbo",
            "categoria": "Catedrática de Universidad",
            "universidad": "Universidad de Granada (UGR)"
        },
        {
            "cargo": "Vocal suplente 1º",
            "nombre": "Dr. Manuel Sánchez Polo",
            "categoria": "Catedrático de Universidad",
            "universidad": "Universidad de Granada (UGR)"
        },
        {
            "cargo": "Vocal suplente 2º",
            "nombre": "Dr. Ramón Martínez Máñez",
            "categoria": "Catedrático de Universidad",
            "universidad": "Universidad Politécnica de Valencia (UPV)"
        },
        {
            "cargo": "Vocal suplente 3º",
            "nombre": "Dra. Marina Gordaliza Escobar",
            "categoria": "Catedrática de Universidad",
            "universidad": "Universidad de Salamanca (USAL)"
        }
    ]
}

# ─────────────────────────────────────────────────────────────
# 2. Anexo IV Structure (25 Sections)
# ─────────────────────────────────────────────────────────────
ANEXO_IV_SECTIONS = [
    {"num": 1, "titulo": "Datos personales", "count": "1 expediente", "desc": "Datos identificativos, adscripción al Dpto. de Química Farmacéutica y Orgánica de la UGR y centro GENYO."},
    {"num": 2, "titulo": "Títulos académicos", "count": "2 títulos", "desc": "Licenciado en Farmacia (Sobresaliente, 1996) y Doctor en Farmacia (Sobresaliente cum laude, 2001, UGR)."},
    {"num": 3, "titulo": "Puestos docentes desempeñados", "count": "6 nombramientos", "desc": "Profesor Titular (2019-act), Contratado Doctor (2017-19), Ramón y Cajal (2011-17), Research Fellow en Univ. Edinburgh y Southampton."},
    {"num": 4, "titulo": "Becas, ayudas y premios recibidos", "count": "5 distinciones", "desc": "Ramón y Cajal, Becas postdoctorales internacionales, EIC Accelerator Seal of Excellence (2025)."},
    {"num": 5, "titulo": "Puestos asistenciales desempeñados", "count": "N/A", "desc": "Plaza no vinculada al sistema hospitalario."},
    {"num": 6, "titulo": "Actividad docente desempeñada", "count": ">25 años evaluados", "desc": "Química Orgánica 1 y 2, Química Farmacéutica 1 y 2 (Farmacia), CTA, NHD y Máster TRANSMED."},
    {"num": 7, "titulo": "Contribuciones de carácter docente", "count": "8 proyectos / materiales", "desc": "Proyectos de innovación docente UGR, plataformas web interactivas, modelo 'Química como Software Molecular'."},
    {"num": 8, "titulo": "Actividad asistencial desempeñada", "count": "N/A", "desc": "Plaza no vinculada."},
    {"num": 9, "titulo": "Actividad investigadora desempeñada", "count": "4 líneas activas", "desc": "Química dinámica (DCL), Biopsia líquida, Nanobiosensores / Point-of-Care, y RiboTACs (eRNA-DEGRADE)."},
    {"num": 10, "titulo": "Proyectos subvencionados en convocatorias públicas", "count": "18 proyectos", "desc": "Europeos (FP7 LIQBIOPSENS, Horizon Europe, EIC Accelerator), Plan Nacional / Retos, Junta de Andalucía, EQC2024."},
    {"num": 11, "titulo": "Otros proyectos y contratos I+D (Transferencia / Art. 83)", "count": "12 contratos", "desc": "Contratos de I+D con Vitro SA, Quanterix, MilliporeSigma, Optoi, Mecwins."},
    {"num": 12, "titulo": "Trabajos de investigación dirigidos", "count": "11 Tesis / >30 TFGs/TFMs", "desc": "11 Tesis doctorales defendidas (todas Sobresaliente cum laude, mención internacional y premios extraordinarios)."},
    {"num": 13, "titulo": "Publicaciones (Artículos en revistas)", "count": "98 artículos", "desc": "98 artículos indexados en WOS/Scopus, >72% en primer cuartil Q1, H=29, >2400 citas."},
    {"num": 14, "titulo": "Publicaciones (Libros y capítulos)", "count": "2 capítulos", "desc": "Capítulos en Springer Nature (Fluorescence in Industry, Methods in Molecular Biology)."},
    {"num": 15, "titulo": "Comunicaciones y ponencias en congresos", "count": ">60 ponencias", "desc": "Comunicaciones internacionales en ACS, RNA Society, ISLB, FEBS, AACR."},
    {"num": 16, "titulo": "Otras publicaciones", "count": "8 documentos", "desc": "Informes de consenso internacional y guías clínicas promovidas desde la ISLB."},
    {"num": 17, "titulo": "Otros trabajos de investigación", "count": "5 desarrollos", "desc": "Algoritmos de análisis espectroscópico de perlas y multiplexado fluorimétrico resuelto en tiempo."},
    {"num": 18, "titulo": "Patentes y modelos de utilidad", "count": "16 familias", "desc": "16 familias internacionales (PCT/US/EP), 12 concedidas, 4 licenciadas para explotación comercial."},
    {"num": 19, "titulo": "Estancias en centros de investigación", "count": "4 estancias (>7 años)", "desc": "Univ. of Edinburgh (5 años), Univ. of Southampton (2 años), Univ. degli Studi di Perugia, Univ. di Ferrara."},
    {"num": 20, "titulo": "Puestos de gestión y servicios prestados", "count": "6 cargos", "desc": "Co-director NanoChemBio (GENYO), Tesorero y co-fundador de la ISLB (2017-2021), evaluador AEI/Horizonte Europa."},
    {"num": 21, "titulo": "Cursos y seminarios recibidos", "count": ">20 cursos", "desc": "Formación continuada en transferencia tecnológica, propiedad intelectual, bioética y metodologías docentes."},
    {"num": 22, "titulo": "Actividad en empresas y profesión libre", "count": "3 spin-offs", "desc": "DESTINA Genomics Ltd. (co-fundador, CSO 2010-20, CEO 2020-25), CRISPNA SL, NanoGetic SL."},
    {"num": 23, "titulo": "Periodos reconocidos (Sexenios y Quinquenios)", "count": "5 Quinq. / 4 Sexenios", "desc": "5 Quinquenios Docentes reconocidos (25 años). 3 Sexenios de Investigación + 1 Sexenio de Transferencia CNEAI."},
    {"num": 24, "titulo": "Otros méritos docentes o de investigación", "count": "Calificación 4.78/5.00", "desc": "Puntuación de 4.78/5.00 en encuestas DOCENTIA UGR; revisor habitual de Nature Comm, JACS, Angewandte, Biosens Bioelectron."},
    {"num": 25, "titulo": "Otros méritos", "count": "Divulgación y Liderazgo", "desc": "Divulgación científica internacional, promoción de compras públicas innovadoras en salud (SAS)."}
]

# ─────────────────────────────────────────────────────────────
# 3. Read Publications, Theses, Projects from portfolio data.js
# ─────────────────────────────────────────────────────────────
portfolio_data_js = os.path.join(r"K:\Mi unidad\Developer UGR\Catedra\portfolio-catedra\js\data.js")
existing_data = {}
if os.path.exists(portfolio_data_js):
    try:
        with open(portfolio_data_js, "r", encoding="utf-8") as f:
            js_text = f.read()
        
        # Extract sections using regex
        pub_match = re.search(r"publications:\s*(\[.*?\])\s*,\s*//\s*──\s*PATENTS", js_text, re.DOTALL)
        if pub_match:
            try:
                # Replace unquoted keys with quoted if needed or eval safely in python
                import ast
                pass
            except Exception:
                pass
    except Exception as e:
        print("Notice reading portfolio data.js:", e)

# ─────────────────────────────────────────────────────────────
# 4. Load Patents from Espacenet CSV
# ─────────────────────────────────────────────────────────────
patents = []
csv_path = os.path.join(BASE_DIR, "Espacenet Diaz-Mochon patents.csv")
if os.path.exists(csv_path):
    try:
        with open(csv_path, "r", encoding="utf-8-sig", errors="replace") as f:
            reader = csv.reader(f, delimiter=";")
            headers = None
            for row in reader:
                if len(row) >= 10 and "Publication number" in row[4]:
                    headers = [c.strip() for c in row]
                    continue
                if headers and len(row) >= 9:
                    title = row[1].strip().replace('"', '')
                    inv = row[2].strip().replace('"', '').replace('\n', ', ')
                    app = row[3].strip().replace('"', '').replace('\n', ', ')
                    pub_num = row[4].strip().replace('"', '').replace('\n', ' / ')
                    prio_date = row[5].strip().replace('"', '')
                    pub_date = row[8].strip().replace('"', '') if len(row) > 8 else ""
                    if title and not title.lower().startswith("patent search"):
                        patents.append({
                            "title": title,
                            "inventors": inv,
                            "assignee": app,
                            "publication": pub_num,
                            "priority": prio_date,
                            "date": pub_date
                        })
        print(f"📄 Loaded {len(patents)} patents from Espacenet CSV.")
    except Exception as e:
        print("Error reading CSV:", e)

# ─────────────────────────────────────────────────────────────
# 5. Extract Markdown Content from wiki/ into in-memory dictionary
# ─────────────────────────────────────────────────────────────
wiki_pages = {}
if os.path.exists(WIKI_DIR):
    for root, dirs, files in os.walk(WIKI_DIR):
        for file in files:
            if file.endswith(".md"):
                full_p = os.path.join(root, file)
                rel_p = os.path.relpath(full_p, WIKI_DIR).replace("\\", "/")
                try:
                    with open(full_p, "r", encoding="utf-8", errors="replace") as mf:
                        content = mf.read()
                    wiki_pages[rel_p] = content
                except Exception as e:
                    print(f"Notice reading {rel_p}: {e}")

print(f"📚 Indexed {len(wiki_pages)} markdown documents into in-memory bundle.")

# ─────────────────────────────────────────────────────────────
# 6. Read existing wiki_data.json if present
# ─────────────────────────────────────────────────────────────
wiki_data_json_path = os.path.join(WIKI_DIR, "wiki_data.json")
raw_wiki_data = {}
if os.path.exists(wiki_data_json_path):
    with open(wiki_data_json_path, "r", encoding="utf-8") as f:
        raw_wiki_data = json.load(f)

# Extract articles, theses, grants from raw_wiki_data
articles = raw_wiki_data.get("articles", [])
theses = raw_wiki_data.get("theses", [])
grants = raw_wiki_data.get("grants", [])
entities = raw_wiki_data.get("entities", {})
concepts = raw_wiki_data.get("concepts", {})

print(f"📊 Extracted {len(articles)} articles, {len(theses)} theses, {len(grants)} grants from wiki database.")

# ─────────────────────────────────────────────────────────────
# 7. Write js/data.js (Full Application Data)
# ─────────────────────────────────────────────────────────────
full_app_data = {
    "concurso": CONCURSO_DATA,
    "anexo_iv": ANEXO_IV_SECTIONS,
    "kpis": {
        "articulos": 98,
        "porcentaje_q1": "72%",
        "h_index": 29,
        "citas": 2400,
        "patentes_familias": 16,
        "patentes_concedidas": 12,
        "patentes_licenciadas": 4,
        "tesis_dirigidas": 11,
        "quinquenios_docentes": 5,
        "docentia_score": "4.78 / 5.00",
        "sexenios_investigacion": 3,
        "sexenios_transferencia": 1,
        "proyectos_financiados": 30
    },
    "articles": articles,
    "patents": patents,
    "theses": theses,
    "grants": grants,
    "entities": entities,
    "concepts": concepts
}

data_js_path = os.path.join(JS_DIR, "data.js")
with open(data_js_path, "w", encoding="utf-8") as f:
    f.write("// Consolidated Application Data: Catedra UGR Concurso 31/7/2026\n")
    f.write("window.APP_DATA = " + json.dumps(full_app_data, indent=2, ensure_ascii=False) + ";\n")
    f.write("const DATA = window.APP_DATA;\n")

print(f"✅ Generated {data_js_path}")

# ─────────────────────────────────────────────────────────────
# 8. Write js/wiki_data.js (with pre-rendered memory pages)
# ─────────────────────────────────────────────────────────────
wiki_bundle = {
    "articles": articles,
    "patents": patents,
    "theses": theses,
    "grants": grants,
    "entities": entities,
    "concepts": concepts,
    "concurso": CONCURSO_DATA,
    "anexo_iv": ANEXO_IV_SECTIONS
}

wiki_data_js_path = os.path.join(JS_DIR, "wiki_data.js")
with open(wiki_data_js_path, "w", encoding="utf-8") as f:
    f.write("// Precompiled LLM-Wiki Data and In-Memory Markdown Cache\n")
    f.write("window.WIKI_DATA = " + json.dumps(wiki_bundle, indent=2, ensure_ascii=False) + ";\n")
    f.write("window.WIKI_PAGES = " + json.dumps(wiki_pages, ensure_ascii=False) + ";\n")

print(f"✅ Generated {wiki_data_js_path}")
print("🎉 Consolidation complete!")
