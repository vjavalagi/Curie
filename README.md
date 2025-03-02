# Curie
To start app, run "npm install", then "npm run dev"

We are going to put all files in the components folder, with pages being marked "Page", and components existing within them


To use the semantic scholar api:
pip install -r requirements.txt
python3 semantic_scholar.py

go to terminal and run these to test

## GlobalContext
This lets us have function and states without having to pass through props! its much cleaner
```
Search API
curl -X GET "http://localhost:5001/api/search?query=generative+ai&year=2020-&only_open_access=true"

Download PDF API
curl -v -X POST "http://127.0.0.1:5001/api/download-pdf" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.mdpi.com/2079-8954/12/3/103/pdf?version=1710867327"}'

```

## LLM Experiments
### GPT 3.5 Turbo
I tried using gpt and i got the following results after running 100 timeline requests. I was hoping 3.5 would be really fast even if it wasnt good but it wasnt either
Average time to complete: 3.4447554111480714
Success rate: 0.54

So the API is super slow and only able to succesfully return a formatted json 54% of the time.

### GPT 4 turbo

Average time to complete: 12.2710049700737
Success rate: 0.97

Much more reliable, but like 4 times as slow


### GPT 4o mini

Average time to complete: 5.74 seconds
Success rate: 100.00%

prob best one, fastest and most semantically correct



