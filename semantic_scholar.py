import os
import json
import requests
import urllib3
import re
import hashlib
from arxiv import Client, Search, SortCriterion
from flask import Flask, request, jsonify, send_from_directory, make_response, send_file, abort, after_this_request
from dotenv import load_dotenv, find_dotenv
from flask_cors import CORS
from gpt import get_foundational_papers
from summaries.joined_summary import summarize_document, extract_text_pymu,  summarize_sections, ask_curie 
from arxiv_api import ArxivAPI
from slide_gen import generate_presentation, downloadAndZip
import boto3
from dotenv import load_dotenv, find_dotenv
from botocore.exceptions import ClientError
from aws import upload_paper, delete_paper_folder, delete_paper, create_user, update_tags, create_paper_folder, get_user_file_system, move_file, dynamodb, users
from google.api_core.client_options import ClientOptions
from google.cloud import documentai
import tempfile
import requests
import zipfile
import tempfile

arxiv_python = ArxivAPI()
# Load environment variables from .env file
load_dotenv(find_dotenv())

# Create your Flask app once
app = Flask(__name__)
CORS(app, origins=[
    "https://set-up-amplify.d1d7sg0tu7v11c.amplifyapp.com",
    "https://curie-guide.com",
    "https://www.curie-guide.com", 
    "http://localhost:3000"
    "http://localhost:5173"
], supports_credentials=True)


# Set up the path for storing PDFs
pdf_output_path = "pdfs/"
os.makedirs(pdf_output_path, exist_ok=True)

