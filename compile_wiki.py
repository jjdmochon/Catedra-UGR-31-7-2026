import os
import re
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Dynamic path resolution
base_dir = os.path.dirname(os.path.abspath(__file__))
wiki_dir = os.path.join(base_dir, "wiki")
index_path = os.path.join(wiki_dir, "index.md")

if not os.path.exists(index_path):
    print(f"Error: index.md not found at {index_path}")
    sys.exit(1)

with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

data = {
    "articles": [],
    "patents": [],
    "preprints": [],
    "meeting_abstracts": [],
    "book_chapters": [],
    "theses": [],
    "grants": [],
    "entities": {
        "researchers": [],
        "institutions": [],
        "projects": []
    },
    "concepts": {
        "chemistry": [],
        "platforms": [],
        "clinical_areas": []
    }
}

# Helper to clean markdown cells
def clean_cell(cell):
    cell = cell.strip()
    m_link = re.search(r'\[.*?\]\((.*?)\)', cell)
    link = m_link.group(1) if m_link else None
    
    text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', cell)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = re.sub(r'<br>', ' ', text)
    text = text.strip()
    return {"text": text, "link": link}

# Helper to inspect summary file for richer metadata
def enrich_from_summary_file(rel_link):
    if not rel_link:
        return {}
    
    full_path = os.path.join(wiki_dir, rel_link.replace("/", os.sep))
    if not os.path.exists(full_path):
        return {}
    
    metadata = {}
    try:
        with open(full_path, "r", encoding="utf-8") as sf:
            s_content = sf.read()
            
        # Parse frontmatter if present
        fm_match = re.match(r"^---(.*?)---", s_content, re.DOTALL)
        if fm_match:
            fm_text = fm_match.group(1)
            for line in fm_text.splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    k = k.strip().lower()
                    v = v.strip().strip('"').strip("'")
                    metadata[k] = v
                    
        # Extract images if any
        img_match = re.findall(r'!\[.*?\]\((.*?)\)', s_content)
        if img_match:
            metadata["images"] = img_match
            
        # Extract summary body without frontmatter
        body = s_content
        if fm_match:
            body = s_content[fm_match.end():].strip()
            
        # First 500 characters of text for clean preview
        clean_body = re.sub(r'#.*?\n', ' ', body)
        clean_body = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', clean_body)
        clean_body = re.sub(r'[\*\_\`\>]', ' ', clean_body)
        clean_body = re.sub(r'\s+', ' ', clean_body).strip()
        metadata["preview"] = clean_body[:400]
        metadata["full_summary"] = body
    except Exception as e:
        pass
        
    return metadata

# Parse tables
sections_config = [
    (r"## 📄 Articles by Year\s*(.*?)(?=## 📊 Patents Catalog)", "articles", True),
    (r"## 📊 Patents Catalog\s*(.*?)(?=## 🔬 Preprints)", "patents", False),
    (r"## 🔬 Preprints\s*(.*?)(?=## 📝 Meeting Abstracts)", "preprints", False),
    (r"## 📝 Meeting Abstracts\s*(.*?)(?=## 📚 Book Chapters)", "meeting_abstracts", False),
    (r"## 📚 Book Chapters\s*(.*?)(?=## 🎓 Doctoral Theses Catalog)", "book_chapters", False),
    (r"## 🎓 Doctoral Theses Catalog\s*(.*?)(?=## 💶 Grants and Projects Catalog)", "theses", False),
    (r"## 💶 Grants and Projects Catalog\s*(.*?)(?=## 👥 Entities Catalog)", "grants", False)
]

