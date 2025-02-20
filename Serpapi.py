from serpapi import GoogleSearch
import json
from urllib.request import Request, urlopen
from PyPDF2 import PdfWriter, PdfReader
from io import BytesIO

params = {
  "api_key": "98566a4548ae480b8b9abd9452def15cfbf5c5b1d137fe0ed8bddf7a2af26cd8",
  "engine": "google_scholar",
  "q": "Coffee",
  "hl": "en"
}
def api_call(params, output_name="test.json"):
    search = GoogleSearch(params)
    results = search.get_dict()
    return results

def get_pdf(url):
    
    writer = PdfWriter()
    remoteFile = urlopen(Request(url)).read()
    memoryFile = BytesIO(remoteFile)
    pdfFile = PdfReader(memoryFile)
  
    for pageNum in range(len(pdfFile.pages)):
            currentPage = pdfFile.pages[pageNum]
            #currentPage.mergePage(watermark.getPage(0))
            writer.add_page(currentPage)


    outputStream = open(url[:10],"wb")
    writer.write(outputStream)
    outputStream.close()
   
    
def read_serp_json(name):
    with open(name) as f:
        data = json.load(f)
    return data


def extract_single_data(results, i):
    output_data = {}  
    output_data["title"] = results[i]["title"] if "title" in results[i] else None
    output_data["link"] = results[i]["link"] if "link" in results[i] else None
    output_data['result_id'] = results[i]["result_id"] if "result_id" in results[i] else None
    if "resources" in results[i]:
        for r in results[i]["resources"]:
            if "file_format" in r and r["file_format"].upper() == "PDF":
                output_data["pdf"] = r["link"]
    if "inline_links" in results[i]:
        output_data["cited_papers"] = results[i]["inline_links"]["serpapi_cite_link"] if "serpapi_cite_link" in results[i]["inline_links"] else None
        if "cited_by" in results[i]["inline_links"]:
            output_data["citation_total"] = results[i]["inline_links"]["cited_by"]["total"] if "total" in results[i]["inline_links"]["cited_by"] else None
    return output_data
    
def extract_all_data(data, cap = 5):
    ret_data = {}
    results = data["organic_results"]
    
    cap = min(cap, len(results))
    for i in range(cap):
        ret_data[i] = extract_single_data(results, i)
    return ret_data


data = api_call(params)
extracted_data = extract_all_data(data)
print(extracted_data.keys())
for i, res in extracted_data.items():
    if "pdf" in res:
        print(res["pdf"])
        try:
            get_pdf(res["pdf"])
        except:
            print("Error")

