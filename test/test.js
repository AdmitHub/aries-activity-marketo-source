import { assert } from 'chai';
import nock from 'nock';
import * as fixtures from './fixtures';
import config from './test-config';
import MarketoSource from '../lib/index';

let source = null;

describe('MarketoSource', () => {
    afterEach(async () => {
        // clear out nock interceptor(s) after each test
        nock.cleanAll();
    });

    describe('#auth', () => {
        before(async () => {
            nock(config.endpoint)
                .get('/oauth/token?grant_type=client_credentials')
                .query({ client_id: config.clientId, client_secret: config.clientSecret })
                // return a fake access token
                .reply(200, fixtures.oauth);
        });

        it('should grab an access token', async () => {
            source = new MarketoSource(config.clientId, config.clientSecret,
                                       config.endpoint, config.identity);
            await source.auth();

            assert.isOk(source.accessToken);
        });
    });

    // describe('#listDescribeLeads', () => {
    //     before(async () => {
    //         nock(ENDPOINT_URI)
    //             .get('/v1/leads/describe.json')
    //             .query({ access_token: source.accessToken })
    //             .reply(200, fixtures.listDescribeLeads);
    //     });
    //
    //     it('should filter based on fieldKey and fieldValue', async () => {
    //         const result = await source.listDescribeLeads({ fieldKey: 'displayName', fieldValue: 'Marketo Social Twitter Reach' });
    //
    //         assert.isOk(result);
    //     });
    // });
    //
    // describe('#lookupLeads', () => {
    //     before(async () => {
    //         nock(ENDPOINT_URI)
    //             .get('/v1/leads/describe.json')
    //             .query({ access_token: source.accessToken })
    //             .reply(200, fixtures.listDescribeLeads);
    //         nock(ENDPOINT_URI)
    //             .get('/v1/leads.json')
    //             // note: `3` is the response from listDescribeLeads
    //             .query({ access_token: source.accessToken, filterType: 'id', filterValues: '3' })
    //             .reply(200, fixtures.lookupLeads);
    //     });
    //
    //     it('should return ids corresponding to fieldKey and fieldValue', async () => {
    //         const result = await source.lookupLeads({ fieldKey: 'displayName', fieldValue: 'Marketo Social Twitter Reach' });
    //
    //         assert.isOk(result);
    //     });
    // });
    //
    // describe('#getStaticList', () => {
    //     before(async () => {
    //         nock(ENDPOINT_URI)
    //             // note: `57777` is listId
    //             .get('/v1/lists/57777/leads.json')
    //             .query({ access_token: source.accessToken, fields: 'firstName,lastName,id,company' })
    //             .reply(200, fixtures.getStaticList);
    //     });
    //
    //     it('should return data from a static list', async () => {
    //         const result = await source.getStaticList({ listId: '57777', fields: 'firstName,lastName,id,company' });
    //
    //         assert.isOk(result);
    //     });
    // });
});