# Parse Articles
articles_match = re.search(r"## 📄 Articles by Year\s*(.*?)(?=## 📊 Patents Catalog)", content, re.S)
if articles_match:
    articles_section = articles_match.group(1)
    year_sections = re.findall(r"### 📅 (\d{4})\s*(.*?)(?=### 📅 \d{4}|##|$)", articles_section, re.S)
    for year, table_text in year_sections:
        lines = table_text.strip().splitlines()
        for line in lines:
            line = line.strip()
            if line.startswith("|") and not ("Title" in line or "---" in line):
                parts = [p.strip() for p in line.split("|")[1:-1]]
                if len(parts) >= 4:
                    title_data = clean_cell(parts[0])
                    authors_data = clean_cell(parts[1])
                    summary_data = clean_cell(parts[2])
                    full_text_data = clean_cell(parts[3])
                    
                    enrichment = enrich_from_summary_file(summary_data["link"])
                    
                    item = {
                        "year": int(year),
                        "title": title_data["text"],
                        "authors": authors_data["text"],
                        "summary_link": summary_data["link"],
                        "full_text_link": full_text_data["link"],
                        "doi": enrichment.get("doi", ""),
                        "journal": enrichment.get("journal", ""),
                        "preview": enrichment.get("preview", ""),
                        "images": enrichment.get("images", [])
                    }
                    data["articles"].append(item)

# Parse other tables
for regex, key, is_articles in sections_config[1:]:
    match = re.search(regex, content, re.S)
    if match:
        section_text = match.group(1)
        lines = section_text.strip().splitlines()
        for line in lines:
            line = line.strip()
            if line.startswith("|") and not ("Title" in line or "---" in line or "Column" in line):
                parts = [p.strip() for p in line.split("|")[1:-1]]
                if len(parts) >= 3:
                    if key == "patents":
                        title_data = clean_cell(parts[0])
                        pub_num = parts[1].replace("\n", " ").strip()
                        prio_date = parts[2].strip()
                        summary_data = clean_cell(parts[3]) if len(parts) > 3 else {"link": None}
                        full_text_data = clean_cell(parts[4]) if len(parts) > 4 else {"link": None}
                        enrichment = enrich_from_summary_file(summary_data["link"])
                        data["patents"].append({
                            "title": title_data["text"],
                            "publication_number": pub_num,
                            "priority_date": prio_date,
                            "summary_link": summary_data["link"],
                            "full_text_link": full_text_data["link"],
                            "preview": enrichment.get("preview", "")
                        })
                    elif key == "theses":
                        title_data = clean_cell(parts[0])
                        uni = parts[1].strip()
                        advisors = parts[2].strip()
                        year = parts[3].strip()
                        summary_data = clean_cell(parts[4]) if len(parts) > 4 else {"link": None}
                        full_text_data = clean_cell(parts[5]) if len(parts) > 5 else {"link": None}
                        enrichment = enrich_from_summary_file(summary_data["link"])
                        data["theses"].append({
                            "title": title_data["text"],
                            "university": uni,
                            "advisors": advisors,
                            "year": year,
                            "summary_link": summary_data["link"],
                            "full_text_link": full_text_data["link"],
                            "preview": enrichment.get("preview", "")
                        })
                    elif key == "grants":
                        title_data = clean_cell(parts[0])
                        date = parts[1].strip()
                        status = parts[2].strip()
                        summary_data = clean_cell(parts[3]) if len(parts) > 3 else {"link": None}
                        full_text_data = clean_cell(parts[4]) if len(parts) > 4 else {"link": None}
                        enrichment = enrich_from_summary_file(summary_data["link"])
                        data["grants"].append({
                            "title": title_data["text"],
                            "date": date,
                            "status": status,
                            "summary_link": summary_data["link"],
                            "full_text_link": full_text_data["link"],
                            "preview": enrichment.get("preview", "")
                        })
                    else:
                        title_data = clean_cell(parts[0])
                        authors_or_date = parts[1].strip()
                        summary_data = clean_cell(parts[2]) if len(parts) > 2 else {"link": None}
                        full_text_data = clean_cell(parts[3]) if len(parts) > 3 else {"link": None}
                        enrichment = enrich_from_summary_file(summary_data["link"])
                        data[key].append({
                            "title": title_data["text"],
                            "date_or_authors": authors_or_date,
                            "summary_link": summary_data["link"],
                            "full_text_link": full_text_data["link"],
                            "preview": enrichment.get("preview", "")
                        })

