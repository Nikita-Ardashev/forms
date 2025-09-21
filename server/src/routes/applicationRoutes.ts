import applicationController from '@/controllers/applicationController';
import { Router } from 'express';

const { create, getAll, validateApplication } = applicationController;

const applicationRouter = Router();

/** Получить список заявок */
applicationRouter.get('/', getAll);

/** Создать новую заявку */
applicationRouter.post('/', ...validateApplication, create);

export default applicationRouter;
