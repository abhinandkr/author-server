import {Request, Response, Router} from 'express';
import StatusCodes from 'http-status-codes';
import geoService from '@services/geo-service';

// eslint-disable-next-line new-cap
const router = Router();
const {OK} = StatusCodes;

export const p = {
	get: '/coord/:placeName',
} as const;

router.get(p.get, async (request: Request, response: Response) => {
	const {placeName} = request.params;
	const coordinates = await geoService.getPlaceCoordinates(placeName);
	return response
		.set('Access-Control-Allow-Origin', 'http://localhost:3001')
		.json(coordinates)
		.status(OK);
});

export default router;
