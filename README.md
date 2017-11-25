# ServerlessGraphqlSubscriptions

[Demo](https://todo.girishnanda.com)

Open 2 different tabs to the same team url i.e. (https://todo.girishnanda.com/team/${teamName}. If one tab creates a todo, it will appear up in the other tab.

See https://github.com/ioxe/graphql-aws-iot-server for server side package

See https://github.com/ioxe/graphql-aws-iot-client for client side ws transport package which works with current Apollo Client as is.

# Deploying backend

* The backend for this app is deployed using cloudformation. Cloudformation stacks can be deployed via AWS console. For deploying this into your own account some of the input parameters will have to be changed
Below is the link to the full stack
https://github.com/ioxe/graphql-aws-iot-example/blob/master/backend/todo-backend.yaml

* For IotEndpoint you need to enter the IoT endpoint for the region and account number where you are deploying this app.
Below is the command to get the endpoint for a specific aws profile and region

* You need to specify an origin access identity as an input parameter to the stack. You can either choose an existing one or create a new one from the cloudfront section of the AWS console under Private Content / Origin Access Identity. An origin access identity should look like origin-access-identity/cloudfront/E2ZUH5OG8A4XID. If the identity is invalid the cloudfront distribution will fail to deploy and the stack create will fail.

```
aws describe iot-endpoint --profile profilename --region region
```
* You may want to also change the MinDynamoDbAutoScalingCapacity and the MaxDynamoDbAutoScalingCapacity. Currently there are two global indexes for the subscription publisher and pruner as well the 2 primary indexes (1 for subscriptions table 1 for todos table). So setting a min capacity of 5 would mean 20 write and 20 read capacity units would be provisioned. you get 25 read units and 25 write units in the free tier. I am sure this could be optimized perhaps using local secondary indexes instead of global indexes so that it would take less total read /write units.

* The lambda build files for the lambda functions are served on a public bucket so you should not need to change the key / bucket for deploying this stack. If you want to deploy your own custom functions. You need to change the BackendCodeBucket, TodoApiKey, SubscriptionPublisherKey, and SubscriptionPrunerKey input parameters.

* To rebuild the three lambda function please see package.json for each function for the current build scripts. You would need to change the variables in the config (devFunctionName, devCodeBucketName, codeKey, profile and region to match your own environment). devFunctionName is used to update and existing lambda function so it is not needed for your first deploy. 

* npm run update:S3 uploads the build zip to an s3 bucket so that it can be used with cloudformation.

## Post cloudformation backend deployment update client app 

* Update environment variables in client app -  src/environments/environment.ts. IdentityPoolId is an output of the cloudformaiton stack. Please update the 'identityPoolId' variable to that value. Update the region and iotEndpoint to match the region of your stack and the iotEndpoint that you entered as a stack parameter.

* Upload client build to s3 bucket - WebsiteBucketName is also an output of the stack. You need to change the s3BucketName in the config section of package.json at the root of this repo. You also need to update the profile and region to match your AWS account. npm run update will upload the client build to the website bucket.

* Visit s3 bucket url - The cloudformation stack also has an output named WebsiteBucketUrl. This is the url where you can view the app once the build is uploaded. 


* the current example uses dynamodb to store subscription state. However the [graphql-aws-iot-server](https://github.com/ioxe/graphql-aws-iot-server) is designed to work with other dbs also. Please see server repo for more details. For another app, I currently use faunadb its a serverless database with less setup. Theres no need to think about provisioned capacity and autoscaling.

