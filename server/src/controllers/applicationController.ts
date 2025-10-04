import { logger } from '@/config/logger';
import applicationDAO from '@/DAO/applicationDAO';
import { IApplication } from '@/models/application';
import { IErrorResponse } from '@/models/response';
import { sanitizeRequest } from '@/security/sanitize';
import { asyncHandler } from '@/utils/asyncHandler';
import { verifyJwtToken } from '@/utils/jwt';
import { monitorRetry } from '@/utils/retryMonitor';
import { NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const validateApplication = [
	body('email').isEmail().normalizeEmail().withMessage('Неверный формат почты'),
	body('name')
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage('Короткое или длинное имя пользователя'),
	body('phone').isMobilePhone('ru-RU').withMessage('Неверный формат номера'),
	body('message').isLength({ max: 1000 }),
	body('service_type').isString().withMessage('Неверный тип'),
];

const create = asyncHandler(async (req, res) => {
	const { body: sanitizeBody } = sanitizeRequest(req);
	const body = sanitizeBody as IApplication;
	body.source = req.headers.origin ?? '';
	try {
		validationResult(req).throw();

		const result = await applicationDAO.create(body);

		res.json({
			success: true,
			data: { ...body, id: result.rows[0].id },
			message: 'Заявка успешно создана!',
		});
	} catch (e: any) {
		logger.error(e);
		monitorRetry('create_application_full', 1, false, e);
		res.status(500).send({
			error: e,
			success: false,
			message: 'Не удалось создать заявку!',
		} as IErrorResponse);
	}
});

const getAll = asyncHandler(async (req, res) => {
	try {
		verifyJwtToken(req.headers.authorization as string);
		const result = await applicationDAO.getAll();

		res.json({ success: true, data: result.rows, count: result.rows.length });
	} catch (e: any) {
		logger.error(e);
		monitorRetry('get_all_applications', 1, false, e);
		res.status(500).send({
			error: 'Не удалось получить заявки',
			success: false,
		} as IErrorResponse);
	}
});

const applicationController = {
	create,
	getAll,
	validateApplication,
};

export default applicationController;
