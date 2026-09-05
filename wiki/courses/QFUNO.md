---
title: "Química Farmacéutica I (QFUNO) - UGR"
type: course
date_created: 2026-08-26
date_updated: 2026-08-26
status: active
confidence: high
tags: [teaching, medicinal-chemistry, drug-design, pharmacokinetics, UGR]
sources: [portfolio-catedra/index.html, CV JJD short.md]
---

# Química Farmacéutica I (QFUNO)

## Overview
Química Farmacéutica I (QFUNO) is a core course in the third year of the Grado en Farmacia at the Universidad de Granada. 

The course introduces students to the fundamental concepts of drug design, target identification, and lead optimization. The goal is to move beyond rote memorization of drug structures and train students to think like medicinal chemists: analyzing a molecular structure, identifying its pharmacophore, predicting its ADME (Absorption, Distribution, Metabolism, Excretion) profile, and designing synthetic pathways to optimize its therapeutic window.

---

## Core Concepts
- **Molecular Recognition**: How small molecules interact with biological macromolecular targets (receptors, enzymes, nucleic acids) through non-covalent forces (hydrogen bonds, electrostatic forces, hydrophobic interactions).
- **Pharmacophore**: The precise 3D spatial arrangement of chemical features (donor/acceptor groups, aromatic rings) required to trigger a biological response.
- **ADME & Pharmacokinetics**: Designing molecules that can survive the body’s "defensive operating system" (solubility, membrane permeability, metabolic degradation).
- **Lead Optimization**: Modifying hits using bioisosterism, rigidification, simplification, or chain extension to improve binding affinity and selectivity.
- **QSAR (Quantitative Structure-Activity Relationship)**: Correlating physical-chemical parameters (lipophilicity LogP, electronic constants, steric factors) with biological potency.

---

## Weekly Syllabus

| Week | Topic | Core Computational / Chemical Analogy |
| :--- | :--- | :--- |
| **W1** | Intro to Medicinal Chemistry | Treating target drug design as writing specialized software interfaces. |
| **W2** | Drug Targets (Proteins & Nucleic Acids) | Analyzing target macromolecule topologies as dynamic binding sockets. |
| **W3** | Forces in Molecular Recognition | Energy optimization: enthalpy-entropy trade-offs in binding. |
| **W4** | Pharmacokinetics & Bioavailability | Packaging: keeping the payload intact through physiological barriers. |
| **W5** | Lead Identification & Screening | Querying databases: physical DEL screens vs. virtual screening. |
| **W6** | Pharmacophore Mapping & Lead Optimization | Code refactoring: modular changes (isosteres) to improve code efficiency. |
| **W7** | QSAR & Computational Drug Design | Statistical regression: finding correlations between structure and activity. |
| **W8** | Drug Metabolism & Prodrugs | Compilation flags: designing inactive molecules activated by cellular enzymes. |

---

## Common Student Misconceptions
- **Misconception: "Drugs work through magic lock-and-key mechanisms."**  
  *Correction*: Drug-target binding is a thermodynamic equilibrium. In reality, molecules are highly flexible ensembles. Binding occurs because the conformation-bound state is lower in free energy (delta G = delta H - T * delta S) than the unbound, solvated state. Students must analyze the enthalpy of bond formation versus the entropic cost of freezing molecular rotations.
- **Misconception: "A drug has only one target."**  
  *Correction*: All small molecules exhibit a binding profile across the proteome. Selectivity is relative, not absolute. Designing out off-target activities is a major debugging stage in lead development.

---

## Laboratory & Practical Activities
1. **Solid-Phase Synthesis (SPPS) Simulation & Practice**: Students perform solid-phase resin synthesis, understanding how immobilization simplifies purification (analogous to git-commit operations on solid resin beads).
2. **Computational Docking**: Practical sessions using molecular modeling software (e.g., PyMOL, AutoDock/DiffDock) to physically dock lead candidates into active sites, calculating binding free energies and identifying target-ligand interactions.

---

## Assessment Methods
- **Continuous Evaluation (40%)**: Weekly quizzes, active participation in the Google Sites evaluation hub, and molecular design assignments.
- **Practical Lab Evaluation (20%)**: Lab reports and performance during synthesis and docking sessions.
- **Final Written Examination (40%)**: Written test focusing on mechanism-of-action predictions, synthetic design of simple APIs, and pharmacophore identification.

---

## Connections
- **Related Courses**: `[[QFDOS]]`, `[[QO_UGR]]`
- **Related Methods**: `[[Solid_Phase_Synthesis]]`, `[[Peptide_Libraries]]`, `[[DNA_Encoded_Libraries]]`
