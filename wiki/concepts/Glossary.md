---
title: "LLM Wiki Concepts and Glossary"
type: concept
date_created: 2026-08-26
date_updated: 2026-08-26
status: active
confidence: high
tags: [glossary, definitions, acronyms, chemistry, diagnostics]
sources: [portfolio-catedra/index.html, CV JJD short.md, extracted_docx_text.txt]
---

# LLM Wiki Concepts and Glossary

## Overview
This glossary provides concise definitions and computational-chemical analogies for recurring concepts, acronyms, and terminology used throughout Prof. Juan José Díaz-Mochón’s research, teaching, and spin-off platforms.

---

## Terminology & Definitions

### A
- **Abasic Site**: A position in a nucleic acid or PNA strand where the organic base is missing, leaving only the sugar or pseudopeptide backbone monomer. In `[[SMART_Probes]]`, this empty space serves as a pocket for template-directed dynamic ligation.

### C
- **Cell-Free DNA (cfDNA)**: Fragmented DNA circulating freely in blood plasma, released by apoptotic or necrotic cells. A primary target of liquid biopsy for non-invasive cancer profiling.
- **chemFISH**: An in situ hybridization method combining `[[Dynamic_Chemical_Labeling]]` with fluorescent detection to identify single nucleotide variations (SNVs) in repetitive genomic sequences under a microscope.
- **Circulating Tumor Cells (CTCs)**: Intact cancer cells that shed from a primary tumor and enter the bloodstream, acting as seeds for metastasis and key cellular biomarkers in liquid biopsies.
- **Click Chemistry**: A class of highly selective, high-yielding, and biocompatible reactions (most famously the copper-catalyzed azide-alkyne cycloaddition, CuAAC) used to couple biomolecules together without interfering with cellular chemistry.

### D
- **DNA-Encoded Library (DEL)**: A collection of millions to billions of small molecules, each covalently attached to a unique double-stranded DNA barcode that codes for its synthetic history, allowing massively parallel screening.
- **drug2cell**: A computational pipeline that maps drug-target interaction networks onto single-cell RNA-seq datasets to predict target availability and off-target safety at single-lineage resolution.
- **Dynamic Chemical Labeling (DCL)**: A PCR-free detection technology utilizing reversible covalent chemistry (imine formation) to selectively label and identify specific target sequences opposite an abasic PNA probe.

### E
- **Enhancer RNA (eRNA)**: Short-lived, non-coding RNA molecules transcribed from active genomic enhancer regions. They function as structural scaffolds to recruit transcription machinery and stabilize Enhancer-Promoter loops.

### I
- **isomiR**: Sequence variants of microRNAs that differ by single nucleotide additions, deletions, or polymorphisms. DCL is designed to differentiate between highly similar isomirs without PCR bias.

### L
- **Liquid Biopsy**: A minimally invasive diagnostic method that analyzes circulating biomarkers (miRNAs, cfDNA, CTCs, exosomes) in blood plasma or other biofluids to monitor disease status in real-time.

### M
- **Micro-C**: A spatial genomics method that uses micrococcal nuclease (MNase) to digest chromatin into single-nucleosome fragments, allowing the mapping of 3D chromatin conformation (E-P loops) at sub-kilobase resolution.

### P
- **Peptide Nucleic Acid (PNA)**: A synthetic DNA/RNA mimic with a neutral, achiral pseudopeptide backbone composed of repeated N-(2-aminoethyl)glycine units, yielding high hybridization stability and nuclease resistance.

### R
- **RiboTAC**: Ribonuclease-Targeting Chimera. A heterobifunctional molecule consisting of an RNA-binding ligand linked to an RNase L recruiter, designed to drive targeted catalytic degradation of specific RNA transcripts.

### S
- **SMART Base**: A modified nucleobase (A, T, G, C) functionalized with an aldehyde group and a reporter tag (biotin or fluorophore), used as the reactive substrate in DCL reactions.
- **SMART Probe**: An abasic Peptide Nucleic Acid (PNA) probe containing a vacant monomer position designed to direct dynamic chemical labeling.

---

## Connections
- **Methods**: `[[Dynamic_Chemical_Labeling]]`, `[[SMART_Probes]]`, `[[RiboTAC_Degraders]]`, `[[DNA_Encoded_Libraries]]`, `[[drug2cell_Pipeline]]`, `[[Micro_C_snm3C_seq]]`
