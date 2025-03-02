import os
import json
import requests
import urllib3
from flask import Flask, request, jsonify
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

def get_pdf(download_url):
    """Download a PDF from the given URL and save it locally."""
    http = urllib3.PoolManager()
    print(f"Attempting to download PDF from: {download_url}")
    response = http.request('GET', download_url)
    print("Status:", response.status)
    filename = pdf_output_path + str(hash(download_url)) + ".pdf"
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
    Expects JSON body with a key 'url', e.g.,
    { "url": "https://example.com/path/to/file.pdf" }
    """
    data = request.get_json()
    download_url = data.get('url')
    if not download_url:
        return jsonify({"error": "No URL provided"}), 400
    
    filename = get_pdf(download_url)
    return jsonify({"message": "PDF downloaded", "filename": filename})

if __name__ == '__main__':
    # Run on port 5001
    app.run(debug=True, port=5001)
