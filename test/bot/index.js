const { Client } = require('klasa');
const { token } = require('./config');
const { Constants: { Events: { REQUEST_MADE } } } = require('../../src/index.js');

Client.use(require('../../src/index.js').Client);

const client = new Client();

client.on(REQUEST_MADE, args => console.log(args));

client.login(token);
