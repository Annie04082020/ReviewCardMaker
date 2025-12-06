import os
import fitz  # PyMuPDF
import json
import re

# Configuration
PDF_DIR = r"d:\ReviewCardMaker\dictionary"
OUTPUT_FILE = r"d:\ReviewCardMaker\docs\src\data\dictionary.json"

def extract_text_from_pdfs():
    dictionary_data = []

    if not os.path.exists(PDF_DIR):
        print(f"Error: Directory not found: {PDF_DIR}")
        return

    print(f"Scanning {PDF_DIR}...")
    
    files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith(".pdf")]
    
    for filename in files:
        filepath = os.path.join(PDF_DIR, filename)
        print(f"Processing: {filename}")
        
        try:
            doc = fitz.open(filepath)
            pdf_content = []
            
            for page_num, page in enumerate(doc):
                text = page.get_text("text")
                if text.strip():
                    # Basic cleaning
                    lines = [line.strip() for line in text.split('\n') if line.strip()]
                    pdf_content.append({
                        "page": page_num + 1,
                        "content": lines,
                        "raw_text": text
                    })
            
            dictionary_data.append({
                "source": filename.replace(".pdf", ""),
                "pages": pdf_content
            })
            
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(dictionary_data, f, ensure_ascii=False, indent=2)
        
    print(f"Success! Extracted data from {len(files)} files to {OUTPUT_FILE}")

if __name__ == "__main__":
    extract_text_from_pdfs()
