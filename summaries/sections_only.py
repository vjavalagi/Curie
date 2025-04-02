
from google.api_core.client_options import ClientOptions
from google.cloud import documentai
from openai import OpenAI
import re
import os


project_id = "curie-451919"
location = "us"  # Format is "us" or "eu"
file_path = "pdfs/Science.pdf"  # The path to the PDF file
processor_id = "e023529ca8b39cc"

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def quickstart(
    project_id: str,
    location: str,
    file_path: str,
    processor_id: str = "e023529ca8b39cc",
):
    
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")

    client = documentai.DocumentProcessorServiceClient(client_options=opts)

    processor_name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"


    # Read file into memory
    with open(file_path, "rb") as image:
        image_content = image.read()

    # Load binary data
    raw_document = documentai.RawDocument(
        content=image_content,
        mime_type="application/pdf",  # Refer to https://cloud.google.com/document-ai/docs/file-types for supported file types
    )

    # Configure the process request
    request = documentai.ProcessRequest(name=processor_name, raw_document=raw_document)

    result = client.process_document(request=request)

    # For a full list of `Document` object attributes, reference this page: https://cloud.google.com/document-ai/docs/reference/rest/v1/Document
    # https://cloud.google.com/document-ai/docs/handle-response
    document = result.document

    return document


#function to send the document text created by google processor to open ai to get summaries per section: Results, Methods
def summarize_doc_with_ai(document):

    # prepare prompt for gpt
    prompt = f"""
    Generate a one sentence summary for each section of the following document. The sections are: Introduction, Methods, Results, Discussion, Conclusion.

    {document.text}

    """

    response = client.chat.completions.create(model="gpt-4o-mini",
    messages=[{"role": "system", "content": "You are a subject expert"},
              {"role": "user", "content": prompt}])
    return response






# if __name__ == "__main__":
#     document = quickstart(project_id, location, file_path, processor_id)

#     #print(document.pages[1].blocks[0].paragraphs[0])
#     print("Document text:")
#     print(document.text[:1000])  
#     #document = document.text[:1000]  # Limit to first 1000 characters for display

#     # Call the function to summarize the document
#     summary = summarize_doc_with_ai(document)
#     print("Summary of the document:")
#     print(summary)







