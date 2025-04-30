"""
Module: file_management.py
Description: 
    This module provides functionality for managing users and files using AWS services.
    It handles user management (hashing passwords, creating/updating user profiles), 
    file management (creating folders, uploading files to S3, updating file tags, and more), 
    and basic interactions with AWS DynamoDB and S3 using boto3.
    
    AWS credentials are loaded from a .env file using python-dotenv.
"""

# python nativ
import os
import uuid
import hashlib
from datetime import datetime, timezone
import requests
from io import BytesIO
import json
# aws anf third party
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv, find_dotenv

# ------------------------------------------------------------------------------
# Load AWS credentials from .env file
# ------------------------------------------------------------------------------
load_dotenv(find_dotenv())

AMAZON_ACCESS_KEY_ID = os.getenv("AMAZON_ACCESS_KEY_ID")
AMAZON_SECRET_ACCESS_KEY = os.getenv("AMAZON_SECRET_ACCESS_KEY")
AMAZON_DEFAULT_REGION = os.getenv("AMAZON_DEFAULT_REGION")
SERP = os.getenv('SERP')
print(AMAZON_ACCESS_KEY_ID)
print(AMAZON_SECRET_ACCESS_KEY)
print(AMAZON_DEFAULT_REGION)
# ------------------------------------------------------------------------------
# Initialize AWS services (DynamoDB & S3)
# ------------------------------------------------------------------------------
session = boto3.Session(
    aws_access_key_id=AMAZON_ACCESS_KEY_ID,
    aws_secret_access_key=AMAZON_SECRET_ACCESS_KEY,
    region_name=AMAZON_DEFAULT_REGION
)

dynamodb = session.resource("dynamodb")
users = dynamodb.Table("Users")
# files_table = dynamodb.Table("Files")

## new s3 directory bucket'
s3 = boto3.resource('s3', region_name=AMAZON_DEFAULT_REGION)
file_bucket = s3.Bucket('curie-file-storage')


# ==============================================================================
#                          USER MANAGEMENT FUNCTIONS
# ==============================================================================

def hash_password(password):
    """
    Hashes a password using the SHA-256 algorithm.

    Args:
        password (str): The plain text password.

    Returns:
        str: The resulting hashed password in hexadecimal format.
    """
    return hashlib.sha256(password.encode()).hexdigest()


def create_user(username, email, photo_url, password):
    """
    Creates a new user profile in the Users table with a hashed password.
    
    The function ensures that duplicate usernames are not allowed.

    Args:
        username (str): Unique identifier for the user.
        email (str): User's email address.
        photo_url (str): URL for the user's profile photo.
        password (str): Plain text password for the user.

    Returns:
        dict: A message confirming successful creation or an error if the user already exists.
    """
    hashed_pass = hash_password(password)

    user_item = {
        'UserID': username,
        'Email': email,
        'PhotoURL': photo_url,
        'PasswordHash': hashed_pass,
        'CreatedAt': datetime.now(timezone.utc).isoformat()
    }

    try:
        users.put_item(
            Item=user_item,
            ConditionExpression="attribute_not_exists(UserID)"
        )
        # Add to the s3 bucket
        user_folder = f'Users/{username}/'
        file_bucket.put_object(Key=user_folder)
   
        return {"message": "User profile created successfully."}
    except ClientError as e:
        print(e)
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            return {"error": "Username already exists."}
        else:
            raise
def delete_user(username):
    ## destroy their folder in file_bucket
    user_folder = f'Users/{username}/'
    file_bucket.delete_objects(Delete={'Objects': [{'Key': user_folder}]})
    ## delete user from users table
    users.delete_item(Key={'UserID': username})
    return {"message": "User deleted successfully."}

def get_user_profile(username):
    """
    Retrieves a user's profile from the Users table.

    Args:
        username (str): The unique identifier of the user.

    Returns:
        dict or None: The user profile item if found, otherwise None.
    """
    response = users.get_item(Key={'UserID': username})
    return response.get("Item")


