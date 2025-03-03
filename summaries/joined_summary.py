from google.api_core.client_options import ClientOptions
from google.cloud import documentai
from openai import OpenAI
import os
import json

# Set up API credentials
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

# Function to extract pre-generated summary from Document AI (if available)
def summarize_document(project_id, location, file_path, processor_id, version_id=None):
    """Processes a document using Google Document AI and returns the extracted summary if available."""
    
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
def extract_text(project_id, location, file_path, processor_id, version_id=None):
    """Extracts text from a document using Google Document AI."""
    
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
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "You are a subject matter expert."},
                  {"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content.strip()

def summarize_sections_json (document_text):
    """Generates a one-sentence summary per section and returns it in JSON format."""
    
    prompt = f"""
    Extract the title, authors, and provide a two-sentence summary as bullet points for each relevant section of the document. This text
    is an academic paper
    The summary should be concise and no more than two sentences per section. Each section needs a summary and a portion of the json.
    Return a string that I can parse into a json using, json_data = json.loads(json_response)

    Document:
    {document_text}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "You are a subject matter expert."},
                  {"role": "user", "content": prompt}]
    )
    #print(response.choices[0].message.content.strip())
    json_response = response.choices[0].message.content.strip()

    # start json at {
    json_response = json_response[json_response.index("{"):]
    # end json at }
    json_response = json_response[:json_response.rindex("}")+1]

    print(json_response)

    # Parse the string into JSON (if it's in proper format)
    try:
        json_data = json.loads(json_response)
    except json.JSONDecodeError:
        print("Error decoding JSON. The response might not be in valid JSON format.")
        return None

    return json_data



# === Main Execution ===
if __name__ == "__main__":
    # === Processor 1 === Extract Pre-generated Summary (Sql.docx.pdf)
    project_summary = "522084706907"
    processor_summary = "97a7a6e3b25b168d"
    version_summary = "53d3ef3b90ac9580"
    file_summary = "../pdfs/Sql.docx.pdf"

    print("\n=== Retrieving Pre-generated Summary (Sql.docx.pdf) ===")
    pre_generated_summary = summarize_document(project_summary, "us", file_summary, processor_summary, version_summary)
    print(pre_generated_summary)

    # === Processor 2 === Extract Text & Summarize Sections (Science.pdf)
    project_text = "curie-451919"
    processor_text = "e023529ca8b39cc"
    file_text = "../pdfs/Science.pdf"

    print("\n=== Extracting Text and Summarizing Sections (Science.pdf) ===")
    extracted_text = extract_text(project_text, "us", file_text, processor_text)
    
    if extracted_text.strip():  # Only summarize if text extraction was successful
        section_summaries = summarize_sections(extracted_text)
        print("\n=== Section Summaries (Science.pdf) ===")
        print(section_summaries)
    else:
        print("No text extracted from document.")

    section_summaries_json = summarize_sections_json(extracted_text)
    # make into json file so can use to make slides
    json_filename = "summaries.json"
    with open(json_filename, "w") as json_file:
        json.dump(section_summaries_json, json_file)
    print(f"Section summaries saved to {json_filename}")
