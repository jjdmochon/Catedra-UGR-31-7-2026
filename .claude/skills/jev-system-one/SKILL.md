---
name: jev-system-one
description: Ultrarrápido motor de decisiones "System 1" no autoregresivo (TypeSafe AI Jev) para enrutamiento de subagentes (<100ms), circuit breakers, filtrado de slop de IA y triaje de tareas docentes y biotecnológicas con primitivas Choice, Noul y Score. Juzga la voz por registro (ceo, alumnos, manuscrito, diapositivas, propuesta, informe, divulgacion, recomendacion).
---

# Jev System-1 Fast Decision Engine

Motor de decisiones estructuradas de ultrabaja latencia impulsado por **Jev (TypeSafe AI)**.

## Capacidades principales

1. **Subagent & Domain Routing**
   - Clasifica cualquier instrucción hacia los dominios de Juanjo (`destina_biotech`,
     `ugr_teaching`, `biophysics_pna`, `keratin_krt10`, `compliance_iso`,
     `review_provenance`, `scientific_tools`, `general_dev`).
   - Decide de forma no autoregresiva si delegar en subagente paralelo (`requires_subagent`)
     o ejecutar directamente.

2. **Quality Gate documental (`Noul`)**
   - Decide qué etapas del pipeline de revisión necesita realmente un documento, y
     certifica el entregable antes de la firma.

3. **Primitivas disponibles**
   - `Choice`: clasificación discreta tipada. Devuelve `.choice`, `.confidence`, `.probabilities`.
   - `Noul`: decisión booleana calibrada. Devuelve `.noul` como probabilidad flotante.
   - `Score`: nivel ordinal o rúbrica. Devuelve `.score`, `.confidence`, `.probabilities`.

## Enrutamiento de tareas

```bash
# Salida estándar en texto:
python3 ".claude/skills/jev-system-one/scripts/jev_router.py" "¿Cómo diseñar sondas SMART para detectar miR-122?"

# Salida en JSON para consumo directo por otros agentes:
python3 ".claude/skills/jev-system-one/scripts/jev_router.py" "Prepara el examen de QFDOS tema 4" --json
```

## Gatekeeper del pipeline documental

Etapas 0 y 4 de la sección 3 de CLAUDE.md: triaje previo y certificación final.

```bash
# Triaje: qué etapas necesita realmente el documento
python3 ".claude/skills/jev-system-one/scripts/jev_doc_gatekeeper.py" "ruta/documento.md"

# JSON para subagentes (así lo consume document-reviewer):
python3 ".claude/skills/jev-system-one/scripts/jev_doc_gatekeeper.py" "informe.docx" --json

# Texto por stdin:
echo "texto a auditar" | python3 ".claude/skills/jev-system-one/scripts/jev_doc_gatekeeper.py" -

# Registro de voz explícito (si se omite, se detecta):
python3 ".claude/skills/jev-system-one/scripts/jev_doc_gatekeeper.py" "aviso_parcial.md" --registro alumnos
python3 ".claude/skills/jev-system-one/scripts/jev_doc_gatekeeper.py" --listar-registros

# Presentaciones: la voz no cuenta para certificar
python3 ".claude/skills/jev-system-one/scripts/jev_doc_gatekeeper.py" "Tema 3. QFDOS Completa.md" --tipo diapositivas --json
```

Acepta `.md`, `.txt`, `.docx`, `.pdf`, `.pptx` (con `python-pptx`) y `-` (stdin). Pasa **siempre la ruta del fichero**,
no el texto pegado: extrae `.docx` con python-docx y `.pdf` con PyMuPDF, y sobre
documentos largos muestrea cabeza, centro y cola para no perder slop enterrado a mitad.

`--lang es|en` fuerza el idioma; por defecto lo detecta Jev y resuelve el humanizador.

### Modo diapositivas (`--tipo diapositivas`)

