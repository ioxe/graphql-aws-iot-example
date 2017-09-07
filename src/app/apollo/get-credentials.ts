import { environment } from '../../environments/environment';

import { CognitoIdentityCredentials } from 'aws-sdk/global';

declare var AWS: any;
AWS.config.region = 'us-west-2';
import { Credentials } from 'aws-sdk/global';

export const getCredentials = () => {
    // cognito specific workaround for this demo to support multiple tabs in the same browser (potentially there is a better one)
    // clientId must be unique per tab. If localstorage is not cleared - the second tab will try to reuse the same identity.
    for (const key in localStorage) {
        if (key.indexOf('aws.cognito.') !== -1) {
            localStorage.removeItem(key);
        }
    }
    const credentials = new CognitoIdentityCredentials({
        IdentityPoolId: environment.identityPoolId,
    });
    return credentials.refreshPromise().then((res: any) => {
        console.log((credentials as any)._identityId);
        return { credentials, clientId: (credentials as any)._identityId };
    });
};
