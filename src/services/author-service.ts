import axios from 'axios';
import {ParamMissingError} from '@shared/errors';

async function fetchBirthPlace(author: string): Promise<any> {
	if (!author) {
		return null;
	}
	const birthplaceObj = await getData(generateUri(author), 'birthPlace');
	if (!birthplaceObj) {
		return null;
	}
	if (!(birthplaceObj instanceof Object)) {
		return birthplaceObj;
	}
	if (!birthplaceObj['__deferred']['uri']) {
		throw new ParamMissingError();
	}
	return birthplaceObj['__deferred']['uri']
		.split('/')
		.pop()
		.replaceAll('_', ' ');
}


async function fetchData(url: string): Promise<any> {
	const res = await axios.get(url);
	return res.data.d.results;
}

async function getData(uri: string, property: string): Promise<any> {
	const birthPlaceData = await fetchData(uri);
	if (!birthPlaceData || birthPlaceData.length === 0) {
		return null;
	}
	const birthplaceObj = birthPlaceData[0][`http://dbpedia.org/property/${property}`];
	return birthplaceObj;
}

function generateUri(str: string): string {
	const name = str.replaceAll(' ', '_');
	return `https://dbpedia.org/data/${name}.jsod`;
}

export default {
	fetchBirthPlace,
} as const;