El Noul de voz suspende cualquier texto de diapositivas, incluso con el registro
`diapositivas` y después del humanizador: el Tema 3 publicado de QFDOS da 0.94 y el Tema 4
revisado, 0.82-0.94. En diapositivas la voz no se juzga, así que este modo la deja fuera de
la certificación:

- **Solo se activa** con un `.pptx` o con un `.md` exportado de un `.pptx`
  (`scripts/pptx_a_markdown.py` o `export_pptx_simple.py` de QFDOS): cabeceras `## Slide N`
  o `## Diapositiva NN:` correlativas desde 1, al menos tres, separadas por `---`. Con
  cualquier otra entrada se ignora: el documento se audita en modo normal, `tipo` vale
  `documento` y `warning` lo explica. Así nadie puede saltarse la voz de un manuscrito o
  un aviso pasándole el flag.
- `3_voz` sale con `ejecutar: false` y `aplicable: false`; su probabilidad se sigue
  calculando, pero solo como dato. `quality_gate_passed` depende de marcas invisibles y
  metadatos, slop y LaTeX. `needs_humanizer_rewrite` es `false`.
- El registro es `diapositivas` (su tolerancia de slop admite viñetas y fragmentos), salvo
  `--registro` o marcador en el fichero. Un `.jev-registro` de carpeta no lo cambia.
- En un `.pptx` los metadatos **se inspeccionan de verdad** en lugar de marcarse por
  formato: se abre el zip y se buscan C2PA (chunk `caBX` en PNG, cajas JUMBF `c2pa`) y la
  etiqueta IPTC `trainedAlgorithmicMedia` en todas las partes, patrón de diapositivas
  incluido. El hallazgo nombra la imagen (`ppt/media/image3.png`). En modo normal el `.pptx`
  se sigue marcando solo por su extensión. `watermarks-remover` no abre `.pptx`: se limpian
  (o se sustituyen) las imágenes que nombra el hallazgo y se vuelven a meter en el `.pptx`;
  luego, nueva pasada sobre el `.pptx`.
- El fallo en abierto no cambia: sin Jev, `2_anti_slop` y `4_latex` quedan pendientes y no
  se certifica.

El `.md` exportado no lleva las imágenes dentro: certificarlo no limpia las marcas C2PA de
los PNG de `assets/` ni del `.pptx`, que pasan por `watermarks-remover` aparte.

### Claves de salida

| Clave | Significado |
|---|---|
| `etapas_a_ejecutar` | Lista de etapas que sí hacen falta. Ejecuta solo esas. |
| `quality_gate_passed` | Certificación. `true` únicamente con veredicto real de Jev. |
| `humanizer_skill` | `humanizer-juanjo-es` o `humanizer-juanjo`, ya resuelto por idioma. |
| `slop_probability` | Noul de slop, umbral 0.50. |
| `registro` | Registro de voz aplicado: `ceo`, `alumnos`, `apuntes`, `manuscrito`, `diapositivas`, `propuesta`, `informe`, `divulgacion`, `recomendacion`. |
| `registro_origen` | De dónde sale: `parametro`, `marcador en el documento`, `carpeta (...)`, `jev choice`, `heuristica local`. |
| `guia_registro` | Sección de `references/registros.md` que debe aplicar el humanizador. |
| `voz_por_registro` | Solo en detección automática: p de voz con cada registro, para ver si el elegido es el que mejor encaja. |
| `has_latex_violations` | Regex literal OR Noul. |
| `tipo` | Modo aplicado: `documento` o `diapositivas`. Si pediste `diapositivas` y sale `documento`, la entrada no era elegible (ver `warning`). |
| `tipo_motivo` | Solo en modo diapositivas: `entrada .pptx` o `Markdown exportado de .pptx (N diapositivas)`. |
| `engine` | `jev-native (typesafe-ai)` o `fallo-abierto (sin Jev)`. |

## Registros de voz

