import {httpGet} from '@shared/functions';
import {ApiError} from '@shared/errors';

const ACCESS_KEY = '5b70def3ada924c0a17bd722e3d4899f';
async function getPlaceCoordinates(placeName: string) {
	const params = {
		access_key: ACCESS_KEY,
		query: placeName,
	}

	try {
		const res = await httpGet('http://api.positionstack.com/v1/forward', {params});
		if (!res || !res.data) {
			throw new ApiError();
		}
		const {data} = res.data;
		if (!data) {
			throw new ApiError();
		}
		if (data.length === 0) {
			return null;
		}
		const {latitude, longitude} = data[0];
		return {latitude, longitude};
	} catch (e) {
		throw e;
	}
}

export default {
	getPlaceCoordinates
} as const;

