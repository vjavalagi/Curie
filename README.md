# Curie
To start app, run "npm install", then "npm run dev"

We are going to put all files in the components folder, with pages being marked "Page", and components existing within them


To use the semantic scholar api:
pip install -r requirements.txt
python3 semantic_scholar.py

go to terminal and run these to test

```
Search API
curl -X GET "http://localhost:5001/api/search?query=generative+ai&year=2020-&only_open_access=true"

Download PDF API
curl -v -X POST "http://127.0.0.1:5001/api/download-pdf" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.mdpi.com/2079-8954/12/3/103/pdf?version=1710867327"}'

```