import os
import json
import requests
import urllib3
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv, find_dotenv
from flask_cors import CORS
from gpt import get_foundational_papers
from summaries.joined_summary import summarize_document, extract_text, extract_text_pymu,  summarize_sections
from arxiv_api import ArxivAPI
from arxiv import Client, Search, SortCriterion
import boto3
from dotenv import load_dotenv, find_dotenv
from botocore.exceptions import ClientError


arxiv = ArxivAPI()
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
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")
S3_BUCKET_NAME = "curie-file-storage"

s3_client = boto3.client(
    "s3",
    region_name=AWS_DEFAULT_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

def get_whole_summary(name):
    return summarize_document(name)

def get_section_summaries(name):
    print("Getting Section Summaries", name)
    print("extracting text")
    #text = extract_text(name)
    text = extract_text_pymu(name)
    print(text)
    print("summarizing sections")
    return summarize_sections(text)

def get_pdf(obj, name = None):
    """Download a PDF from the given URL and save it locally."""
    print(obj)
    print(type(obj))
    name = name if name else obj["title"]
    if not name.endswith(".pdf"):
        name += ".pdf"
    arxiv.save_pdf(obj, name)
    return name
    
def sortCriteria(a,b):
    pass

'''
Alternative URLS

Bulk Search, returns as many as possible https://api.semanticscholar.org/graph/v1/paper/search/bulk

Relevance Search, returns the most relevant papers https://api.semanticscholar.org/graph/v1/paper/search
'''
# def search_semantic_scholar(query_params, only_open_access=False):
#     url = "https://api.semanticscholar.org/graph/v1/paper/search/"
#     headers = {"x-api-key": SEMANTIC_SCHOLAR_API_KEY}
    
#     response = requests.get(url, params=query_params, headers=headers)
#     print("Response status code:", response.status_code)
    
#     try:
#         response_json = response.json()
#     except Exception as e:
#         print("Error parsing JSON:", e)
#         return {"error": "Invalid response from API"}
    
#     data = response_json.get('data', [])
#     if only_open_access:
#         data = [d for d in data if 'openAccessPdf' in d and d['openAccessPdf']]
    
#     return data


    
@app.route('/api/summarize-sections', methods=['GET'])
def api_summarize_sections():
    """
    Example: GET /api/summarize-sections?file_path=/path/to/file.pdf
    """
    print("File path", request.args.get('file_path'))
    file_path = "./pdfs/" + request.args.get('file_path', 'ExamRubric') + ".pdf"
    print(file_path)
    print("FILE PATH for section summaries", file_path)
    summary = get_section_summaries(file_path)
    print("SUMMARY", summary)
    return jsonify({"summary": summary})


@app.route('/api/summarize', methods=['GET'])
def api_summarize():
    """
    Example: GET /api/summarize?file_path=/path/to/file.pdf
    """
    file_path = request.args.get('file_path', 'pdfs/ExamRubric.pdf')
    print("FILE PATH", file_path)
    summary = get_whole_summary(file_path)
    return jsonify({"summary": summary})

@app.route('/api/timeline', methods=['GET'])
def api_timeline():
    Subject = request.args.get('subject', 'generative ai')
    timeline = get_foundational_papers(Subject)
    print("HERE IS " , timeline)
    return jsonify(timeline)

@app.route('/api/search', methods=['GET'])
def api_search():
    """
    """
    topic = request.args.get('topic', 'Computer Science')
    limit = int(request.args.get('limit', 7))
    results = arxiv.search(topic, limit, SortCriterion.Relevance)
    return jsonify(results)

@app.route('/api/download-pdf', methods=['POST'])
def api_download_pdf():
    """
    Example: POST /api/download-pdf
    {
        "entry_id": "1234.56789",
        "title": "example.pdf"
    }
    """
    data = request.get_json()
    get_pdf(data)
    return jsonify({"success": True})

@app.route("/generate-presigned-url", methods=["POST"])
def generate_presigned_url():
    data = request.get_json()
    filename = data["filename"]
    file_type = data["fileType"]
    
    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": S3_BUCKET_NAME,
                "Key": filename,
                "ContentType": file_type
            },
            ExpiresIn=3600
        )
        return jsonify({"uploadUrl": presigned_url, "fileUrl": f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{filename}"})
    except ClientError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on port 5001
    app.run(debug=True, port=5001)



