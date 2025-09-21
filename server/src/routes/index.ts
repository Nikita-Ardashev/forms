import { Router } from 'express';
import applicationRouter from './applicationRoutes';
import statsRouter from './statsRoutes';
import fileRouter from './fileRoutes';

const appRouter = Router();

appRouter.use('/api/application', applicationRouter);
appRouter.use('/api/stats', statsRouter);
appRouter.use('/api/', fileRouter);

export default appRouter;
