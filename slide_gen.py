import os
import subprocess
import json
import shutil
import pymupdf
from PIL import Image
import io
from summaries.joined_summary import extract_text_pymu, summarize_sections

"""
class Summary(BaseModel):
    introduction: str
    methods: str
    results: str
    discussion: str
    conclusion: str
"""
# # Get the base directory where this script is located (Curie folder)
# base_dir = os.path.dirname(os.path.abspath(__file__))

# # Define paths relative to Curie folder
# slides_dir = os.path.join(base_dir, "slides")
# summaries_file = os.path.join(base_dir, "summaries", "summaries.json")
# pdf_path = os.path.join(base_dir, "pdfs", "An Optimal Control View of Adversarial Machine Learning.pdf")
# output_folder = os.path.join(slides_dir, "extracted_images")  # Move images inside slides folder


# os.makedirs(slides_dir, exist_ok=True)
# os.makedirs(output_folder, exist_ok=True)

# # Load JSON data from summaries.json
# if not os.path.exists(summaries_file):
#     print(f"Error: The file '{summaries_file}' was not found.")
#     exit(1)

# with open(summaries_file, "r") as json_file:
#     data = json.load(json_file)

# # Extract images from PDF
# doc = pymupdf.open(pdf_path)
# image_files = []

# for page_num in range(len(doc)):
#     page = doc[page_num]
#     images = page.get_images(full=True)

#     for img_index, img in enumerate(images):
#         xref = img[0]
#         base_image = doc.extract_image(xref)
#         image_bytes = base_image["image"]
#         img_ext = base_image["ext"]

#         # Convert image to PNG for LaTeX compatibility
#         image = Image.open(io.BytesIO(image_bytes))
#         filename = f"figure_{page_num + 1}_{img_index + 1}.png"  # Use PNG format
#         image_path = os.path.join(output_folder, filename)
#         image.save(image_path, format="PNG")
#         image_files.append(filename)

# print(f"Extracted {len(image_files)} images.")

# # LaTeX Template
# latex_template = f"""\\documentclass{{beamer}}
# \\usetheme{{Dresden}}

# \\title{{{data["title"]}}}
# \\author{{{", ".join(data["authors"])}}}
# \\date{{\\today}}

# \\begin{{document}}

# \\frame{{\\titlepage}}

# \\begin{{frame}}{{Abstract}}
#     {data["sections"]["Abstract"]["summary"]}
# \\end{{frame}}

# \\begin{{frame}}{{Introduction}}
#     {data["sections"]["Introduction"]["summary"]}
# \\end{{frame}}

# \\begin{{frame}}{{Related Work}}
#     {data["sections"]["Related Work"]["summary"]}
# \\end{{frame}}

# \\begin{{frame}}{{Approach}}
#     {data["sections"]["Approach"]["summary"]}
# \\end{{frame}}

# \\begin{{frame}}{{Results and Discussions}}
#     {data["sections"]["Results and Discussions"]["summary"]}
# \\end{{frame}}

# \\begin{{frame}}{{Conclusion}}
#     {data["sections"]["Conclusion"]["summary"]}
# \\end{{frame}}
# """

# # Add extracted images as slides
# for img in image_files:
#     latex_template += f"""
# \\begin{{frame}}{{Extracted Figure}}
#     \\centering
#     \\begin{{figure}}
#         \\includegraphics[width=0.8\\textwidth]{{extracted_images/{img}}}  % Relative path inside slides/
#     \\end{{figure}}
# \\end{{frame}}
# """

# latex_template += "\n\\end{document}"

# # Save LaTeX file in 'slides' directory
# tex_filename = os.path.join(slides_dir, "Academic_Presentation.tex")
# with open(tex_filename, "w") as tex_file:
#     tex_file.write(latex_template)

# print(f"LaTeX file '{tex_filename}' created successfully!")

# # Compile LaTeX file into PDF
# subprocess.run(["pdflatex", "-output-directory", slides_dir, tex_filename])

# # Move auxiliary files (like .snm, .log, etc.) into the slides directory
# for file in os.listdir(slides_dir):
#     if file.endswith((".aux", ".log", ".snm", ".toc", ".out")):
#         shutil.move(os.path.join(slides_dir, file), os.path.join(slides_dir, file))

# print("Presentation PDF generated successfully!")
def generate_presentation(pdf_path):
    # Get the base directory where this script is located (Curie folder)
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Define paths relative to Curie folder
    slides_dir = os.path.join(base_dir, "slides")
    # summaries_file = os.path.join(base_dir, "summaries", "summaries.json")
    output_folder = os.path.join(slides_dir, "extracted_images")  # Move images inside slides folder

    os.makedirs(slides_dir, exist_ok=True)
    os.makedirs(output_folder, exist_ok=True)

    text = extract_text_pymu(pdf_path)

    data = summarize_sections(text)

    # Extract images from PDF
    doc = pymupdf.open(pdf_path)
    image_files = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        images = page.get_images(full=True)

        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            img_ext = base_image["ext"]

            # Convert image to PNG for LaTeX compatibility
            image = Image.open(io.BytesIO(image_bytes))
            filename = f"figure_{page_num + 1}_{img_index + 1}.png"  # Use PNG format
            image_path = os.path.join(output_folder, filename)
            image.save(image_path, format="PNG")
            image_files.append(filename)

    print(f"Extracted {len(image_files)} images.")

    # LaTeX Template
    latex_template = f"""\\documentclass{{beamer}}
\\usetheme{{Dresden}}

\\title{{{data["title"]}}}
\\author{{{data["authors"]}}}
\\date{{\\today}}

\\begin{{document}}

\\frame{{\\titlepage}}

\\begin{{frame}}{{Introduction}}
    {data["introduction"]}
\\end{{frame}}

\\begin{{frame}}{{Methods}}
    {data["methods"]}
\\end{{frame}}

\\begin{{frame}}{{Results}}
    {data["results"]}
\\end{{frame}}

\\begin{{frame}}{{Discussion}}
    {data["discussion"]}
\\end{{frame}}

\\begin{{frame}}{{Conclusion}}
    {data["conclusion"]}
\\end{{frame}}
"""

    # Add extracted images as slides
    for img in image_files:
        latex_template += f"""
\\begin{{frame}}{{Extracted Figure}}
    \\centering
    \\begin{{figure}}
        \\includegraphics[width=0.8\\textwidth]{{extracted_images/{img}}}  % Relative path inside slides/
    \\end{{figure}}
\\end{{frame}}
"""

    latex_template += "\n\\end{document}"

    # Save LaTeX file in 'slides' directory
    tex_filename = os.path.join(slides_dir, "Academic_Presentation.tex")
    with open(tex_filename, "w") as tex_file:
        tex_file.write(latex_template)

    print(f"LaTeX file '{tex_filename}' created successfully!")

    # Compile LaTeX file into PDF
    subprocess.run(["pdflatex", "-output-directory", slides_dir, tex_filename])

    # Move auxiliary files (like .snm, .log, etc.) into the slides directory
    for file in os.listdir(slides_dir):
        if file.endswith((".aux", ".log", ".snm", ".toc", ".out")):
            shutil.move(os.path.join(slides_dir, file), os.path.join(slides_dir, file))

    print("Presentation PDF generated successfully!")
#generate_presentation("pdfs/Pattern Formation for Asynchronous Robots without Agreement in Chirality.pdf")