SEMANTIC_SCHOLAR_API_KEY = os.getenv('SEMANTICAPIKEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
AMAZON_ACCESS_KEY_ID = os.getenv("AMAZON_ACCESS_KEY_ID")
AMAZON_SECRET_ACCESS_KEY = os.getenv("AMAZON_SECRET_ACCESS_KEY")
AMAZON_DEFAULT_REGION = os.getenv("AMAZON_DEFAULT_REGION")
S3_BUCKET_NAME = "curie-file-storage"

s3_client = boto3.client(
    "s3",
    region_name=AMAZON_DEFAULT_REGION,
    aws_access_key_id=AMAZON_ACCESS_KEY_ID,
    aws_secret_access_key=AMAZON_SECRET_ACCESS_KEY,
)

def get_whole_summary(name):
    return summarize_document(name)

def get_section_summaries(name, sentence_count):
    # print("Getting Section Summaries", name)
    # print("extracting text")
    #text = extract_text(name)
    text = extract_text_pymu(name)
    #print(text)
    # print("summarizing sections with sentence count", sentence_count)
    return summarize_sections(text, sentence_count)

def get_pdf(obj, name = None):
    """Download a PDF from the given URL and save it locally."""
    # print("pdf object", obj)
    # print(type(obj))
    paper = obj["user"]
    name = name if name else paper["title"]
    if not name.endswith(".pdf"):
        name += ".pdf"
    print("PDF name", name)
    arxiv_python.save_pdf(paper, name)
    
    
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
@app.route("/api/download-zip", methods=["POST"])
def download_zip():
    # Specify the folder you want to zip. Replace with your actual folder path.
    # get the folder name from the request
    data = request.get_json()
    folder_to_zip = data.get('folder')

    print("Folder to zip:", folder_to_zip)
    if not folder_to_zip:
        abort(400, description="Folder name is required.")
    # Create a temporary file that will store the zip archive
    tmp_zip = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
    tmp_zip.close()  # Close the file so zip_folder can write to it

    try:
        downloadAndZip(folder_to_zip, tmp_zip.name)
    except Exception as e:
        print("Error zipping folder:", folder_to_zip, e)
        app.logger.error("Error zipping folder: %s", e)
        abort(500, description="An error occurred during zipping the folder.")

    # Ensure the temporary file gets removed after sending the file
    @after_this_request
    def remove_file(response):
        try:
            os.remove(tmp_zip.name)
        except Exception as error:
            app.logger.error("Error removing temporary zip file: %s", error)
        return response

    # send_file returns the zipped file with 'as_attachment=True' to prompt a download.
    return send_file(tmp_zip.name, as_attachment=True, download_name="folder.zip")    
@app.route('/api/summarize-sections', methods=['GET'])
def api_summarize_sections():
    """
    Example: GET /api/summarize-sections?pdf_url=https://...&sentence_count=4
    """
    pdf_url = request.args.get("pdf_url")
    sentence_count = int(request.args.get("sentence_count", 4))

    if not pdf_url:
        return jsonify({"error": "Missing pdf_url"}), 400

    try:
        # Download the PDF from the URL into memory
        response = requests.get(pdf_url)
        response.raise_for_status()

        # Send the in-memory PDF to Document AI
        project_id = "curie-451919"
        processor_id = "e023529ca8b39cc"
        location = "us"

        opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
        docai_client = documentai.DocumentProcessorServiceClient(client_options=opts)
        processor_path = f"projects/{project_id}/locations/{location}/processors/{processor_id}"

        raw_document = documentai.RawDocument(content=response.content, mime_type="application/pdf")
        doc_request = documentai.ProcessRequest(name=processor_path, raw_document=raw_document)
        result = docai_client.process_document(request=doc_request)

        extracted_text = result.document.text

        # Summarize using your OpenAI pipeline
        summary = summarize_sections(extracted_text, sentence_count)
        return jsonify({"summary": summary})
    except Exception as e:
        print("Error during summarize-sections:", e)
        return jsonify({"error": str(e)}), 500




# @app.route('/api/summarize-sections-sent', methods=['GET'])
# def api_summarize_sections_sent():
#     """
#     Example: GET /api/summarize-section-sent?file_path=/path/to/file.pdf?sentence_count=5
#     """
#     print("File path", request.args.get('file_path'))
#     file_path = "./pdfs/" + request.args.get('file_path', 'ExamRubric') + ".pdf"
#     print(file_path)
#     print("FILE PATH for section summaries", file_path)

#     sentence_count = request.args.get('sentence_count')
#     print(f"Sentence count: {sentence_count}")

#     summary = get_section_summaries(file_path, sentence_count)
#     print("SUMMARY", summary)
#     return jsonify({"summary": summary})

# TESTING NO PDF DOWNLOAD
@app.route('/api/summarize-sections-sent', methods=['GET'])
def api_summarize_sections_sent():
    pdf_url = request.args.get("pdf_url")

    if not pdf_url:
        return jsonify({"error": "Missing pdf_url"}), 400

    try:
        # Download the PDF to a temp file
        response = requests.get(pdf_url)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name

        print("Downloaded PDF to:", temp_file_path)

        # Extract text and summarize
        extracted_text = extract_text_pymu(temp_file_path)
        summary = summarize_sections(extracted_text)
        return jsonify({"summary": summary})

    except Exception as e:
        print("Error during summarization:", e)
        return jsonify({"error": str(e)}), 500



@app.route('/api/summarize', methods=['GET'])
def api_summarize():
    """
    Example: GET /api/summarize?file_path=/path/to/file.pdf
    """
    file_path = request.args.get('file_path', 'pdfs/ExamRubric.pdf')
    print("FILE PATH", file_path)
    summary = get_whole_summary(file_path)
    return jsonify({"summary": summary})

@app.route('/api/ask-curie', methods=['GET'])
def api_summarize_raw():
    """
    Example: GET /api/summarize-raw?file_path=/path/to/file.pdf
    """
    name = request.args.get('name', '/ExamRubric.pdf')
    
    name = name if name.endswith(".pdf") else name + ".pdf"
    name = "./pdfs/" + name
   
    print("FILE PATH", name)
    question = request.args.get('question', 'What is the main topic of this paper?')
    extracted_text = extract_text_pymu(name)
    print("EXTRACTED TEXT", extracted_text)
    response = ask_curie(extracted_text, question)        
    print("FILE PATH", name)
    return jsonify(response)


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
    limit = int(request.args.get('limit', 60))
    results = arxiv_python.search(topic, limit, SortCriterion.Relevance)
    return jsonify(results)

@app.route('/api/gen-slides', methods=['POST'])
def api_generate_slides():
    """
    ```
    curl -X POST http://localhost:5001/api/gen-slides \
    -H "Content-Type: application/json" \
    -d '{"path": "pdfs/A fixed-parameter tractable algorithm for combinatorial filter reduction.pdf"}'
    ```
    """
    data = request.get_json()
    path = data.get("path")

    if not path:
        return jsonify({"error": "Missing path parameter"}), 400

    try:
        print("generating slides for", path)
        generate_presentation(path)
        return jsonify({"message": "Slides generated successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/download-pdf', methods=['POST'])
def api_download_pdf():
    """
    
    """
    
    data = request.get_json()
    print("Data for paper", data)
    get_pdf(data)
    return jsonify({"success": True})

@app.route("/api/s3-url", methods=["GET"])
def get_presigned_url():
    filename = request.args.get("filename")
    content_type = request.args.get("content_type", "image/png")  

    if not filename:
        return make_response(jsonify({"error": "Missing filename"}), 400)

    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": S3_BUCKET_NAME,
                "Key": filename,
                "ContentType": content_type
            },
            ExpiresIn=3600,
            HttpMethod="PUT"
        )
        return jsonify({"url": presigned_url})
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

def make_bibkey(authors, year, title):
    first_author_lastname = authors[0].name.split()[-1].lower()
    short_title_words = title.lower().split()[0:5]
    short_title = re.sub(r'\W+', '', ''.join(short_title_words))
    return f"{first_author_lastname}{year}{short_title}"

@app.route('/api/arxiv-bibtex', methods=['GET'])
def get_arxiv_bibtex():
    arxiv_id = request.args.get("arxiv_id")
    if not arxiv_id:
        return jsonify({"error": "Missing arxiv_id parameter"}), 400

    try:
        client = Client()
        search = Search(id_list=[arxiv_id])
        result = next(client.results(search), None)

        if not result:
            return jsonify({"error": "No result found for the provided arxiv_id."}), 404

        authors = ' and '.join([author.name for author in result.authors])
        year = result.published.year
        title = result.title.strip()
        arxiv_id_clean = result.entry_id.split('/')[-1].split('v')[0]
        primary_class = result.primary_category
        bibkey = make_bibkey(result.authors, year, title)

        bibtex_entry = f"""@misc{{{bibkey},
        title={{ {title} }},
        author={{ {authors} }},
        year={{ {year} }},
        eprint={{ {arxiv_id_clean} }},
        archivePrefix={{arXiv}},
        primaryClass={{ {primary_class} }},
        url={{https://arxiv.org/abs/{arxiv_id_clean} }},
        }}"""

        return jsonify({"bibtex": bibtex_entry})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/rename-folder", methods=["POST"])
def rename_folder():
    data = request.get_json()
    username = data.get("username")
    old_folder = data.get("oldFolderName")
    new_folder = data.get("newFolderName")

    if not username or not old_folder or not new_folder:
        return jsonify({"error": "Missing required fields."}), 400

    try:
        # 1. List all objects in the old folder path
        old_prefix = f"Users/{username}/{old_folder}/"
        new_prefix = f"Users/{username}/{new_folder}/" 


        response = s3_client.list_objects_v2(Bucket=S3_BUCKET_NAME, Prefix=old_prefix)

        if "Contents" in response:
            for obj in response["Contents"]:
                old_key = obj["Key"]
                new_key = old_key.replace(old_prefix, new_prefix, 1)

                # 2. Copy object to new key
                s3_client.copy_object(
                    Bucket=S3_BUCKET_NAME,
                    CopySource={"Bucket": S3_BUCKET_NAME, "Key": old_key},
                    Key=new_key
                )

                # 3. Delete old object
                s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=old_key)

        # 4. Update DynamoDB (remove old folder, add new one with same content)
        user_data = users.get_item(Key={"UserID": username}).get("Item")

        if not user_data:
            return jsonify({"error": "User not found."}), 404

        folders = user_data.get("folders", [])
        updated_folders = []
        for folder in folders:
            if folder["name"] == old_folder:
                folder["name"] = new_folder
            updated_folders.append(folder)

        users.update_item(
            Key={"UserID": username},
            UpdateExpression="SET folders = :folders",
            ExpressionAttributeValues={":folders": updated_folders},
        )

        return jsonify({"message": "Folder renamed successfully."})

    except Exception as e:
        print("Rename error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/move-paper", methods=["POST"])
