import os
import json
import requests
import urllib3
import hashlib
from flask import Flask, request, jsonify, send_from_directory, make_response
from dotenv import load_dotenv, find_dotenv
from flask_cors import CORS
from gpt import get_foundational_papers
from summaries.joined_summary import summarize_document, extract_text, extract_text_pymu,  summarize_sections
from arxiv_api import ArxivAPI
from arxiv import Client, Search, SortCriterion
import boto3
from dotenv import load_dotenv, find_dotenv
from botocore.exceptions import ClientError
from aws import upload_paper, delete_paper_folder, delete_paper, create_user, update_tags, create_paper_folder, get_user_file_system, dynamodb, users, files_table


arxiv = ArxivAPI()
# Load environment variables from .env file
load_dotenv(find_dotenv())

# Create your Flask app once
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Enable CORS for all routes

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
    print("pdf object", obj)
    print(type(obj))
    paper = obj["user"]
    name = name if name else paper["title"]
    if not name.endswith(".pdf"):
        name += ".pdf"
    arxiv.save_pdf(paper, name)
    
    
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

@app.route("/api/s3-url", methods=["GET"])
def get_presigned_url():
    filename = request.args.get("filename")
    
    if not filename:
        return make_response(jsonify({"error": "Missing filename"}), 400)

    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={"Bucket": S3_BUCKET_NAME, "Key": filename, "ContentType": "image/png"},
            ExpiresIn=3600,
            HttpMethod="PUT"
        )
        response = make_response(jsonify({"url": presigned_url}))
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        return response
    except Exception as e:
        return make_response(jsonify({"error": str(e)}), 500)

@app.route("/api/create-user", methods=["POST"])
def api_create_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    photo_url = data.get("photo_url")
    password = data.get("password")

    if not all([username, email, photo_url, password]):
        return jsonify({"error": "Missing fields"}), 400

    result = create_user(username, email, photo_url, password)
    return jsonify(result)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = users.get_item(Key={"UserID": username}).get("Item")
    if not user:
        return jsonify({"error": "User not found"}), 404

    hashed_input = hashlib.sha256(password.encode()).hexdigest()
    if hashed_input != user["PasswordHash"]:
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({"message": "Login successful", "user": user}), 200

@app.route("/api/create-folder", methods=["POST"])
def createfolder():
    data = request.get_json()
    username = data.get("username")
    folder = data.get("folder")
    response = create_paper_folder(username, folder)
    return jsonify(response)
@app.route("/api/delete-folder", methods=["POST"])
def deletefolder():
    data = request.get_json()   
    username = data.get("username")
    folder = data.get("folder")
    response = delete_paper_folder(username, folder)
    return jsonify(response)
@app.route("/api/upload-paper-to-folder", methods=["POST"])
def upload_paper_to_folder():
    data = request.get_json()
    username = data.get("username")
    folder = data.get("folder")
    paper = data.get("paper")
    response = upload_paper(username, folder, paper)
    return jsonify(response)

@app.route("/api/delete-paper", methods=["POST"])
def delete_paper_route():
    data = request.get_json()
    username = data.get("username")
    folder = data.get("folder")
    paper_id = data.get("paper_id")
    print("Deleting paper", username, folder, paper_id)
    response = delete_paper(username, folder, paper_id)
    return jsonify(response)

@app.route("/api/test")
def test_cors():
    return jsonify({"message": "CORS is working!"})

@app.route("/api/get-file-system", methods=["GET"])
def get_file_system():
    username = request.args.get("username")
    response = get_user_file_system(username)
    return jsonify(response)
@app.route("/api/update-tags", methods=["POST"])
def update_tags_route():
    data = request.get_json()
    username = data.get("username")
    folder = data.get("folder", "")  
    paper_id = data.get("paper_id")
    new_tags = data.get("new_tags")
    
    if not username or not paper_id or new_tags is None:
        return jsonify({"error": "Missing required parameters."}), 400

    result = update_tags(username, folder, paper_id, new_tags)
    return jsonify(result)


if __name__ == '__main__':
    # Run on port 5001
    app.run(debug=True, host="0.0.0.0", port=5001)



