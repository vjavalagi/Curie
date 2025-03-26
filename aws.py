import boto3
from dotenv import load_dotenv, find_dotenv
import os
import uuid
from datetime import datetime, timezone
from botocore.exceptions import ClientError

# Load AWS credentials from .env
load_dotenv(find_dotenv())

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")


# Initialize DynamoDB
session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_DEFAULT_REGION
)

dynamodb = session.resource("dynamodb")
users = dynamodb.Table("Users")
files_table = dynamodb.Table("Files")

### -------------------------------- ###
###         USER MANAGEMENT          ###
### -------------------------------- ###

def create_user(username, email, photo_url, password):
    """Creates a new user profile only if the username is not taken."""
    hashed_pass = hash(password)

    user_item = {
        'UserID': f'USER#{username}',
        'Email': email,
        'PhotoURL': photo_url,
        'PasswordHash': hashed_pass,
        'CreatedAt': datetime.now(timezone.utc).isoformat()
    }

    try:
        response = users.put_item(
            Item=user_item,
            ConditionExpression="attribute_not_exists(UserID)"
        )
        return {"message": "User profile created successfully."}
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            return {"error": "Username already exists."}
        else:
            raise

def get_user_profile(username):
    response = users.get_item(Key={'UserID': f'USER#{username}'})
    return response.get("Item")

def update_user_profile(username, email=None, photo_url=None):
    update_expression = []
    expression_values = {}

    if email:
        update_expression.append("Email = :email")
        expression_values[":email"] = email
    if photo_url:
        update_expression.append("PhotoURL = :photo")
        expression_values[":photo"] = photo_url

    if not update_expression:
        return {"message": "No fields to update."}

    update_expression = "SET " + ", ".join(update_expression)

    users.update_item(
        Key={'UserID': f'USER#{username}'},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_values
    )
    return {"message": "Profile updated successfully."}

### -------------------------------- ###
###      FILE & FOLDER FUNCTIONS     ###
### -------------------------------- ###

def create_folder(username, folder_name, tags=None):
    folder_id = str(uuid.uuid4())
    folder_item = {
        "UserID": username,
        "ItemID": folder_id,
        "Type": "folder",
        "FolderName": folder_name,
        "CreatedAt": datetime.now(timezone.utc).isoformat(),
        "Tags": tags or []
    }
    files_table.put_item(Item=folder_item)
    return folder_item

def upload_file(username, file_name, s3_url, file_type, size, parent_folder_id=None, tags=None, arxiv_metadata=None):
    file_id = str(uuid.uuid4())
    file_item = {
        "UserID": username,
        "ItemID": file_id,
        "Type": "file",
        "FileName": file_name,
        "ParentFolderID": parent_folder_id,
        "S3URL": s3_url,
        "FileType": file_type,
        "Size": size,
        "UploadedAt": datetime.now(timezone.utc).isoformat(),
        "Tags": tags or []
    }
    if arxiv_metadata:
        file_item.update({
            "ArxivID": arxiv_metadata.get("entry_id"),
            "Title": arxiv_metadata.get("title"),
            "Authors": arxiv_metadata.get("authors"),
            "Published": arxiv_metadata.get("published"),
            "Updated": arxiv_metadata.get("updated"),
            "Links": arxiv_metadata.get("links")
        })

    files_table.put_item(Item=file_item)
    return file_item

def update_tags(username, item_id, new_tags):
    return files_table.update_item(
        Key={"UserID": username, "ItemID": item_id},
        UpdateExpression="SET Tags = :tags",
        ExpressionAttributeValues={":tags": new_tags},
        ReturnValues="UPDATED_NEW"
    )

def search_by_tag(username, tag):
    response = files_table.scan(
        FilterExpression="UserID = :u AND contains(Tags, :t)",
        ExpressionAttributeValues={":u": username, ":t": tag}
    )
    return response.get("Items", [])

def get_user_folders(username):
    response = files_table.scan(
        FilterExpression="UserID = :u AND Type = :t",
        ExpressionAttributeValues={":u": username, ":t": "folder"}
    )
    return response.get("Items", [])

def get_loose_files(username):
    response = files_table.scan(
        FilterExpression="UserID = :u AND Type = :t AND attribute_not_exists(ParentFolderID)",
        ExpressionAttributeValues={":u": username, ":t": "file"}
    )
    return response.get("Items", [])

def get_folder_files(username, folder_id):
    response = files_table.scan(
        FilterExpression="UserID = :u AND Type = :t AND ParentFolderID = :fid",
        ExpressionAttributeValues={":u": username, ":t": "file", ":fid": folder_id}
    )
    return response.get("Items", [])

def move_file(username, file_id, new_folder_id):
    return files_table.update_item(
        Key={"UserID": username, "ItemID": file_id},
        UpdateExpression="SET ParentFolderID = :new_folder",
        ExpressionAttributeValues={":new_folder": new_folder_id}
    )

