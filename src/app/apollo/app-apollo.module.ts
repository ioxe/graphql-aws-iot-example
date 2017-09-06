import { Inject } from '@angular/core';
import { NgModule } from '@angular/core';

import { ApolloModule } from 'apollo-angular';
import { ApolloClient } from 'apollo-client';

import { SubscriptionClient } from 'graphql-aws-iot-ws-client/src/client';

import { getCredentials } from './get-credentials';

import { environment } from '../../environments/environment';
const { region, iotEndpoint, AppPrefix } = environment;


const wsClient = new SubscriptionClient(iotEndpoint, {
    AppPrefix,
    region,
    lazy: false,
    reconnect: true
}, getCredentials);

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
