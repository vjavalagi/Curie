import boto3
import os
from dotenv import load_dotenv, find_dotenv
from botocore.exceptions import ClientError
from flask import Flask, request, jsonify
from flask_cors import CORS


load_dotenv(find_dotenv())

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")
S3_BUCKET_NAME = "curie-file-storage"

s3_client = boto3.client(
    "s3",
    region_name=AWS_DEFAULT_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

app = Flask(__name__)
CORS(app)

@app.route("/generate-presigned-url", methods=["POST"])
def generate_presigned_url():
    data = request.get_json()
    filename = data["filename"]
    file_type = data["fileType"]
    
    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": S3_BUCKET_NAME,
                "Key": filename,
                "ContentType": file_type
            },
            ExpiresIn=3600
        )
        return jsonify({"uploadUrl": presigned_url, "fileUrl": f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{filename}"})
    except ClientError as e:
        return jsonify({"error": str(e)}), 500
