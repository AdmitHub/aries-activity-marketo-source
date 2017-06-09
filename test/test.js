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

let source = null;

describe('MarketoSource', () => {
    before(async () => {
        // grab an access token for tests
        source = new MarketoSource(options.clientId, options.clientSecret,
                                   options.endpoint, options.identity);
        await source.auth();
    });

    describe('#auth', () => {
        it('should grab an access token', async () => {
            const s = new MarketoSource(options.clientId, options.clientSecret,
                                        options.endpoint, options.identity);
            await s.auth();
            assert.isOk(s.accessToken);
        });
    });

    describe('#listDescribeLeads', () => {
        it('should filter based on fieldKey and fieldValue', async () => {
            const result = await source.listDescribeLeads({ fieldKey: 'displayName', fieldValue: 'Site' });
            assert.isOk(result);
        });
    });

    describe('#lookupLeads', () => {
        it('should return ids corresponding to fieldKey and fieldValue', async () => {
            const result = await source.lookupLeads({ fieldKey: 'displayName', fieldValue: 'Site' });
            assert.isOk(result);
            assert.isTrue(result instanceof Array);
        });
    });

    describe('#getStaticList', () => {
        it('should return data from a static list', async () => {
            const result = await source.getStaticList({
                listId: '57777',
                fields: 'firstName,lastName,id,company',
            });

            assert.isOk(result);
        });
    });
});