def update_user_profile(username, email=None, photo_url=None):
    """
    Updates the user profile for the given username. Only email and photo_url can be updated.
    
    Args:
        username (str): Unique identifier for the user.
        email (str, optional): New email address.
        photo_url (str, optional): New photo URL.

    Returns:
        dict: A message indicating whether the profile was updated or if no fields were provided.
    """
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
        Key={'UserID': f'USER#{username}'},  # Note: Key format may need to be consistent with create_user.
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_values
    )
    return {"message": "Profile updated successfully."}

# ==============================================================================
#                          FILE & FOLDER FUNCTIONS
# ==============================================================================

# def create_folder(username, folder_name, tags=None):
#     """
#     Creates a folder for the specified user in the Files table.

#     Args:
#         username (str): The user's unique identifier.
#         folder_name (str): The name of the folder.
#         tags (list, optional): List of tags associated with the folder.

#     Returns:
#         dict: The folder item that was created.
#     """
#     folder_id = str(uuid.uuid4())
#     folder_item = {
#         "UserID": username,
#         "ItemID": folder_id,
#         "Type": "folder",
#         "FolderName": folder_name,
#         "CreatedAt": datetime.now(timezone.utc).isoformat(),
#         "Tags": tags or []
#     }
#     files_table.put_item(Item=folder_item)
#     return folder_item
def create_paper_folder(username, folder_name, tags=None):
    """
    Creates a folder for the specified user in the Files table.

    Args:
        username (str): The user's unique identifier.
        folder_name (str): The name of the folder.
        tags (list, optional): List of tags associated with the folder.

    Returns:
        dict: The folder item that was created.
    """
    try:
        folder_path = f'Users/{username}/{folder_name}/'
        file_bucket.put_object(Key=folder_path)
        return {"message": "Folder created successfully."}
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
            return {"error": "Folder already exists."}
        else:
            raise
def delete_paper_folder(username, folder_name):
    """
    Deletes a folder and all its contents (files and sub-folders) from the S3 bucket.
    
    Args:
        username (str): The user's unique identifier.
        folder_name (str): The name of the folder to delete.
        
    Returns:
        dict: A response message indicating the success or failure of the operation.
    """
    folder_prefix = f'Users/{username}/{folder_name}/'
    print("Deleting folder with prefix:", folder_prefix)
    
    s3_client = boto3.client(
        "s3",
        region_name=AMAZON_DEFAULT_REGION,
        aws_access_key_id=AMAZON_ACCESS_KEY_ID,
        aws_secret_access_key=AMAZON_SECRET_ACCESS_KEY
    )
    
    try:
        # List all objects with the specified prefix.
        response = s3_client.list_objects_v2(Bucket="curie-file-storage", Prefix=folder_prefix)
        if "Contents" not in response:
            return {"message": "Folder is empty or does not exist."}
        
        objects_to_delete = [{"Key": obj["Key"]} for obj in response["Contents"]]
        print("Objects to delete:", objects_to_delete)
        
        delete_response = s3_client.delete_objects(
            Bucket="curie-file-storage",
            Delete={"Objects": objects_to_delete}
        )
        print("Delete response:", delete_response)
        return {"message": "Folder deleted successfully."}
    except ClientError as e:
        print("Failed to delete folder:", e)
        return {"error": f"Failed to delete folder: {e}"}
