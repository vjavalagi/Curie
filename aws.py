import boto3
from dotenv import load_dotenv, find_dotenv
import os
from botocore.exceptions import ClientError

load_dotenv(find_dotenv())

AWS_ACCESS_KEY_ID= os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY=os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION=os.getenv("AWS_DEFAULT_REGION")


dyanmodb = boto3.resource(
    'dynamodb',
    aws_access_key_id = AWS_ACCESS_KEY_ID,
    aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
    region_name = AWS_DEFAULT_REGION
)
users = dyanmodb.Table("cure_users")

response = users.get_item(Key={'username': 'johndoe'})

print(response)

def makeuser(username, email, photo_path, password):
    # create a new user and hashed password
    hashed_pass = hash(password)
    
    # Create the item to insert
    user_item = {
        'username': username,    # Partition key
        'email': email,
        'photo_path': photo_path,
        'password': hashed_pass
    }
    # Insert the item into the table
    response = users.put_item(Item=user_item)
    maketable(username)
    return response
    
    
def maketable(username):
    # Initialize the DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    
    # Construct a table name using the username. Adjust this naming convention as needed.
    table_name = f"{username}_Table"
    
    try:
        # Create the DynamoDB table with a single primary key "username"
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {
                    'AttributeName': 'username',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'username',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        
        # Wait until the table exists.
        table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
        print(f"Table '{table_name}' created successfully!")
        return table
    except ClientError as e:
        print("Error creating table:", e)
        return None
    
def 
    
def test_make_user():
    # List of test users with names: Josh, Veda, Sydney, and Shaym
    test_users = [
        {"username": "Josh", "email": "josh@example.com", "photo_path": "/photos/josh.png", "password": "password123"},
        {"username": "Veda", "email": "veda@example.com", "photo_path": "/photos/veda.png", "password": "password456"},
        {"username": "Sydney", "email": "sydney@example.com", "photo_path": "/photos/sydney.png", "password": "password789"},
        {"username": "Shaym", "email": "shaym@example.com", "photo_path": "/photos/shaym.png", "password": "password321"}
    ]
    
    # Process each test user: insert and then retrieve the item to verify
    for user in test_users:
        put_response = makeuser(user["username"], user["email"], user["photo_path"], user["password"])
        print(f"Put Item Response for {user['username']}: {put_response}")
        
        # Retrieve the inserted item
        get_response = users.get_item(Key={'username': user["username"]})
        print(f"Retrieved Item for {user['username']}: {get_response}")

# Run the tests
test_make_user()
