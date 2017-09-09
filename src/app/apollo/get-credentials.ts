import { environment } from '../../environments/environment';

import { CognitoIdentityCredentials } from 'aws-sdk/global';

declare var AWS: any;
AWS.config.region = 'us-west-2';
import { Credentials } from 'aws-sdk/global';

export const getCredentials = () => {
    const credentials = new CognitoIdentityCredentials({
        IdentityPoolId: environment.identityPoolId,
    });
    return credentials.refreshPromise().then((res: any) => {
        return { credentials };
    });
};