def upload_paper(user, folder, paper):
    """
    Downloads an arXiv paper's PDF from its URL, uploads it to S3, and stores metadata as JSON.
    
    Args:
        user (str): The identifier for the user.
        folder (str): The S3 folder for the metadata JSON.
        paper (dict): A dictionary containing paper metadata including "entry_id" and "links".
    
    Returns:
        dict: A success message with the S3 URL, or an error message.
    """
    # Find a PDF link from the paper's links
    pdf_url = None
    for link in paper['links']:
        if "pdf" in link:
            pdf_url = link
            break

    if not pdf_url:
        return {"error": "PDF URL not found in paper links."}
    
    try:
        # Download the PDF using requests
        response = requests.get(pdf_url, stream=True)
        response.raise_for_status()
        response.raw.decode_content = True
        
        # Read the entire content into memory
        data = response.content
        content_length = len(data)
        file_obj = BytesIO(data)
        
        # Construct the S3 key for the PDF file
        pdf_key = f"SavedPapers/{paper['entry_id']}.pdf"
        s3_url = f"https://curie-file-storage.s3.amazonaws.com/{pdf_key}"
        
        # Upload the PDF to S3 with explicit ContentLength
        file_bucket.put_object(Key=pdf_key, Body=file_obj, ContentLength=content_length)
        
    except requests.exceptions.RequestException as e:
        print("Failed to download PDF:", e)
        return {"error": f"Failed to download PDF: {e}"}
    except ClientError as e:
        print("Failed to upload PDF to S3:", e)
        return {"error": f"S3 upload failed: {e}"}
    
    # Prepare paper metadata
    paper_item = {
        "entry_id": paper["entry_id"],
        "published": paper["published"],
        "updated": paper["updated"],
        "title": paper["title"],
        "authors": paper["authors"],
        "journal_ref": paper.get("journal_ref"),
        "pdf_url": pdf_url,
        "s3_url": s3_url,
        "tags" : [],
    }
    try:
        # Serialize metadata to JSON
        metadata_key = f"Users/{user}/{folder}/{paper['entry_id']}.json" if folder else f"Users/{user}/{paper['entry_id']}.json"
        paper_obj = json.dumps(paper_item)
        file_bucket.put_object(Key=metadata_key, Body=paper_obj)
        return {"message": "Paper uploaded successfully.", "s3_url": s3_url, "paper": paper_item}
    except ClientError as e:
        print("Failed to upload paper metadata:", e)
        return {"error": "Failed to upload paper metadata."}

  
def delete_paper(user, folder, paper_id):
    """
    Deletes a paper from the user's folder in the file_bucket

    Args:
        user (str): The identifier for the user.
        folder (str): The S3 folder for the metadata JSON.
        paper (dict): A dictionary containing paper metadata including "entry_id" and "links".
    
    Returns:
        dict: A success message with the S3 URL, or an error message.
    """
    try:
        # Construct the S3 key for the PDF file
        metadata_key = f"Users/{user}/{folder}/{paper_id}.json" if folder else f"Users/{user}/{paper_id}.json"
        # Delete the paper from the file_bucket
        file_bucket.delete_objects(Delete={'Objects': [{'Key': metadata_key}]})
        return {"message": "Paper deleted successfully."}
    except ClientError as e:
        print("Failed to delete paper:", e)
        return {"error": "Failed to delete paper."}

# def upload_file(username, file_name, s3_url, file_type, size, parent_folder_id=None, tags=None, arxiv_metadata=None):
#     """
#     Registers a file upload in the Files table with associated metadata.

#     Args:
#         username (str): User who owns the file.
#         file_name (str): The name of the file.
#         s3_url (str): The S3 URL where the file is stored.
#         file_type (str): Type of the file (e.g., pdf, image).
#         size (int): File size in bytes.
#         parent_folder_id (str, optional): ID of the parent folder, if any.
#         tags (list, optional): List of tags associated with the file.
#         arxiv_metadata (dict, optional): Metadata if the file is an arXiv paper.

#     Returns:
#         dict: The file item that was created and stored in the Files table.
#     """
#     file_id = str(uuid.uuid4())
#     file_item = {
#         "UserID": username,
#         "ItemID": file_id,
#         "Type": "file",
#         "FileName": file_name,
#         "ParentFolderID": parent_folder_id,
#         "S3URL": s3_url,
#         "FileType": file_type,
#         "Size": size,
#         "UploadedAt": datetime.now(timezone.utc).isoformat(),
#         "Tags": tags or []
#     }
#     if arxiv_metadata:
#         file_item.update({
#             "ArxivID": arxiv_metadata.get("entry_id"),
#             "Title": arxiv_metadata.get("title"),
#             "Authors": arxiv_metadata.get("authors"),
#             "Published": arxiv_metadata.get("published"),
#             "Updated": arxiv_metadata.get("updated"),
#             "Links": arxiv_metadata.get("links")
#         })

