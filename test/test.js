import { assert } from 'chai';
import nock from 'nock';
import * as fixtures from './fixtures';
import config from './test-config';
import MarketoSource from '../lib/index';

let source = null;

// credentials for nock testing
const credentials = {
    clientId: config.clientId || 'id',
    clientSecret: config.clientSecret || 'secret',
    endpoint: config.endpoint || 'https://example.mktorest.com/rest',
    identity: config.identity || 'https://example.mktorest.com/identity',
};

describe('MarketoSource', () => {
    afterEach(() => {
        // clear out nock interceptor(s) after each test
        nock.cleanAll();
    });

    describe('#auth', () => {
        before(() => {
            nock(credentials.identity)
                .get('/oauth/token')
                .query({ grant_type: 'client_credentials', client_id: credentials.clientId, client_secret: credentials.clientSecret })
                // return a fake access token
                .reply(200, fixtures.oauth);
        });

        it('should grab an access token', async () => {
            source = new MarketoSource(credentials.clientId, credentials.clientSecret,
                                       credentials.endpoint, credentials.identity);
            await source.auth();

            assert.isOk(source.accessToken);
        });
    });

    describe('#listDescribeLeads', () => {
        before(() => {
            nock(credentials.endpoint)
                .get('/v1/leads/describe.json')
                .query({ access_token: source.accessToken })
                .reply(200, fixtures.listDescribeLeads);
        });

        it('should filter based on fieldKey and fieldValue', async () => {
            const result = await source.listDescribeLeads({ fieldKey: 'displayName', fieldValue: 'Marketo Social Twitter Reach' });

            assert.isOk(result);
        });
    });

    describe('#lookupLeads', () => {
        before(() => {
            nock(credentials.endpoint)
                .get('/v1/leads/describe.json')
                .query({ access_token: source.accessToken })
                .reply(200, fixtures.listDescribeLeads);
            nock(credentials.endpoint)
                .get('/v1/leads.json')
                // note: `3` is the response from listDescribeLeads
                .query({ access_token: source.accessToken, filterType: 'id', filterValues: '3' })
                .reply(200, fixtures.lookupLeads);
        });

        it('should return ids corresponding to fieldKey and fieldValue', async () => {
            const result = await source.lookupLeads({ fieldKey: 'displayName', fieldValue: 'Marketo Social Twitter Reach' });

            assert.isOk(result);
        });
    });

    describe('#getStaticList', () => {
        before(() => {
            nock(credentials.endpoint)
                // note: `57777` is listId
                .get('/v1/lists/57777/leads.json')
                .query({ access_token: source.accessToken, fields: 'firstName,lastName,id,company' })
                .reply(200, fixtures.getStaticList);
        });

        it('should return data from a static list', async () => {
            const result = await source.getStaticList({ listId: '57777', fields: 'firstName,lastName,id,company' });

            assert.isOk(result);
        });
    });
});
