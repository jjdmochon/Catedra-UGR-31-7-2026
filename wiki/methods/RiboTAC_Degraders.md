---
title: "RiboTAC Degraders (Targeted RNA Cleavage)"
type: method
date_created: 2026-08-26
date_updated: 2026-08-26
status: active
confidence: high
tags: [method, RiboTAC, RNA-degradation, chemical-biology, eRNA, therapeutics]
sources: [extracted_docx_text.txt]
---

# RiboTAC Degraders (Targeted RNA Cleavage)

## Purpose
Ribonuclease-Targeting Chimeras (RiboTACs) are heterobifunctional molecules designed to induce the selective, catalytic degradation of specific RNA transcripts (such as non-coding enhancer RNAs or oncogenic mRNAs) inside living cells.

---

## Operating Principle: Molecular Garbage Collection
In cellular biology, targeted protein degradation (PROTACs) utilizes the ubiquitin-proteasome system to destroy proteins. RiboTACs translate this concept to the transcriptome. 

RiboTACs function as **molecular garbage collection scripts** that route pathologically elevated RNA molecules directly to endogenous nucleases:

```
[Target eRNA Transcript] ── (RNA Binding Domain) ── [Linker] ── (RNase L Recruiter) ── [RNase L]
                                                                                            │
                                                                                            ▼ Local Activation
                                                                                    [Catalytic Cleavage]
                                                                                            │
                                                                                            ▼
                                                                                    [eRNA Degradation]
```

A RiboTAC consists of three structural components:
1. **The Address Pointer (RNA Binding Domain)**: A small molecule, synthetic ligand, or Peptide Nucleic Acid (PNA) designed to selectively bind to a specific secondary or tertiary structural motif (like a hairpin loop or internal bulge) on the target RNA.
2. **The Linker**: A bioconjugated spacer (typically PEG or alkyl chains) optimized for length, flexibility, and cell permeability.
3. **The Cleavage Engine (RNase L Recruiter)**: A small molecule (such as a 2'-5' oligoadenylate monomer mimic or specialized heterocycle) that binds to and recruits inactive monomeric **Ribonuclease L (RNase L)**.

**Mechanistic Cascade**:
- The RiboTAC crosses the cell membrane.
- The RNA binding domain binds to the target transcript (e.g., the super-enhancer eRNA DHS44500).
- The recruiter domain recruits inactive RNase L to the site.
- The local high concentration triggers dimerization and activation of RNase L.
- RNase L catalytically cleaves the adjacent single-stranded target RNA.
- The cleaved fragments are degraded by host exonucleases. The RiboTAC molecule remains intact, dissociates, and cycles to bind another target transcript, acting as a sub-stoichiometric catalytic engine.

---

## Inputs and Outputs
- **Inputs**:
  - Target RNA structural data (SHAPE-MaP, NMR, or Cryo-EM models).
  - Heterobifunctional RiboTAC chemical formulations.
  - Endogenous cellular RNase L.
- **Outputs**:
  - Depletion of the target RNA transcript.
  - Dissolution of downstream biomolecular complexes (e.g., super-enhancer loop collapse).

---

## Strengths & Limitations

### Strengths
- **Sub-Stoichiometric Efficacy**: Traditional small molecules require 1:1 occupancy to block an active site. RiboTACs act catalytically; a single molecule can destroy multiple RNA targets sequentially, lowering the required therapeutic dose.
- **Accessing the Non-Coding Genome**: Over 98% of the human genome is transcribed into non-coding RNAs, which lack drug-binding protein pockets. RiboTACs open up this entire regulome for therapeutic intervention.
- **State-Selectivity**: By targeting eRNAs transcribed only in disease-activated cell states (e.g., inflammatory macrophages), RiboTACs achieve highly localized tissue selectivity.

### Limitations
- **Synthetic Size (Rule of Five Violations)**: Conjugating two distinct chemical entities creates large molecules with high molecular weights (>800 Da), frequently compromising cellular uptake and bioavailability.
- **Off-Target Degradation**: Structured host RNAs (like transfer and ribosomal RNAs) are highly abundant. If the RNA-binding domain lacks high selectivity, RiboTACs can cause systemic toxicity by degrading essential cellular machinery.

---

## Critical Parameters & Common Errors
- **Linker Length Optimization**: If the linker is too short, steric hindrance prevents RNase L from binding or dimerizing. If the linker is too long, the effective local concentration of the nuclease is reduced, lowering cleavage kinetics. Linkers must be optimized in increments of single carbon/PEG units.
- **HOOK Effect**: At very high concentrations, RiboTAC molecules can saturate both the target RNA and the RNase L pool as binary complexes, preventing the formation of the active ternary complex (RNA-RiboTAC-RNase L). This leads to a loss of degradation activity at high doses.

---

## Connections
- **Related Methods**: `[[DNA_Encoded_Libraries]]`, `[[drug2cell_Pipeline]]`, `[[Micro_C_snm3C_seq]]`
- **Related Projects**: 
