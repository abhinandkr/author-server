import {Router} from 'express';
import authorRouter from './author-router';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/authorPlace', authorRouter);

// Export default.
export default baseRouter;
