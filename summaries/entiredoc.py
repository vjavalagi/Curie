from google.api_core.client_options import ClientOptions
from google.cloud import documentai
from openai import OpenAI
import os


project_id = "522084706907"
location = "us"  # Format is "us" or "eu"
file_path = "pdfs/Sql.docx.pdf"  # The path to the PDF file
processor_id = "97a7a6e3b25b168d"
version_id = "53d3ef3b90ac9580"

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)


def quickstart(
    project_id: str,
    location: str,
    file_path: str,
    processor_id: str = "97a7a6e3b25b168d",
    version_id: str = "53d3ef3b90ac9580",
):
    
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")

    client = documentai.DocumentProcessorServiceClient(client_options=opts)

    processor_name = f"projects/{project_id}/locations/{location}/processors/{processor_id}/processorVersions/{version_id}"

    print(processor_name)

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


def extract_summary_from_document(document):
    for entity in document.entities:
        if entity.type_ == "summary":
            summary_text = entity.mention_text
            
            # Return the extracted summary
            return summary_text


if __name__ == "__main__":
    document = quickstart(project_id, location, file_path, processor_id)
    
    # Call the function to summarize and access the summary
    summary = extract_summary_from_document(document)
    if summary:
        print("Extracted Summary:")
        print(summary)
    else:
        print("No summary found in the document.")