Una sola voz de CEO suspendía manuscritos (penaliza la cautela científica), diapositivas
(penaliza los fragmentos) y avisos a alumnos (penaliza la segunda persona). Ahora el Noul de
voz se elige por registro, en español y en inglés:

| Registro | Cubre |
|---|---|
| `ceo` | Emails de CEO y corporativos: inversores, consejo, socios, clientes. Es la voz anterior, sin cambios. |
| `alumnos` | Avisos de PRADO, emails a estudiantes, instrucciones de prácticas, feedback de TFG/TFM. |
| `apuntes` | Apuntes de un tema, resúmenes de clase y guías de estudio en primera persona del plural (QFDOS: `Apuntes/raw`). |
| `manuscrito` | Artículos, revisiones, tesis, abstracts, respuesta a revisores. |
| `diapositivas` | Títulos, viñetas y notas de presentaciones. |
| `propuesta` | ISCIII, AEI, Horizon, FIBAO, EQC, CDTI. |
| `informe` | Validaciones, ISO 9001/13485, CAPA, SOP, actas, IVDR. |
| `divulgacion` | LinkedIn, notas de prensa, web, podcast. |
| `recomendacion` | Cartas de recomendación y de referencia: máster, doctorado, becas, plazas, premios. |

Alias admitidos: `students`, `notes`, `estudio`, `manuscript`, `paper`, `slides`, `grant`, `report`, `outreach`,
`recommendation`, `referencia`,
`corporativo`, entre otros (`jev_registros.ALIAS`).

**Cómo se decide**, de mayor a menor prioridad:

1. `--registro` en la línea de comandos o `registro` en la herramienta MCP.
2. Marcador en las primeras 40 líneas del fichero: `<!-- registro: alumnos -->` o
   `registro: manuscrito` en el frontmatter YAML.
3. Un fichero `.jev-registro` con una palabra en la carpeta del documento o en una superior.
   Útil para fijar `alumnos` en la carpeta de QFDOS o `manuscrito` en la de un artículo; el
   hook `doc_gate.py` lo respeta sin flags.
4. `Choice` de Jev en la misma llamada que el resto de preguntas (no añade latencia de red).
   Si su confianza baja de 0.40 y la heurística local es clara, manda la heurística.
5. Heurística local (extensión `.pptx`, densidad de viñetas, vocabulario) cuando Jev no responde.
6. `ceo` por defecto.

Con registro `ceo` fijado (flag, marcador o carpeta) las instrucciones de voz y de slop son
idénticas, carácter a carácter, a las calibradas antes de los registros. Los demás registros
añaden a la instrucción de slop una cláusula de tolerancia de formato (viñetas en
diapositivas, "robust" estadístico en manuscritos, listas de fechas en avisos); en detección
automática se añade una tolerancia genérica que reúne las anteriores.

**Archivos:**

- `scripts/jev_registros.py`: instrucciones Noul por registro e idioma, alias y heurística.
- `references/registros.md`: guía de reescritura por registro para los humanizadores.
- `scripts/calibrar_registros.py` + `tests/registros_contraste.json`: pares de contraste.

**Calibración obligatoria** tras crear o editar un registro:

```bash
python3 ".claude/skills/jev-system-one/scripts/calibrar_registros.py"
```

Exige `p_voz(ok) < 0.35`, `p_voz(mal) > 0.65`, separación media ≥ 0.60 y acierto del `Choice`
en las muestras buenas. Para las malas no exige que el `Choice` acierte (un texto mal escrito
puede parecer de otro tipo), sino que no quede **enmascarada**: si se enruta a otro registro, la
voz de ese registro debe seguir rechazándola. Imprime además la matriz cruzada (muestras de un
registro puntuadas con la voz de los demás).

