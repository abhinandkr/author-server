import {SPARQLQueryDispatcher} from '@shared/functions';
import {ApiError} from '@shared/errors';

async function getAuthorBirthPlace() {
	const endpointUrl = 'https://query.wikidata.org/sparql';
	const sparqlQuery = `SELECT DISTINCT ?item ?itemLabel ?birthLocation ?birthLocationLabel WHERE {
  ?item ((wdt:P31|wdt:P101|wdt:P106)/(wdt:P279*)) wd:Q482980;
    rdfs:label "Rupi Kaur"@en;
    wdt:P19 ?birthLocation.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;

	const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
	try {
		const res = await queryDispatcher.query(sparqlQuery);
		return res;
	} catch (e) {
		throw e;
	}
}

export default {
	getAuthorBirthPlace,
} as const;