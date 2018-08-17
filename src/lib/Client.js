const { Client, util: { mergeDefault } } = require('klasa');
const { OPTIONS } = require('../lib/util/CONSTANTS');

const RESTManager = require('../lib/REST/RESTManager.js');

class RequestLoggerClient extends Client {

	constructor(config) {
		super(config);
		this.constructor[Client.plugin].call(this);
	}

	static [Client.plugin]() {
		mergeDefault(OPTIONS, this.options);

		this.rest = new RESTManager(this, this.options._tokenType);
	}

}

module.exports = RequestLoggerClient;
