import {Router} from 'express';
import userRouter from './user-router';
import authorRouter from './author-router';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/users', userRouter);
baseRouter.use('/authorPlace', authorRouter);

// Export default.
export default baseRouter;
