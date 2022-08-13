import logger from 'jet-logger';
import axios from 'axios';
import {ApiError} from '@shared/errors';

/**
 * Print an error object if it's truthy. Useful for testing.
 *
 * @param err
 */
export function pErr(err?: Error): void {
	if (!!err) {
		logger.err(err);
	}
}


/**
 * Get a random number between 1 and 1,000,000,000,000
 *
 * @returns
 */
export function getRandomInt(): number {
	return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Make a http get request
 * @param url {string} URL
 * @param params {object} params to the get request
 */
export async function httpGet(url: string, params?: object) {
	const res = await axios.get(url, params);
	return res;
}

export class SPARQLQueryDispatcher {
	private readonly endpoint: string;
	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	public async query(sparqlQuery: string) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);
		const headers = {'Accept': 'application/sparql-results+json'};

		try {
			const res = await httpGet(fullUrl, {headers});
			const {data: {results: {bindings}}} = res;
			if (!bindings) {
				throw new ApiError();
			}
			if (bindings.length === 0) {
				return null;
			}
			return bindings[0];
		} catch (e) {
			throw e;
		}
	}
}


