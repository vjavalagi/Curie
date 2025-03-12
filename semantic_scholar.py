import os
import json
import requests
import urllib3
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv, find_dotenv
from flask_cors import CORS
from gpt import get_foundational_papers

# Load environment variables from .env file
load_dotenv(find_dotenv())

# Create your Flask app once
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up the path for storing PDFs
pdf_output_path = "pdfs/"
os.makedirs(pdf_output_path, exist_ok=True)

SEMANTIC_SCHOLAR_API_KEY = os.getenv('SEMANTICAPIKEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

def get_pdf(download_url, title):
    """Download a PDF from the given URL and save it using the paper's title."""
    http = urllib3.PoolManager()
    print(f"Attempting to download PDF from: {download_url}")
    response = http.request(
            'GET',
            download_url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'application/pdf',
                'Referer': 'https://www.semanticscholar.org/'  # Simulating a request from Semantic Scholar
        }
    )

    if response.status != 200:
        print("Failed to download PDF:", response.status)
        return None

    filename = f"pdfs/{title}.pdf"

    with open(filename, 'wb') as file:
        file.write(response.data)

    print("Completed download:", filename)
    return filename

def sortCriteria(a,b):
    pass

'''
Alternative URLS

Bulk Search, returns as many as possible https://api.semanticscholar.org/graph/v1/paper/search/bulk

Relevance Search, returns the most relevant papers https://api.semanticscholar.org/graph/v1/paper/search
'''
def search_semantic_scholar(query_params, only_open_access=False):
    url = "https://api.semanticscholar.org/graph/v1/paper/search/"
    headers = {"x-api-key": SEMANTIC_SCHOLAR_API_KEY}
    
    response = requests.get(url, params=query_params, headers=headers)
    print("Response status code:", response.status_code)
    
    try:
        response_json = response.json()
    except Exception as e:
        print("Error parsing JSON:", e)
        return {"error": "Invalid response from API"}
    
    data = response_json.get('data', [])
    if only_open_access:
        data = [d for d in data if 'openAccessPdf' in d and d['openAccessPdf']]
    
    return data


@app.route('/api/timeline', methods=['GET'])
def api_timeline():
    Subject = request.args.get('subject', 'generative ai')
    timeline = get_foundational_papers(Subject)
    print("HERE IS " , timeline)
    return jsonify(timeline)

@app.route('/api/search', methods=['GET'])
def api_search():
    """
    Example: GET /api/search?query=generative+ai&year=2020-&only_open_access=true
    """
    query = request.args.get('query', 'generative ai')
    year = request.args.get('year', '2005-')
    fields = request.args.get('fields', 'title,url,citationCount,publicationTypes,publicationDate,openAccessPdf')
    only_open_access = request.args.get('only_open_access', 'true').lower() == 'true'
    
    query_params = {
        "query": query,
        "fields": fields,
        "year": year
    }
    
    results = search_semantic_scholar(query_params, only_open_access)
    if results and isinstance(results, list):
        print(results[0])
    
    return jsonify(results)

@app.route('/api/download-pdf', methods=['POST'])
def api_download_pdf():
    """
    Expects JSON body with 'url' and 'title', e.g.,
    { "url": "https://example.com/path/to/file.pdf", "title": "Paper Title" }
    """
    data = request.get_json()
    download_url = data.get('url')
    title = data.get('title', 'untitled')  # Default title if not provided

    if not download_url:
        return jsonify({"error": "No URL provided"}), 400

    # Sanitize title for filename
    safe_title = "".join(c if c.isalnum() or c in (" ", "_", "-") else "_" for c in title).strip()
    safe_title = safe_title.replace(" ", "_")  # Replace spaces with underscores

    filename = get_pdf(download_url, safe_title)
    
    return jsonify({"message": "PDF downloaded", "filename": title})
@app.route('/api/list-pdfs', methods=['GET'])
def list_pdfs():
    """List all saved PDFs in the pdfs directory."""
    pdf_directory = "pdfs/"
    try:
        pdf_files = [
            {"title": f[:-4], "filename": f}  # Remove ".pdf" from title
            for f in os.listdir(pdf_directory) if f.endswith(".pdf")
        ]
        return jsonify(pdf_files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pdfs/<filename>', methods=['GET'])
def serve_pdf(filename):
    """Serve the PDFs so they can be accessed via frontend."""
    return send_from_directory("pdfs", filename)


if __name__ == '__main__':
    # Run on port 5001
    app.run(debug=True, port=5001)
