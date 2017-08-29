import { Inject } from '@angular/core';
import { NgModule } from '@angular/core';

import { ApolloModule } from 'apollo-angular';
import { ApolloClient} from 'apollo-client';

// import { SubscriptionClient } from 'subscriptions-transport-ws';

import { SubscriptionClient } from 'graphql-aws-iot-ws-transport/src/client';

import { refreshCredentials } from './refresh-credentials';

import { environment } from '../../environments/environment';
const { apiFunctionName, region, iotEndpoint} = environment;

const idToken = localStorage.getItem('id_token');
// const GRAPHQL_ENDPOINT = 'ws://localhost:5000/graphql';

// const wsClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
//     reconnect: true
// });

const wsClient = new SubscriptionClient(iotEndpoint, {
    APP_PREFIX: 'IOX',
    reconnect: true
}, refreshCredentials);

const client: ApolloClient = new ApolloClient({
    dataIdFromObject: (o: any) => o.id,
    networkInterface: wsClient,
    connectToDevTools: true,
    // queryDeduplication: true
});

export function provideClient(): ApolloClient {
    return client;
}

@NgModule({
    imports: [ApolloModule.forRoot(provideClient)],
    exports: [ApolloModule]
})
export class AppApolloModule { }
