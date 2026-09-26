---
name: brag
description: Genera documentos de méritos del Prof. Juan José Díaz-Mochón a partir de las fuentes verificadas del repositorio de candidatura (Cátedra UGR 31/7/2026). Usar cuando el usuario invoque /brag o pida un CV completo (formato Anexo IV BOE), un CVA/CV abreviado, un resumen ejecutivo de logros, una bio corta o un listado de méritos para una convocatoria (ISCIII, AEI, ANECA, EQC, FIBAO).
---

# /brag · Documentos de méritos

Producimos documentos de méritos exclusivamente con datos que existen en las fuentes del repositorio. Nada se inventa, redondea al alza ni extrapola.

## 1. Formato

Si `$ARGUMENTS` no indica formato, se pregunta una sola vez con estas opciones:

| Formato | Salida | Cómo |
|---|---|---|
| **CV completo** (por defecto) | `cv/CV_Diaz-Mochon_Anexo_IV.docx` | `cd cv && npm install && npm run build` |
| **CVA / CV abreviado** | DOCX de 4 páginas máx. (modelo FECYT) | Resumen narrativo + 10 aportaciones más relevantes + 5 proyectos + 5 patentes/contratos |
| **Resumen ejecutivo** | Texto en el chat o DOCX de 1 página | Indicadores + 5 hitos + líneas activas |
| **Bio** | 150 o 300 palabras, ES/EN | Tercera persona, voz ejecutiva |
| **Méritos para una convocatoria** | DOCX o tabla | Filtrar por el baremo de la convocatoria que indique el usuario |

Además del formato, se pregunta el periodo (p. ej. «últimos 10 años» para ISCIII/AEI) y el idioma si no son evidentes.

## 2. Fuentes (orden de prioridad)

1. `js/data.js` → `window.APP_DATA`: `kpis`, `projects` (30, con `amount_val`, `is_ip`, `category`), `theses` (11), `concurso`, `anexo_iv`.
2. `Diaz-Mochon scientific production 2026_0626.md`: referencias completas de artículos (98), capítulos, resúmenes de congresos, patentes (Espacenet, con estado) y preprints. Los títulos de `data.js` vienen truncados; aquí están completos.
3. `cv/authors_fix.json`: listas de autores completas (PubMed/Crossref) para las referencias cuyo autor aparece truncado en la fuente 2.
4. `wiki/concurso/Baremo_Anexo_IV_BOE.md` y `wiki/profile/*.md`: trayectoria, puestos, estancias, empresas.
5. `Espacenet Diaz-Mochon patents.csv`: verificación de patentes.

Para leer `data.js` desde Node: `global.window = {}; require("./js/data.js"); const D = window.APP_DATA;`

## 3. Reglas

- **Cifras calculadas, no copiadas**: importes totales, número de proyectos como IP y patentes concedidas se recalculan desde los datos (`amount_val`, `is_ip`, estado `Granted`). Si una cifra del README o del wiki no coincide con el dato calculado, se usa el calculado y se avisa al usuario.
- **Incoherencias conocidas que hay que señalar, no ocultar**:
  - README y wiki declaran «12 patentes concedidas»; Espacenet solo registra 3 concesiones (US8716457B2, US11242526B2, ES2548927B1).
  - «Más de 60 ponencias en congresos»: solo 12 resúmenes están documentados.
  - «5 quinquenios = 25 años de docencia» frente a una docencia en la UGR que empieza en 2011.
- **Nombre del candidato en negrita** en todas las referencias.
- **Sin LaTeX**: caracteres Unicode nativos (miR-122, 1H RMN, Δ, ×, →). Se limpian los restos de BibTeX (`$\less$`, `\&`, `--`).
- **Voz**: directa, ejecutiva, plural de equipo en español («desarrollamos», «planteamos»). Nada de fórmulas de relleno. Para pulir el texto narrativo, usar `humanizer-juanjo-es` / `humanizer-juanjo` si están disponibles.
- **Datos personales**: solo los que ya figuran en el repositorio. No se añaden DNI, fecha de nacimiento ni domicilio si el usuario no los proporciona.

## 4. Entrega

1. Generar el documento y validarlo (XSD si está disponible la skill `docx`; render a PDF si LibreOffice Writer está instalado).
2. Informar al usuario de lo siguiente: ruta del fichero, recuento por apartado y lista de incoherencias o huecos detectados (apartados con datos genéricos y certificados pendientes de `wiki/profile/Missing_Information.md`).
3. Hacer commit en la rama de trabajo solo si el usuario trabaja sobre el repositorio.
