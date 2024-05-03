import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createAmplifyHosting } from './hosting/amplify';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import {
  AccountRecovery,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito'

// imports for dyanmoDB table
import {
  CfnOutput,
  Duration,
  Expiration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'

import * as path from 'path'
import { Schema } from '@aws-cdk/aws-appsync';
import {
  GraphqlApi,
  ISchema,
  AuthorizationType,
  FieldLogLevel,
  MappingTemplate,
  PrimaryKey,
  Values,
} from '@aws-cdk/aws-appsync-alpha'




export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //added underneath super func
    const userPool = new UserPool(this, 'todoTestUserPool', {
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    })
    //added underneath userPool func continues ...

    new CfnUserPoolGroup(this, 'TodoUserPoolGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'Admin',
      description: 'Admin users for the TodoTestAPI',
    })

    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
    })

    //added for dynamoDB table
    const todoTable = new Table(this, 'Todo Table', {
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: AttributeType.STRING },
    })

    const api = new GraphqlApi(this, 'TodoTestAPI', {
      name: 'TodoTestAPI',
      // ...

      // ...

        schema: Schema.fromAsset(path.join(__dirname, 'schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.API_KEY,
            apiKeyConfig: {
              name: 'simple api key',
              description: 'a simple api key',
              expires: Expiration.after(Duration.days(30)),
            },
          },
        ],
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    })

      
    
    
    
    
// added underneath super func closed    

//To export variables we use the CfnOutput function
//UserPoolId
new CfnOutput(this, 'eu-north-1_QjKsTM6gM', {
  value: userPool.userPoolId,
})

//UserPoolClientId
new CfnOutput(this, '507mulfjjh69vl2d4astvp12ng', {
  value: userPoolClient.userPoolClientId,
})

//graphql api url
new CfnOutput(this, 'https://gucj652xv5cqvbnckl46wi6hsy.appsync-api.eu-north-1.amazonaws.com/graphql', {
  value: api.graphqlUrl,
})
//Graphql api key
new CfnOutput(this, 'da2-qt2hxjycbfcebdxrow6752soq4', {
  value: api.apiKey as string,
})

//Graphql api id
new CfnOutput(this, 'm3mymbsxyvdbfa73tnjg55tfx4', {
  value: api.apiId,
})


    const amplifyHostedApp = createAmplifyHosting(this, {
      appName: "fullstack-amplify-example",
      branch: "main",
      ghOwner: "hariranjitkar",
      repo: "hosting-fullstack-cdk",
      ghTokenName: "github-token-ex",
    })
  }
}