def delete_file(username, file_id, s3_url):
    files_table.delete_item(Key={"UserID": username, "ItemID": file_id})
    s3 = boto3.client("s3")
    file_key = s3_url.split("/")[-1]
    s3.delete_object(Bucket="curie-file-storage", Key=file_key)
    return {"message": "File deleted"}
### -------------------------------- ###
###           TEST DATA              ###
### -------------------------------- ###

def batch_create_users():
    test_users = [
        {"username": "Josh", "email": "josh@example.com", "photo_url": "https://s3.amazonaws.com/my-bucket/josh-profile.jpg", "password": "password123"},
        {"username": "Sydney", "email": "sydney@example.com", "photo_url": "https://s3.amazonaws.com/my-bucket/sydney-profile.jpg", "password": "password456"},
        {"username": "Shyam", "email": "shyam@example.com", "photo_url": "https://s3.amazonaws.com/my-bucket/shyam-profile.jpg", "password": "password789"}
    ]
    for user in test_users:
        print(create_user(user["username"], user["email"], user["photo_url"], user["password"]))

def generate_test_files_with_arxiv():
    arxiv_entries = [
        {
            "entry_id": "2301.09753v1",
            "title": "Towards Modular Machine Learning Solution Development: Benefits and Trade-offs",
            "authors": ["Samiyuru Menik", "Lakshmish Ramaswamy"],
            "published": "2023-01-23T22:54:34+00:00",
            "updated": "2023-01-23T22:54:34+00:00",
            "links": [
                "http://arxiv.org/abs/2301.09753v1",
                "http://arxiv.org/pdf/2301.09753v1"
            ]
        },
        {
            "entry_id": "1909.09246v1",
            "title": "Machine Learning for Clinical Predictive Analytics",
            "authors": ["Wei-Hung Weng"],
            "published": "2019-09-19T22:02:00+00:00",
            "updated": "2019-09-19T22:02:00+00:00",
            "links": [
                "http://arxiv.org/abs/1909.09246v1",
                "http://arxiv.org/pdf/1909.09246v1"
            ]
        }
    ]
    usernames = ["Josh", "Sydney", "Shyam"]
    for i, entry in enumerate(arxiv_entries):
        upload_file(
            username=usernames[i % len(usernames)],
            file_name=f"arxiv_{entry['entry_id']}.pdf",
            s3_url=entry['links'][1],
            file_type="pdf",
            size=123456,
            tags=["arxiv", "research"],
            arxiv_metadata=entry
        )
    print("✅ ArXiv test files uploaded.")
def check_table_exists(table_name):
    client = session.client("dynamodb")
    try:
        client.describe_table(TableName=table_name)
        print(f"✅ Table '{table_name}' exists.")
        return True
    except client.exceptions.ResourceNotFoundException:
        print(f"❌ Table '{table_name}' does not exist.")
        return False

def create_files_table():
    """Creates the Files table if it does not exist."""
    if check_table_exists("Files"):
        return

    session.client("dynamodb").create_table(
        TableName="Files",
        KeySchema=[
            {'AttributeName': 'UserID', 'KeyType': 'HASH'},
            {'AttributeName': 'ItemID', 'KeyType': 'RANGE'}
        ],
        AttributeDefinitions=[
            {'AttributeName': 'UserID', 'AttributeType': 'S'},
            {'AttributeName': 'ItemID', 'AttributeType': 'S'}
        ],
        ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    )
    print("Table 'Files' created successfully.")
def upload_to_s3(file_path, s3_key, bucket_name="curie-file-storage"):
    s3 = session.client("s3")
    try:
        s3.upload_file(file_path, bucket_name, s3_key)
        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
        return {"success": True, "s3_url": s3_url}
    except ClientError as e:
        print("Upload failed:", e)
        return {"success": False, "error": str(e)}

def upload_folder_to_s3(folder_path, s3_prefix="", bucket_name="curie-file-storage"):
    s3 = session.client("s3")
    uploaded_files = []

    for root, _, files in os.walk(folder_path):
        for file_name in files:
            local_path = os.path.join(root, file_name)
            relative_path = os.path.relpath(local_path, folder_path)
            s3_key = os.path.join(s3_prefix, relative_path).replace("\\", "/")

            try:
                s3.upload_file(local_path, bucket_name, s3_key)
                s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
                uploaded_files.append(s3_url)
                print(f"Uploaded {file_name} -> {s3_url}")
            except ClientError as e:
                print(f"Failed to upload {file_name}:", e)

    return uploaded_files

def preview_image_urls(s3_urls):
    for url in s3_urls:
        if url.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
            print(f"🖼 Image preview URL: {url}")

# uploaded_urls = upload_folder_to_s3("./ProfilePictures", "profile-pictures/")
uploaded_urls = upload_folder_to_s3("./ProfilePictures", "profile-pictures/")

# generate_test_files_with_arxiv()
print ( preview_image_urls('https://curie-file-storage.s3.amazonaws.com/profile-pictures/preline.png')) 
