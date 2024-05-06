"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const path = require("path");
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
const lambda = require("aws-cdk-lib/aws-lambda");
class APIStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new aws_appsync_alpha_1.GraphqlApi(this, 'ChatApp', {
            name: 'ChatApp',
            schema: aws_appsync_alpha_1.Schema.fromAsset(path.join(__dirname, 'graphql/schema.graphql')),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: aws_appsync_alpha_1.AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool: props.userpool,
                    },
                },
            },
            logConfig: {
                fieldLogLevel: aws_appsync_alpha_1.FieldLogLevel.ALL,
            },
            xrayEnabled: true,
        });
        const createRoomLambda = new lambda.Function(this, 'CreateRoomFunction', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'create_room.create',
            code: lambda.Code.fromAsset(path.join(__dirname, 'graphql/mappingTemplates/Mutation/create_room.py')),
            environment: {
                TABLENAME: props.roomTable.tableName,
            },
        });
        const createMessageLambda = new lambda.Function(this, 'CreateRoomFunction', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'create_message.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, 'graphql/mappingTemplates/Mutation/create_message.py')),
            environment: {
                TABLENAME: props.messageTable.tableName,
            },
        });
        const updateMessageLambda = new lambda.Function(this, 'CreateRoomFunction', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'update_message.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, 'graphql/mappingTemplates/Mutation/update_message.py')),
            environment: {
                TABLENAME: props.messageTable.tableName,
            },
        });
        const listMessagesForRoomLambda = new lambda.Function(this, 'CreateRoomFunction', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'list_messages_for_room.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, 'graphql/mappingTemplates/Query/list_messages_for_room.py')),
            environment: {
                TABLENAME: props.messageTable.tableName,
            }
        });
        const listRoomsLambda = new lambda.Function(this, 'CreateRoomFunction', {
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'list_rooms.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, 'graphql/mappingTemplates/Query/list_rooms.py')),
            environment: {
                TABLENAME: props.roomTable.tableName,
            }
        });
        const createRoomLambdaDS = api.addLambdaDataSource('CreateRoomLambdaDataSource', createRoomLambda);
        createRoomLambdaDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'createRoom'
        });
        const createMessageLambdaDS = api.addLambdaDataSource('CreateMessageLambdaDataSource', createMessageLambda);
        createMessageLambdaDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'createMessage'
        });
        const updateMessageLambdaDS = api.addLambdaDataSource('UpdateMessageLambdaDataSource', updateMessageLambda);
        updateMessageLambdaDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'updateMessage',
        });
        const listMessagesForRoomLambdaDS = api.addLambdaDataSource('ListMessagesForRoomLambdaDataSource', listMessagesForRoomLambda);
        listMessagesForRoomLambdaDS.createResolver({
            typeName: 'Query',
            fieldName: 'listMessagesForRoom',
        });
        const listRoomsLambdaDS = api.addLambdaDataSource('ListRoomsLambdaDataSource', listRoomsLambda);
        listRoomsLambdaDS.createResolver({
            typeName: 'Query',
            fieldName: 'listRooms'
        });
        // const roomTableDataSource = api.addDynamoDbDataSource(
        // 	'RoomTableDataSource',
        // 	props.roomTable
        // )
        // const messageTableDataSource = api.addDynamoDbDataSource(
        // 	'MessageTableDataSource',
        // 	props.messageTable
        // )
        // roomTableDataSource.createResolver({
        // 	typeName: 'Mutation',
        // 	fieldName: 'createRoom',
        // 	requestMappingTemplate: MappingTemplate.fromFile(
        // 		path.join(
        // 			__dirname,
        // 			'graphql/mappingTemplates/Mutation.createRoom.req.vtl'
        // 		)
        // 	),
        // 	responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        // })
        // roomTableDataSource.createResolver({
        // 	typeName: 'Query',
        // 	fieldName: 'listRooms',
        // 	// Can't use MappingTemplate.dynamoDbScanTable() because it's too basic for our needs👇🏽
        // 	// https://github.com/aws/aws-cdk/blob/5e4d48e2ff12a86c0fb0177fe7080990cf79dbd0/packages/%40aws-cdk/aws-appsync/lib/mapping-template.ts#L39. I should PR this to take in an optional limit and scan 🤔
        // 	requestMappingTemplate: MappingTemplate.fromFile(
        // 		path.join(__dirname, 'graphql/mappingTemplates/Query.listRooms.req.vtl')
        // 	),
        // 	responseMappingTemplate: MappingTemplate.fromFile(
        // 		path.join(__dirname, 'graphql/mappingTemplates/Query.listRooms.res.vtl')
        // 	),
        // })
        // messageTableDataSource.createResolver({
        // 	typeName: 'Mutation',
        // 	fieldName: 'createMessage',
        // 	requestMappingTemplate: MappingTemplate.fromFile(
        // 		path.join(
        // 			__dirname,
        // 			'graphql/mappingTemplates/Mutation.createMessage.req.vtl'
        // 		)
        // 	),
        // 	responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        // })
        // messageTableDataSource.createResolver({
        // 	typeName: 'Query',
        // 	fieldName: 'listMessagesForRoom',
        // 	requestMappingTemplate: MappingTemplate.fromFile(
        // 		path.join(
        // 			__dirname,
        // 			'graphql/mappingTemplates/Query.listMessagesForRoom.req.vtl'
        // 		)
        // 	),
        // 	responseMappingTemplate: MappingTemplate.fromFile(
        // 		path.join(
        // 			__dirname,
        // 			'graphql/mappingTemplates/Query.listMessagesForRoom.res.vtl'
        // 		)
        // 	),
        // })
        // messageTableDataSource.createResolver({
        // 	typeName: 'Mutation',
        // 	fieldName: 'updateMessage',
        // 	requestMappingTemplate: MappingTemplate.fromFile(
        // 		path.join(
        // 			__dirname,
        // 			'graphql/mappingTemplates/Mutation.updateMessage.req.vtl'
        // 		)
        // 	),
        // 	responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        // })
        new aws_cdk_lib_1.CfnOutput(this, 'GraphQLAPIURL', {
            value: api.graphqlUrl,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'GraphQLAPIID', {
            value: api.apiId,
        });
    }
}
exports.APIStack = APIStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGlTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMEQ7QUFHMUQsNkJBQTRCO0FBQzVCLGtFQU1tQztBQUduQyxpREFBaUQ7QUFVakQsTUFBYSxRQUFTLFNBQVEsbUJBQUs7SUFDbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFvQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUV2QixNQUFNLEdBQUcsR0FBRyxJQUFJLDhCQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMzQyxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSwwQkFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3hFLG1CQUFtQixFQUFFO2dCQUNwQixvQkFBb0IsRUFBRTtvQkFDckIsaUJBQWlCLEVBQUUscUNBQWlCLENBQUMsU0FBUztvQkFDOUMsY0FBYyxFQUFFO3dCQUNmLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtxQkFDeEI7aUJBQ0Q7YUFDRDtZQUNELFNBQVMsRUFBRTtnQkFDVixhQUFhLEVBQUUsaUNBQWEsQ0FBQyxHQUFHO2FBQ2hDO1lBQ0QsV0FBVyxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFBO1FBS0YsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ3hFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsT0FBTyxFQUFFLG9CQUFvQjtZQUM3QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDcEMsU0FBUyxFQUNULGtEQUFrRCxDQUNsRCxDQUFDO1lBQ0YsV0FBVyxFQUFF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c0Q7UUFDdEQsZUFBZTtRQUNmLGdCQUFnQjtRQUNoQixrRUFBa0U7UUFDbEUsTUFBTTtRQUNOLE1BQU07UUFDTixLQUFLO1FBRUwsMENBQTBDO1FBQzFDLHlCQUF5QjtRQUN6QiwrQkFBK0I7UUFDL0IscURBQXFEO1FBQ3JELGVBQWU7UUFDZixnQkFBZ0I7UUFDaEIsK0RBQStEO1FBQy9ELE1BQU07UUFDTixNQUFNO1FBQ04sa0VBQWtFO1FBQ2xFLEtBQUs7UUFFTCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNwQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDckIsQ0FBQyxDQUFBO1FBRUYsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDbkMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO1NBQ2hCLENBQUMsQ0FBQTtJQUNILENBQUM7Q0FDRDtBQXpNRCw0QkF5TUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5PdXRwdXQsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInXHJcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJ1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJ1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7XHJcblx0R3JhcGhxbEFwaSxcclxuXHRTY2hlbWEsXHJcblx0QXV0aG9yaXphdGlvblR5cGUsXHJcblx0RmllbGRMb2dMZXZlbCxcclxuXHRNYXBwaW5nVGVtcGxhdGUsXHJcbn0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnXHJcbmltcG9ydCB7IFVzZXJQb29sIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZ25pdG8nXHJcbmltcG9ydCB7IElSb2xlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSdcclxuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xyXG5cclxuaW50ZXJmYWNlIEFQSVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcclxuXHR1c2VycG9vbDogVXNlclBvb2xcclxuXHRyb29tVGFibGU6IFRhYmxlXHJcblx0dXNlclRhYmxlOiBUYWJsZVxyXG5cdG1lc3NhZ2VUYWJsZTogVGFibGVcclxuXHR1bmF1dGhlbnRpY2F0ZWRSb2xlOiBJUm9sZVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQVBJU3RhY2sgZXh0ZW5kcyBTdGFjayB7XHJcblx0Y29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFQSVN0YWNrUHJvcHMpIHtcclxuXHRcdHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpXHJcblxyXG5cdFx0Y29uc3QgYXBpID0gbmV3IEdyYXBocWxBcGkodGhpcywgJ0NoYXRBcHAnLCB7XHJcblx0XHRcdG5hbWU6ICdDaGF0QXBwJyxcclxuXHRcdFx0c2NoZW1hOiBTY2hlbWEuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdncmFwaHFsL3NjaGVtYS5ncmFwaHFsJykpLFxyXG5cdFx0XHRhdXRob3JpemF0aW9uQ29uZmlnOiB7XHJcblx0XHRcdFx0ZGVmYXVsdEF1dGhvcml6YXRpb246IHtcclxuXHRcdFx0XHRcdGF1dGhvcml6YXRpb25UeXBlOiBBdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wsXHJcblx0XHRcdFx0XHR1c2VyUG9vbENvbmZpZzoge1xyXG5cdFx0XHRcdFx0XHR1c2VyUG9vbDogcHJvcHMudXNlcnBvb2wsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdGxvZ0NvbmZpZzoge1xyXG5cdFx0XHRcdGZpZWxkTG9nTGV2ZWw6IEZpZWxkTG9nTGV2ZWwuQUxMLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHR4cmF5RW5hYmxlZDogdHJ1ZSxcclxuXHRcdH0pXHJcblxyXG5cclxuXHJcblxyXG5cdFx0Y29uc3QgY3JlYXRlUm9vbUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0NyZWF0ZVJvb21GdW5jdGlvbicsIHtcclxuXHRcdFx0cnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcclxuXHRcdFx0aGFuZGxlcjogJ2NyZWF0ZV9yb29tLmNyZWF0ZScsXHJcblx0XHRcdGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oXHJcblx0XHRcdFx0X19kaXJuYW1lLFxyXG5cdFx0XHRcdCdncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvTXV0YXRpb24vY3JlYXRlX3Jvb20ucHknXHJcblx0XHRcdCkpLFxyXG5cdFx0XHRlbnZpcm9ubWVudDoge1xyXG5cdFx0XHRcdFRBQkxFTkFNRTogcHJvcHMucm9vbVRhYmxlLnRhYmxlTmFtZSxcclxuXHRcdFx0fSxcclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnN0IGNyZWF0ZU1lc3NhZ2VMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdDcmVhdGVSb29tRnVuY3Rpb24nLCB7XHJcblx0XHRcdHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXHJcblx0XHRcdGhhbmRsZXI6ICdjcmVhdGVfbWVzc2FnZS5oYW5kbGVyJyxcclxuXHRcdFx0Y29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihcclxuXHRcdFx0XHRfX2Rpcm5hbWUsXHJcblx0XHRcdFx0J2dyYXBocWwvbWFwcGluZ1RlbXBsYXRlcy9NdXRhdGlvbi9jcmVhdGVfbWVzc2FnZS5weSdcclxuXHRcdFx0KSksXHJcblx0XHRcdGVudmlyb25tZW50OiB7XHJcblx0XHRcdFx0VEFCTEVOQU1FOiBwcm9wcy5tZXNzYWdlVGFibGUudGFibGVOYW1lLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y29uc3QgdXBkYXRlTWVzc2FnZUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0NyZWF0ZVJvb21GdW5jdGlvbicsIHtcclxuXHRcdFx0cnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcclxuXHRcdFx0aGFuZGxlcjogJ3VwZGF0ZV9tZXNzYWdlLmhhbmRsZXInLFxyXG5cdFx0XHRjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKFxyXG5cdFx0XHRcdF9fZGlybmFtZSxcclxuXHRcdFx0XHQnZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL011dGF0aW9uL3VwZGF0ZV9tZXNzYWdlLnB5J1xyXG5cdFx0XHQpKSxcclxuXHRcdFx0ZW52aXJvbm1lbnQ6IHtcclxuXHRcdFx0XHRUQUJMRU5BTUU6IHByb3BzLm1lc3NhZ2VUYWJsZS50YWJsZU5hbWUsXHJcblx0XHRcdH0sXHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0Y29uc3QgbGlzdE1lc3NhZ2VzRm9yUm9vbUxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0NyZWF0ZVJvb21GdW5jdGlvbicsIHtcclxuXHRcdFx0cnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcclxuXHRcdFx0aGFuZGxlcjogJ2xpc3RfbWVzc2FnZXNfZm9yX3Jvb20uaGFuZGxlcicsXHJcblx0XHRcdGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oXHJcblx0XHRcdFx0X19kaXJuYW1lLFxyXG5cdFx0XHRcdCdncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvUXVlcnkvbGlzdF9tZXNzYWdlc19mb3Jfcm9vbS5weSdcclxuXHRcdFx0KSksXHJcblx0XHRcdGVudmlyb25tZW50OiB7XHJcblx0XHRcdFx0VEFCTEVOQU1FOiBwcm9wcy5tZXNzYWdlVGFibGUudGFibGVOYW1lLFxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRjb25zdCBsaXN0Um9vbXNMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdDcmVhdGVSb29tRnVuY3Rpb24nLCB7XHJcblx0XHRcdHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXHJcblx0XHRcdGhhbmRsZXI6ICdsaXN0X3Jvb21zLmhhbmRsZXInLFxyXG5cdFx0XHRjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKFxyXG5cdFx0XHRcdF9fZGlybmFtZSxcclxuXHRcdFx0XHQnZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL1F1ZXJ5L2xpc3Rfcm9vbXMucHknXHJcblx0XHRcdCkpLFxyXG5cdFx0XHRlbnZpcm9ubWVudDoge1xyXG5cdFx0XHRcdFRBQkxFTkFNRTogcHJvcHMucm9vbVRhYmxlLnRhYmxlTmFtZSxcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0XHJcblx0XHRjb25zdCBjcmVhdGVSb29tTGFtYmRhRFMgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZSgnQ3JlYXRlUm9vbUxhbWJkYURhdGFTb3VyY2UnLCBjcmVhdGVSb29tTGFtYmRhKTtcclxuXHRcdGNyZWF0ZVJvb21MYW1iZGFEUy5jcmVhdGVSZXNvbHZlcih7XHJcblx0XHRcdHR5cGVOYW1lOiAnTXV0YXRpb24nLFxyXG5cdFx0XHRmaWVsZE5hbWU6ICdjcmVhdGVSb29tJ1xyXG5cdFx0fSlcclxuXHJcblx0XHRjb25zdCBjcmVhdGVNZXNzYWdlTGFtYmRhRFMgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZSgnQ3JlYXRlTWVzc2FnZUxhbWJkYURhdGFTb3VyY2UnLCBjcmVhdGVNZXNzYWdlTGFtYmRhKTtcclxuXHRcdGNyZWF0ZU1lc3NhZ2VMYW1iZGFEUy5jcmVhdGVSZXNvbHZlcih7XHJcblx0XHRcdHR5cGVOYW1lOiAnTXV0YXRpb24nLFxyXG5cdFx0XHRmaWVsZE5hbWU6ICdjcmVhdGVNZXNzYWdlJ1xyXG5cdFx0fSlcclxuXHJcblx0XHRjb25zdCB1cGRhdGVNZXNzYWdlTGFtYmRhRFMgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZSgnVXBkYXRlTWVzc2FnZUxhbWJkYURhdGFTb3VyY2UnLCB1cGRhdGVNZXNzYWdlTGFtYmRhKTtcclxuXHRcdHVwZGF0ZU1lc3NhZ2VMYW1iZGFEUy5jcmVhdGVSZXNvbHZlcih7XHJcblx0XHRcdHR5cGVOYW1lOiAnTXV0YXRpb24nLFxyXG5cdFx0XHRmaWVsZE5hbWU6ICd1cGRhdGVNZXNzYWdlJyxcclxuXHRcdH0pXHJcblxyXG5cdFx0Y29uc3QgbGlzdE1lc3NhZ2VzRm9yUm9vbUxhbWJkYURTID0gYXBpLmFkZExhbWJkYURhdGFTb3VyY2UoJ0xpc3RNZXNzYWdlc0ZvclJvb21MYW1iZGFEYXRhU291cmNlJywgbGlzdE1lc3NhZ2VzRm9yUm9vbUxhbWJkYSk7XHJcblx0XHRsaXN0TWVzc2FnZXNGb3JSb29tTGFtYmRhRFMuY3JlYXRlUmVzb2x2ZXIoe1xyXG5cdFx0XHR0eXBlTmFtZTogJ1F1ZXJ5JyxcclxuXHRcdFx0ZmllbGROYW1lOiAnbGlzdE1lc3NhZ2VzRm9yUm9vbScsXHJcblx0XHR9KVxyXG5cclxuXHRcdGNvbnN0IGxpc3RSb29tc0xhbWJkYURTID0gYXBpLmFkZExhbWJkYURhdGFTb3VyY2UoJ0xpc3RSb29tc0xhbWJkYURhdGFTb3VyY2UnLCBsaXN0Um9vbXNMYW1iZGEpO1xyXG5cdFx0bGlzdFJvb21zTGFtYmRhRFMuY3JlYXRlUmVzb2x2ZXIoe1xyXG5cdFx0XHR0eXBlTmFtZTogJ1F1ZXJ5JyxcclxuXHRcdFx0ZmllbGROYW1lOiAnbGlzdFJvb21zJ1xyXG5cdFx0fSlcclxuXHJcblxyXG5cclxuXHJcblx0XHQvLyBjb25zdCByb29tVGFibGVEYXRhU291cmNlID0gYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZShcclxuXHRcdC8vIFx0J1Jvb21UYWJsZURhdGFTb3VyY2UnLFxyXG5cdFx0Ly8gXHRwcm9wcy5yb29tVGFibGVcclxuXHRcdC8vIClcclxuXHRcdC8vIGNvbnN0IG1lc3NhZ2VUYWJsZURhdGFTb3VyY2UgPSBhcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKFxyXG5cdFx0Ly8gXHQnTWVzc2FnZVRhYmxlRGF0YVNvdXJjZScsXHJcblx0XHQvLyBcdHByb3BzLm1lc3NhZ2VUYWJsZVxyXG5cdFx0Ly8gKVxyXG5cclxuXHRcdC8vIHJvb21UYWJsZURhdGFTb3VyY2UuY3JlYXRlUmVzb2x2ZXIoe1xyXG5cdFx0Ly8gXHR0eXBlTmFtZTogJ011dGF0aW9uJyxcclxuXHRcdC8vIFx0ZmllbGROYW1lOiAnY3JlYXRlUm9vbScsXHJcblx0XHQvLyBcdHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5mcm9tRmlsZShcclxuXHRcdC8vIFx0XHRwYXRoLmpvaW4oXHJcblx0XHQvLyBcdFx0XHRfX2Rpcm5hbWUsXHJcblx0XHQvLyBcdFx0XHQnZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL011dGF0aW9uLmNyZWF0ZVJvb20ucmVxLnZ0bCdcclxuXHRcdC8vIFx0XHQpXHJcblx0XHQvLyBcdCksXHJcblx0XHQvLyBcdHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZHluYW1vRGJSZXN1bHRJdGVtKCksXHJcblx0XHQvLyB9KVxyXG5cclxuXHRcdC8vIHJvb21UYWJsZURhdGFTb3VyY2UuY3JlYXRlUmVzb2x2ZXIoe1xyXG5cdFx0Ly8gXHR0eXBlTmFtZTogJ1F1ZXJ5JyxcclxuXHRcdC8vIFx0ZmllbGROYW1lOiAnbGlzdFJvb21zJyxcclxuXHRcdC8vIFx0Ly8gQ2FuJ3QgdXNlIE1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlNjYW5UYWJsZSgpIGJlY2F1c2UgaXQncyB0b28gYmFzaWMgZm9yIG91ciBuZWVkc/CfkYfwn4+9XHJcblx0XHQvLyBcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9ibG9iLzVlNGQ0OGUyZmYxMmE4NmMwZmIwMTc3ZmU3MDgwOTkwY2Y3OWRiZDAvcGFja2FnZXMvJTQwYXdzLWNkay9hd3MtYXBwc3luYy9saWIvbWFwcGluZy10ZW1wbGF0ZS50cyNMMzkuIEkgc2hvdWxkIFBSIHRoaXMgdG8gdGFrZSBpbiBhbiBvcHRpb25hbCBsaW1pdCBhbmQgc2NhbiDwn6SUXHJcblx0XHQvLyBcdHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5mcm9tRmlsZShcclxuXHRcdC8vIFx0XHRwYXRoLmpvaW4oX19kaXJuYW1lLCAnZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL1F1ZXJ5Lmxpc3RSb29tcy5yZXEudnRsJylcclxuXHRcdC8vIFx0KSxcclxuXHRcdC8vIFx0cmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5mcm9tRmlsZShcclxuXHRcdC8vIFx0XHRwYXRoLmpvaW4oX19kaXJuYW1lLCAnZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL1F1ZXJ5Lmxpc3RSb29tcy5yZXMudnRsJylcclxuXHRcdC8vIFx0KSxcclxuXHRcdC8vIH0pXHJcblxyXG5cdFx0Ly8gbWVzc2FnZVRhYmxlRGF0YVNvdXJjZS5jcmVhdGVSZXNvbHZlcih7XHJcblx0XHQvLyBcdHR5cGVOYW1lOiAnTXV0YXRpb24nLFxyXG5cdFx0Ly8gXHRmaWVsZE5hbWU6ICdjcmVhdGVNZXNzYWdlJyxcclxuXHRcdC8vIFx0cmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxyXG5cdFx0Ly8gXHRcdHBhdGguam9pbihcclxuXHRcdC8vIFx0XHRcdF9fZGlybmFtZSxcclxuXHRcdC8vIFx0XHRcdCdncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvTXV0YXRpb24uY3JlYXRlTWVzc2FnZS5yZXEudnRsJ1xyXG5cdFx0Ly8gXHRcdClcclxuXHRcdC8vIFx0KSxcclxuXHRcdC8vIFx0cmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlJlc3VsdEl0ZW0oKSxcclxuXHRcdC8vIH0pXHJcblx0XHQvLyBtZXNzYWdlVGFibGVEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKHtcclxuXHRcdC8vIFx0dHlwZU5hbWU6ICdRdWVyeScsXHJcblx0XHQvLyBcdGZpZWxkTmFtZTogJ2xpc3RNZXNzYWdlc0ZvclJvb20nLFxyXG5cdFx0Ly8gXHRyZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbUZpbGUoXHJcblx0XHQvLyBcdFx0cGF0aC5qb2luKFxyXG5cdFx0Ly8gXHRcdFx0X19kaXJuYW1lLFxyXG5cdFx0Ly8gXHRcdFx0J2dyYXBocWwvbWFwcGluZ1RlbXBsYXRlcy9RdWVyeS5saXN0TWVzc2FnZXNGb3JSb29tLnJlcS52dGwnXHJcblx0XHQvLyBcdFx0KVxyXG5cdFx0Ly8gXHQpLFxyXG5cdFx0Ly8gXHRyZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxyXG5cdFx0Ly8gXHRcdHBhdGguam9pbihcclxuXHRcdC8vIFx0XHRcdF9fZGlybmFtZSxcclxuXHRcdC8vIFx0XHRcdCdncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvUXVlcnkubGlzdE1lc3NhZ2VzRm9yUm9vbS5yZXMudnRsJ1xyXG5cdFx0Ly8gXHRcdClcclxuXHRcdC8vIFx0KSxcclxuXHRcdC8vIH0pXHJcblxyXG5cdFx0Ly8gbWVzc2FnZVRhYmxlRGF0YVNvdXJjZS5jcmVhdGVSZXNvbHZlcih7XHJcblx0XHQvLyBcdHR5cGVOYW1lOiAnTXV0YXRpb24nLFxyXG5cdFx0Ly8gXHRmaWVsZE5hbWU6ICd1cGRhdGVNZXNzYWdlJyxcclxuXHRcdC8vIFx0cmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxyXG5cdFx0Ly8gXHRcdHBhdGguam9pbihcclxuXHRcdC8vIFx0XHRcdF9fZGlybmFtZSxcclxuXHRcdC8vIFx0XHRcdCdncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvTXV0YXRpb24udXBkYXRlTWVzc2FnZS5yZXEudnRsJ1xyXG5cdFx0Ly8gXHRcdClcclxuXHRcdC8vIFx0KSxcclxuXHRcdC8vIFx0cmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlJlc3VsdEl0ZW0oKSxcclxuXHRcdC8vIH0pXHJcblxyXG5cdFx0bmV3IENmbk91dHB1dCh0aGlzLCAnR3JhcGhRTEFQSVVSTCcsIHtcclxuXHRcdFx0dmFsdWU6IGFwaS5ncmFwaHFsVXJsLFxyXG5cdFx0fSlcclxuXHJcblx0XHRuZXcgQ2ZuT3V0cHV0KHRoaXMsICdHcmFwaFFMQVBJSUQnLCB7XHJcblx0XHRcdHZhbHVlOiBhcGkuYXBpSWQsXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG4iXX0=