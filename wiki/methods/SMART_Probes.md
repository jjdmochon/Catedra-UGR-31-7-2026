---
title: "Sondas Químicas SMART basadas en PNA Abásico"
type: metodo
date_created: 2026-08-26
date_updated: 2026-09-06
status: active
confidence: high
tags: [metodo, pna, smart-probes, sondas, sintesis-solido, biochips]
sources: [portfolio-catedra/index.html, JJD-LLM-Wiki/wiki/concepts/chemistry/Peptide_Nucleic_Acids.md]
---

# Sondas Químicas SMART basadas en PNA Abásico

## 1. Definición y Función Molecular
Las **sondas SMART** son oligómeros sintéticos de Ácido Nucleico Peptídico (PNA) que incorporan en una posición interna definida un **monómero abásico** provisto de una función amina reactiva. 

Actúan como plantillas moleculares de alta afinidad capaces de hibridar con hebras diana de ADN o ARN para posicionar y catalizar la incorporación selectiva de una SMART nucleobase mediante química dinámica covalente.

---

## 2. Arquitectura Estructural del PNA
El esqueleto tradicional de fosfodiéster con desoxirribosa cargado negativamente del ADN se sustituye en el PNA por una cadena principal neutra, aciral y peptídica de unidades repetidas de **N-(2-aminoetil)glicina**:

```
        Esqueleto de ADN                   Esqueleto de PNA
        
         O=P-O(-)                           O=C
           │                                  │
         O-CH2                              N-CH2-CH2
           │   \                              │
           │    CH2 ── Base                   │
           │   /                              CH2-CO ── Base
         O-CH                                 │
           │                                N-CH2
         O=P-O(-)                           O=C
```

### Propiedades Biofísicas Relevantes
1. **Ausencia de Repulsión Electrostática**: Al carecer de cargas negativas en su esqueleto, el PNA no sufre repulsión coulòmbica al unirse al ADN o ARN diana, lo que se traduce en constantes de afinidad sustancialmente mayores y temperaturas de fusión (Tm) superiores a las de los dúplex ADN-ADN equivalentes.
2. **Inestabilidad acusada ante Mismatches**: Un único desemparejamiento de bases provoca una disminución de la temperatura de fusión de entre 10 ºC y 18 ºC en un dúplex PNA-ADN, frente a la caída de sólo 4 ºC a 8 ºC observada en dúplex ADN-ADN, aportando una ventana de discriminación excepcionalmente amplia.
3. **Resistencia Enzimática Absoluta**: La estructura pseudopeptídica del PNA es completamente inmune a la degradación por nucleasas (DNasas, RNasas) y presenta una gran resistencia a proteasas séricas humanas.

---

## 3. Síntesis y Estrategia de Protección Ortogonal
La síntesis de sondas SMART se realiza en fase sólida (SPPS) empleando química Fmoc:
- El monómero abásico requiere el uso de grupos protectores ortogonales como el grupo **Dde** (1-(4,4-dimetil-2,6-dioxociclohexiliden)etilo), el cual es totalmente resistente a la piperidina empleada en la desprotección del grupo Fmoc, pero se elimina selectivamente mediante tratamiento con hidracina diluida.
- Para evitar la auto-agregación hidrofóbica en disolución acuosa típica de las secuencias purínicas de PNA, se introducen de forma rutinaria residuos de L-lisina en los extremos amino o carboxilo terminales de la sonda.
