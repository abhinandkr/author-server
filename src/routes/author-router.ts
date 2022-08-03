import {Request, Response, Router} from 'express';
import StatusCodes from 'http-status-codes';
import authorService from '@services/author-service';

const router = Router();
const {OK} = StatusCodes;

export const p = {
	get: '/author/:authorName',
} as const;

router.get(p.get, async (request: Request, response: Response) => {
	const {authorName} = request.params;
	const birthPlace = await authorService.fetchBirthPlace(authorName);
	return response.status(OK).json(birthPlace);
});

export default router;
