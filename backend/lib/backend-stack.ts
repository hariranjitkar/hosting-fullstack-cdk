import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createAmplifyHosting } from './hosting/amplify';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyHostedApp = createAmplifyHosting(this, {
      appName: "fullstack-amplify-example",
      branch: "main",
      ghOwner: "hariranjitkar",
      repo: "hosting-fullstack-cdk",
      ghTokenName: "github-token-ex",
    })
  }
}
