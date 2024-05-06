from os import getenv
import boto3
from datetime import datetime
from uuid import uuid4
from json import dumps


def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = getenv('TABLENAME')
    table = dynamodb.Table(table_name)
    
    input_data = event['arguments']['input']
    
    # Generate a unique ID for the room
    room_id = str(uuid4())
    owner = event['identity']['username']
    
    # Create a new room item in DynamoDB
    room_item = {
        'id': room_id,
        'name': input_data['name'],
        'owner': owner,
        'createdAt': datetime.now().isoformat() + 'Z',
        'updatedAt': datetime.now().isoformat() + 'Z',
    }
    
    table.put_item(Item=room_item)
    
    # Construct the response according to the query
    response = {
        'id': room_item['id'],
        'name': room_item['name'],
        'createdAt': room_item['createdAt'],
        'updatedAt': room_item['updatedAt']
    }
    
    return response
