---
title: "Cribado de Quimiotecas Codificadas por ADN (DNA-Encoded Libraries - DEL)"
type: metodo
date_created: 2026-08-26
date_updated: 2026-09-06
status: active
confidence: high
tags: [metodo, del, librerias-quimicas, cribado, ngs, sintesis-combinatoria]
sources: [portfolio-catedra/index.html, CV JJD short.md]
---

# Cribado de Quimiotecas Codificadas por ADN (DNA-Encoded Libraries - DEL)

## 1. Definición y Alcance
La tecnología de Quimiotecas Codificadas por ADN (**DEL**) permite la síntesis y evaluación simultánea de colecciones combinatorias masivas compuestas por millones o miles de millones de moléculas orgánicas pequeñas en un único tubo de ensayo, identificando ligandos afines mediante secuenciación masiva (NGS).

---

## 2. Fundamento y Procedimiento Experimental
En el cribado convencional de alto rendimiento (HTS), cada molécula debe sintetizarse, purificarse y ensayarse en un pocillo individualizado mediante sistemas robóticos de alto coste. La tecnología DEL resuelve esta limitación mediante el principio de **código de barras molecular**:

```
[Diana Inmovilizada en Esferas Magnéticas] + [Quimioteca Combinatoria Codificada con ADN (>10^8 compuestos)]
                             │
                             ▼ Incubación e Hibridación por Afinidad
[Complejos Diana-Ligando Unidos a la Fase Sólida]
                             │
                             ▼ Lavados Astringentes (Eliminación de moléculas no unidas)
[Elución Térmica de Ligandos Específicos]
                             │
                             ▼ Amplificación por PCR del Código de Barras de ADN
[Secuenciación Masiva NGS y Conteo de Lecturas]
                             │
                             ▼ Decodificación Computacional
[Identificación de Estructuras Químicas Candidatas Enriquecidas]
```

1. **Síntesis Combinatoria *Split-and-Pool***: Pequeñas moléculas se sintetizan paso a paso en fase sólida o en disolución. Tras cada transformación química sintética, se liga enzimáticamente un bloque oligonucleotídico específico que registra la reacción efectuada. Al finalizar, cada molécula está unida a un código de barras de ADN único.
2. **Selección por Afinidad**: La macromolécula diana se inmoviliza sobre esferas magnéticas y se incuba con la mezcla de cientos de millones de compuestos en una microcentrífuga convencional.
3. **Lavados y Elución**: Los compuestos sin afinidad se eliminan con lavados de alta astringencia; los ligandos fuertemente unidos se eluyen por desnaturalización térmica.
4. **Lectura por NGS**: Los códigos de barras de ADN de los compuestos unidos se amplifican por PCR y se secuencian. La abundancia relativa de lecturas identifica de forma unívoca la estructura química de los ligandos de mayor afinidad.
