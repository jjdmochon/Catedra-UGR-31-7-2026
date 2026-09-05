---
title: "DNA-Encoded Library (DEL) Screening"
type: method
date_created: 2026-08-26
date_updated: 2026-08-26
status: active
confidence: high
tags: [method, DEL, screening, library, small-molecules, drug-discovery]
sources: [extracted_docx_text.txt]
---

# DNA-Encoded Library (DEL) Screening

## Purpose
DNA-Encoded Library (DEL) screening is an ultra-high-throughput ligand discovery technology used to isolate small-molecule binders against folded macromolecular targets (proteins or structured RNA) from combinatorial pools containing millions to billions of distinct chemical entities.

---

## Operating Principle: A Massively Parallel Hash Search
In traditional high-throughput screening (HTS), a robotic arm dispenses individual compounds into 384-well plates, executing one assay per well. 

DEL replaces this physical partition with a **massively parallel hash search in a single tube**:

```
[Target RNA Immobilized on Beads] + [DNA-Encoded Chemical Library (>10^8 compounds)]
                     │
                     ▼ Incubation & Hybridization
[Complex of Target RNA + Bound Small Molecules]
                     │
                     ▼ Stringent Washing (Washes away unbound compounds)
[Elution of Bound Compounds]
                     │
                     ▼ PCR Amplification of DNA Barcodes
[High-Throughput Sequencing (NGS)]
                     │
                     ▼ Computational Decoding
[Enriched Chemical Structures Identified]
```

1. **The Chemical Database (The Library)**: Through combinatorial split-and-pool synthesis, small molecules are built step-by-step on a solid support. At each synthetic step, a unique, short double-stranded DNA tag is enzymatically ligated to the linker. The final product is a small molecule covalently attached to a unique **DNA barcode** that acts as a synthetic metadata tag.
2. **Target Engagement**: The target (e.g., natively folded DHS44500 eRNA) is immobilized on magnetic beads. The entire library of >10^8 tagged compounds is added to a single tube and incubated under physiological conditions.
3. **Partition & Wash**: Unbound molecules are washed away using stringent buffer conditions. Molecules that bind the target with high affinity remain tethered to the beads.
4. **NGS Readout & Hash Decoding**: The bound complexes are eluted. The DNA barcodes are amplified via PCR and sequenced using Next-Generation Sequencing (NGS). The sequence reads are mapped back to their chemical synthesis database, allowing researchers to count the abundance of each barcode. High counts indicate chemical structures with high binding affinity.

---

## Inputs and Outputs
- **Inputs**:
  - Purified, natively folded target RNA (immobilized on magnetic or streptavidin beads).
  - Combinatorial DNA-encoded small-molecule library.
  - DNA polymerase and PCR primers for barcode amplification.
- **Outputs**:
  - Raw sequencing reads (FASTQ) decoded into enrichment matrices identifying candidate chemical scaffolds.

---

## Strengths & Limitations

### Strengths
- **Scale**: Screens billions of molecules in a single microcentrifuge tube, bypassing the need for multi-million-euro plate-handling robotics.
- **Minimal Sample Volume**: Requires micrograms of target material compared to milligrams needed for traditional screens.
- **Direct Target Selection**: Allows screening of target structures under competitive conditions (e.g., adding excess transfer RNA to drive selectivity).

### Limitations
- **Affinity-Only Readout**: The assay only measures physical binding (Kd), not functional activity (e.g., whether the compound inhibits or degrades the target). Hit compounds must undergo functional assay screening downstream.
- **Chemical Synthesis Constraints**: The combinatorial reactions must be compatible with DNA stability. Harsh reaction conditions (such as strong acids, high heat, or organometallic reagents) cannot be used as they damage the DNA barcode tags.

---

## Critical Parameters & Common Errors
- **RNA Folding Integrity**: RNA is prone to misfolding. Screening must take place in buffers containing magnesium ions (Mg2+) to stabilize the native tertiary loops. If the target RNA misfolds during screening, the process will enrich for binders to inactive, denatured structures.
- **Non-Specific DNA Binding**: Small molecules are linked to large, highly charged double-stranded DNA tags. The DNA tag itself can bind non-specifically to basic targets. This requires negative-control screenings (using the DNA tag alone) to filter out false-positive DNA-binders.

---

## Connections
- **Related Methods**: `[[Dynamic_Chemical_Labeling]]`, `[[RiboTAC_Degraders]]`, `[[drug2cell_Pipeline]]`
- **Related Projects**: 
