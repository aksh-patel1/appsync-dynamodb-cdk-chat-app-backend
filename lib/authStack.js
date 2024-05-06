"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
const aws_cognito_identitypool_alpha_1 = require("@aws-cdk/aws-cognito-identitypool-alpha");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const path = require("path");
class AuthStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        var _a;
        super(scope, id, props);
        const addUserFunc = new aws_lambda_1.Function(this, 'postConfirmTriggerFunc', {
            runtime: aws_lambda_1.Runtime.NODEJS_20_X,
            handler: 'addUserToDB.main',
            code: aws_lambda_1.Code.fromAsset(path.join(__dirname, 'functions/postConfirmTrigger')),
            environment: {
                TABLENAME: props.userTable.tableName,
            },
        });
        const userPool = new aws_cognito_1.UserPool(this, `${props.userpoolConstructName}`, {
            selfSignUpEnabled: true,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            accountRecovery: aws_cognito_1.AccountRecovery.PHONE_AND_EMAIL,
            userVerification: {
                emailStyle: aws_cognito_1.VerificationEmailStyle.CODE,
            },
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
                givenName: {
                    required: true,
                    mutable: true,
                },
                familyName: {
                    required: true,
                    mutable: true,
                },
            },
            lambdaTriggers: {
                postConfirmation: addUserFunc,
            },
        });
        props.userTable.grantWriteData(addUserFunc);
        if (props.hasCognitoGroups) {
            (_a = props.groupNames) === null || _a === void 0 ? void 0 : _a.forEach((groupName) => new aws_cognito_1.CfnUserPoolGroup(this, `${props.userpoolConstructName}${groupName}Group`, {
                userPoolId: userPool.userPoolId,
                groupName: groupName,
            }));
        }
        const userPoolClient = new aws_cognito_1.UserPoolClient(this, `${props.userpoolConstructName}Client`, {
            userPool,
        });
        const identityPool = new aws_cognito_identitypool_alpha_1.IdentityPool(this, props.identitypoolConstructName, {
            identityPoolName: props.identitypoolConstructName,
            allowUnauthenticatedIdentities: true,
            authenticationProviders: {
                userPools: [
                    new aws_cognito_identitypool_alpha_1.UserPoolAuthenticationProvider({ userPool, userPoolClient }),
                ],
            },
        });
        this.authenticatedRole = identityPool.authenticatedRole;
        this.unauthenticatedRole = identityPool.unauthenticatedRole;
        this.userpool = userPool;
        this.identityPoolId = new aws_cdk_lib_1.CfnOutput(this, 'IdentityPoolId', {
            value: identityPool.identityPoolId,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'UserPoolId', {
            value: userPool.userPoolId,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'UserPoolClientId', {
            value: userPoolClient.userPoolClientId,
        });
    }
}
exports.AuthStack = AuthStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0aFN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQU1vQjtBQUNwQix5REFPZ0M7QUFFaEMsNEZBR2dEO0FBRWhELHVEQUEyRTtBQUMzRSw2QkFBNEI7QUFZNUIsTUFBYSxTQUFVLFNBQVEsbUJBQUs7SUFNbkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFdkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUNoRSxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLE9BQU8sRUFBRSxrQkFBa0I7WUFDM0IsSUFBSSxFQUFFLGlCQUFJLENBQUMsU0FBUyxDQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSw4QkFBOEIsQ0FBQyxDQUNwRDtZQUNELFdBQVcsRUFBRTtnQkFDWixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTO2FBQ3BDO1NBQ0QsQ0FBQyxDQUFBO1FBRUYsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxFQUFFO1lBQ3JFLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxlQUFlLEVBQUUsNkJBQWUsQ0FBQyxlQUFlO1lBQ2hELGdCQUFnQixFQUFFO2dCQUNqQixVQUFVLEVBQUUsb0NBQXNCLENBQUMsSUFBSTthQUN2QztZQUNELFVBQVUsRUFBRTtnQkFDWCxLQUFLLEVBQUUsSUFBSTthQUNYO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ25CLEtBQUssRUFBRTtvQkFDTixRQUFRLEVBQUUsSUFBSTtvQkFDZCxPQUFPLEVBQUUsSUFBSTtpQkFDYjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLElBQUk7b0JBQ2QsT0FBTyxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0QsVUFBVSxFQUFFO29CQUNYLFFBQVEsRUFBRSxJQUFJO29CQUNkLE9BQU8sRUFBRSxJQUFJO2lCQUNiO2FBQ0Q7WUFDRCxjQUFjLEVBQUU7Z0JBQ2YsZ0JBQWdCLEVBQUUsV0FBVzthQUM3QjtTQUNELENBQUMsQ0FBQTtRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBRTNDLElBQUksS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQzNCLE1BQUEsS0FBSyxDQUFDLFVBQVUsMENBQUUsT0FBTyxDQUN4QixDQUFDLFNBQVMsRUFBRSxFQUFFLENBQ2IsSUFBSSw4QkFBZ0IsQ0FDbkIsSUFBSSxFQUNKLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsT0FBTyxFQUNqRDtnQkFDQyxVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVU7Z0JBQy9CLFNBQVMsRUFBRSxTQUFTO2FBQ3BCLENBQ0QsRUFDRjtTQUNEO1FBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSw0QkFBYyxDQUN4QyxJQUFJLEVBQ0osR0FBRyxLQUFLLENBQUMscUJBQXFCLFFBQVEsRUFDdEM7WUFDQyxRQUFRO1NBQ1IsQ0FDRCxDQUFBO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSw2Q0FBWSxDQUNwQyxJQUFJLEVBQ0osS0FBSyxDQUFDLHlCQUF5QixFQUMvQjtZQUNDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyx5QkFBeUI7WUFDakQsOEJBQThCLEVBQUUsSUFBSTtZQUNwQyx1QkFBdUIsRUFBRTtnQkFDeEIsU0FBUyxFQUFFO29CQUNWLElBQUksK0RBQThCLENBQUMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLENBQUM7aUJBQ2hFO2FBQ0Q7U0FDRCxDQUNELENBQUE7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxDQUFDLGlCQUFpQixDQUFBO1FBQ3ZELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxZQUFZLENBQUMsbUJBQW1CLENBQUE7UUFDM0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFFeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzNELEtBQUssRUFBRSxZQUFZLENBQUMsY0FBYztTQUNsQyxDQUFDLENBQUE7UUFFRixJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNqQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFVBQVU7U0FDMUIsQ0FBQyxDQUFBO1FBRUYsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN2QyxLQUFLLEVBQUUsY0FBYyxDQUFDLGdCQUFnQjtTQUN0QyxDQUFDLENBQUE7SUFDSCxDQUFDO0NBQ0Q7QUF2R0QsOEJBdUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHRDZm5PdXRwdXQsXHJcblx0RXhwaXJhdGlvbixcclxuXHRSZW1vdmFsUG9saWN5LFxyXG5cdFN0YWNrLFxyXG5cdFN0YWNrUHJvcHMsXHJcbn0gZnJvbSAnYXdzLWNkay1saWInXHJcbmltcG9ydCB7XHJcblx0QWNjb3VudFJlY292ZXJ5LFxyXG5cdENmblVzZXJQb29sR3JvdXAsXHJcblx0VXNlclBvb2wsXHJcblx0VXNlclBvb2xDbGllbnQsXHJcblx0VXNlclBvb2xPcGVyYXRpb24sXHJcblx0VmVyaWZpY2F0aW9uRW1haWxTdHlsZSxcclxufSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29nbml0bydcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cydcclxuaW1wb3J0IHtcclxuXHRJZGVudGl0eVBvb2wsXHJcblx0VXNlclBvb2xBdXRoZW50aWNhdGlvblByb3ZpZGVyLFxyXG59IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2duaXRvLWlkZW50aXR5cG9vbC1hbHBoYSdcclxuaW1wb3J0IHsgSVJvbGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJ1xyXG5pbXBvcnQgeyBDb2RlLCBJRnVuY3Rpb24sIFJ1bnRpbWUsIEZ1bmN0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSdcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYidcclxuXHJcbmludGVyZmFjZSBBdXRoU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xyXG5cdHJlYWRvbmx5IHN0YWdlOiBzdHJpbmdcclxuXHRyZWFkb25seSB1c2VycG9vbENvbnN0cnVjdE5hbWU6IHN0cmluZ1xyXG5cdHJlYWRvbmx5IGhhc0NvZ25pdG9Hcm91cHM6IGJvb2xlYW5cclxuXHRyZWFkb25seSBncm91cE5hbWVzPzogc3RyaW5nW11cclxuXHRyZWFkb25seSBpZGVudGl0eXBvb2xDb25zdHJ1Y3ROYW1lOiBzdHJpbmdcclxuXHRyZWFkb25seSB1c2VyVGFibGU6IFRhYmxlXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBdXRoU3RhY2sgZXh0ZW5kcyBTdGFjayB7XHJcblx0cHVibGljIHJlYWRvbmx5IGlkZW50aXR5UG9vbElkOiBDZm5PdXRwdXRcclxuXHRwdWJsaWMgcmVhZG9ubHkgYXV0aGVudGljYXRlZFJvbGU6IElSb2xlXHJcblx0cHVibGljIHJlYWRvbmx5IHVuYXV0aGVudGljYXRlZFJvbGU6IElSb2xlXHJcblx0cHVibGljIHJlYWRvbmx5IHVzZXJwb29sOiBVc2VyUG9vbFxyXG5cclxuXHRjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXV0aFN0YWNrUHJvcHMpIHtcclxuXHRcdHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpXHJcblxyXG5cdFx0Y29uc3QgYWRkVXNlckZ1bmMgPSBuZXcgRnVuY3Rpb24odGhpcywgJ3Bvc3RDb25maXJtVHJpZ2dlckZ1bmMnLCB7XHJcblx0XHRcdHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE2X1gsXHJcblx0XHRcdGhhbmRsZXI6ICdhZGRVc2VyVG9EQi5tYWluJyxcclxuXHRcdFx0Y29kZTogQ29kZS5mcm9tQXNzZXQoXHJcblx0XHRcdFx0cGF0aC5qb2luKF9fZGlybmFtZSwgJ2Z1bmN0aW9ucy9wb3N0Q29uZmlybVRyaWdnZXInKVxyXG5cdFx0XHQpLFxyXG5cdFx0XHRlbnZpcm9ubWVudDoge1xyXG5cdFx0XHRcdFRBQkxFTkFNRTogcHJvcHMudXNlclRhYmxlLnRhYmxlTmFtZSxcclxuXHRcdFx0fSxcclxuXHRcdH0pXHJcblxyXG5cdFx0Y29uc3QgdXNlclBvb2wgPSBuZXcgVXNlclBvb2wodGhpcywgYCR7cHJvcHMudXNlcnBvb2xDb25zdHJ1Y3ROYW1lfWAsIHtcclxuXHRcdFx0c2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXHJcblx0XHRcdHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuXHRcdFx0YWNjb3VudFJlY292ZXJ5OiBBY2NvdW50UmVjb3ZlcnkuUEhPTkVfQU5EX0VNQUlMLFxyXG5cdFx0XHR1c2VyVmVyaWZpY2F0aW9uOiB7XHJcblx0XHRcdFx0ZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdXRvVmVyaWZ5OiB7XHJcblx0XHRcdFx0ZW1haWw6IHRydWUsXHJcblx0XHRcdH0sXHJcblx0XHRcdHN0YW5kYXJkQXR0cmlidXRlczoge1xyXG5cdFx0XHRcdGVtYWlsOiB7XHJcblx0XHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHRcdFx0XHRcdG11dGFibGU6IHRydWUsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRnaXZlbk5hbWU6IHtcclxuXHRcdFx0XHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdFx0XHRcdFx0bXV0YWJsZTogdHJ1ZSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGZhbWlseU5hbWU6IHtcclxuXHRcdFx0XHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdFx0XHRcdFx0bXV0YWJsZTogdHJ1ZSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRsYW1iZGFUcmlnZ2Vyczoge1xyXG5cdFx0XHRcdHBvc3RDb25maXJtYXRpb246IGFkZFVzZXJGdW5jLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSlcclxuXHJcblx0XHRwcm9wcy51c2VyVGFibGUuZ3JhbnRXcml0ZURhdGEoYWRkVXNlckZ1bmMpXHJcblxyXG5cdFx0aWYgKHByb3BzLmhhc0NvZ25pdG9Hcm91cHMpIHtcclxuXHRcdFx0cHJvcHMuZ3JvdXBOYW1lcz8uZm9yRWFjaChcclxuXHRcdFx0XHQoZ3JvdXBOYW1lKSA9PlxyXG5cdFx0XHRcdFx0bmV3IENmblVzZXJQb29sR3JvdXAoXHJcblx0XHRcdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0XHRcdGAke3Byb3BzLnVzZXJwb29sQ29uc3RydWN0TmFtZX0ke2dyb3VwTmFtZX1Hcm91cGAsXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHR1c2VyUG9vbElkOiB1c2VyUG9vbC51c2VyUG9vbElkLFxyXG5cdFx0XHRcdFx0XHRcdGdyb3VwTmFtZTogZ3JvdXBOYW1lLFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdClcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB1c2VyUG9vbENsaWVudCA9IG5ldyBVc2VyUG9vbENsaWVudChcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0YCR7cHJvcHMudXNlcnBvb2xDb25zdHJ1Y3ROYW1lfUNsaWVudGAsXHJcblx0XHRcdHtcclxuXHRcdFx0XHR1c2VyUG9vbCxcclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cclxuXHRcdGNvbnN0IGlkZW50aXR5UG9vbCA9IG5ldyBJZGVudGl0eVBvb2woXHJcblx0XHRcdHRoaXMsXHJcblx0XHRcdHByb3BzLmlkZW50aXR5cG9vbENvbnN0cnVjdE5hbWUsXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZGVudGl0eVBvb2xOYW1lOiBwcm9wcy5pZGVudGl0eXBvb2xDb25zdHJ1Y3ROYW1lLFxyXG5cdFx0XHRcdGFsbG93VW5hdXRoZW50aWNhdGVkSWRlbnRpdGllczogdHJ1ZSxcclxuXHRcdFx0XHRhdXRoZW50aWNhdGlvblByb3ZpZGVyczoge1xyXG5cdFx0XHRcdFx0dXNlclBvb2xzOiBbXHJcblx0XHRcdFx0XHRcdG5ldyBVc2VyUG9vbEF1dGhlbnRpY2F0aW9uUHJvdmlkZXIoeyB1c2VyUG9vbCwgdXNlclBvb2xDbGllbnQgfSksXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH1cclxuXHRcdClcclxuXHJcblx0XHR0aGlzLmF1dGhlbnRpY2F0ZWRSb2xlID0gaWRlbnRpdHlQb29sLmF1dGhlbnRpY2F0ZWRSb2xlXHJcblx0XHR0aGlzLnVuYXV0aGVudGljYXRlZFJvbGUgPSBpZGVudGl0eVBvb2wudW5hdXRoZW50aWNhdGVkUm9sZVxyXG5cdFx0dGhpcy51c2VycG9vbCA9IHVzZXJQb29sXHJcblxyXG5cdFx0dGhpcy5pZGVudGl0eVBvb2xJZCA9IG5ldyBDZm5PdXRwdXQodGhpcywgJ0lkZW50aXR5UG9vbElkJywge1xyXG5cdFx0XHR2YWx1ZTogaWRlbnRpdHlQb29sLmlkZW50aXR5UG9vbElkLFxyXG5cdFx0fSlcclxuXHJcblx0XHRuZXcgQ2ZuT3V0cHV0KHRoaXMsICdVc2VyUG9vbElkJywge1xyXG5cdFx0XHR2YWx1ZTogdXNlclBvb2wudXNlclBvb2xJZCxcclxuXHRcdH0pXHJcblxyXG5cdFx0bmV3IENmbk91dHB1dCh0aGlzLCAnVXNlclBvb2xDbGllbnRJZCcsIHtcclxuXHRcdFx0dmFsdWU6IHVzZXJQb29sQ2xpZW50LnVzZXJQb29sQ2xpZW50SWQsXHJcblx0XHR9KVxyXG5cdH1cclxufVxyXG4iXX0=