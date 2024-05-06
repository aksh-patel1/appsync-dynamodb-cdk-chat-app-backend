from os import getenv
import boto3
from datetime import datetime
from uuid import uuid4

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = getenv('TABLENAME')
    table = dynamodb.Table(table_name)
    
    message_id = str(uuid4())
    owner = event['identity']['username']
    created_at = datetime.now().isoformat()
    updated_at = datetime.now().isoformat()

    input_data = event['arguments']['input']
    
    item = {
        'id': message_id,
        'roomId': input_data['roomId'],
        'content': input_data['content'],
        'owner': owner,
        'createdAt': created_at,
        'updatedAt': updated_at,
        # Add other attributes here if needed
    }
    
    table.put_item(Item=item)
    
    # Construct the response according to the schema
    response = {
        'id': item['id'],
        'content': item['content'],
        'owner': item['owner'],
        'createdAt': item['createdAt'] + 'Z',
        'updatedAt': item['updatedAt'] + 'Z',
        'roomId': item['roomId']
    }
    
    return response