#     files_table.put_item(Item=file_item)
#     return file_item

def get_paper_metadata(username, folder, item_id):
    file_path = f'Users/{username}/{folder}/{item_id}.json'
    try:
        obj = file_bucket.Object(file_path)
        body = obj.get()['Body'].read().decode('utf-8')
        return json.loads(body)
    except ClientError as e:
        return {"error": f"Failed to get paper metadata: {e}"}
    
def get_paper_pdf(username, folder, item_id):
    """
    Retrieve the PDF URL of a paper from its metadata.

    This function fetches the metadata of a paper using the provided 
    username, folder, and item ID. If the metadata contains an "s3_url" 
    key, the corresponding value (PDF URL) is returned. Otherwise, an 
    error message is returned indicating that the PDF URL was not found.

    Args:
        username (str): The username associated with the paper.
        folder (str): The folder where the paper is stored.
        item_id (str): The unique identifier of the paper.

    Returns:
        str or dict: The PDF URL as a string if found, or a dictionary 
        with an error message if the URL is not present in the metadata.
    """
    metadata = get_paper_metadata(username, folder, item_id)
    if "s3_url" in metadata:
        return metadata["s3_url"]
    return {"error": "PDF URL not found in paper metadata."}
def get_file_system_recursive(prefix, bucket_name="curie-file-storage"):
    """
    Recursively retrieves the file system structure from S3 for a given prefix.
    
    For loose JSON files at the current level, it fetches and parses the file contents
    so that the actual JSON objects are returned instead of just the filenames.
    
    Args:
        prefix (str): The S3 key prefix representing the current folder.
        bucket_name (str): The S3 bucket name.
    
    Returns:
        dict: A dictionary with two keys:
              - "folders": a list of dictionaries with "name" and "content" keys,
              - "jsons": a list of JSON objects (parsed from the JSON files) at the current level.
    """
    s3_client = session.client("s3")
    response = s3_client.list_objects_v2(
        Bucket=bucket_name,
        Prefix=prefix,
        Delimiter="/"
    )
    
    file_system = {"folders": [], "jsons": []}
    
    # Process loose JSON files at the current level.
    for obj in response.get("Contents", []):
        key = obj.get("Key")
        # Skip placeholder objects representing folders.
        if key.endswith("/"):
            continue
        # Extract the file name relative to the current prefix.
        file_name = key[len(prefix):]
        if file_name.endswith(".json"):
            # Fetch the JSON file from S3.
            json_obj = s3_client.get_object(Bucket=bucket_name, Key=key)
            json_data = json_obj['Body'].read().decode('utf-8')
            parsed_json = json.loads(json_data)
            file_system["jsons"].append(parsed_json)
    
    # Process sub-folders (returned as CommonPrefixes).
    for cp in response.get("CommonPrefixes", []):
        folder_prefix = cp.get("Prefix")
        # Extract the folder name relative to the current prefix.
        folder_name = folder_prefix[len(prefix):].rstrip("/")
        # Recursively get the content of this folder.
        nested_fs = get_file_system_recursive(folder_prefix, bucket_name)
        file_system["folders"].append({
            "name": folder_name,
            "content": nested_fs
        })
    
    return file_system

def get_user_file_system(username, current_folder=None):
    """
    Retrieves the complete file system structure for a given user.
    
    The function uses the base prefix "Users/{username}/" and recursively 
    builds a dictionary representing all sub-folders and loose JSON files (as JSON objects).
    
    Args:
        username (str): The user identifier.
    
    Returns:
        dict: A nested dictionary representing the user's file system.
    """
    base_prefix = f"Users/{username}/" if not current_folder else f"Users/{username}/{current_folder}/"
    return get_file_system_recursive(base_prefix)
