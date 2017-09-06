import 'source-map-support/register';

import 'aws-sdk';

import { SubscriptionPruner } from 'graphql-aws-iot-ws-transport';

// Currently only subscribed to the AWS IoT disconnected lifecycle event

let subscriptionPruner;
export const handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    const { clientId } = event;

    if (!subscriptionPruner) {
        const subscriptionPrunerOptions = {
            subscriptionsTableName: process.env.SubscriptionsTableName,
            clientIdtoSubscriptionsIndex: process.env.ClientIdToSubscriptionsIndex
        };
        subscriptionPruner = new SubscriptionPruner(subscriptionPrunerOptions);
    }

    subscriptionPruner.onEvent(clientId).
        then(_ => {
            callback();
        })
        .catch(err => {
            console.log('Pruner error');
            console.log(err);
            callback();
        });

};
