import {ApiError} from '@shared/errors';
import {httpGet} from '@shared/functions';

export class SPARQLQueryDispatcher {
	private readonly endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	public async query(sparqlQuery: string) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);
		const headers = {'Accept': 'application/sparql-results+json'};
		const res = await httpGet(fullUrl, {headers});
		const {data: {results: {bindings}}} = res;
		if (!bindings) {
			throw new ApiError();
		}
		if (bindings.length === 0) {
			return null;
		}
		return bindings[0];

	}
}
