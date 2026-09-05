# LLM Wiki Ontology & Link Rules

This document outlines the standard types, templates, directory layout, and link constraints for the JJD LLM Wiki.

## 📁 Directory Structure
- `wiki/` (Root)
  - `index.md` (Main entry point catalog)
  - `log.md` (Append-only modification log)
  - `ontology.md` (Wiki rules and structural definitions)
  - `entities/`
    - `people/` (Pages for authors, researchers, collaborators)
    - `institutions/` (Pages for universities, centers, companies)
    - `projects/` (Pages for research grants, initiatives)
  - `concepts/`
    - `chemistry/` (Chemical methods, reagents, synthesis processes)
    - `platforms/` (Diagnostic or hardware platforms e.g. Luminex, Flow Cytometry)
    - `clinical-areas/` (Hepatotoxicity, Cancer, Leishmaniasis, etc.)
  - `outputs/`
    - `summaries_papers/` (Individual summary pages for publications)
    - `summaries_patents/` (Individual summary pages for patents)
    - `summaries_theses/` (Individual summary pages for doctoral theses)
  - `timelines/` (Chronological sheets)
  - `grants_and_projects/` (Grants, sponsorships, research consortiums)
  - `sources/`
    - `papers_md/` (Raw markdown files of converted papers - READ ONLY)
    - `patents_md/` (Raw markdown files of patents - READ ONLY)
    - `theses_md/` (Theses markdowns)
    - `corporate_md/` (Corporate/commercial reports)
    - `misc_md/` (Other documents)
  - `config/`
    - `agents/` (System prompt specifications for maintenance agents)

## 📋 Templates

### 1. Paper Summary Page Template (located in `outputs/summaries_papers/`)
```markdown
---
title: "Summary of: [Full Title]"
authors: "[Author string]"
year: [YYYY]
section: "[Articles|Book Chapters|Preprints]"
---
# Summary of: [Title]

- **Authors:** [Authors]
- **Journal/Citation:** *[Journal Name, Volume, Pages, (Year)]*
- **Year:** [Year]
- **DOI:** [[DOI Link]]([DOI Link])

---
## 📄 Abstract / Context Preview
[Abstract text or introductory paragraphs]

---
## 📂 Original Document
- 🔗 [Original Converted Markdown (Full Text)](../../sources/papers_md/[Folder_Name]/[File_Name].md)
```

## 🔗 Link Rules
1. **Source Linking:** Every Summary Page *must* contain a direct, clickable relative link to its raw source document under `sources/papers_md/` or `sources/patents_md/`.
2. **Author Reference:** When creating or modifying a summary page, any author name mentioned in the metadata that exists as a page under `entities/people/` should be linked (e.g. `[[Salvatore Pernagallo](../../entities/people/Salvatore_Pernagallo.md)]`).
3. **Concept Extraction:** Important chemical techniques (e.g., *Dynamic Chemical Labeling*, *PNA*) or diagnostic platforms (*Luminex MAGPIX*, *destiNA*) should link to their respective definitions under `concepts/chemistry/` or `concepts/platforms/`.
