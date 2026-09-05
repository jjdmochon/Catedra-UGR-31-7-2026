---
title: "Translational Medicine and Diagnostics (TRANSMED) - UGR"
type: course
date_created: 2026-08-26
date_updated: 2026-08-26
status: active
confidence: high
tags: [teaching, master, translational-medicine, diagnostics, regulation, ISO-13485, UGR]
sources: [portfolio-catedra/index.html, CV JJD short.md]
---

# Translational Medicine and Diagnostics (TRANSMED)

## Overview
This postgraduate module is taught within the Master’s Program in Translational Medicine (TRANSMED) and the Master’s in Drug R&D at the Universidad de Granada.

The course bridges the gap between laboratory chemical discoveries and clinical deployment. In software terms, **doing chemistry in the lab is writing code on a localhost development server. Shipping a molecular diagnostic to clinical practice is deploying that code to a production cluster serving millions of users.** The course covers liquid biopsy platforms, clinical cohort design, statistical validation of diagnostic assays, quality systems (ISO 13485), patent strategies, and biotechnology entrepreneurship.

---

## Core Concepts
- **Translational Pipeline**: The sequence of stages required to take a chemical assay (e.g., dynamic chemical labeling of microRNAs) through analytical validation, clinical cohort testing, regulatory approval, and commercial scaling.
- **Diagnostic Performance Metrics**:
  * **Clinical Sensitivity**: True Positive Rate (TP / (TP + FN)).
  * **Clinical Specificity**: True Negative Rate (TN / (TN + FP)).
  * **PPV/NPV (Positive/Negative Predictive Value)**: Dependent on disease prevalence in the tested population.
  * **ROC AUC (Receiver Operating Characteristic - Area Under the Curve)**: Statistical evaluation of diagnostic accuracy.
- **Regulatory Frameworks (ISO 13485 & CE-IVD)**: Quality management systems for design, development, and manufacture of medical devices.
- **Intellectual Property & Technology Transfer**: Patent filing strategies, university spin-off generation, and public-private funding acquisition (e.g., EIC Accelerator, CDTI).

---

## Weekly Syllabus

| Week | Topic | Core Computational / Translational Analogy |
| :--- | :--- | :--- |
| **W1** | Intro to Translational Medicine | Shipping code: why "working on my machine" (the lab bench) is insufficient for production (the clinic). |
| **W2** | Liquid Biopsy Biomarkers | System telemetry: monitoring circulating DNA, microRNAs, and shedding cells. |
| **W3** | Amplification-Free Diagnostics | Code optimization: simplifying diagnostic protocols by removing enzymatic steps. |
| **W4** | Assay Integration & xMAP Platforms | API integration: adapting chemical labeling to commercial hardware (Luminex, Simoa). |
| **W5** | Analytical vs. Clinical Validation | Unit testing vs. User Acceptance Testing (UAT) in patient cohorts. |
| **W6** | Diagnostic Statistics & ROC Curves | Threshold tuning: balancing false positives and false negatives using ROC analysis. |
| **W7** | Quality Systems & ISO 13485 | Static analysis & safety guardrails: establishing strict compliance and traceability checklists. |
| **W8** | Entrepreneurship & Tech Transfer | Deployment & scaling: building spin-offs, writing patent claims, and raising capital. |

---

## Common Student Misconceptions
- **Misconception: "An assay with 99% analytical sensitivity is immediately ready for clinical use."**  
  *Correction*: Analytical sensitivity (limit of detection, e.g., detecting 1 copy of DNA per microliter) does *not* equal clinical sensitivity. In clinical cohorts, biological variance (isomirs, extraction yields, patient backgrounds) introduces noise. Furthermore, positive predictive value (PPV) drops significantly if the disease prevalence in the target screening population is low.
- **Misconception: "Regulatory quality standards (ISO 13485) stifle research creativity."**  
  *Correction*: ISO 13485 is a design framework. It ensures that every step of synthesis, reagent labeling, and measurement is fully traceable. If a clinical batch fails, documentation acts as a git-bisect tool, allowing developers to isolate and debug the specific failing batch or process.

---

## Laboratory & Practical Activities
1. **Clinical Cut-off Analysis**: Students receive real-world clinical datasets from paracetamol toxicity (miR-122) and acute liver injury cohorts. They plot ROC curves, calculate Area Under the Curve (AUC), and determine the optimal diagnostic cut-off point.
2. **Target Product Profile (TPP) Design**: Teams select a molecular biomarker (e.g., miR-21 for cancer, or Leishmania hsp70 genes) and author a complete TPP document, describing clinical utility, target users, analytical limits, storage requirements, and regulatory path.

---

## Assessment Methods
- **Target Product Profile Proposal (50%)**: Written design dossier outlining the translational development plan for a molecular diagnostic device.
- **Group Oral Presentation (30%)**: Pitching a diagnostic spin-off to a mock panel of venture capitalists and clinical regulators.
- **Continuous Case-Study Evaluations (20%)**: Weekly data-analysis exercises.

---

## Connections
- **Related Profile**: `[[Professor_Profile]]`, `[[Research_Overview]]`
- **Related Projects**: `[[LIQBIOPSENS]]`, `[[CoVradar]]`
- **Related Concepts**: `[[Liquid_Biopsy]]`, `[[microRNA_122]]`, `[[Hepatotoxicity]]`
