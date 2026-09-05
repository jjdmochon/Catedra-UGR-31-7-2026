---
title: "drug2cell Pipeline (Single-Cell Off-Target Analysis)"
type: method
date_created: 2026-08-26
date_updated: 2026-08-26
status: active
confidence: high
tags: [method, drug2cell, single-cell, scRNA-seq, computational-biology, bioinformatics]
sources: [extracted_docx_text.txt]
---

# drug2cell Pipeline (Single-Cell Off-Target Analysis)

## Purpose
`drug2cell` is an analytical bioinformatics pipeline designed to integrate single-cell RNA sequencing (scRNA-seq) datasets with drug-target interaction databases. In translational research, it is utilized as a **computational safety screen** to map drug target availability and predict off-target toxicity profiles across millions of individual cells at single-lineage resolution prior to preclinical animal studies.

---

## Operating Principle: The Tissue-Wide Compiler Check
In software development, static analysis tools scan source code to find bugs or illegal API calls before compilation. 

The `drug2cell` pipeline acts as a **static safety check for drug binding**:

```
[scRNA-seq Expression Matrices (cell x gene)] + [Drug/eRNA Target Affinities]
                               │
                               ▼ drug2cell Matrix Multiplication
              [Cell-by-Drug Engagement Scores]
                               │
                               ▼ UMAP Dimensionality Reduction
           [Cell Type-Specific Toxicity Mapping]
                               │
                               ▼ Threshold Evaluation
   [Flagging of Off-Target Activation in Vital Organs]
```

1. **Target Abundance Input**: The pipeline ingests single-cell transcriptomic reference datasets (e.g., from the Human Cell Atlas or clinical disease cohorts) representing millions of cell types across major organs (heart, kidney, liver, brain).
2. **Matrix Integration**: Instead of evaluating target availability in bulk tissue (which averages out signals and misses rare cell populations), `drug2cell` calculates target expression levels () for every single cell.
3. **Engagement Scoring**: The pipeline multiplies the cell-by-gene expression matrix by the drug-target binding affinity vector, generating a cell-by-drug engagement score.
4. **Safety Verification**: The output maps where the drug or RiboTAC will bind in the human body. For the compiler must verify that the target eRNA (DHS44500) shows high expression scores *only* in active inflammatory cells (LPS-stimulated macrophages) and exhibits **zero expression** in vital cell types prone to off-target toxicities (e.g., cardiac sinoatrial pacemaker cells, blood-brain barrier endothelial cells, or renal podocytes).

---

## Inputs and Outputs
- **Inputs**:
  - Single-cell RNA-seq datasets (typically stored in `.h5ad` format).
  - Targeted drug/RiboTAC binding affinity database.
- **Outputs**:
  - UMAP dimensionality reduction plots showing target availability across cell clusters.
  - Quantitative safety scores indicating predicted off-target tissue exposure.

---

## Strengths & Limitations

### Strengths
- **Resolves Cellular Heterogeneity**: Identifies rare cell populations (representing <1% of a tissue) that express the target and could trigger severe side effects, which would be completely missed by bulk RNA-seq.
- **Computational-First Safety Grid**: Accelerates drug development by identifying unsafe compounds in silico, saving time and reducing the need for animal testing.
- **State-Specific Resolution**: Can differentiate between healthy resting cell states and disease-activated states within the same cell lineage.

### Limitations
- **Transcription-Translation Disconnect**: The pipeline measures RNA abundance. In some cases, mRNA transcript levels do not correlate linearly with physical target protein levels on the cell surface due to translational regulation.
- **Atlas Bias**: The accuracy of the safety prediction is dependent on the depth, tissue quality, and clinical diversity of the underlying input single-cell reference datasets.

---

## Connections
- **Related Methods**: `[[RiboTAC_Degraders]]`, `[[Micro_C_snm3C_seq]]`
- **Related Projects**: 
