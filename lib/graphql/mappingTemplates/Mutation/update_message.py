from os import getenv
import boto3
from datetime import datetime

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = getenv('TABLENAME')
    table = dynamodb.Table(table_name)
    
    updated_at = datetime.now().isoformat()
    
    response = table.update_item(
        Key={
            'id': event['arguments']['id']
        },
        UpdateExpression='SET #updatedAt = :updatedAt, #content = :content',
        ExpressionAttributeNames={
            '#updatedAt': 'updatedAt',
            '#content': 'content'
        },
        ExpressionAttributeValues={
            ':updatedAt': updated_at,
            ':content': event['arguments']['content']
        },
        ReturnValues='ALL_NEW'
    )
    
    return {
        'statusCode': 200,
        'body': 'Message updated successfully',
        'updatedMessage': response['Attributes']
    }
