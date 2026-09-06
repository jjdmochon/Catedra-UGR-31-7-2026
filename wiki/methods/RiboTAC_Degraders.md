---
title: "Degradadores Quiméricos Dirigidos a ARN (RiboTACs)"
type: metodo
date_created: 2026-08-26
date_updated: 2026-09-06
status: active
confidence: high
tags: [metodo, ribotac, degradacion-arn, quimica-biologica, erna, terapia]
sources: [portfolio-catedra/index.html, Proyecto Investigador Cátedra]
---

# Degradadores Quiméricos Dirigidos a ARN (RiboTACs)

## 1. Concepto y Justificación Terapéutica
Las quimeras reclutadoras de ribonucleasas (**RiboTACs**) son moléculas heterobifuncionales diseñadas para inducir la escisión catalítica y selectiva de transcritos de ARN patológicos (como ARNs no codificantes de tipo *enhancer* o ARNs mensajeros oncogénicos) en células vivas.

De forma análoga a los PROTACs en el ámbito de las proteínas, los RiboTACs trasladan el paradigma de la degradación dirigida al transcriptoma, eliminando la necesidad de emplear inhibidores estéricos o terapia génica exógena.

---

## 2. Mecanismo de Acción Molecular

```
[ARN Diana: eRNA] ── (Dominio de Unión a ARN) ── [Linker] ── (Ligando Reclutador) ── [RNasa L Inactiva]
                                                                                        │
                                                                                        ▼ Dimerización y Activación
                                                                                [Escisión Catalítica del eRNA]
                                                                                        │
                                                                                        ▼
                                                                                [Degradación por Exonucleasas]
```

Un degradador RiboTAC consta de tres bloques moleculares conjugados:
1. **El Dominio Director (Unión al ARN)**: Un ligando sintético de bajo peso molecular o una sonda de PNA optimizada para unirse con gran afinidad a una estructura secundaria o terciaria específica del ARN diana.
2. **El Conector Espaciador (*Linker*)**: Una cadena de longitud y flexibilidad ajustada (generalmente cadenas de polietilenglicol o alquílicas) que garantiza la aproximación espacial sin interferir en la permeabilidad celular.
3. **El Módulo Reclutador de RNasa L**: Un motivo químico mimético de 2'-5' oligoadenilatos capaz de unirse selectivamente a la **Ribonucleasa L (RNasa L)** monomérica inactiva endógena de la célula.

### Cascada Catalítica
Al atravesar la membrana celular, el RiboTAC se une al ARN diana y recluta monómeros de RNasa L. El incremento de concentración local fuerza la dimerización de la enzima, activando su dominio catalítico nucleasa para cortar la hebra de ARN contigua. La molécula de RiboTAC se libera intacta tras el corte, permitiendo que una única molécula de fármaco degrade múltiples copias del transcrito diana de forma subestequiométrica.
