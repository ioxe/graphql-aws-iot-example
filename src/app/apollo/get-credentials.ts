import { environment } from '../../environments/environment';

import { CognitoIdentityCredentials } from 'aws-sdk/global';

declare var AWS: any;
AWS.config.region = 'us-west-2';
import { Credentials } from 'aws-sdk/global';

export const getCredentials = () => {
    let credentials;
    if (localStorage.getItem('credentials')) {
        const identityId = JSON.parse(localStorage.getItem('credentials'))._identityId;
        credentials = new CognitoIdentityCredentials({
            IdentityId: identityId,
        });
    } else {
        credentials = new CognitoIdentityCredentials({
            IdentityPoolId: environment.identityPoolId,
        });
    }
    return credentials.refreshPromise().then((res: any) => {
        localStorage.setItem('credentials', JSON.stringify(credentials));
        return { credentials, clientId: credentials._identityId };
    });
};
