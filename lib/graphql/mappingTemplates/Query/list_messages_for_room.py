from os import getenv
import boto3

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = getenv('TABLENAME')
    table = dynamodb.Table(table_name)
    
    index_name = 'messages-by-room-id'
    expression_attribute_values = {':roomId': event['arguments']['roomId']}
    
    params = {
        'IndexName': index_name,
        'KeyConditionExpression': 'roomId = :roomId',
        'ExpressionAttributeValues': expression_attribute_values,
    }
    
    if 'sortDirection' in event['arguments'] and event['arguments']['sortDirection'] == 'DESC':
        params['ScanIndexForward'] = False
    else:
        params['ScanIndexForward'] = True
    
    if 'nextToken' in event['arguments']:
        params['ExclusiveStartKey'] = {'id': event['arguments']['nextToken']}
    
    response = table.query(**params)
    
    # Extract items from the response
    items = response.get('Items', [])
    
    # Format the items to match the GraphQL response schema
    messages = [{
        'id': item['id'],
        'content': {
            'text': item.get('content', None).get('text', None),
            'imageId': item.get('content', None).get('imageId', None)
        },
        'owner': item['owner'],
        'createdAt': item['createdAt'] + 'Z',
        'updatedAt': item['updatedAt'] + 'Z',
        'roomId': item['roomId']
    } for item in items]
    
    # Construct the response according to the schema
    response_data = {
        'items': messages,
        'nextToken': response.get('LastEvaluatedKey', None)
    }
    
    return response_data
