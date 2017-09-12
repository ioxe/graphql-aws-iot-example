import 'source-map-support/register';

import AWSXray from 'aws-xray-sdk';
const AWS = AWSXray.captureAWS(require('aws-sdk'));

import { SubscriptionManager, PubSub } from 'graphql-aws-iot-server';

import schema from './root.schema';

let db;
let manager;
let pubsub;

export const handler = (event, context, callback) => {
    console.log('Todo api handler running');
    console.log(JSON.stringify(event));

    if (!db) {
        db = new AWS.DynamoDB.DocumentClient();
    }

    if (!pubsub) {
        // class that invokes publisher lambda to trigger a subscription publish has only one method publish
        pubsub = new PubSub(process.env.SubscriptionPublisherFunctionName);
    }

    if (!manager) {
        const subscriptionManagerOptions = {
            appPrefix: process.env.AppPrefix,
            iotEndpoint: process.env.IotEndpoint,
            schema,
            addSubscriptionFunction: (subscription) => {
                const putParams = {
                    TableName: process.env.SubscriptionsTableName,
                    Item: subscription
                }
                return db.put(putParams).promise();
            },
            removeSubscriptionFunction: ({ clientId, subscriptionName }) => {
                const params = {
                    TableName: process.env.SubscriptionsTableName,
                    Key: {
                        clientId,
                        subscriptionName: subscriptionName
                    }
                }
                return db.delete(params).promise();
            }
        };
        manager = new SubscriptionManager(subscriptionManagerOptions);
    }

    const { data, clientId } = event;
    const parsedMessage = JSON.parse(data);

    const graphqlContext = {
        documentClient: db,
        TableName: process.env.TodosTableName,
        pubsub
    };

    manager.onMessage(parsedMessage, clientId, graphqlContext)
        .then(_ => {
            callback();
        })
        .catch(err => {
            console.log('Todo Api Handler Error');
            console.log(JSON.stringify(err));
            callback();
        });
};

// Used to generate schema for apollo code gen / automatic type generation
// TODO take this out of handler as it is not used post deployment
export const schemaGenHandler = ({ query, variables }, context, callback) => {
    const runQuery = require('graphql-server-core').runQuery;
    const queryOptions = {
        schema,
        query,
        variables,
        // context: graphQLcontext,
        debug: false // unnecessarily shows stacktrace when I throw a custom error message (like accountId not found)
    };
    runQuery(queryOptions)
        .then(res => {
            callback(null, res);
        })
        .catch(err => {
            console.log('error is ' + err);
            callback(err);
        });
};