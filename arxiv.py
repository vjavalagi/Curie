import os
import feedparser
import requests
import urllib3
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv, find_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv(find_dotenv())

# Flask App
app = Flask(__name__)
CORS(app)

# PDF Storage Path
pdf_output_path = "pdfs/"
os.makedirs(pdf_output_path, exist_ok=True)

# Base URL for arXiv API
ARXIV_API_URL = "http://export.arxiv.org/api/query?"

def get_pdf(download_url, title):
    """Download a PDF from arXiv and save it using the paper's title."""
    http = urllib3.PoolManager()
    print(f"Attempting to download PDF from: {download_url}")

    try:
        response = http.request('GET', download_url, headers={'User-Agent': 'Mozilla/5.0'})
        print(f"Response Status: {response.status}")
    except Exception as e:
        print(f"Error making request: {e}")
        return None

    if response.status != 200:
        print(f"Failed to download PDF, HTTP Status: {response.status}")
        return None

    # Ensure filename is safe
    filename = f"pdfs/{title}.pdf"

    try:
        with open(filename, 'wb') as file:
            file.write(response.data)
        print(f"File successfully written: {filename}")
    except Exception as e:
        print(f"Error writing file: {e}")
        return None

    return filename


def search_arxiv(query, max_results=10):
    """Search arXiv for papers matching the query."""
    query_params = f"search_query=all:{query}&start=0&max_results={max_results}"
    url = ARXIV_API_URL + query_params
    feed = feedparser.parse(url)

    results = []
    for entry in feed.entries:
        arxiv_id = entry.id.split('/')[-1]
        pdf_link = f"https://arxiv.org/pdf/{arxiv_id}.pdf"

        paper_info = {
            "title": entry.title,
            "authors": [author.name for author in entry.authors],
            "published": entry.published,
            "summary": entry.summary,
            "arxiv_id": arxiv_id,
            "pdf_url": pdf_link,
            "link": entry.link
        }
        results.append(paper_info)

    return results

@app.route('/api/search', methods=['GET'])
def api_search():
    """
    Example: GET /api/search?query=generative+ai&max_results=5
    """
    query = request.args.get('query', 'generative ai')
    max_results = int(request.args.get('max_results', 10))

    results = search_arxiv(query, max_results)
    return jsonify(results)

@app.route('/api/download-pdf', methods=['POST'])
def api_download_pdf():
    """
    Expects JSON body with 'pdf_url' and 'title', e.g.,
    { "pdf_url": "https://arxiv.org/pdf/1234.56789.pdf", "title": "Paper Title" }
    """
    data = request.get_json()
    print("Received request:", data)  # Log incoming request

    download_url = data.get('pdf_url')
    title = data.get('title', 'untitled')

    if not download_url:
        print("Error: No PDF URL provided")
        return jsonify({"error": "No PDF URL provided"}), 400

    print(f"Downloading PDF from: {download_url} with title: {title}")

    filename = get_pdf(download_url, title)

    if filename:
        print(f"PDF successfully saved as: {filename}")
        return jsonify({"message": "PDF downloaded", "filename": filename})
    else:
        print("Error: Failed to save PDF")
        return jsonify({"error": "Failed to download PDF"}), 500


@app.route('/api/list-pdfs', methods=['GET'])
def list_pdfs():
    """List all saved PDFs in the pdfs directory."""
    try:
        pdf_files = [
            {"title": f[:-4], "filename": f}  # Remove ".pdf" from title
            for f in os.listdir(pdf_output_path) if f.endswith(".pdf")
        ]
        return jsonify(pdf_files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pdfs/<filename>', methods=['GET'])
def serve_pdf(filename):
    """Serve the PDFs so they can be accessed via frontend."""
    return send_from_directory(pdf_output_path, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
