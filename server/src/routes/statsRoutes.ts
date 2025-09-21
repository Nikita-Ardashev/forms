import statsController from '@/controllers/statsController';
import { Router } from 'express';

const { stats } = statsController;

const statsRouter = Router();

/** Получить статистику */
statsRouter.get('/', stats);

export default statsRouter;
