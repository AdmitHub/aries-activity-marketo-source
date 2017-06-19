require('dotenv').config();

const config = {
    clientId: process.env.CLIENT_ID || 'id',
    clientSecret: process.env.CLIENT_SECRET || 'secret',
    endpoint: process.env.ENDPOINT || 'https://example.mktorest.com/rest',
    identity: process.env.IDENTITY || 'https://example.mktorest.com/identity',
};

export default config;
