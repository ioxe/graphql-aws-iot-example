import 'source-map-support/register';

import AWSXray from 'aws-xray-sdk';
var AWS = AWSXray.captureAWS(require('aws-sdk')); // eslint-disable-line


import { SubscriptionPublisher } from 'graphql-aws-iot-server';
import schema from '../../todo-api/src/root.schema';

let db;
let publisher;

export const handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    const { triggerName, payload } = event;

    const triggerNameToFilterFunctionsMap = {
        NEW_TODO: (payload, variables) => {
            return payload.teamTodoAdded.teamName === variables.teamName;
        }
    };

    const triggerNameToSubscriptionNamesMap = {
        NEW_TODO: ['teamTodoAdded']
    };

    const subscriptionPublisherOptions = {
        appPrefix: process.env.AppPrefix,
        iotEndpoint: process.env.IotEndpoint,
        schema
    };

    if (!publisher) {
        publisher = new SubscriptionPublisher(subscriptionPublisherOptions);
    }

    if (!db) {
        db = new AWS.DynamoDB.DocumentClient();
    }


    onTrigger(triggerName, payload)
        .then(res => {
            console.log(res);
            callback();
        })
        .catch(err => {
            console.log('Subscription Publisher Error');
            console.log(err);
        });

    function onTrigger(triggerName, payload) {
        let promises = [];
        let subscriptions = triggerNameToSubscriptionNamesMap[triggerName];        
        subscriptions.forEach(subscriptionName => {
            promises.push(publishForSubscription(subscriptionName, triggerName, payload));
        });
        return Promise.all(promises);
    }

    function publishForSubscription(subscriptionName, triggerName, payload) {
        const params = {
            TableName: process.env.SubscriptionsTableName,
            IndexName: process.env.SubscriptionToClientIdsIndex,
            KeyConditionExpression: 'subscriptionName = :hkey',
            ExpressionAttributeValues: {
                ':hkey': subscriptionName
            }
        };

        let subscriptionsToExecute = [];

        return db.query(params).promise()
            .then(res => {
                if (res.Items && res.Items.length) {
                    res.Items.forEach(subscription => {
                        if (triggerNameToFilterFunctionsMap[triggerName]) {
                            const execute = triggerNameToFilterFunctionsMap[triggerName](payload, subscription.variableValues);
                            if (!execute) return;
                        }
                        subscriptionsToExecute.push(subscription);
                    });
                }
                if (!subscriptionsToExecute.length) {
                    return Promise.resolve(null);
                }
                return publisher.executeQueriesAndSendMessages(subscriptionsToExecute, payload);
            });
    }
};
