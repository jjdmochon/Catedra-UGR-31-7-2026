---
title: "Micro-C and snm3C-seq (3D Chromatin Conformation)"
type: method
date_created: 2026-08-26
date_updated: 2026-08-26
status: active
confidence: high
tags: [method, Micro-C, snm3C-seq, chromatin-conformation, epigenomics, sequencing]
sources: [extracted_docx_text.txt]
---

# Micro-C and snm3C-seq (3D Chromatin Conformation)

## Purpose
Micro-C and single-nucleus methyl-3C sequencing (snm3C-seq) are high-resolution spatial genomics technologies used to map the three-dimensional structural architecture of chromosomes. In epigenomic research (such as the  project), they are utilized to capture the decay and collapse of **Enhancer-Promoter (E-P) loops** following targeted degradation of regulatory eRNAs.

---

## Operating Principle: Debugging Spatial Genome Structure
If the genome is a long spool of magnetic tape containing source code, it cannot be read as a simple linear string. The tape is folded into complex 3D loops that bring remote configurations (enhancers) into physical contact with active compilers (promoters). 

Micro-C and snm3C-seq act as **spatial debuggers** to map these physical loop contacts:

```
[Folded Chromatin in Cell Nucleus]
               │
               ▼ Formaldehyde Crosslinking (Freezes spatial loops in place)
[Ligated, Frozen Chromatin Loop]
               │
               ▼ MNase Digestion (Cuts DNA down to single nucleosomes)
[Single-Nucleosome DNA Ends]
               │
               ▼ Biotin Labeling & Proximity Ligation (Joins spatial neighbors)
[Chimeric DNA Molecules containing loop contacts]
               │
               ▼ Purification & High-Throughput Sequencing (NGS)
[Computational Contact Map Resolution]
```

### 1. Micro-C (High-Resolution Loop Mapping)
- **The Resolution Challenge**: Traditional Hi-C uses restriction enzymes to digest DNA, yielding structural maps with a resolution of 4–20 kilobases (kb)—too coarse to resolve individual Enhancer-Promoter loops.
- **MNase Precision**: Micro-C replaces restriction enzymes with **Micrococcal Nuclease (MNase)**, which digests chromatin down to the level of single nucleosomes (~147 base pairs).
- **Ligation & Sequencing**: Free nucleosome ends that are in close spatial proximity are labeled with biotin, ligated together to form chimeric DNA molecules, sheared, pulled down with streptavidin, and sequenced. This provides sub-kilobase resolution of chromatin loops, domain boundaries, and nucleosome positions.

### 2. snm3C-seq (Multi-Omic Single-Cell Resolution)
- **EPIGENETIC DUELING**: snm3C-seq combines 3D chromatin contact mapping (3C) with DNA methylation profiling (bisulfite conversion) in individual, single cell nuclei.
- **Multi-Omic Output**: For each individual nucleus, researchers obtain a simultaneous readout of chromosome conformation (loops) and DNA methylation patterns. This allows profiling of cell-type specific epigenetic states in heterogeneous clinical samples.

---

## Inputs and Outputs
- **Inputs**:
  - Crosslinked cell nuclei (isolated from cell culture or patient-derived PBMCs).
  - Micrococcal Nuclease (MNase) enzymes.
  - Biotinylated nucleotides and DNA ligases.
  - Bisulfite or enzymatic conversion reagents (for snm3C-seq).
- **Outputs**:
  - Raw sequencing reads processed into chromatin contact matrices (e.g., `.cool` or `.hic` formats).
  - High-resolution contact map visualizations resolving loops, TADs (Topologically Associating Domains), and compartments.

---

## Strengths & Limitations

### Strengths
- **Nucleosome-Level Resolution**: Easily maps fine-scale Enhancer-Promoter interactions, which are crucial for assessing the downstream structural impact of eRNA-targeting RiboTACs.
- **Epigenetic Multi-Omics**: snm3C-seq resolves the relationship between DNA methylation (gene silencing) and spatial loop formation in the same single cell.

### Limitations
- **High Sequencing Cost**: Resolving chromatin structures at single-nucleosome resolution requires billions of sequencing reads per sample, representing a major budget driver.
- **Complex Bioinformatics**: Analyzing chimeric reads and reconstructing 3D loop topographies requires highly specialized computational pipelines (e.g., cooler, HiC-Pro) and GPU computing arrays.

---

## Connections
- **Related Methods**: `[[RiboTAC_Degraders]]`, `[[drug2cell_Pipeline]]`
- **Related Projects**: 
