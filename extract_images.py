import os
import io
import pymupdf  # Use pymupdf without explicitly calling fitz
from PIL import Image

# Input PDF file
pdf_path = "science.pdf"
output_folder = "extracted_images"
os.makedirs(output_folder, exist_ok=True)

# Open the PDF
doc = pymupdf.open(pdf_path)  # Equivalent to fitz.open()

image_count = 0

for page_num in range(len(doc)):
    page = doc[page_num]
    images = page.get_images(full=True)

    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        img_ext = base_image["ext"]
        image = Image.open(io.BytesIO(image_bytes))

        # Attempt to find a figure title (text near the image)
        figure_title = None
        for text_block in page.get_text("blocks"):
            text_x, text_y, text_w, text_h, text = text_block[:5]
            img_x, img_y, img_w, img_h = img[1:5]

            # If text is below or above the image, assume it's a caption
            if img_y < text_y < img_y + img_h + 50:  
                figure_title = text.strip()
                break  # Take the first relevant text as the title

        # Generate a filename
        filename = f"figure_{image_count}.{img_ext}"
        if figure_title:
            safe_title = figure_title.replace(" ", "_").replace("/", "_")  # Avoid invalid characters
            filename = f"figure_{image_count}_{safe_title}.{img_ext}"

        # Save the image
        image_path = os.path.join(output_folder, filename)
        image.save(image_path)
        print(f"Saved {filename}")

        image_count += 1

print(f"Extracted {image_count} images.")
