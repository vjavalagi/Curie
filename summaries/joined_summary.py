from google.api_core.client_options import ClientOptions
from google.cloud import documentai
from openai import OpenAI
import os
import json
from dotenv import load_dotenv, find_dotenv
from pydantic import BaseModel
load_dotenv(find_dotenv())

'''
Introduction, Methods, Results, Discussion, Conclusion.
'''
class Summary(BaseModel):
    introduction: str
    methods: str
    results: str
    discussion: str
    conclusion: str
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
def summarize_sections(document_text):
    """Generates a one-sentence summary per section."""
    
    prompt = f"""
    Generate a one-sentence summary for each section of the following document. 
    The sections are: Introduction, Methods, Results, Discussion, Conclusion.

    {document_text}
    """
    
        
    print("SUMMARIZE SECTIONS")
    
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "You are a subject matter expert."},
                  {"role": "user", "content": prompt}],
        response_format=Summary
    )
    print("FINISHED")
    obj = json.loads(response.choices[0].message.content.strip())
    
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
