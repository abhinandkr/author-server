import axios from 'axios';
import {ApiError, ParamMissingError} from '@shared/errors';

async function fetchBirthPlace(author: string): Promise<any> {
	if (!author) {
		throw new ParamMissingError();
	}
	return await getData(generateUri(author), 'birthPlace');
}

async function fetchData(url: string): Promise<any> {
	const res = await axios.get(url);
	if (!res || !res.data) {
		throw new ApiError();
	}
	if (typeof res.data === 'string' || res.data instanceof String) {
		const regex = /"http:\/\/dbpedia.org\/property\/birthPlace"[^,]*/m;
		const data = res.data.match(regex);
		if (!data || data.length === 0) {
			return null;
		}
		const birthplaceObj = JSON.parse(`{${data[0]}}`);
		if (!birthplaceObj) {
			return null;
		}
		return [birthplaceObj];
	}
	return res.data.d.results;
}

async function getData(uri: string, property: string): Promise<any> {
	const birthPlaceData = await fetchData(uri);
	if (!birthPlaceData || birthPlaceData.length === 0) {
		return null;
	}
	const birthplaceObj = birthPlaceData[0][`http://dbpedia.org/property/${property}`];
	if (!birthplaceObj) {
		return null;
	}
	if (typeof birthplaceObj === 'string' || birthplaceObj instanceof String) {
		return birthplaceObj;
	}
	if (!birthplaceObj['__deferred']['uri']) {
		throw new ApiError();
	}
	return birthplaceObj['__deferred']['uri']
		.split('/')
		.pop()
		.replaceAll('_', ' ');
}

function generateUri(str: string): string {
	const name = str.replaceAll(' ', '_');
	return `https://dbpedia.org/data/${name}.jsod`;
}

export default {
	fetchBirthPlace,
} as const;