def move_paper():
    data = request.get_json()
    print(" Move paper data:", data)

    username = data.get("username")
    paper_id = data.get("paper_id")
    from_folder = data.get("from_folder") or ""
    to_folder = data.get("to_folder") or ""

    if not username or not paper_id:
        return jsonify({"error": "Missing required fields."}), 400

    try:
        result = move_file(username, from_folder, to_folder, paper_id)
        status = 200 if "message" in result else 500
        return jsonify(result), status
    except Exception as e:
        print(" Move paper exception:", e)
        return jsonify({"error": str(e)}), 500

def mass_upload_to_josh():
    subject = "Flowers"
    limit_per_batch = 100  # Reasonable number to avoid overloading arXiv or AWS at once
    username = "Josh"
    folder_name = "TAMU Professors"

    # # Ensure Josh has the folder created
    # create_paper_folder(username, folder_name)

    for i in range(100):
        print(f"--- Batch {i+1}/100 ---")
        papers = arxiv_python.search(subject, limit_per_batch, SortCriterion.Relevance)
        for paper in papers:
            try:
                # Download the paper
                # file_name = get_pdf({"paper": paper})
                # Upload to Josh's S3 folder
                upload_response = upload_paper(username, folder_name, paper)
                print(f"Uploaded paper: {paper['title']}... | Response: {upload_response}")
            except Exception as e:
                print(f"Error uploading paper {paper.get('title', '')}: {e}")
@app.route('/api/dev/mass-upload-josh')
def run_mass_upload():
    try:
        mass_upload_to_josh()
        return jsonify({"message": "Done uploading 1000 batches to Josh's account!"})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    # Run on port 5001
    app.run(debug=True, host="0.0.0.0", port=5001)