def update_tags(username, folder, paper_id, new_tags):
    """
    Updates the tags of a specific file or folder in the Files table.

    Args:
        username (str): The user's unique identifier.
        item_id (str): The ID of the file or folder.
        new_tags (list): A new list of tags.

    Returns:
        dict: The response from the update operation containing the updated attributes.
    """
    # Update the tags attribute of the file/folder
    key = f"Users/{username}/{folder}/{paper_id}.json" if folder else f"Users/{username}/{paper_id}.json"
    print("the new tags to add", new_tags)
    print("the key", key)
    try:
        # Retrieve the current metadata JSON from S3
        obj = file_bucket.Object(key)
        body = obj.get()['Body'].read().decode('utf-8')
        metadata = json.loads(body)
        print("Current metadata:", metadata)
        # Update the tags field
        metadata["tags"] = new_tags
        print("Updated metadata:", metadata['tags'])
        
        # Serialize the updated metadata
        updated_metadata = json.dumps(metadata)
        
        # Write the updated metadata back to S3
        file_bucket.put_object(Key=key, Body=updated_metadata)
        
        return {"message": "Tags updated successfully.", "updated_metadata": metadata}
    except ClientError as e:
        print("Failed to update tags:", e)
        return {"error": f"Failed to update tags: {e}"}
        
    


# def search_by_tag(username, tag):
#     """
#     Searches for files or folders belonging to a user that contain a specific tag.

#     Args:
#         username (str): The user's unique identifier.
#         tag (str): The tag to search for.

#     Returns:
#         list: A list of items (files/folders) that match the tag.
#     """
#     response = files_table.scan(
#         FilterExpression="UserID = :u AND contains(Tags, :t)",
#         ExpressionAttributeValues={":u": username, ":t": tag}
#     )
#     return response.get("Items", [])


# def get_user_folders(username):
#     """
#     Retrieves all folders associated with a specific user.

#     Args:
#         username (str): The user's unique identifier.

#     Returns:
#         list: A list of folder items.
#     """
#     response = files_table.scan(
#         FilterExpression="UserID = :u AND Type = :t",
#         ExpressionAttributeValues={":u": username, ":t": "folder"}
#     )
#     return response.get("Items", [])


# def get_loose_files(username):
#     """
#     Retrieves files for a user that are not stored inside any folder.

#     Args:
#         username (str): The user's unique identifier.

#     Returns:
#         list: A list of file items.
#     """
#     response = files_table.scan(
#         FilterExpression="UserID = :u AND Type = :t AND attribute_not_exists(ParentFolderID)",
#         ExpressionAttributeValues={":u": username, ":t": "file"}
#     )
#     return response.get("Items", [])


# def get_folder_files(username, folder_id):
#     """
#     Retrieves files within a specific folder for a given user.

#     Args:
#         username (str): The user's unique identifier.
#         folder_id (str): The ID of the folder.

#     Returns:
#         list: A list of file items contained in the folder.
#     """
#     response = files_table.scan(
#         FilterExpression="UserID = :u AND Type = :t AND ParentFolderID = :fid",
#         ExpressionAttributeValues={":u": username, ":t": "file", ":fid": folder_id}
#     )
#     return response.get("Items", [])


def move_file(username, old_folder, new_folder, file_id):
    print("Moving file ", file_id, " from ", old_folder or "[Loose Papers]", " to ", new_folder or "[Loose Papers]")

    if old_folder:
        old_path = f'Users/{username}/{old_folder}/{file_id}.json'
    else:
        old_path = f'Users/{username}/{file_id}.json'

    if new_folder:
        new_path = f'Users/{username}/{new_folder}/{file_id}.json'
    else:
        new_path = f'Users/{username}/{file_id}.json'

    print("Moving from ", old_path, " to ", new_path)

    try:
        file_bucket.copy({'Bucket': 'curie-file-storage', 'Key': old_path}, new_path)
        file_bucket.delete_objects(Delete={'Objects': [{'Key': old_path}]})
        return {"message": "File moved successfully."}
    except ClientError as e:
        return {"error": f"Failed to move file: {e}"}

    


