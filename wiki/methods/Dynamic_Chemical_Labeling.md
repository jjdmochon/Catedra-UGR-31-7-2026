---
title: "Marcado Químico Dinámico (Dynamic Chemical Labeling - DCL)"
type: metodo
date_created: 2026-08-26
date_updated: 2026-09-06
status: active
confidence: high
tags: [metodo, dcl, quimica-dinamica, pna, smart-base, diagnostico]
sources: [portfolio-catedra/index.html, JJD-LLM-Wiki/wiki/concepts/chemistry/Dynamic_Chemical_Labeling.md]
---

# Marcado Químico Dinámico (Dynamic Chemical Labeling - DCL)

## 1. Definición y Propósito
El **Marcado Químico Dinámico (DCL)** es una tecnología de diagnóstico molecular libre de enzimas y libre de PCR, co-inventada por el Prof. Dr. Juan José Díaz-Mochón. 

Permite interrogar secuencias de ADN y ARN, discriminar mutaciones puntuales (SNVs) y cuantificar microRNAs directamente en fluidos biológicos complejos (como suero, plasma o saliva humana) con resolución de nucleótido único.

---

## 2. Principio Fisicoquímico de Funcionamiento
A diferencia de las técnicas moleculares convencionales que dependen de polimerasas, transcriptasas inversas y ligasas proteicas sensibles a la temperatura y a inhibidores endógenos, el DCL opera bajo las leyes del **equilibrio termodinámico de la química orgánica covalente reversible**:

```
[Hebra Diana: ADN/ARN] + [Sonda de PNA Abásico]
               │
               ▼ Hibridación de alta afinidad
[Dúplex PNA:Diana con bolsillo abásico vacío frente a la base mutada]
               │
               ▼ Adición de SMART nucleobase reactiva (aldehído + biotina/fluoróforo)
[Equilibrio Dinámico de Formación de Base de Schiff / Imina]
               │
               ▼ Estabilización termodinámica por apareamiento Watson-Crick
[Complejo de hibridación correcto estabilizado]
               │
               ▼ Reducción química (Cianoborohidruro sódico, NaBH3CN)
[Marcado covalente irreversible con amina secundaria]
```

1. **La Sonda de PNA Abásico**: Se diseña un oligómero de Ácido Nucleico Peptídico (PNA) complementario a la secuencia de interés, en el que se omite deliberadamente una nucleobase en la posición de la mutación diana, introduciendo un espaciador que porta una amina reactiva.
2. **Hibridación Específica**: El PNA neutro se une a la hebra diana con gran afinidad, formando un dúplex muy estable y dejando una cavidad vacía justo frente a la base a interrogar.
3. **Equilibrio Covalente Reversible**: Se introduce la **SMART nucleobase**, modificada con un grupo aldehído. Ésta reacciona reversiblemente con la amina de la sonda PNA, formando una imina que se ensambla y desensambla continuamente.
4. **Reconocimiento Watson-Crick**: Si la SMART nucleobase es la complementaria canónica (e.g., SMART-Citosina frente a Guanina diana), se establecen enlaces de hidrógeno Watson-Crick que estabilizan conformacionalmente la estructura en el interior de la cavidad. Si existe un emparejamiento erróneo (*mismatch*), la imina se hidroliza de inmediato y la base es expulsada al medio.
5. **Fijación Covalente Irreversible**: La adición controlada de un agente reductor suave (cianoborohidruro sódico) reduce de manera irreversible la imina a una amina secundaria estable, dejando la sonda covalentemente marcada con la etiqueta indicadora (fluoróforo o biotina).

---

## 3. Ventajas y Limitaciones Clínicas

### Ventajas Competitivas
- **Ausencia Total de PCR**: Elimina el riesgo de falsos positivos por contaminación cruzada de amplicones en el laboratorio clínico.
- **Inmunidad a Inhibidores**: No se inhibe por la presencia de heparina, hemo, bilirrubina o sales que inactivan habitualmente las ADN polimerasas comerciales.
- **Resolución de Base Única**: Capaz de discriminar con fiabilidad absoluta isoformas de microRNA (isomirs) que difieren en un único nucleótido terminal.
- **Estabilidad de Reactivos**: Las sondas sintéticas de PNA y las bases SMART son estables a temperatura ambiente, sin requerir cadena de frío para su transporte y almacenamiento.

### Parámetros de Sensibilidad
Al no existir una amplificación exponencial geométrica del analito, la lectura ultrasensible de biomarcadores en concentraciones sub-picomolares se realiza integrando el DCL en plataformas de alta sensibilidad óptica, tales como analizadores Luminex MAGPIX, citometría de flujo o sistemas monomoleculares Quanterix Simoa.
