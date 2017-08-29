import 'source-map-support/register';

import AWS from 'aws-sdk';

import { SubscriptionServer } from 'graphql-aws-iot-ws-transport';

import { execute, subscribe } from 'graphql';

import schema from './root.schema';


let documentClient;
let server;

export const handler = (event, context, callback) => {
    console.log('Todo api handler running');
    console.log(JSON.stringify(event));
    documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });
    initSubscriptionServer();
    const { data, clientId } = event;
    const parsedMessage = JSON.parse(data);

    server.onMessage(parsedMessage, clientId)
        .then(res => {
            console.log('result');
            console.log(JSON.stringify(res));
            callback();
        })
        .catch(err => {
            console.log('error');
            console.log(JSON.stringify(err));
            callback();
        });

    // const handleMessage = (recordNumber) => {
    //     const decodedData = event.Records[recordNumber];
    //     console.log('Decoded payload:', decodedData);
    //     const { data, clientId } = decodedData;
    //     const parsedMessage = JSON.parse(data);
    //     server.onMessage(parsedMessage, clientId)
    //         .then(res => {
    //             console.log('result');
    //             console.log(JSON.stringify(res));
    //             if (recordNumber < (event.Records.length - 1)) {
    //                 handleMessage(recordNumber + 1);
    //             } else {
    //                 callback();
    //             }
    //         })
    //         .catch(err => {
    //             console.log('error');
    //             console.log(JSON.stringify(err));
    //             if (recordNumber < (event.Records.length - 1)) {
    //                 handleMessage();
    //             } else {
    //                 callback();
    //             }
    //         });
    // };

    // handleMessage(0);
};


function initSubscriptionServer() {
    if (!server) {
        server = new SubscriptionServer({
            APP_PREFIX: 'IOX',
            iotEndpoint: process.env.IotEndpoint,
            schema,
            execute,
            subscribe,
            getConnectionContextFn: (clientId) => {
                let connectionContext;
                const params = {
                    TableName: process.env.ConnectionsTableName,
                    Key: {
                        clientId
                    }
                };
                return new Promise((resolve, reject) => {
                    documentClient.get(params, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                })
                    .then(res => {
                        if (res && res.Item) {
                            connectionContext = res.Item;
                        } else {
                            connectionContext = {
                                clientId,
                                initPromise: Promise.resolve(null),
                                operations: {}
                            };
                        }
                        return Object.assign({}, connectionContext, { initPromise: Promise.resolve(null) });
                    });
            },
            setConnectionContextFn: (connectionContext) => {
                const params = {
                    TableName: process.env.ConnectionsTableName,
                    Item: connectionContext
                };
                return new Promise((resolve, reject) => {
                    documentClient.put(params, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                });
            },
            onOperation: (msg, params) => {
                return new Promise((resolve) => {
                    const context = {
                        documentClient,
                        TableName: process.env.TodosTableName
                    };
                    resolve(Object.assign({}, params, { context }));
                });
            }
        });
    }
}

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
