import { assert } from 'chai';
import MarketoSource from '../lib/index.js';
import config from './test-config.js';
// import nock from 'nock';
// import * as fixtures from './fixtures';

const options = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    endpoint: config.endpoint,
    identity: config.identity,
};

describe('MarketoSource', () => {
    describe('auth', () => {
        it('should grab an access token', async () => {
            const source = new MarketoSource(options.clientId, options.clientSecret, options.endpoint, options.identity);
            await source.auth();
            assert.isOk(source.accessToken);
        });
    });

    describe('listDescribeLeads', () => {
        it('should filter based on fieldKey and fieldValue', async () => {
            const source = new MarketoSource(options.clientId, options.clientSecret, options.endpoint, options.identity);
            const result = await source.listDescribeLeads('displayName', 'Site');

            assert.isOk(result);
        });
    });

    describe('lookupLeads', () => {
        it('should return ids corresponding to fieldKey and fieldValue', async () => {
            const source = new MarketoSource(options.clientId, options.clientSecret, options.endpoint, options.identity);
            const result = await source.lookupLeads('displayName', 'Site');

            assert.isOk(result);
            assert.isTrue(result instanceof Array);
        });
    });
});
