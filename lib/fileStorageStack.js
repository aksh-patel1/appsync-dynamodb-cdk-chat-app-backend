"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const iam = require("aws-cdk-lib/aws-iam");
class FileStorageStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const fileStorageBucket = new s3.Bucket(this, 's3-bucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            cors: [
                {
                    allowedMethods: [
                        s3.HttpMethods.GET,
                        s3.HttpMethods.POST,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.DELETE,
                    ],
                    allowedOrigins: props.allowedOrigins,
                    allowedHeaders: ['*'],
                },
            ],
        });
        // allow guests read access to the bucket.
        // fileStorageBucket.addToResourcePolicy(
        // 	new iam.PolicyStatement({
        // 		effect: iam.Effect.ALLOW,
        // 		actions: ['s3:GetObject'],
        // 		principals: [new iam.AnyPrincipal()],
        // 		resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`],
        // 	})
        // )
        const mangedPolicyForAmplifyUnauth = new iam.ManagedPolicy(this, 'mangedPolicyForAmplifyUnauth', {
            description: 'managed policy to allow usage of Storage Library for unauth',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:GetObject'],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:GetObject'],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:ListBucket'],
                    resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}`],
                    conditions: {
                        StringLike: {
                            's3:prefix': [
                                'public/',
                                'public/*',
                                'protected/',
                                'protected/*',
                            ],
                        },
                    },
                }),
            ],
            roles: [props.unauthenticatedRole],
        });
        const mangedPolicyForAmplifyAuth = new iam.ManagedPolicy(this, 'mangedPolicyForAmplifyAuth', {
            description: 'managed Policy to allow usage of storage library for auth',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/\${cognito-identity.amazonaws.com:sub}/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/private/\${cognito-identity.amazonaws.com:sub}/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:GetObject'],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:ListBucket'],
                    resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}`],
                    conditions: {
                        StringLike: {
                            's3:prefix': [
                                'public/',
                                'public/*',
                                'protected/',
                                'protected/*',
                                'private/${cognito-identity.amazonaws.com:sub}/',
                                'private/${cognito-identity.amazonaws.com:sub}/*',
                            ],
                        },
                    },
                }),
            ],
            roles: [props.authenticatedRole],
        });
        new aws_cdk_lib_1.CfnOutput(this, 'BucketName', {
            value: fileStorageBucket.bucketName,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'BucketRegion', {
            value: this.region,
        });
    }
}
exports.FileStorageStack = FileStorageStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZVN0b3JhZ2VTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVTdG9yYWdlU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQXlFO0FBRXpFLHlDQUF3QztBQUN4QywyQ0FBMEM7QUFRMUMsTUFBYSxnQkFBaUIsU0FBUSxtQkFBSztJQUMxQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBRXZCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDMUQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLElBQUksRUFBRTtnQkFDTDtvQkFDQyxjQUFjLEVBQUU7d0JBQ2YsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHO3dCQUNsQixFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7d0JBQ25CLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRzt3QkFDbEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNO3FCQUNyQjtvQkFDRCxjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7b0JBQ3BDLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQztpQkFDckI7YUFDRDtTQUNELENBQUMsQ0FBQTtRQUVGLDBDQUEwQztRQUMxQyx5Q0FBeUM7UUFDekMsNkJBQTZCO1FBQzdCLDhCQUE4QjtRQUM5QiwrQkFBK0I7UUFDL0IsMENBQTBDO1FBQzFDLDBFQUEwRTtRQUMxRSxNQUFNO1FBQ04sSUFBSTtRQUVKLE1BQU0sNEJBQTRCLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUN6RCxJQUFJLEVBQ0osOEJBQThCLEVBQzlCO1lBQ0MsV0FBVyxFQUNWLDZEQUE2RDtZQUM5RCxVQUFVLEVBQUU7Z0JBQ1gsSUFBSSxHQUFHLENBQUMs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Q1osYUFBYTtnQ0FDYixnREFBZ0Q7Z0NBQ2hELGlEQUFpRDs2QkFDakQ7eUJBQ0Q7cUJBQ0Q7aUJBQ0QsQ0FBQzthQUNGO1lBQ0QsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1NBQ2hDLENBQ0QsQ0FBQTtRQUVELElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2pDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxVQUFVO1NBQ25DLENBQUMsQ0FBQTtRQUVGLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ25DLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNsQixDQUFDLENBQUE7SUFDSCxDQUFDO0NBQ0Q7QUF6SUQsNENBeUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJ1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJ1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnXHJcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJ1xyXG5cclxuaW50ZXJmYWNlIEZpbGVTdG9yYWdlU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xyXG5cdGF1dGhlbnRpY2F0ZWRSb2xlOiBpYW0uSVJvbGVcclxuXHR1bmF1dGhlbnRpY2F0ZWRSb2xlOiBpYW0uSVJvbGVcclxuXHRhbGxvd2VkT3JpZ2luczogc3RyaW5nW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZpbGVTdG9yYWdlU3RhY2sgZXh0ZW5kcyBTdGFjayB7XHJcblx0Y29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEZpbGVTdG9yYWdlU3RhY2tQcm9wcykge1xyXG5cdFx0c3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcclxuXHJcblx0XHRjb25zdCBmaWxlU3RvcmFnZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ3MzLWJ1Y2tldCcsIHtcclxuXHRcdFx0cmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG5cdFx0XHRhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcclxuXHRcdFx0Y29yczogW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGFsbG93ZWRNZXRob2RzOiBbXHJcblx0XHRcdFx0XHRcdHMzLkh0dHBNZXRob2RzLkdFVCxcclxuXHRcdFx0XHRcdFx0czMuSHR0cE1ldGhvZHMuUE9TVCxcclxuXHRcdFx0XHRcdFx0czMuSHR0cE1ldGhvZHMuUFVULFxyXG5cdFx0XHRcdFx0XHRzMy5IdHRwTWV0aG9kcy5ERUxFVEUsXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0YWxsb3dlZE9yaWdpbnM6IHByb3BzLmFsbG93ZWRPcmlnaW5zLFxyXG5cdFx0XHRcdFx0YWxsb3dlZEhlYWRlcnM6IFsnKiddLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdF0sXHJcblx0XHR9KVxyXG5cclxuXHRcdC8vIGFsbG93IGd1ZXN0cyByZWFkIGFjY2VzcyB0byB0aGUgYnVja2V0LlxyXG5cdFx0Ly8gZmlsZVN0b3JhZ2VCdWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShcclxuXHRcdC8vIFx0bmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG5cdFx0Ly8gXHRcdGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuXHRcdC8vIFx0XHRhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxyXG5cdFx0Ly8gXHRcdHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcclxuXHRcdC8vIFx0XHRyZXNvdXJjZXM6IFtgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX0vcHVibGljLypgXSxcclxuXHRcdC8vIFx0fSlcclxuXHRcdC8vIClcclxuXHJcblx0XHRjb25zdCBtYW5nZWRQb2xpY3lGb3JBbXBsaWZ5VW5hdXRoID0gbmV3IGlhbS5NYW5hZ2VkUG9saWN5KFxyXG5cdFx0XHR0aGlzLFxyXG5cdFx0XHQnbWFuZ2VkUG9saWN5Rm9yQW1wbGlmeVVuYXV0aCcsXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcdCdtYW5hZ2VkIHBvbGljeSB0byBhbGxvdyB1c2FnZSBvZiBTdG9yYWdlIExpYnJhcnkgZm9yIHVuYXV0aCcsXHJcblx0XHRcdFx0c3RhdGVtZW50czogW1xyXG5cdFx0XHRcdFx0bmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG5cdFx0XHRcdFx0XHRlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcblx0XHRcdFx0XHRcdGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXHJcblx0XHRcdFx0XHRcdHJlc291cmNlczogW1xyXG5cdFx0XHRcdFx0XHRcdGBhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wdWJsaWMvKmAsXHJcblx0XHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHR9KSxcclxuXHRcdFx0XHRcdG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuXHRcdFx0XHRcdFx0ZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG5cdFx0XHRcdFx0XHRhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxyXG5cdFx0XHRcdFx0XHRyZXNvdXJjZXM6IFtcclxuXHRcdFx0XHRcdFx0XHRgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX0vcHJvdGVjdGVkLypgLFxyXG5cdFx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XHRuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcblx0XHRcdFx0XHRcdGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuXHRcdFx0XHRcdFx0YWN0aW9uczogWydzMzpMaXN0QnVja2V0J10sXHJcblx0XHRcdFx0XHRcdHJlc291cmNlczogW2Bhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfWBdLFxyXG5cdFx0XHRcdFx0XHRjb25kaXRpb25zOiB7XHJcblx0XHRcdFx0XHRcdFx0U3RyaW5nTGlrZToge1xyXG5cdFx0XHRcdFx0XHRcdFx0J3MzOnByZWZpeCc6IFtcclxuXHRcdFx0XHRcdFx0XHRcdFx0J3B1YmxpYy8nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQncHVibGljLyonLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQncHJvdGVjdGVkLycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdCdwcm90ZWN0ZWQvKicsXHJcblx0XHRcdFx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR9KSxcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdHJvbGVzOiBbcHJvcHMudW5hdXRoZW50aWNhdGVkUm9sZV0sXHJcblx0XHRcdH1cclxuXHRcdClcclxuXHJcblx0XHRjb25zdCBtYW5nZWRQb2xpY3lGb3JBbXBsaWZ5QXV0aCA9IG5ldyBpYW0uTWFuYWdlZFBvbGljeShcclxuXHRcdFx0dGhpcyxcclxuXHRcdFx0J21hbmdlZFBvbGljeUZvckFtcGxpZnlBdXRoJyxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFx0J21hbmFnZWQgUG9saWN5IHRvIGFsbG93IHVzYWdlIG9mIHN0b3JhZ2UgbGlicmFyeSBmb3IgYXV0aCcsXHJcblx0XHRcdFx0c3RhdGVtZW50czogW1xyXG5cdFx0XHRcdFx0bmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG5cdFx0XHRcdFx0XHRlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcblx0XHRcdFx0XHRcdGFjdGlvbnM6IFsnczM6UHV0T2JqZWN0JywgJ3MzOkdldE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuXHRcdFx0XHRcdFx0cmVzb3VyY2VzOiBbXHJcblx0XHRcdFx0XHRcdFx0YGFybjphd3M6czM6Ojoke2ZpbGVTdG9yYWdlQnVja2V0LmJ1Y2tldE5hbWV9L3B1YmxpYy8qYCxcclxuXHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdH0pLFxyXG5cdFx0XHRcdFx0bmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG5cdFx0XHRcdFx0XHRlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcblx0XHRcdFx0XHRcdGFjdGlvbnM6IFsnczM6UHV0T2JqZWN0JywgJ3MzOkdldE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuXHRcdFx0XHRcdFx0cmVzb3VyY2VzOiBbXHJcblx0XHRcdFx0XHRcdFx0YGFybjphd3M6czM6Ojoke2ZpbGVTdG9yYWdlQnVja2V0LmJ1Y2tldE5hbWV9L3Byb3RlY3RlZC9cXCR7Y29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOnN1Yn0vKmAsXHJcblx0XHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHR9KSxcclxuXHRcdFx0XHRcdG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuXHRcdFx0XHRcdFx0ZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG5cdFx0XHRcdFx0XHRhY3Rpb25zOiBbJ3MzOlB1dE9iamVjdCcsICdzMzpHZXRPYmplY3QnLCAnczM6RGVsZXRlT2JqZWN0J10sXHJcblx0XHRcdFx0XHRcdHJlc291cmNlczogW1xyXG5cdFx0XHRcdFx0XHRcdGBhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wcml2YXRlL1xcJHtjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206c3VifS8qYCxcclxuXHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdH0pLFxyXG5cdFx0XHRcdFx0bmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG5cdFx0XHRcdFx0XHRlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcblx0XHRcdFx0XHRcdGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXHJcblx0XHRcdFx0XHRcdHJlc291cmNlczogW1xyXG5cdFx0XHRcdFx0XHRcdGBhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wcm90ZWN0ZWQvKmAsXHJcblx0XHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHR9KSxcclxuXHRcdFx0XHRcdG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuXHRcdFx0XHRcdFx0ZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG5cdFx0XHRcdFx0XHRhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnXSxcclxuXHRcdFx0XHRcdFx0cmVzb3VyY2VzOiBbYGFybjphd3M6czM6Ojoke2ZpbGVTdG9yYWdlQnVja2V0LmJ1Y2tldE5hbWV9YF0sXHJcblx0XHRcdFx0XHRcdGNvbmRpdGlvbnM6IHtcclxuXHRcdFx0XHRcdFx0XHRTdHJpbmdMaWtlOiB7XHJcblx0XHRcdFx0XHRcdFx0XHQnczM6cHJlZml4JzogW1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQncHVibGljLycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdCdwdWJsaWMvKicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdCdwcm90ZWN0ZWQvJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0J3Byb3RlY3RlZC8qJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0J3ByaXZhdGUvJHtjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206c3VifS8nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQncHJpdmF0ZS8ke2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTpzdWJ9LyonLFxyXG5cdFx0XHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRyb2xlczogW3Byb3BzLmF1dGhlbnRpY2F0ZWRSb2xlXSxcclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cclxuXHRcdG5ldyBDZm5PdXRwdXQodGhpcywgJ0J1Y2tldE5hbWUnLCB7XHJcblx0XHRcdHZhbHVlOiBmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lLFxyXG5cdFx0fSlcclxuXHJcblx0XHRuZXcgQ2ZuT3V0cHV0KHRoaXMsICdCdWNrZXRSZWdpb24nLCB7XHJcblx0XHRcdHZhbHVlOiB0aGlzLnJlZ2lvbixcclxuXHRcdH0pXHJcblx0fVxyXG59XHJcbiJdfQ==