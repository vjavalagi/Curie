
from google.api_core.client_options import ClientOptions
from google.cloud import documentai


project_id = "curie-451919"
location = "us"  # Format is "us" or "eu"
file_path = "Science.pdf"
processor_id = "e023529ca8b39cc"


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

    print("The document contains the following text:")
    print(document.text)

if __name__ == "__main__":
    quickstart(project_id, location, file_path, processor_id)