# ==============================================================================
#                          TEST DATA & UTILITY FUNCTIONS
# ==============================================================================

def batch_create_users():
    """
    Creates a batch of test users in the Users table.

    This function is intended for testing purposes only.
    """
    test_users = [
        {"username": "Josh", "email": "josh@example.com", "photo_url": "https://s3.amazonaws.com/my-bucket/josh-profile.jpg", "password": "password123"},
        {"username": "Sydney", "email": "sydney@example.com", "photo_url": "https://s3.amazonaws.com/my-bucket/sydney-profile.jpg", "password": "password456"},
        {"username": "Shyam", "email": "shyam@example.com", "photo_url": "https://s3.amazonaws.com/my-bucket/shyam-profile.jpg", "password": "password789"}
    ]
    for user in test_users:
        print(create_user(user["username"], user["email"], user["photo_url"], user["password"]))


def generate_test_files_with_arxiv():
    """
    Generates test file entries in the Files table using sample arXiv paper metadata.
    
    This function is intended for testing purposes only.
    """
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
    print("ArXiv test files uploaded.")


def check_table_exists(table_name):
    """
    Checks if a DynamoDB table exists.

    Args:
        table_name (str): The name of the table to check.

    Returns:
        bool: True if the table exists, False otherwise.
    """
    client = session.client("dynamodb")
    try:
        client.describe_table(TableName=table_name)
        print(f"Table '{table_name}' exists.")
        return True
    except client.exceptions.ResourceNotFoundException:
        print(f" Table '{table_name}' does not exist.")
        return False


# def create_files_table():
#     """
#     Creates the Files table in DynamoDB if it does not already exist.
    
#     The table uses a composite primary key consisting of 'UserID' (HASH) and 'ItemID' (RANGE).
#     """
#     if check_table_exists("Files"):
#         return

#     session.client("dynamodb").create_table(
#         TableName="Files",
#         KeySchema=[
#             {'AttributeName': 'UserID', 'KeyType': 'HASH'},
#             {'AttributeName': 'ItemID', 'KeyType': 'RANGE'}
#         ],
#         AttributeDefinitions=[
#             {'AttributeName': 'UserID', 'AttributeType': 'S'},
#             {'AttributeName': 'ItemID', 'AttributeType': 'S'}
#         ],
#         ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
#     )
#     print("Table 'Files' created successfully.")


# def upload_pdf_to_s3(file_path, s3_key):
#     """
#     Uploads a file to an S3 bucket using the boto3 resource API.

#     Args:
#         file_path (str): The local path to the file.
#         s3_key (str): The destination key in S3.
#         bucket_name (str, optional): The S3 bucket name. Defaults to "curie-file-storage".

#     Returns:
#         dict: A success message with the S3 URL if upload is successful,
#               or an error message if it fails.
#     """

#     try:
#         bucket = s3.Bucket(bucket_name)
#         bucket.upload_file(file_path, s3_key)
#         s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
#         return {"success": True, "s3_url": s3_url}
#     except ClientError as e:
#         print("Upload failed:", e)
#         return {"success": False, "error": str(e)}


