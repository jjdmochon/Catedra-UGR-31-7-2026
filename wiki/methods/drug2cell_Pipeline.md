---
title: "Pipeline Computacional drug2cell: Seguridad Farmacológica en Célula Única"
type: metodo
date_created: 2026-08-26
date_updated: 2026-09-06
status: active
confidence: high
tags: [metodo, drug2cell, single-cell, scrna-seq, bioinformatica, toxicologia]
sources: [portfolio-catedra/index.html, Proyecto Investigador Cátedra]
---

# Pipeline Computacional drug2cell: Seguridad Farmacológica en Célula Única

## 1. Definición y Propósito
`drug2cell` es una plataforma bioinformática de análisis que integra matrices de secuenciación de ARN de célula única (scRNA-seq) con bases de datos de afinidad química ligando-diana para evaluar perfiles de eficacia y toxicidad fuera de diana (*off-target*) a resolución de linaje celular antes de iniciar ensayos con modelos animales.

---

## 2. Metodología de Integración de Datos
Los estudios farmacológicos convencionales evalúan la presencia de la diana en extractos tisulares globales (*bulk*), promediando la señal y perdiendo la detección de subpoblaciones celulares minoritarias pero críticas (e.g., células endoteliales, marcapasos cardiacos o podocitos renales).

```
[Matriz scRNA-seq: Célula × Gen] × [Vector de Afinidad: Fármaco-Diana]
                             │
                             ▼ Multiplicación Matricial
           [Puntuación de Compromiso Fármaco-Célula]
                             │
                             ▼ Proyección UMAP
         [Mapeo Celular de Toxicidades Fuera de Diana]
```

1. **Datos de Entrada**: Se procesan conjuntos de datos transcriptómicos de célula única procedentes del *Human Cell Atlas* o de cohortes clínicas específicas en formato `.h5ad` (AnnData).
2. **Evaluación de Diana en Cada Célula**: Se determina cuantitativamente la expresión génica normalizada célula a célula.
3. **Cálculo del Score de Interacción**: Se pondera la expresión celular con las constantes de unión experimental o predicha del candidato terapéutico.
4. **Filtro de Seguridad**: Para candidatos dirigidos a eRNAs inflamatorios (como DHS44500), el pipeline verifica que la interacción se concentre en macrófagos activados por LPS y sea estrictamente nula en tejidos vitales no diana.
