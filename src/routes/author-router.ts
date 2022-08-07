import {Request, Response, Router} from 'express';
import StatusCodes from 'http-status-codes';
import authorService from '@services/author-service';

// eslint-disable-next-line new-cap
const router = Router();
const {OK} = StatusCodes;

export const p = {
	get: '/author/:authorName',
} as const;

router.get(p.get, async (request: Request, response: Response) => {
	const {authorName} = request.params;
	const birthPlace = await authorService.fetchBirthPlace(authorName);
	return response
		.set('Access-Control-Allow-Origin', 'http://localhost:3001')
		.json(birthPlace)
		.status(OK);

});

export default router;
