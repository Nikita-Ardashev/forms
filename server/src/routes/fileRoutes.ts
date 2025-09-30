import fileController from '@/controllers/fileController';
import { Router } from 'express';

const { exportFile } = fileController;

const fileRouter = Router();

/** Скачать CSV с заявками */
fileRouter.get('/export', exportFile);

export default fileRouter;
