import fitz  # PyMuPDF
import sys
import os
import json
import glob
import hashlib

def get_image_hash(image_bytes):
    """Returns MD5 hash of image bytes."""
    return hashlib.md5(image_bytes).hexdigest()

def analyze_pdf_images(doc):
    """
    Analyzes all images in the PDF to find frequent ones (backgrounds/logos).
    Returns a set of hashes to ignore.
    """
    image_counts = {}
    total_pages = len(doc)
    
    print("Analyzing image frequencies...")
    for page in doc:
        image_list = page.get_images(full=True)
        for img in image_list:
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                img_hash = get_image_hash(base_image["image"])
                image_counts[img_hash] = image_counts.get(img_hash, 0) + 1
            except:
                continue
                
    # Threshold: If an image appears on more than 10% of pages (or > 3 pages if small doc), it's likely background/structure
    ignore_hashes = set()
    threshold = max(3, total_pages * 0.1)
    
    for img_hash, count in image_counts.items():
        if count > threshold:
            ignore_hashes.add(img_hash)
            
    print(f"Found {len(ignore_hashes)} background/repeated images to ignore.")
    return ignore_hashes

def extract_data_from_file(pdf_path, output_dir, images_dir, start_id=0):
    """
    Extracts images and text from a single PDF.
    Returns a list of cards and the next available ID.
    """
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF {pdf_path}: {e}")
        return [], start_id

    # Pass 1: Identify background images
    ignore_hashes = analyze_pdf_images(doc)

    cards = []
    print(f"Processing {pdf_path}...")
    
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    safe_base_name = "".join([c if c.isalnum() else "_" for c in base_name])

    for i, page in enumerate(doc):
        current_id = start_id + i
        
        # 1. Extract Image
        image_list = page.get_images(full=True)
        image_path = ""
        
        if image_list:
            page_area = page.rect.width * page.rect.height
            best_image = None
            max_area = 0
            
            for img in image_list:
                xref = img[0]
                
                # Check if it's a known background
                try:
                    base_image = doc.extract_image(xref)
                    img_hash = get_image_hash(base_image["image"])
                    if img_hash in ignore_hashes:
                        continue
                except:
                    continue

                # Get image rects on the page
                rects = page.get_image_rects(xref)
                if not rects:
                    continue
                
                # Use the first occurrence
                rect = rects[0]
                area = rect.width * rect.height
                
                # Heuristic: Ignore if it covers > 95% of page (full slide background)
                if area > (page_area * 0.95):
                    continue
                
                # Pick the largest remaining image
                if area > max_area:
                    max_area = area
                    best_image = img
            
            if best_image:
                xref = best_image[0]
                try:
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    image_filename = f"{safe_base_name}_p{i}.{image_ext}"
                    image_full_path = os.path.join(images_dir, image_filename)
                    
                    with open(image_full_path, "wb") as f:
                        f.write(image_bytes)
                    
                    
                    # Use relative path for GitHub Pages compatibility
                    image_path = f"./cards/{image_filename}"
                except Exception as e:
                    print(f"Error extracting image on page {i} of {base_name}: {e}")

        # 2. Extract Text
        blocks = page.get_text("dict")["blocks"]
        text_blocks = [b for b in blocks if b["type"] == 0]

        title = ""
        description = ""
        
        if text_blocks:
            block_infos = []
            for b_idx, block in enumerate(text_blocks):
                block_text = ""
                block_max_size = 0
                for line in block["lines"]:
                    for span in line["spans"]:
                        if span["size"] > block_max_size:
                            block_max_size = span["size"]
                        block_text += span["text"] + " "
                
                if block_text.strip():
                    block_infos.append({
                        "text": block_text.strip(),
                        "size": block_max_size
                    })
            
            block_infos.sort(key=lambda x: x["size"], reverse=True)
            
            if block_infos:
                title = block_infos[0]["text"]
                description_parts = [b["text"] for b in block_infos[1:]]
                description = "\n".join(description_parts)

        if title or image_path:
            cards.append({
                "id": current_id,
                "title": title,
                "description": description,
                "imagePath": image_path,
                "source": base_name
            })

    return cards, start_id + len(doc)

def main():
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_data.py <pdf_file_or_directory>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    
    # Output directories
    output_dir = os.path.join("docs", "src", "data")
    images_dir = os.path.join("docs", "public", "cards")
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(images_dir, exist_ok=True)

    all_cards = []
    next_id = 0

    if os.path.isdir(input_path):
        pdf_files = glob.glob(os.path.join(input_path, "*.pdf"))
        print(f"Found {len(pdf_files)} PDF files in {input_path}")
        for pdf_file in pdf_files:
            cards, next_id = extract_data_from_file(pdf_file, output_dir, images_dir, next_id)
            all_cards.extend(cards)
    elif os.path.isfile(input_path) and input_path.lower().endswith('.pdf'):
        cards, next_id = extract_data_from_file(input_path, output_dir, images_dir, next_id)
        all_cards.extend(cards)
    else:
        print("Invalid input. Please provide a PDF file or a directory containing PDFs.")
        sys.exit(1)

    json_path = os.path.join(output_dir, "cards.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_cards, f, indent=2, ensure_ascii=False)
        
    print(f"Total processed: {len(all_cards)} cards.")
    print(f"Data saved to {json_path}")

if __name__ == "__main__":
    main()
