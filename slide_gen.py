import os
import subprocess
import json
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor
import shutil

# Create 'slides' directory if it doesn't exist
output_dir = "slides"
os.makedirs(output_dir, exist_ok=True)

# Sample JSON Data
json_data = '''{
    "title": "Understanding Deep Learning",
    "authors": ["John Doe", "Jane Smith"],
    "summary": "This paper explores deep learning models and their applications in modern AI.",
    "abstract": "Deep learning has revolutionized AI, enabling complex pattern recognition and decision-making...",
    "keywords": ["Deep Learning", "Artificial Intelligence", "Neural Networks"]
}'''

# Load JSON
data = json.loads(json_data)

# LaTeX Template
latex_template = f"""\\documentclass{{beamer}}
\\usetheme{{CambridgeUS}}

\\title{{{data["title"]}}}
\\author{{{", ".join(data["authors"])}}}
\\date{{\\today}}

\\begin{{document}}

\\frame{{\\titlepage}}

\\begin{{frame}}{{Summary}}
    {data["summary"]}
\\end{{frame}}

\\begin{{frame}}{{Abstract}}
    {data["abstract"]}
\\end{{frame}}

\\begin{{frame}}{{Keywords}}
    {", ".join(data["keywords"])}
\\end{{frame}}

\\end{{document}}
"""

# Save to LaTeX file in 'slides' directory
tex_filename = os.path.join(output_dir, "Academic_Presentation.tex")
with open(tex_filename, "w") as tex_file:
    tex_file.write(latex_template)

print(f"LaTeX file '{tex_filename}' created successfully!")

# Change working directory to 'slides'
os.chdir(output_dir)

# Run pdflatex to generate PDF and other files in 'slides' directory
subprocess.run(["pdflatex", "Academic_Presentation.tex"])

# Move any auxiliary files (like .snm, .log, etc.) to the slides directory if not already
for file in os.listdir("."):
    if file.endswith((".aux", ".log", ".snm", ".toc", ".out")):
        shutil.move(file, os.path.join(output_dir, file))

# Optionally: If using pdf2pptx (uncomment if pdf2pptx is available)
# try:
#     from pdf2pptx import convert
#     pptx_filename = os.path.join(output_dir, "Academic_Presentation.pptx")
#     convert("Academic_Presentation.pdf", pptx_filename)
#     print(f"PowerPoint file '{pptx_filename}' created successfully!")
# except ImportError:
#     print("Install pdf2pptx with 'pip install pdf2pptx' to enable PDF-to-PPT conversion.")
