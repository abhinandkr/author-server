import {Router} from 'express';
import authorRouter from '@routes/author-router';
import geoRouter from '@routes/geo-router';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/authorPlace', authorRouter);
baseRouter.use('/placeCoord', geoRouter);


// Export default.
export default baseRouter;
