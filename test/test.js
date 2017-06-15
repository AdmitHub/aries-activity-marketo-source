import { assert } from 'chai';
import nock from 'nock';
import * as fixtures from './fixtures';
import config from './test-config';
import MarketoSource from '../lib/index';

let source = null;

describe('MarketoSource', () => {
    afterEach(() => {
        // clear out nock interceptor(s) after each test
        nock.cleanAll();
    });

    describe('#auth', () => {
        before(() => {
            nock(config.identity)
                .get('/oauth/token')
                .query({ grant_type: 'client_credentials', client_id: config.clientId, client_secret: config.clientSecret })
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

    describe('#getStaticList', () => {
        beforeEach(() => {
            nock(config.endpoint)
                // note: `57777` is listId
                .get('/v1/lists/57777/leads.json')
                .query({ access_token: source.accessToken, fields: 'firstName,lastName,id,company' })
                .reply(200, fixtures.getStaticList);
            nock(config.endpoint)
                // note: '57778' is listId
                .get('/v1/lists/57778/leads.json')
                .query({ access_token: source.accessToken, fields: 'id,firstName,lastName,company,email' })
                .reply(200, fixtures.getStaticListPage1)
                .get('/v1/lists/57778/leads.json')
                .query({
                    access_token: source.accessToken,
                    fields: 'id,firstName,lastName,company,email',
                    nextPageToken: 'LS5VL5WD4PUVCOUCJR6VY7JQOYHUSZXFAIXVQSVBTJW7Q23CCGZ4X4JNKUNCF4LCXZJHONDNVOP6Y===',
                })
                .reply(200, fixtures.getStaticListPage2);
        });

        it('should return data from a static list', async () => {
            const result = await source.getStaticList({ listId: '57777', fields: 'firstName,lastName,id,company' });

            assert.isOk(result);
        });

        it('should return data from a static list with multiple pages', async () => {
            const result = await source.getStaticList({ listId: '57778', fields: 'id,firstName,lastName,company,email' });

            assert.isOk(result);
        });
    });
});
