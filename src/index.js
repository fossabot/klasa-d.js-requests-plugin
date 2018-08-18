const { Client: { plugin } } = require('klasa');

module.exports = {
	Client: require('./lib/Client.js'),

	REST: {
		RESTManager: require('./lib/REST/RESTManager'),
		APIRequest: require('./lib/REST/APIRequest'),
		handlers: require('./lib/REST/handlers')
	},

	Constants: require('./lib/util/CONSTANTS'),

	[plugin]: require('./lib/Client')[plugin]
};
