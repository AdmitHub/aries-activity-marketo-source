import { Activity, singleS3StreamOutput } from 'aries-data';
import isFunction from 'lodash.isfunction';
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

        // grab an access token
        this.accessToken = null;
    }

    @singleS3StreamOutput()
    async onTask(activityTask, config) {
        let data = null;

        if (isFunction(this[config.method])) {
            const source = new MarketoSource(config.clientId, config.clientSecret, config.endpoint, config.identity);
            data = await source[config.method](config);
        }

        return data;
    }

    /**
     * Make a http(s) request and return the resulting json
     *
     * @param {string} uri
     * @param {Object} body
     * @param {string} method
     * @returns {Promise.<*>}
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
     * Return an array of ids for leads that match fieldKey and fieldValue
     *
     * @param {string} fieldKey
     * @param {string} fieldValue
     * @returns {Promise.<Array<number>>}
     */
    async listDescribeLeads({ fieldKey, fieldValue }) {
        // grab an access token if needed
        if (!this.accessToken) {
            // need an access token, so grab one
            await this.auth();
        }

        const uri = `${this.endpoint}/v1/leads/describe.json?access_token=${this.accessToken}`;
        const response = await this.request(uri);

        // check the status code
        if (response.statusCode === 603 || response.statusCode === 602) {
            // 603/602 means we need to get a new access token
            // grab a new access token and try again
            await this.auth();
            return this.listDescribeLeads({ fieldKey, fieldValue });
        }

        // get the result from the raw data
        const data = response.data.result;

        // look for matches: filter based on fieldKey and fieldValue,
        // then get the id for each item and return an array of ids (ex: [3, 45])
        if (data) {
            return data.filter(item => item[fieldKey] === fieldValue).map(item => item.id);
        }

        return null;
    }

    /**
     * Return leads that match fieldKey and fieldValue
     *
     * @param {string} fieldKey
     * @param {string} fieldValue
     * @param {string} nextPageToken (null by default)
     * @returns {Promise.<Object>}
     */
    async lookupLeads({ fieldKey, fieldValue, nextPageToken = null }) {
        // grab an access token if needed
        if (!this.accessToken) {
            // need an access token, so grab one
            await this.auth();
        }

        // get the ids and join them by comma
        const ids = await this.listDescribeLeads({ fieldKey, fieldValue });
        const idsInput = ids.join();

        // get the data for the leads by id
        let uri = `${this.endpoint}/v1/leads.json?access_token=${this.accessToken}&filterType=id&filterValues=${idsInput}`;
        if (nextPageToken) {
            // append the next page token
            uri += `&nextPageToken=${nextPageToken}`;
        }

        const response = await this.request(uri);

        // check the status code
        if (response.statusCode === 603 || response.statusCode === 602) {
            // 603/602 means we need to get a new access token
            // grab a new access token and try again
            await this.auth();
            return this.listDescribeLeads({ fieldKey, fieldValue });
        }

        if (!response.data.nextPageToken) {
            return response.data.result;
        }

        // if nextPageToken exists, then add data from the next page
        // there is another page of data, so concat it
        return response.data.result.concat(await this.lookupLeads({
            fieldKey, fieldValue, nextPageToken: response.data.nextPageToken,
        }));
    }
}
