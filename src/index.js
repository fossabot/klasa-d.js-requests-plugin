const {
	Client: {
		plugin
	}
} = require('klasa');

module.exports = {
	Client: require('./lib/Client.js'),
	[plugin]: require('./lib/Client')[plugin]
};
