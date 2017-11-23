# ServerlessGraphqlSubscriptions

[Demo](https://todo.girishnanda.com)

Open 2 different tabs to the same team url i.e. (https://todo.girishnanda.com/team/${teamName}. If one tab creates a todo, it will appear up in the other tab.

See https://github.com/ioxe/graphql-aws-iot-server for server side package

See https://github.com/ioxe/graphql-aws-iot-client for client side ws transport package which works with current Apollo Client as is.

# Deploying backend

* The backend for this app is deployed using cloudformation.
Below is the link to the full stack
https://github.com/ioxe/graphql-aws-iot-example/blob/master/backend/todo-backend.yaml

* For most parameters to the stack use the default values if you are trying to deploy this example.

* For IotEndpoint you need to enter the IoT endpoint for the region and account number where you are deploying this app.
Below is the command to get the endpoint for a specific aws profile and region
```
aws describe iot-endpoint --profile profilename --region region
```
* You may want to also change the MinDynamoDbAutoScalingCapacity and the MaxDynamoDbAutoScalingCapacity according to your needs. If you are using the free tier keep the MaxDynamoDbAutoScalingCapacity to under 25 and the MinDynamoDbAutoScalingCapacity to less than that.

* The lambda build files for the lambda functions are served on a public bucket so you should not need to change the key / bucket for deploying this stack.  

* If you want to deploy your own custom version of these functions then you can change the S3Bucket and Key properties for the SubscriptionPublisher, SubscriptionPruner and TodoApi. You would also need to then upload builds for each lambda function to your own S3bucket.  

* To rebuild the three lambda function please see package.json for the current build scripts. You would need to change the variables in the config (devFunctionName, devCodeBucketName, codeKey and profile to match your own environment). devFunctionName is used to update and existing lambda function so it is not needed for your first deploy. 

* npm run update:S3 uploads the build zip to an s3 bucket so that it can be used for cloudformation.

* the current example uses dynamodb to store subscription state. However the [graphql-aws-iot-server](https://github.com/ioxe/graphql-aws-iot-server) is designed to work with other dbs also. Please see server repo for more details. For another app, I currently use faunadb its a serverless database with less setup. Theres no need to think about provisioned capacity and autoscaling.


