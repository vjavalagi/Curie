from google.api_core.client_options import ClientOptions
from google.cloud import documentai
from openai import OpenAI
import os
import json
from dotenv import load_dotenv, find_dotenv
from pydantic import BaseModel
import pymupdf
load_dotenv(find_dotenv())


class Content(BaseModel):
    section: str
    two_entence_summary: str
    four_sentence_summary: str
    six_sentence_summary: str

class Summary2(BaseModel):
    title: str
    introduction: str
    content: list[Content]
    conclusion: str
class AskCurie(BaseModel):
    question: str
    answer: str
class PaperInfo(BaseModel):
    title: str
    authors: str
    journal: str
    publication_date: str
    doi: str
    abstract: str
    keywords: list[str]
    references: list[str]
    
# Set up API credentials
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
google_creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_creds_path
client = OpenAI(api_key=OPENAI_API_KEY)

# Function to extract pre-generated summary from Document AI (if available)

def summarize_document(file_path):
    """Processes a document using Google Document AI and returns the extracted summary if available."""
    project_id = "522084706907"
    processor_id = "97a7a6e3b25b168d"
    version_id= "53d3ef3b90ac9580"
    location = "us"
    file_summary = "/Users/joshuamayhugh/Documents/Capstone/curie/pdfs/ExamRubric.pdf"
    
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
    docai_client = documentai.DocumentProcessorServiceClient(client_options=opts)

    processor_path = f"projects/{project_id}/locations/{location}/processors/{processor_id}"
    if version_id:
        processor_path += f"/processorVersions/{version_id}"

    with open(file_path, "rb") as file:
        raw_document = documentai.RawDocument(content=file.read(), mime_type="application/pdf")

    request = documentai.ProcessRequest(name=processor_path, raw_document=raw_document)
    result = docai_client.process_document(request=request)
    document = result.document

    for entity in document.entities:
        if entity.type_ == "summary":
            return entity.mention_text  # Return pre-generated summary if found

    return "No summary found in document."

def extract_text_pymu(filepath):
    # Open the PDF file
    doc = pymupdf.open(filepath)
    text = ""
    # Iterate over each page in the PDF
    for page in doc:
        text += page.get_text()  # Extract text from the page
    return text


# Function to extract raw text from a document
def extract_text(file_path):
    """Extracts text from a document using Google Document AI."""
    project_id = "curie-451919"
    processor_id = "e023529ca8b39cc"
    version_id = None
    location = "us"
    
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
    docai_client = documentai.DocumentProcessorServiceClient(client_options=opts)

    processor_path = f"projects/{project_id}/locations/{location}/processors/{processor_id}"
    if version_id:
        processor_path += f"/processorVersions/{version_id}"

    with open(file_path, "rb") as file:
        raw_document = documentai.RawDocument(content=file.read(), mime_type="application/pdf")

    request = documentai.ProcessRequest(name=processor_path, raw_document=raw_document)
    result = docai_client.process_document(request=request)

    return result.document.text  # Return extracted text

# Function to summarize extracted text by section
def summarize_sections(document_text, sentence_count=4):

    """Generates a section-based summary and maps it to the Summary class structure."""
        
    prompt = f"""
    You are an expert in academic document analysis. Do the following:

    1. Read the document below.
    2. Extract the `title` and `authors` if available; otherwise, infer them briefly.
    3. Identify all section headers (e.g., Introduction, Background, Related Work, Experiments, Conclusion, etc.).
    4. For each section, write a 2, 4, and 6 sentence summary.
    5. Return ONLY **valid JSON object** with these keys:
    - "title"
    - "authors"
    - one key per section (use the actual section names from the document).

    The values should be plain strings.

    Document:
    \"\"\"{document_text}\"\"\"
    """
        
    print("summarized sections in joined_summary with __ sentences", sentence_count)
    
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "You are a subject matter expert."},
                  {"role": "user", "content": prompt}],
        response_format=Summary2
    )
    print("FINISHED")

 # Get the response content
    raw_response = response.choices[0].message.content.strip()
    print("raw response", raw_response)

    # try to find between two brackets
    try:
        start_index = raw_response.index("{")
        end_index = raw_response.rindex("}") + 1
        json_str = raw_response[start_index:end_index]
        print("json_str", json_str)

    except:
        print("Failed to find JSON in the response.")
        return None


    try:
        # Try parsing the response content as JSON
        obj = json.loads(json_str)
        print("Parsed JSON object:", obj)
    except json.JSONDecodeError as e:
        print("Failed to decode JSON. Here's the raw response that caused the issue:")
        print(json_str)
        # Handle the error or clean up the response if necessary

    #updated_obj = split_sections_from_text(full_text, obj)
    #print("updated_obj", updated_obj)

    #obj=updated_obj

    return obj if 'obj' in locals() else None  # Return the object if it was parsed successfully, else return None



def ask_curie(document_text, question):
    """Generates a summary per section."""
    
    prompt = f"""
   answer the question {question} based on the document {document_text}
    """
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "You are a subject matter expert."},
                  {"role": "user", "content": prompt}],
        response_format=AskCurie
    )
    print("FINISHED")
    obj = json.loads(response.choices[0].message.content.strip())
    print("ASK CURIE RESPONSE", obj)
    return obj
def ask_curie(document_text, question):
    """Generates a summary per section."""
    
    prompt = f"""
   answer the question {question} based on the document {document_text}
    """
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "You are a subject matter expert."},
                  {"role": "user", "content": prompt}],
        response_format=AskCurie
    )
    print("FINISHED")
    obj = json.loads(response.choices[0].message.content.strip())
    print("ASK CURIE RESPONSE", obj)
    return obj
def getPaperInfo(document_text):
    """gets all the info to store a paper"""
    
    prompt = f"""
    Can you extract the information as requested in the response frormat
    """
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "You are a subject matter expert."},
                  {"role": "user", "content": prompt}],
        response_format=AskCurie
    )
    print("FINISHED")
    obj = json.loads(response.choices[0].message.content.strip())
    print("ASK CURIE RESPONSE", obj)
    return obj

    



# # === Main Execution ===
# if __name__ == "__main__":
#     # === Processor 1 === Extract Pre-generated Summary (Sql.docx.pdf)
    
#     file_path = "/Users/joshuamayhugh/Documents/Capstone/curie/pdfs/ExamRubric.pdf"
#     print("\n=== Retrieving Pre-generated Summary (Sql.docx.pdf) ===")
#     pre_generated_summary = summarize_document(file_path)
#     print(pre_generated_summary)

#     # === Processor 2 === Extract Text & Summarize Sections (Science.pdf)
    
#     file_text = "/Users/joshuamayhugh/Documents/Capstone/curie/pdfs/ExamRubric.pdf"

#     print("\n=== Extracting Text and Summarizing Sections (Science.pdf) ===")
#     extracted_text = extract_text(file_path)
#     print(extracted_text)
#     print()
#     print(summarize_sections(extracted_text))
    
    
    
    # if extracted_text.strip():  # Only summarize if text extraction was successful
    #     section_summaries = summarize_sections(extracted_text)
    #     print("\n=== Section Summaries (Science.pdf) ===")
    #     print(section_summaries)
    # else:
    #     print("No text extracted from document.")

    # section_summaries_json = summarize_sections_json(extracted_text)
    # # make into json file so can use to make slides
    # json_filename = "summaries.json"
    # with open(json_filename, "w") as json_file:
    #     json.dump(section_summaries_json, json_file)
    # print(f"Section summaries saved to {json_filename}")
