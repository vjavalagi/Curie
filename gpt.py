from openai import OpenAI
import os
from dotenv import load_dotenv, find_dotenv
import json
import time

def get_foundational_papers(Topic):
    # Load environment variables from .env file
    load_dotenv(find_dotenv())
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise ValueError("OPENAI_API_KEY not set in environment variables.")

    # Set your OpenAI API key
    client = OpenAI(api_key=key)

    # Define the JSON schema for the expected output
    response_format = {
        "type": "json_schema",
        "json_schema": {
            "name": "foundational_papers",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "papers": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "date": {"type": "string"},
                                "title": {"type": "string"},
                                "author": {"type": "string"}
                            },
                            "required": ["date", "title", "author"],
                            "additionalProperties": False
                        }
                    }
                },
                "required": ["papers"],
                "additionalProperties": False
            }
        }
    }

    # Define the messages for the chat completion
    messages = [
        {"role": "system", "content": "You are a helpful assistant that outputs strictly formatted JSON according to the provided schema."},
        {"role": "user", "content": (
            f"Please provide the dates, titles, and authors of the 10 most important foundational papers by most impactful citations in {Topic}."
            "Ensure each entry includes the date, title, and author. Do not include any additional text."
        )}
    ]

    # Create the chat completion with Structured Outputs enabled via response_format.
    response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=messages,
        response_format=response_format
    )

    # Attempt to access the structured (parsed) output; if not available, fall back to manual parsing.
    try:
        result = response.choices[0].message.parsed
    except AttributeError:
        result = json.loads(response.choices[0].message.content)
    return result

# Test the function over multiple attempts
# attempts = 100
# success = 0
# timetocomplete = []

# for i in range(attempts):
#     print(f"Attempt {i + 1}")
#     start = time.time()
#     try:
#         get_foundational_papers()
#         success += 1
#     except Exception as e:
#         print(f"Attempt {i + 1} failed with error: {e}")
#     end = time.time()
#     timetocomplete.append(end - start)

# print(f"Average time to complete: {sum(timetocomplete) / attempts:.2f} seconds")
# print(f"Success rate: {success / attempts:.2%}")
print(get_foundational_papers("Generative AI"))