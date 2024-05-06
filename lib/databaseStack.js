"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
class DatabaseStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const userTable = new aws_dynamodb_1.Table(this, 'UserTable', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'id', type: aws_dynamodb_1.AttributeType.STRING },
        });
        const roomTable = new aws_dynamodb_1.Table(this, 'RoomTable', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'id', type: aws_dynamodb_1.AttributeType.STRING },
        });
        const messageTable = new aws_dynamodb_1.Table(this, 'MessageTable', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'id', type: aws_dynamodb_1.AttributeType.STRING },
        });
        messageTable.addGlobalSecondaryIndex({
            indexName: 'messages-by-room-id',
            partitionKey: { name: 'roomId', type: aws_dynamodb_1.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: aws_dynamodb_1.AttributeType.STRING },
        });
        const messageTableServiceRole = new aws_iam_1.Role(this, 'MessageTableServiceRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('dynamodb.amazonaws.com'),
        });
        messageTableServiceRole.addToPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            resources: [`${messageTable.tableArn}/index/messages-by-room-id`],
            actions: ['dymamodb:Query'],
        }));
        this.roomTable = roomTable;
        this.userTable = userTable;
        this.messageTable = messageTable;
    }
}
exports.DatabaseStack = DatabaseStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2VTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRhdGFiYXNlU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQXlFO0FBQ3pFLDJEQUE0RTtBQUM1RSxpREFLNEI7QUFLNUIsTUFBYSxhQUFjLFNBQVEsbUJBQUs7SUFLdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUV2QixNQUFNLFNBQVMsR0FBRyxJQUFJLG9CQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUM5QyxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLFdBQVcsRUFBRSwwQkFBVyxDQUFDLGVBQWU7WUFDeEMsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNLEVBQUU7U0FDeEQsQ0FBQyxDQUFBO1FBRUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDOUMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxXQUFXLEVBQUUsMEJBQVcsQ0FBQyxlQUFlO1lBQ3hDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTSxFQUFFO1NBQ3hELENBQUMsQ0FBQTtRQUVGLE1BQU0sWUFBWSxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3BELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsV0FBVyxFQUFFLDBCQUFXLENBQUMsZUFBZTtZQUN4QyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU0sRUFBRTtTQUN4RCxDQUFDLENBQUE7UUFFRixZQUFZLENBQUMsdUJBQXVCLENBQUM7WUFDcEMsU0FBUyxFQUFFLHFCQUFxQjtZQUNoQyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU0sRUFBRTtZQUM1RCxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU0sRUFBRTtTQUMxRCxDQUFDLENBQUE7UUFFRixNQUFNLHVCQUF1QixHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUN6RSxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQztTQUN6RCxDQUFDLENBQUE7UUFFRix1QkFBdUIsQ0FBQyxXQUFXLENBQ2xDLElBQUkseUJBQWUsQ0FBQztZQUNuQixNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO1lBQ3BCLFNBQVMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLFFBQVEsNEJBQTRCLENBQUM7WUFDakUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7U0FDM0IsQ0FBQyxDQUNGLENBQUE7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQTtJQUNqQyxDQUFDO0NBQ0Q7QUFoREQsc0NBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJ1xyXG5pbXBvcnQgeyBBdHRyaWJ1dGVUeXBlLCBCaWxsaW5nTW9kZSwgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInXHJcbmltcG9ydCB7XHJcblx0RWZmZWN0LFxyXG5cdFBvbGljeVN0YXRlbWVudCxcclxuXHRSb2xlLFxyXG5cdFNlcnZpY2VQcmluY2lwYWwsXHJcbn0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSdcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cydcclxuXHJcbmludGVyZmFjZSBEYXRhYmFzZVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHt9XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VTdGFjayBleHRlbmRzIFN0YWNrIHtcclxuXHRwdWJsaWMgcmVhZG9ubHkgcm9vbVRhYmxlOiBUYWJsZVxyXG5cdHB1YmxpYyByZWFkb25seSB1c2VyVGFibGU6IFRhYmxlXHJcblx0cHVibGljIHJlYWRvbmx5IG1lc3NhZ2VUYWJsZTogVGFibGVcclxuXHJcblx0Y29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERhdGFiYXNlU3RhY2tQcm9wcykge1xyXG5cdFx0c3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcclxuXHJcblx0XHRjb25zdCB1c2VyVGFibGUgPSBuZXcgVGFibGUodGhpcywgJ1VzZXJUYWJsZScsIHtcclxuXHRcdFx0cmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG5cdFx0XHRiaWxsaW5nTW9kZTogQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxyXG5cdFx0XHRwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ2lkJywgdHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcclxuXHRcdH0pXHJcblxyXG5cdFx0Y29uc3Qgcm9vbVRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdSb29tVGFibGUnLCB7XHJcblx0XHRcdHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuXHRcdFx0YmlsbGluZ01vZGU6IEJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcclxuXHRcdFx0cGFydGl0aW9uS2V5OiB7IG5hbWU6ICdpZCcsIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXHJcblx0XHR9KVxyXG5cclxuXHRcdGNvbnN0IG1lc3NhZ2VUYWJsZSA9IG5ldyBUYWJsZSh0aGlzLCAnTWVzc2FnZVRhYmxlJywge1xyXG5cdFx0XHRyZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcblx0XHRcdGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXHJcblx0XHRcdHBhcnRpdGlvbktleTogeyBuYW1lOiAnaWQnLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG5cdFx0fSlcclxuXHJcblx0XHRtZXNzYWdlVGFibGUuYWRkR2xvYmFsU2Vjb25kYXJ5SW5kZXgoe1xyXG5cdFx0XHRpbmRleE5hbWU6ICdtZXNzYWdlcy1ieS1yb29tLWlkJyxcclxuXHRcdFx0cGFydGl0aW9uS2V5OiB7IG5hbWU6ICdyb29tSWQnLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG5cdFx0XHRzb3J0S2V5OiB7IG5hbWU6ICdjcmVhdGVkQXQnLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG5cdFx0fSlcclxuXHJcblx0XHRjb25zdCBtZXNzYWdlVGFibGVTZXJ2aWNlUm9sZSA9IG5ldyBSb2xlKHRoaXMsICdNZXNzYWdlVGFibGVTZXJ2aWNlUm9sZScsIHtcclxuXHRcdFx0YXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZHluYW1vZGIuYW1hem9uYXdzLmNvbScpLFxyXG5cdFx0fSlcclxuXHJcblx0XHRtZXNzYWdlVGFibGVTZXJ2aWNlUm9sZS5hZGRUb1BvbGljeShcclxuXHRcdFx0bmV3IFBvbGljeVN0YXRlbWVudCh7XHJcblx0XHRcdFx0ZWZmZWN0OiBFZmZlY3QuQUxMT1csXHJcblx0XHRcdFx0cmVzb3VyY2VzOiBbYCR7bWVzc2FnZVRhYmxlLnRhYmxlQXJufS9pbmRleC9tZXNzYWdlcy1ieS1yb29tLWlkYF0sXHJcblx0XHRcdFx0YWN0aW9uczogWydkeW1hbW9kYjpRdWVyeSddLFxyXG5cdFx0XHR9KVxyXG5cdFx0KVxyXG5cclxuXHRcdHRoaXMucm9vbVRhYmxlID0gcm9vbVRhYmxlXHJcblx0XHR0aGlzLnVzZXJUYWJsZSA9IHVzZXJUYWJsZVxyXG5cdFx0dGhpcy5tZXNzYWdlVGFibGUgPSBtZXNzYWdlVGFibGVcclxuXHR9XHJcbn1cclxuIl19