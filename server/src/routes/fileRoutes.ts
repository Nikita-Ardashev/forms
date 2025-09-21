import { Router } from 'express';

const fileRouter = Router();

/** Скачать CSV с заявками */
fileRouter.get('/export', (req, res) => {
	res.send('file');
});

export default fileRouter;
