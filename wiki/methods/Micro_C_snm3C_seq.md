---
title: "Micro-C y snm3C-seq: Arquitectura Tridimensional de la Cromatina"
type: metodo
date_created: 2026-08-26
date_updated: 2026-09-06
status: active
confidence: high
tags: [metodo, micro-c, snm3c-seq, cromatina, epigenomica, 3d-genomics]
sources: [portfolio-catedra/index.html, Proyecto Investigador Cátedra]
---

# Micro-C y snm3C-seq: Arquitectura Tridimensional de la Cromatina

## 1. Definición y Propósito
**Micro-C** y la secuenciación de conformación cromatínica combinada con metilación en núcleos individuales (**snm3C-seq**) son metodologías de genómica espacial de ultra-alta resolución empleadas para mapear la organización física tridimensional del genoma dentro del núcleo celular.

En los proyectos de investigación en epigenómica del laboratorio, estas técnicas permiten monitorizar la formación y el colapso de **bucles reguladores Enhancer-Promoter (E-P)** tras inducir la degradación dirigida de transcritos de eRNA mediante RiboTACs.

---

## 2. Fundamento Metodológico y Comparativa

```
[Núcleos Celulares Fijados con Formaldehído]
               │
               ▼ Digestión con Nucleasa Microcócica (MNase) a nivel de mononucleosoma
[Extremos de ADN de ~147 pb Libres]
               │
               ▼ Marcaje con Biotina y Ligación por Proximidad Física
[Moléculas Quiméricas Representativas de Bucles Espaciales]
               │
               ▼ Purificación con Estreptavidina y Secuenciación NGS
[Resolución de Matrices de Contacto y Mapas de Calor Tridimensionales]
```

### 1. Ventaja Resolutiva de Micro-C frente al Hi-C Clásico
- Las tecnologías Hi-C clásicas emplean enzimas de restricción para cortar la cromatina, limitando la resolución espacial a ventanas de entre 5 y 20 kilobases (kb), lo que imposibilita resolver contactos finos entre promotores y potenciadores distales.
- Micro-C sustituye las enzimas de restricción por **Nucleasa Microcócica (MNase)**, enzima que digiere la cromatina hasta la unidad de nucleosoma individual (~147 pares de bases), permitiendo resolver la topología cromatínica a nivel de pares de bases únicos.

### 2. Multi-ómica a Célula Única con snm3C-seq
- Permite registrar de manera simultánea en cada núcleo celular individual tanto la conformación 3D del ADN (bucles cromosómicos) como el estado de metilación de las citosinas mediante conversión química.
- Aporta una resolución sin precedentes para identificar estados epigenéticos específicos en subpoblaciones celulares heterogéneas.
