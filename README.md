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
```
aws describe iot-endpoint --profile profilename --region region
```
* You may want to also change the MinDynamoDbAutoScalingCapacity and the MaxDynamoDbAutoScalingCapacity according to your needs. Changing the max capacity to more than 25 a month would exceed the free tier for your account.

* The lambda build files for the lambda functions are served on a public bucket so you should not need to change the key / bucket for deploying this stack. If you want to deploy your own customer functions. You need to change the BackendCodeBucket, TodoApiKey, SubscriptionPublisherKey, and SubscriptionPrunerKey input parameters.

* To rebuild the three lambda function please see package.json for each function for the current build scripts. You would need to change the variables in the config (devFunctionName, devCodeBucketName, codeKey and profile to match your own environment). devFunctionName is used to update and existing lambda function so it is not needed for your first deploy. 

* npm run update:S3 uploads the build zip to an s3 bucket so that it can be used with cloudformation.

## Post cloudformation backend deployment update client app 

* Update environment variables in client app -  src/environments/environment.ts. IdentityPoolId is an output of the cloudformaiton stack. Please update the 'identityPoolId' variable to that value. Update the region and iotEndpoint to match the region of your stack and the iotEndpoint that you entered as a stack parameter.

* Upload client build to s3 bucket - WebsiteBucketName is also an output of the stack. You need to change the s3BucketName in the config section of package.json at the root of this repo. You also need to update the profile and region to match your AWS account. npm run update will upload the client build to the website bucket.

* Visit s3 bucket url - The cloudformation stack also has an output named WebsiteBucketUrl. This is the url where you can view the app once the build is uploaded. 


* the current example uses dynamodb to store subscription state. However the [graphql-aws-iot-server](https://github.com/ioxe/graphql-aws-iot-server) is designed to work with other dbs also. Please see server repo for more details. For another app, I currently use faunadb its a serverless database with less setup. Theres no need to think about provisioned capacity and autoscaling.

