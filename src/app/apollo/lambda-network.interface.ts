import * as Lambda from 'aws-sdk/clients/lambda';
import { NetworkInterface, Request } from 'apollo-client';
import { ExecutionResult } from 'graphql';

import { Credentials } from './credentials.model';
import { refreshCredentials } from './refresh-credentials';

import { environment } from '../../environments/environment';

export class LambdaNetworkInterface implements NetworkInterface {
    inited: boolean;
    constructor(
        private lambdaFunctionName: string,
        private lambdaInstance: Lambda
    ) {
        if (!lambdaFunctionName) {
            throw new Error('functionName is required');
        }
        if (!lambdaInstance) {
            throw new Error('lambda instance is required');
        }
        this.lambdaFunctionName = lambdaFunctionName;
        this.lambdaInstance = lambdaInstance;
    }
    public query(request): Promise<ExecutionResult> {
        // let AWSCredentials;

        const invoke = () => {
            const params = {
                FunctionName: this.lambdaFunctionName,
                InvocationType: 'RequestResponse',
                Payload: JSON.stringify(request)
            };
            return this.lambdaInstance.invoke(params).promise()
                .then((invocationResponse: any) => {
                    if (invocationResponse.errorMessage) {
                        throw new Error(invocationResponse.errorMessage);
                    }
                    const payload = JSON.parse(invocationResponse.Payload);
                    if (payload.errorMessage) {
                        throw new Error(payload.errorMessage);
                    }
                    return payload;
                })
                .catch(err => {
                    throw new Error(err);
                });
        };

        // if (localStorage.getItem('credentials')) {
        //     AWSCredentials = new Credentials(JSON.parse(localStorage.getItem('credentials')));
        // }
        // if (!this.inited) {
        //     // for very first invocation first time set credentials
        //     this.inited = true;
        //     this.lambdaInstance.config.update({ credentials: AWSCredentials });
        // }
        // // if (!AWSCredentials || AWSCredentials.expired) {
            return refreshCredentials().then(credentials => {

                this.lambdaInstance.config.update({ credentials });
                return invoke();
            });
        // } else {
        //     return invoke();
        // }
    }
}
