require('dotenv').config();

const config = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    endpoint: process.env.ENDPOINT,
    identity: process.env.IDENTITY,
};

export default config;
