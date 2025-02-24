import os
import json
import requests
import urllib3
from flask import Flask, request, jsonify
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env file
load_dotenv(find_dotenv())

# Set up the path for storing PDFs
pdf_output_path = "pdfs/"
os.makedirs(pdf_output_path, exist_ok=True)


SEMANTIC_SCHOLAR_API_KEY = os.getenv('SEMANTICAPIKEY')

def get_pdf(download_url):
    """download a PDF from the given URL and save it locally"""
    http = urllib3.PoolManager()
    print(f"Attempting to download PDF from: {download_url}")
    response = http.request('GET', download_url)
    print("status:", response.status)
    filename = pdf_output_path + str(hash(download_url)) + ".pdf"
    with open(filename, 'wb') as file:
        file.write(response.data)
    print("Completed download:", filename)
    return filename

def search_semantic_scholar(query_params, only_open_access=False):
    url = "https://api.semanticscholar.org/graph/v1/paper/search/bulk"
    headers = {"x-api-key": SEMANTIC_SCHOLAR_API_KEY}
    
    response = requests.get(url, params=query_params, headers=headers)
    print("Response status code:", response.status_code)
    
    try:
        response_json = response.json()
    except Exception as e:
        print("Error parsing JSON:", e)
        return {"error": "Invalid response from API"}
    
    print("aspi response:", response_json)
    
    data = response_json.get('data', [])
    if only_open_access:
        data = [d for d in data if 'openAccessPdf' in d and d['openAccessPdf']]
    return data

app = Flask(__name__)

@app.route('/api/search', methods=['GET'])
def api_search():
    """
    Example: GET /api/search?query=generative+ai&year=2020-&only_open_access=true
    """
    # get parameters from the query string, the default values are generative ai, 2020- and title,url,publicationTypes,publicationDate,open
    query = request.args.get('query', 'generative ai')
    year = request.args.get('year', '2020-')
    fields = request.args.get('fields', 'title,url,publicationTypes,publicationDate,openAccessPdf')
    only_open_access = request.args.get('only_open_access', 'true').lower() == 'true'
    
    query_params = {
        "query": query,
        "fields": fields,
        "year": year
    }
    
    results = search_semantic_scholar(query_params, only_open_access)
    print("Results:", results)
    return jsonify(results)

@app.route('/api/download-pdf', methods=['POST'])
def api_download_pdf():
    """
    expects JSON body with a key 'url', for example:
    { "url": "https://example.com/path/to/file.pdf" }
    """
    data = request.get_json()
    download_url = data.get('url')
    if not download_url:
        return jsonify({"error": "No URL provided"}), 400
    
    filename = get_pdf(download_url)
    return jsonify({"message": "PDF downloaded", "filename": filename})


''' examples ''' 
'''
Search API
curl -X GET "http://localhost:5001/api/search?query=generative+ai&year=2020-&only_open_access=true"

Download PDF API
curl -v -X POST "http://127.0.0.1:5001/api/download-pdf" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.mdpi.com/2079-8954/12/3/103/pdf?version=1710867327"}'

'''
if __name__ == '__main__':
    # apparently some apple service runs on 5000 so i changes to 5001
    app.run(debug=True,port=5001)
