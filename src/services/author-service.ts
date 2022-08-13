import {SPARQLQueryDispatcher} from '@shared/functions';

// class AuthorService {
// 	private queryDispatcher: SPARQLQueryDispatcher;
// 	constructor() {
// 		const ENDPOINT_URL = 'https://query.wikidata.org/sparql';
// 		this.queryDispatcher = new SPARQLQueryDispatcher(ENDPOINT_URL);
// 	}
// 	private async query(sparqlQuery: string) {
// 		const res = await this.queryDispatcher.query(sparqlQuery);
// 		return res;
// 	}
// }

const ENDPOINT_URL = 'https://query.wikidata.org/sparql';

async function getPlaceOfBirth(queryDispatcher: SPARQLQueryDispatcher, authorName: string) {
	const birthLocation = 'birthLocation';
	const birthLocationLabel = 'birthLocationLabel';
	const sparqlQuery = `SELECT DISTINCT ?${birthLocation} ?${birthLocationLabel} WHERE {
  ?item ((wdt:P31|wdt:P101|wdt:P106)/(wdt:P279*)) wd:Q482980;
    rdfs:label "${authorName}"@en;
    wdt:P19 ?birthLocation.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

	const res = await queryDispatcher.query(sparqlQuery);
	if (res === null) {
		return null;
	}
	return {
		birthLocation: res[birthLocation].value.split('/').pop(),
		birthLocationLabel: res[birthLocationLabel].value,
	};
}


async function getCountryLatLong(queryDispatcher: SPARQLQueryDispatcher, birthLocation: string) {
	const countryLabel = 'countryLabel';
	const longitude = 'longitude';
	const latitude = 'latitude';
	const sparqlQuery = `SELECT ?${countryLabel} ?${longitude} ?${latitude} WHERE {
  wd:${birthLocation} p:P625 ?coordinate.
  ?coordinate psv:P625 ?coordinate_node.
  ?coordinate_node wikibase:geoLongitude ?${longitude};wikibase:geoLatitude ?${latitude}.
  wd:${birthLocation} wdt:P17 ?country.
  ?country rdfs:label ?${countryLabel}.
  FILTER((LANG(?${countryLabel})) = "en")
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;
	const res = await queryDispatcher.query(sparqlQuery);
	if (res === null) {
		return null;
	}
	return {
		countryLabel: res[countryLabel].value,
		longitude: res[longitude].value,
		latitude: res[latitude].value,
	};
}

async function getBirthPlace(name: string) {
	const queryDispatcher = new SPARQLQueryDispatcher(ENDPOINT_URL);
	const birthObj = await getPlaceOfBirth(queryDispatcher, name);
	if (!birthObj) {
		return null;
	}
	const birthPlaceObj = await getCountryLatLong(queryDispatcher, birthObj?.birthLocation);
	return {
		birthLocationLabel: birthObj.birthLocationLabel,
		...birthPlaceObj
	};
}

export default {
	getBirthPlace,
} as const;