# Parse entities
entities_match = re.search(r"## 👥 Entities Catalog\s*(.*?)(?=## 🧠 Concepts Catalog)", content, re.S)
if entities_match:
    entities_section = entities_match.group(1)
    
    # Researchers
    res_match = re.search(r"### 👥 Researchers \(People\)\s*(.*?)(?=### 🏢|$)", entities_section, re.S)
    if res_match:
        items = re.findall(r"-\s+\*\*\[(.*?)\]\((.*?)\)\*\*\s*\((.*?)\)\s+—\s+\*(.*?)\*", res_match.group(1))
        for name, link, stats, desc in items:
            data["entities"]["researchers"].append({
                "name": name,
                "link": link,
                "stats": stats,
                "description": desc
            })
            
    # Institutions
    inst_match = re.search(r"### 🏢 Institutions & Affiliations\s*(.*?)(?=### 📊|$)", entities_section, re.S)
    if inst_match:
        items = re.findall(r"-\s+\*\*\[(.*?)\]\((.*?)\)\*\*\s*\((.*?)\)\s+—\s+\*(.*?)\*", inst_match.group(1))
        for name, link, stats, desc in items:
            data["entities"]["institutions"].append({
                "name": name,
                "link": link,
                "stats": stats,
                "description": desc
            })
            
    # Projects
    proj_match = re.search(r"### 📊 Grants & Projects\s*(.*?)(?=$)", entities_section, re.S)
    if proj_match:
        items = re.findall(r"-\s+\*\*\[(.*?)\]\((.*?)\)\*\*\s*\((.*?)\)\s+—\s+\*(.*?)\*", proj_match.group(1))
        for name, link, stats, desc in items:
            data["entities"]["projects"].append({
                "name": name,
                "link": link,
                "stats": stats,
                "description": desc
            })

# Parse concepts
concepts_match = re.search(r"## 🧠 Concepts Catalog\s*(.*)", content, re.S)
if concepts_match:
    concepts_section = concepts_match.group(1)
    
    # Chemistry Concepts
    chem_match = re.search(r"### ⚗️ Chemistry Concepts\s*(.*?)(?=### 💻|$)", concepts_section, re.S)
    if chem_match:
        items = re.findall(r"-\s+\*\*\[(.*?)\]\((.*?)\)\*\*\s*\((.*?)\)\s+—\s+\*(.*?)\*", chem_match.group(1))
        for name, link, stats, desc in items:
            data["concepts"]["chemistry"].append({
                "name": name,
                "link": link,
                "stats": stats,
                "description": desc
            })
            
    # Platforms
    plat_match = re.search(r"### 💻 Diagnostic & Hardware Platforms\s*(.*?)(?=### 🏥|$)", concepts_section, re.S)
    if plat_match:
        items = re.findall(r"-\s+\*\*\[(.*?)\]\((.*?)\)\*\*\s*\((.*?)\)\s+—\s+\*(.*?)\*", plat_match.group(1))
        for name, link, stats, desc in items:
            data["concepts"]["platforms"].append({
                "name": name,
                "link": link,
                "stats": stats,
                "description": desc
            })
            
    # Clinical areas
    clin_match = re.search(r"### 🏥 Clinical & Disease Areas\s*(.*?)(?=$)", concepts_section, re.S)
    if clin_match:
        items = re.findall(r"-\s+\*\*\[(.*?)\]\((.*?)\)\*\*\s*\((.*?)\)\s+—\s+\*(.*?)\*", clin_match.group(1))
        for name, link, stats, desc in items:
            data["concepts"]["clinical_areas"].append({
                "name": name,
                "link": link,
                "stats": stats,
                "description": desc
            })

# Output paths
out_json_path = os.path.join(wiki_dir, "wiki_data.json")
with open(out_json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Also write wiki_data.js for direct CORS-free loading
out_js_path = os.path.join(base_dir, "wiki_data.js")
with open(out_js_path, "w", encoding="utf-8") as f:
    f.write("window.WIKI_DATA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n")

print(f"✅ Generated {out_json_path}")
print(f"✅ Generated {out_js_path}")
print(f"📊 Summary: {len(data['articles'])} articles, {len(data['patents'])} patents, {len(data['theses'])} theses, {len(data['grants'])} grants.")
print(f"👥 Entities: {len(data['entities']['researchers'])} researchers, {len(data['entities']['institutions'])} institutions, {len(data['entities']['projects'])} projects.")
print(f"🧠 Concepts: {len(data['concepts']['chemistry'])} chemistry, {len(data['concepts']['platforms'])} platforms, {len(data['concepts']['clinical_areas'])} clinical areas.")
