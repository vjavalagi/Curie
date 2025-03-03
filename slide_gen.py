import os
import subprocess
import json
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor
import shutil

# Get the base directory where this script is located (Curie folder)
base_dir = os.path.dirname(os.path.abspath(__file__))

# Define paths relative to Curie folder
slides_dir = os.path.join(base_dir, "slides")
summaries_file = os.path.join(base_dir, "summaries", "summaries.json")

# Ensure 'slides' directory exists
os.makedirs(slides_dir, exist_ok=True)

# Check if summaries.json exists
if not os.path.exists(summaries_file):
    print(f"Error: The file '{summaries_file}' was not found.")
    exit(1)

# Load JSON data from summaries.json
with open(summaries_file, "r") as json_file:
    data = json.load(json_file)

# choose a template- look at options on Latex website
# https://mpetroff.net/files/beamer-theme-matrix/

# LaTeX Template
latex_template = f"""\\documentclass{{beamer}}
\\usetheme{{Dresden}}

\\title{{{data["title"]}}}
\\author{{{", ".join(data["authors"])}}}
\\date{{\\today}}

\\begin{{document}}

\\frame{{\\titlepage}}

\\begin{{frame}}{{Abstract}}
    {data["sections"]["Abstract"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Introduction}}
    {data["sections"]["Introduction"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Related Work}}
    {data["sections"]["Related Work"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Approach}}
    {data["sections"]["Approach"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Model}}
    {data["sections"]["Model"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Training}}
    {data["sections"]["Training"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Inference}}
    {data["sections"]["Inference"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Dataset}}
    {data["sections"]["Dataset"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Experiments}}
    {data["sections"]["Experiments"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Results and Discussions}}
    {data["sections"]["Results and Discussions"]["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Conclusion}}
    {data["sections"]["Conclusion"]["summary"]}
\\end{{frame}}

\\end{{document}}
"""

# Save LaTeX file in 'slides' directory
tex_filename = os.path.join(slides_dir, "Academic_Presentation.tex")
with open(tex_filename, "w") as tex_file:
    tex_file.write(latex_template)

print(f"LaTeX file '{tex_filename}' created successfully!")

# Run pdflatex to generate PDF inside 'slides' directory
subprocess.run(["pdflatex", "-output-directory", slides_dir, tex_filename])

# Move auxiliary files (like .snm, .log, etc.) into the slides directory
for file in os.listdir(slides_dir):
    if file.endswith((".aux", ".log", ".snm", ".toc", ".out")):
        shutil.move(os.path.join(slides_dir, file), os.path.join(slides_dir, file))

# Optionally: Convert PDF to PowerPoint (if pdf2pptx is installed)
# try:
#     from pdf2pptx import convert
#     pptx_filename = os.path.join(slides_dir, "Academic_Presentation.pptx")
#     convert(os.path.join(slides_dir, "Academic_Presentation.pdf"), pptx_filename)
#     print(f"PowerPoint file '{pptx_filename}' created successfully!")
# except ImportError:
#     print("Install pdf2pptx with 'pip install pdf2pptx' to enable PDF-to-PPT conversion.")
