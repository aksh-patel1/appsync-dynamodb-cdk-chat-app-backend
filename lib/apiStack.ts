import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import * as path from 'path'
import {
	GraphqlApi,
	Schema,
	AuthorizationType,
	FieldLogLevel,
	MappingTemplate,
} from '@aws-cdk/aws-appsync-alpha'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { IRole } from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda';

interface APIStackProps extends StackProps {
	userpool: UserPool
	roomTable: Table
	userTable: Table
	messageTable: Table
	unauthenticatedRole: IRole
}

export class APIStack extends Stack {
	constructor(scope: Construct, id: string, props: APIStackProps) {
		super(scope, id, props)

		const api = new GraphqlApi(this, 'ChatApp', {
			name: 'ChatApp',
			schema: Schema.fromAsset(path.join(__dirname, 'graphql/schema.graphql')),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: AuthorizationType.USER_POOL,
					userPoolConfig: {
						userPool: props.userpool,
					},
				},
			},
			logConfig: {
				fieldLogLevel: FieldLogLevel.ALL,
			},
			xrayEnabled: true,
		})




		const createRoomLambda = new lambda.Function(this, 'CreateRoomFunction', {
			runtime: lambda.Runtime.PYTHON_3_9,
			handler: 'create_room.handler',
			code: lambda.Code.fromAsset(path.join(
				__dirname,
				'graphql/mappingTemplates/Mutation'
			)),
			environment: {
				TABLENAME: props.roomTable.tableName,
			},
		});

		const createMessageLambda = new lambda.Function(this, 'CreateMessageFunction', {
			runtime: lambda.Runtime.PYTHON_3_9,
			handler: 'create_message.handler',
			code: lambda.Code.fromAsset(path.join(
				__dirname,
				'graphql/mappingTemplates/Mutation'
			)),
			environment: {
				TABLENAME: props.messageTable.tableName,
			},
		});

		const updateMessageLambda = new lambda.Function(this, 'UpdateMessageFunction', {
			runtime: lambda.Runtime.PYTHON_3_9,
			handler: 'update_message.handler',
			code: lambda.Code.fromAsset(path.join(
				__dirname,
				'graphql/mappingTemplates/Mutation'
			)),
			environment: {
				TABLENAME: props.messageTable.tableName,
			},
		});


		const listMessagesForRoomLambda = new lambda.Function(this, 'ListMessagesForRoomFunction', {
			runtime: lambda.Runtime.PYTHON_3_9,
			handler: 'list_messages_for_room.handler',
			code: lambda.Code.fromAsset(path.join(
				__dirname,
				'graphql/mappingTemplates/Query'
			)),
			environment: {
				TABLENAME: props.messageTable.tableName,
			}
		});

		const listRoomsLambda = new lambda.Function(this, 'ListRoomsFunction', {
			runtime: lambda.Runtime.PYTHON_3_9,
			handler: 'list_rooms.handler',
			code: lambda.Code.fromAsset(path.join(
				__dirname,
				'graphql/mappingTemplates/Query'
			)),
			environment: {
				TABLENAME: props.roomTable.tableName,
			}
		});

		
		const createRoomLambdaDS = api.addLambdaDataSource('CreateRoomLambdaDataSource', createRoomLambda);
		createRoomLambdaDS.createResolver({
			typeName: 'Mutation',
			fieldName: 'createRoom'
		})

		const createMessageLambdaDS = api.addLambdaDataSource('CreateMessageLambdaDataSource', createMessageLambda);
		createMessageLambdaDS.createResolver({
			typeName: 'Mutation',
			fieldName: 'createMessage'
		})

		const updateMessageLambdaDS = api.addLambdaDataSource('UpdateMessageLambdaDataSource', updateMessageLambda);
		updateMessageLambdaDS.createResolver({
			typeName: 'Mutation',
			fieldName: 'updateMessage',
		})

		const listMessagesForRoomLambdaDS = api.addLambdaDataSource('ListMessagesForRoomLambdaDataSource', listMessagesForRoomLambda);
		listMessagesForRoomLambdaDS.createResolver({
			typeName: 'Query',
			fieldName: 'listMessagesForRoom',
		})

		const listRoomsLambdaDS = api.addLambdaDataSource('ListRoomsLambdaDataSource', listRoomsLambda);
		listRoomsLambdaDS.createResolver({
			typeName: 'Query',
			fieldName: 'listRooms'
		})




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

		new CfnOutput(this, 'GraphQLAPIURL', {
			value: api.graphqlUrl,
		})

		new CfnOutput(this, 'GraphQLAPIID', {
			value: api.apiId,
		})
	}
}
