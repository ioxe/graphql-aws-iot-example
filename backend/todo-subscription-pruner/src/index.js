import 'source-map-support/register';

import AWSXray from 'aws-xray-sdk';
var AWS = AWSXray.captureAWS(require('aws-sdk')); // eslint-disable-line

// Currently only subscribed to the AWS IoT disconnected lifecycle event

let db;

export const handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    const { clientId } = event;

    if (!db) {
        db = new AWS.DynamoDB.DocumentClient();
    }

    onDisconnect(clientId);

    function onDisconnect(clientId) {
        const params = {
            TableName: process.env.SubscriptionsTableName,
            IndexName: process.env.ClientIdToSubscriptionsIndex,
            KeyConditionExpression: 'clientId = :hkey',
            ExpressionAttributeValues: {
                ':hkey': clientId
            }
        };

        return db.query(params).promise().then(res => {
            let promises = [];
            if (res.Items && res.Items.length) {
                res.Items.forEach(item => {
                    const deleteParams = {
                        TableName: process.env.SubscriptionsTableName,
                        Key: {
                            clientId,
                            subscriptionName: item.subscriptionName
                        }
                    };
                    promises.push(db.delete(deleteParams).promise());
                });
                return Promise.all(promises);
            }
        }).then(_ => {
            callback();
        }).catch(_ => {
            console.log('Prune error');
            callback();
        });
    };

};
