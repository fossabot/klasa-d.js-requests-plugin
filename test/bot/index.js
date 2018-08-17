const { Client } = require('klasa');
const { token } = require('./config');

Client.use(require('../../src/index.js').Client);

const client = new Client();

client.on('REQUEST_SENT', args => console.log(args));

client.login(token);
