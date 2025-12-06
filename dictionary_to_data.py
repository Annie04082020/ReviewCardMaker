import os
import fitz  # PyMuPDF
import json
import re

# Configuration
PDF_DIR = r"d:\ReviewCardMaker\dictionary"
OUTPUT_DIR = r"d:\ReviewCardMaker\docs\src\data"
IMAGES_DIR = r"d:\ReviewCardMaker\docs\public\dictionary_images"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "dictionary.json")

def extract_text_from_pdfs():
    dictionary_data = []

    if not os.path.exists(PDF_DIR):
        print(f"Error: Directory not found: {PDF_DIR}")
        return

    # Ensure output directories exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(IMAGES_DIR, exist_ok=True)

    print(f"Scanning {PDF_DIR}...")
    
    files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith(".pdf")]
    
    for filename in files:
        filepath = os.path.join(PDF_DIR, filename)
        print(f"Processing: {filename}")
        
        try:
            doc = fitz.open(filepath)
            pdf_content = []
            
            # Safe filename for images
            safe_base_name = "".join([c if c.isalnum() else "_" for c in filename.replace(".pdf", "")])

            for page_num, page in enumerate(doc):
                # 1. Extract Text
                text = page.get_text("text")
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                
                # Title heuristic: First non-empty line
                title = lines[0] if lines else f"Page {page_num + 1}"

                # 2. Render Page as Image
                # matrix=fitz.Matrix(1, 1) for distinct quality, maybe 1.5 for better
                pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5)) 
                image_filename = f"{safe_base_name}_p{page_num}.png"
                image_full_path = os.path.join(IMAGES_DIR, image_filename)
                pix.save(image_full_path)
                
                # Relative path for frontend
                image_path = f"./dictionary_images/{image_filename}"

                if lines: # Only add pages with text content? User might want diagrams too. 
                    # Let's add all pages but note if empty text.
                    pass

                pdf_content.append({
                    "page": page_num + 1,
                    "title": title,
                    "content": lines,
                    "imagePath": image_path,
                    "raw_text": text
                })
            
            dictionary_data.append({
                "source": filename.replace(".pdf", ""),
                "pages": pdf_content
            })
            
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(dictionary_data, f, ensure_ascii=False, indent=2)
        
    print(f"Success! Extracted data from {len(files)} files to {OUTPUT_FILE}")

if __name__ == "__main__":
    extract_text_from_pdfs()
