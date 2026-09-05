# Wiki Ingestion & Modification Log

Chronological ledger of wiki modifications, updates, and ingest operations.

## [2026-06-25] Ingest | Structured Bulk Ingestion
- **Action:** Bulk ingest of converted publications into the newly defined wiki ontology.
- **Details:** Imported 101 publications into `sources/papers_md/`, created corresponding summaries in `outputs/summaries_papers/`, and initialized catalog inside `index.md`.

## [2026-06-26] Ingest | Patents Bulk Ingestion
- **Action:** Bulk ingest of patents from Espacenet CSV and bibliography files.
- **Details:** Imported 16 patents into `sources/patents_md/`, created summaries in `outputs/summaries_patents/`, and updated `index.md` catalog.

## [2026-06-26] Ingest | Concepts Ingestion & Cross-Linking
- **Action:** Extracted 15 research concepts, generated concept files, and linked mentions across 101 publications and 16 patents.
- **Details:** Generated concept pages under `concepts/` and updated `index.md` catalog with Concepts tables. Linked 109 publications and 15 patents.

## [2026-06-26] Ingest | Dynamic Concept Auto-Extraction & Linking
- **Action:** Expanded concepts database to 28 concepts (added 13 new concepts such as miR-122, nanoparticles, hydrogels, and MALDI-TOF).
- **Details:** Generated additional concept pages under `concepts/` and rebuilt `index.md` Concepts Catalog. Cross-linked 166 paper references and 28 patent references dynamically.

## [2026-06-26] Ingest | Dynamic Concept Refinement & Specificity Relinking
- **Action:** Cleaned old overlapping concepts links and re-linked all summaries across 28 concepts with strict priority-based matching.
- **Details:** Resolved specificity conflicts (e.g. `miR-21`, `miR-122`, `cfDNA`, and `CTCs` now correctly link to their specific concept pages instead of general category pages). Checked 162 paper links and 26 patent links.

## [2026-06-26] Ingest | Entities Ingestion & Cross-Linking
- **Action:** Extracted and linked 30 entities (19 researchers, 7 institutions, and 4 projects) across all publications and patents.
- **Details:** Generated entity pages under `entities/` folders and appended the Entities Catalog section to `index.md`. Linked 226 paper references and 58 patent references.

## [2026-06-26] Ingest | Doctoral Theses Ingestion & Unified Re-linking
- **Action:** Ingested 7 doctoral theses, generated summary pages under `outputs/summaries_theses/`, and performed a complete, unified re-linking of all 28 concepts and 30 entities across papers, patents, and theses.
- **Details:** Updated `index.md` with a new Doctoral Theses Catalog, updated linking tables in all concept and entity pages. Relinked counts: 162 papers, 10 theses, and 26 patents.

## [2026-06-26] Ingest | Doctoral Theses Ingestion & Unified Re-linking
- **Action:** Ingested 7 doctoral theses, generated summary pages under `outputs/summaries_theses/`, and performed a complete, unified re-linking of all 28 concepts and 30 entities across papers, patents, and theses.
- **Details:** Updated `index.md` with a new Doctoral Theses Catalog, updated linking tables in all concept and entity pages. Relinked counts: 162 papers, 10 theses, and 26 patents.

## [2026-06-29] Ingest | Missing Doctoral Theses Ingestion
- **Action:** Ingested 4 missing doctoral theses, generated summary pages under `outputs/summaries_theses/`.
- **Details:** Updated `index.md` with new theses catalog entries and created summaries.

## [2026-06-29] Ingest | New Document Ingestion
- **Action:** Ingested 24 `Certification`, generated summary pages under `outputs/summaries/`.
- **Details:** Updated `index.md` with new document catalog entries.

## [2026-06-29] Ingest | Grants and Projects
- **Action:** Ingested 37 `Grant / Project`s, generated summary pages under `outputs/summaries/`.
- **Details:** Updated `index.md` with new grants catalog entries.

## [2026-06-29] lint | Health-check & Reorganization
- **Action:** Performed wiki restructuring, cleaned files, and re-verified.
- **Details:** Kept and converted 11 doctoral theses under advisor direction, deleted 24 administrative certifications, ingested 3 project technical memories, set up placeholders for other project-related files, cleaned 14 `desktop.ini` files, and grouped publications by type (Articles, Patents, Preprints, etc.) in `index.md`. Checked 402 links, 0 broken.

## [2026-07-01] Ingest | New Document Ingestion
- **Action:** Ingested 1 `Article` (Sensors & Diagnostics publication by Marín-Romero et al. - 2022).
- **Details:** Converted PDF to Markdown using MarkItDown, saved under `sources/papers_md/`, generated paper summary under `outputs/summaries_papers/`, and updated catalog in `index.md`.

## [2026-07-02] Ingest | New Document Ingestion (Collaboration Papers)
- **Action:** Ingested 2 `Article`s (Aho et al. - 2020 and Wallin & Lönnberg - 2022).
- **Details:** Converted PDF files to Markdown using MarkItDown, saved under `sources/papers_md/`, generated paper summaries under `outputs/summaries_papers/`, and updated catalog in `index.md`.

## [2026-08-26] Ingest & Restructure | LLM Wiki Version 2 Upgrade
- **Action:** Substantial upgrade of the LLM Wiki structure, ingesting new proposal and expanding academic-pedagogical sections.
- **Details:** 
  2. Created the Professor Profile (`profile/Professor_Profile.md`) and Research Overview (`profile/Research_Overview.md`) detailing the 6 I+D axes.
  3. Added the Courses & Teaching section containing `courses/Overview.md` and pages for `QFUNO.md`, `QFDOS.md`, `QO_UGR.md`, and `TRANSMED.md`.
  4. Added the Methods & Technologies section containing `methods/Methods_Overview.md` and pages for `Dynamic_Chemical_Labeling.md`, `SMART_Probes.md`, `RiboTAC_Degraders.md`, `DNA_Encoded_Libraries.md`, `drug2cell_Pipeline.md`, and `Micro_C_snm3C_seq.md`.
  5. Added the Centralized Glossary (`concepts/Glossary.md`), Open Questions (`open-questions-opportunities/Open_Questions.md`), and Gaps checklist (`profile/Missing_Information.md`).
  6. Inserted a V2 Navigation Hub at the top of `index.md`, resolved LaTeX compliance across all files, and recompiled the database successfully (99 articles, 16 patents, 11 theses, 80 grants).
