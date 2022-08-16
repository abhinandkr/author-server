import {SPARQLQueryDispatcher} from '@shared/classes';

export default class AuthorService {
	private queryDispatcher: SPARQLQueryDispatcher;

	constructor() {
		const ENDPOINT_URL = 'https://query.wikidata.org/sparql';
		this.queryDispatcher = new SPARQLQueryDispatcher(ENDPOINT_URL);
	}

	private async query(sparqlQuery: string) {
		return await this.queryDispatcher.query(sparqlQuery);
	}

	private async getBirthLocation(authorName: string) {
		const birthLocationId = 'birthLocationId';
		const birthLocationIdLabel = `${birthLocationId}Label`;
		const sparqlQuery = `SELECT DISTINCT ?${birthLocationId} ?${birthLocationIdLabel} WHERE {
		  ?item ((wdt:P31|wdt:P101|wdt:P106)/(wdt:P279*)) wd:Q482980;
		    rdfs:label "${authorName}"@en;
		    wdt:P19 ?${birthLocationId}.
		  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
		}`;

		const res = await this.query(sparqlQuery);
		if (res === null) {
			return null;
		}
		return {
			birthLocationId: res[birthLocationId].value.split('/').pop(),
			birthLocationIdLabel: res[birthLocationIdLabel].value,
		};
	}

	private async getCountryLatLong(birthLocationId: string) {
		const countryLabel = 'countryLabel';
		const longitude = 'longitude';
		const latitude = 'latitude';
		const item = 'item';
		const itemDescription = `${item}Description`;
		const sparqlQuery = `SELECT ?${countryLabel} ?${longitude} ?${latitude} ?${itemDescription} WHERE {
		  VALUES ?${item} {wd:${birthLocationId}}
		  ?${item} p:P625 ?coordinate.
		  ?coordinate psv:P625 ?coordinate_node.
		  ?coordinate_node wikibase:geoLongitude ?${longitude};wikibase:geoLatitude ?${latitude}.
		  ?${item} wdt:P17 ?country.
		  ?country rdfs:label ?${countryLabel}.
		  FILTER((LANG(?${countryLabel})) = "en")
		  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
		}`;
		const res = await this.query(sparqlQuery);
		if (res === null) {
			return null;
		}
		return {
			country: res[countryLabel].value,
			longitude: res[longitude].value,
			latitude: res[latitude].value,
			itemDescription: res[itemDescription].value,
		};
	}

	public async getBirthData(authorName: string) {
		const birthObj = await this.getBirthLocation(authorName);
		if (!birthObj) {
			return null;
		}
		const countryLatLong = await this.getCountryLatLong(birthObj?.birthLocationId);
		if (!countryLatLong) {
			return null;
		}
		return {
			birthLocation: birthObj.birthLocationIdLabel,
			...countryLatLong,
		};
	}
}
