import 'source-map-support/register';

import { SubscriptionPublisher } from 'graphql-aws-iot-ws-transport';
import schema from '../../todo-api/src/root.schema';

let publisher;

export const handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    const { triggerName, payload } = event;

    const subscriptionPublisherOptions = {
        appPrefix: process.env.AppPrefix,
        iotEndpoint: process.env.IotEndpoint,
        tableName: process.env.SubscriptionsTableName,
        subscriptionToClientIdsIndex: process.env.SubscriptionToClientIdsIndex,
        triggerToFilterFunctionsMap: {
            NEW_TODO: (payload, variables) => {
                return payload.teamTodoAdded.teamName === variables.teamName;
            }
        },
        triggerNameToSubscriptionNamesMap: {
          NEW_TODO: 'teamTodoAdded'
        },
        schema
    };
    
    if (!publisher) {
        publisher = new SubscriptionPublisher(subscriptionPublisherOptions);
    }
    
    publisher.onEvent(triggerName, payload)
        .then(res => {
            console.log(res);
            callback();
        })
        .catch(err => {
            console.log('Publisher error');
            console.log(err);
            callback();
        });
};
