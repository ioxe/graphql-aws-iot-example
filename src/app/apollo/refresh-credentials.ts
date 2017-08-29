import { environment } from '../../environments/environment';

// import { CognitoIdentityCredentials } from 'aws-sdk/global';

// declare var AWS: any;
// AWS.config.region = 'us-west-2';
import { Credentials } from 'aws-sdk/global';

export const refreshCredentials = () => {
    // const credentials = new CognitoIdentityCredentials({
    //     IdentityPoolId: environment.identityPoolId,
    // });
    // return credentials.refreshPromise().then(res => {
    //     localStorage.setItem('credentials', JSON.stringify(credentials));
    //     return credentials;
    // });
    return Promise.resolve(
        new Credentials({ secretAccessKey: '1rCtew+H4bIuh3L5mMYaEKmf2kbb7xPiEz5EepjY', accessKeyId: 'AKIAJCFJZ2B6JZRBBEGQ'}));
};