El `Choice` clasifica por destinatario y marcas formales (código de documento, título más
viñetas, secciones y figuras, saludo y firma), nunca por el tono, con criterios enumerados y
ordenados en `INSTR_CHOICE`. Para manuscritos, informes y diapositivas el registro explícito
(`--registro`, marcador o `.jev-registro`) sigue siendo la opción más segura.
Si un registro falla, se ajusta su instrucción en `jev_registros.py`, no el umbral.

### Reparto de responsabilidades

Los invisibles (ZWSP, BOM, soft hyphen, TAG chars U+E0000), los homoglifos cirílicos y
griegos, y los formatos portadores de metadatos se detectan **localmente y sin API**: son
preguntas mecánicas con respuesta exacta y no procede delegarlas en un modelo
probabilístico. Solo el slop, la voz y el LaTeX van a Jev, que es donde hay juicio.

### Dos propiedades que conviene no romper

**Las instrucciones de `Noul` van especificadas al detalle a propósito.** Medido sobre el
mismo texto de slop evidente: con la instrucción vaga "¿contiene clichés de IA?" el Noul
devuelve 0.63 y no separa nada; con la instrucción enumerada que lleva el script, 0.97
frente a 0.03 en un texto limpio. Si alguien acorta esas constantes, la compuerta deja de
discriminar sin dar ningún error.

**Falla en abierto.** Si la API no responde, el gatekeeper ejecuta las cuatro etapas y
**deniega** la certificación. Una caída de red nunca debe aprobar un entregable.

## Configuración de entorno

La clave se lee de `~/.env` o de la variable de entorno:

```powershell
$env:TYPESAFE_API_KEY = "tu-api-key-de-typesafe"
```

Dependencias: `typesafe-sdk` (0.7.1), `python-dotenv`, `python-docx`, `pymupdf`; opcional
`python-pptx` para leer `.pptx`.

**Intérprete.** Están instaladas en Python 3.13 (`C:\Python313`), no en Anaconda, que es el
`python` por defecto en el PATH. Por eso todos los comandos usan `py -3.13`. Con otro
intérprete el motor responde `fallo-abierto (sin Jev)` aunque la clave esté bien. Para
comprobarlo: `python3 -c "import typesafe_sdk"`.

## Uso desde la app de escritorio de Claude (MCP local)

La app no ejecuta los scripts de las skills en este equipo, así que Jev se expone como servidor
MCP: `mcp/jev_mcp_server.py`, registrado como `jev` en
`%APPDATA%\Claude\claude_desktop_config.json` (lo hace `sync-pull`, paso 14).

| Herramienta | Uso |
|---|---|
| `jev_gate_text(texto, lang?, registro?, tipo?)` | Etapas 0 y 4 sobre texto pegado o adjunto en el chat. |
| `jev_gate_file(ruta, lang?, registro?, tipo?)` | Igual para `.md`, `.txt`, `.docx`, `.pdf`, `.pptx`, `.html`, `.tex` del disco (ruta absoluta). |

`tipo='diapositivas'` funciona como `--tipo diapositivas`; en `jev_gate_text` el texto tiene
que conservar las cabeceras `## Slide N` de la exportación. Cuando no certifica,
`siguiente_paso` pide repetir la llamada con `tipo='diapositivas'` para que la ronda 2 no
vuelva al modo normal; con un `.pptx`, además, por `jev_gate_file` sobre el `.pptx` limpio,
porque su texto extraído ya no tiene las cabeceras.
| `jev_registros()` | Lista de registros de voz disponibles. |
| `jev_route(tarea)` | Router de dominio, subagentes y código. |

Devuelven el mismo JSON que `jev_doc_gatekeeper.py --json`. Requiere `mcp>=2` en Python 3.13
(`python3 -m pip install --user "mcp>=2"`) y reiniciar la app tras el registro. Prueba sin la
app: `python3 ".claude/skills/jev-system-one/mcp/jev_mcp_server.py" --selftest`.
Solo funciona en la app de escritorio de cada equipo; claude.ai web y el móvil no lo ven.