def upload_folder_to_s3(folder_path, s3_prefix="", bucket_name="curie-file-storage"):
    """
    Uploads all files within a local folder to an S3 bucket.

    Each file's S3 key is generated by combining the given s3_prefix with its relative path.
    
    Args:
        folder_path (str): The local path of the folder to upload.
        s3_prefix (str, optional): A prefix to add to each file's S3 key. Defaults to an empty string.
        bucket_name (str, optional): The S3 bucket name. Defaults to "curie-file-storage".

    Returns:
        list: A list of S3 URLs for the successfully uploaded files.
    """
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
    """
    Prints preview URLs for images from a list of S3 URLs.

    Only URLs ending with common image extensions are printed.

    Args:
        s3_urls (list): A list of S3 URL strings.
    """
    for url in s3_urls:
        if url.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
            print(f"🖼 Image preview URL: {url}")


# ------------------------------------------------------------------------------
# Uncomment the following lines to run test functions
# ------------------------------------------------------------------------------
# generate_test_files_with_arxiv()
# print(preview_image_urls(['https://curie-file-storage.s3.amazonaws.com/profile-pictures/preline.png']))
print(create_user("test1", "jmayhugh@tamu.edu", "https://curie-file-storage.s3.amazonaws.com/profile-pictures/preline.png", "password123"))
#print(create_paper_folder("Joshua4", "TestFolder"))
# Hard-coded paper object for testing
paper = {
    "authors": ["Qin Zhang", "Manoj Karkee", "Amy Tabb"],
    "entry_id": "1907.13114v1",
    "journal_ref": (
        "book chapter in Robotics and automation for improving agriculture,\n"
        "  J. Billingsley, Ed. Burleigh Dodds Science Publishing, 2019"
    ),
    "links": [
        "http://dx.doi.org/10.19103/AS.2019.0056.14",
        "http://arxiv.org/abs/1907.13114v1",
        "http://arxiv.org/pdf/1907.13114v1"
    ],
    "published": "2019-07-30T17:56:17+00:00",
    "summary": (
        "Book chapter that summarizes recent research on agricultural robotics in\n"
        "orchard management, including Robotic pruning, Robotic thinning, Robotic\n"
        "spraying, Robotic harvesting, Robotic fruit transportation, and future trends."
    ),
    "title": "The Use of Agricultural Robots in Orchard Management",
    "updated": "2019-07-30T17:56:17+00:00"
}
#print(upload_paper("Joshua4", "TestFolder", paper))
#print(move_file("Joshua4", "TestFolder", "TestFolder2", "1907.13114v1"))
#print(get_paper_metadata("Joshua4", "TestFolder2", "1907.13114v1"))
#print(get_paper_pdf("Joshua4", "TestFolder2", "1907.13114v1"))
# delete_user("test1")
# print(create_paper_folder("test1", "TestFolder1"))
# print(create_paper_folder("test1", "TestFolder2"))
# print(create_paper_folder("test1", "TestFolder3"))
# print(create_paper_folder("test1", "TestFolder4"))
# # create a bunch of files in this table
# print(upload_paper("test1", "TestFolder1", paper))
# print(upload_paper("test1", "TestFolder1", paper))
# print(upload_paper("test1", "TestFolder1", paper))
# print(upload_paper("test1", "TestFolder1", paper))
# print(upload_paper("test1", "TestFolder2", paper))
# print(upload_paper("test1", "TestFolder3", paper))
# print(upload_paper("test1", "TestFolder4", paper))
# paper2 = {
#     "authors": ["Elad Hazan"],
#     "entry_id": "1909.03550v1",
#     "journal_ref": None,
#     "links": [
#         "http://arxiv.org/abs/1909.03550v1",
#         "http://arxiv.org/pdf/1909.03550v1"
#     ],
#     "published": "2019-09-08T21:49:42+00:00",
#     "summary": (
#         "Lecture notes on optimization for machine learning, derived from a course at\n"
#         "Princeton University and tutorials given in MLSS, Buenos Aires, as well as\n"
#         "Simons Foundation, Berkeley."
#     ),
#     "title": "Lecture Notes: Optimization for Machine Learning",
#     "updated": "2019-09-08T21:49:42+00:00"
# }
# print(upload_paper("test1", "", paper))
# print(upload_paper("test1", "", paper2))
# print(get_user_file_system("test1"))
