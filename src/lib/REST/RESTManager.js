const handlers = require('./handlers');
const APIRequest = require('./APIRequest');
const routeBuilder = require('discord.js/src/rest/APIRouter');
const { Error } = require('discord.js/src/errors');
const { Endpoints } = require('discord.js/src/util/Constants');
const { Collection } = require('discord.js');
const { Events: { REQUEST_QUEUED } } = require('../util/CONSTANTS');

class RESTManager {

	constructor(client, tokenPrefix = 'Bot') {
		this.client = client;
		this.handlers = new Collection();
		this.globallyRateLimited = false;
		this.tokenPrefix = tokenPrefix;
		this.versioned = true;
		if (client.options.restSweepInterval > 0) {
			client.setInterval(() => {
				this.handlers.sweep(handler => handler._inactive);
			}, client.options.restSweepInterval * 1000);
		}
	}

	get api() {
		return routeBuilder(this);
	}

	getAuth() {
		const token = this.client.token || this.client.accessToken;
		const prefixed = !!this.client.application || this.client.user;
		if (token && prefixed) return `${this.tokenPrefix} ${token}`;
		else if (token) return token;
		throw new Error('TOKEN_MISSING');
	}

	get cdn() {
		return Endpoints.CDN(this.client.options.http.cdn); // eslint-disable-line new-cap
	}

	push(handler, apiRequest) {
		return new Promise((resolve, reject) => {
			handler.push({
				request: apiRequest,
				resolve,
				reject
			});
		});
	}

	getRequestHandler() {
		const method = this.client.options.apiRequestMethod;
		if (typeof method === 'function') return method;
		const handler = handlers[method];
		if (!handler) throw new Error('RATELIMIT_INVALID_METHOD');
		return handler;
	}

	request(method, url, options = {}) {
		const apiRequest = new APIRequest(this, method, url, options);
		let handler = this.handlers.get(apiRequest.route);

		if (!handler) {
			handler = new handlers.RequestHandler(this, this.getRequestHandler());
			this.handlers.set(apiRequest.route, handler);
		}

		if (this.client.listenerCount(REQUEST_QUEUED)) {
			this.client.emit(REQUEST_QUEUED, {
				handler,
				apiRequest,
				input: {
					method,
					url,
					options
				}
			});
		}

		return this.push(handler, apiRequest);
	}

	set endpoint(endpoint) {
		this.client.options.http.api = endpoint;
	}

}

module.exports = RESTManager;
