from os import getenv
import boto3

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = getenv('TABLENAME')
    table = dynamodb.Table(table_name)
    
    limit = 100 if event['arguments'].get('limit', 100) == None else event['arguments'].get('limit', 100)
    next_token = event['arguments'].get('nextToken', None)
    
    params = {
        'Limit': limit
    }
    
    if next_token:
        params['ExclusiveStartKey'] = {'id': next_token}
    
    response = table.scan(**params)

    # Extract items from the response
    items = response.get('Items', [])
    
    # Format the items to match the GraphQL response schema
    rooms = [{
        'id': item['id'],
        'name': item['name'],
        'messages': item.get('messages', {}).get('items', []),
        'createdAt': item['createdAt'],
        'updatedAt': item['updatedAt']
    } for item in items]
    
    # Construct the response according to the schema
    response_data = {
        'items': rooms,
        'nextToken': response.get('LastEvaluatedKey', None)
    }
    
    return response_data
