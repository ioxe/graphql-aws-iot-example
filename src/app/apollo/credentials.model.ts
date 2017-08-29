import * as moment from 'moment';

export class Credentials {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: string;
    expirationTime: string;
    constructor(credentialsResponse) {
        this.accessKeyId = credentialsResponse.AccessKeyId;
        this.secretAccessKey = credentialsResponse.SecretAccessKey;
        this.sessionToken = credentialsResponse.SessionToken;
        this.expirationTime = credentialsResponse.Expiration;
    }
    get expired() {
        return moment.utc(this.expirationTime).isBefore(moment.utc());
    }
}

