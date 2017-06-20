/* eslint class-methods-use-this: ["error", { "exceptMethods": ["request"] }] */
import { Activity, singleS3StreamOutput } from 'aries-data';
import isFunction from 'lodash.isfunction';
import isString from 'lodash.isstring';
import rq from 'request-promise';

export default class MarketoSource extends Activity {
    /**
     * @param {string} clientId
     * @param {string} clientSecret
     * @param {string} endpoint
     * @param {string} identity
     */
    constructor(clientId, clientSecret, endpoint, identity) {
        super();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.endpoint = endpoint;
        this.identity = identity;

        this.accessToken = null;
    }

    @singleS3StreamOutput('json')
    async onTask(activityTask, config) {
        let data = null;

        if (isFunction(this[config.method])) {
            const source = new MarketoSource(config.clientId, config.clientSecret,
                                             config.endpoint, config.identity);
            data = await source[config.method](config);
        }

        return data;
    }

    /**
     * Make a http(s) request and return the resulting json
     *
     * @param   {string} uri
     * @param   {Object} body
     * @param   {string} method
     * @returns {Promise.<Object>}
     */
    async request(uri, body = null, method = 'GET') {
        const options = {
            uri,
            json: true,
            method,
            body,
            transform: (data, response) => ({
                // custom response structure (include the status code)
                statusCode: response.statusCode,
                data,
            }),
        };

        return rq(options);
    }

    /**
     * Gets an access token for the session
     *
     * @returns {void}
     */
    async auth() {
        // get an access token
        const uri = `${this.identity}/oauth/token?grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`;
        const response = await this.request(uri);
        this.accessToken = response.data.access_token;
    }

    // Methods
    /**
     * Returns a static list
     *
     * @param  {number}         listId
     * @param  {string|Array}   fields
     * @param  {string}         nextPageToken (null by default)
     * @return {Promise.<Array>}
     */
    async getStaticList({ listId, fields, nextPageToken = null }) {
        // grab an access token if needed
        if (!this.accessToken) {
            // need an access token, so grab one
            await this.auth();
        }

        let uri = `${this.endpoint}/v1/lists/${listId}/leads.json?access_token=${this.accessToken}`;

        if (isString(fields)) {
            // fields is a string
            uri += `&fields=${fields}`;
        } else {
            // fields is an array, so join into a single string separated by commas
            uri += `&fields=${fields.join()}`;
        }

        if (nextPageToken) {
            // append the next page token
            uri += `&nextPageToken=${nextPageToken}`;
        }

        const response = await this.request(uri);
        const result = response.data.result;

        if (!response.data.nextPageToken) {
            // no more data
            return result;
        }

        // more data exists
        return result.concat(await this.getStaticList({
            listId, fields, nextPageToken: response.data.nextPageToken,
        }));
    }
}
