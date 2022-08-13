import {SPARQLQueryDispatcher} from '@shared/functions';

async function getBirthPlace(name: string) {
	const endpointUrl = 'https://query.wikidata.org/sparql';
	const queriedLabel = 'birthLocationLabel';
	const sparqlQuery = `SELECT DISTINCT ?${queriedLabel} WHERE {
  ?item ((wdt:P31|wdt:P101|wdt:P106)/(wdt:P279*)) wd:Q482980;
    rdfs:label "${name}"@en;
    wdt:P19 ?birthLocation.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

	const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
	try {
		const res = await queryDispatcher.query(sparqlQuery);
		if (res === null) {
			return null;
		}
		return res[queriedLabel].value;
	} catch (e) {
		throw e;
	}
}

export default {
	getBirthPlace,
} as const;