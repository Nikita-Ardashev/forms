import { pool } from '@/config/database';
import { logger } from '@/config/logger';
import { IApplication } from '@/models/application';
import { IErrorResponse } from '@/models/response';
import { sanitizeRequest } from '@/security/sanitize';
import { sendMessageToEmail } from '@/services/emailService';
import { sendMessageToBoot } from '@/services/telegramService';
import { asyncHandler } from '@/utils/asyncHandler';
import { exponentialRetry } from '@/utils/gracefulShutdown';
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
	body('serviceType').isString().withMessage('Неверный тип'),
];

const create = asyncHandler(async (req, res) => {
	const { body } = sanitizeRequest(req);
	body as IApplication;

	try {
		validationResult(req).throw();

		const { name, email, phone, serviceType, message, source } = body as Omit<
			IApplication,
			'id' | 'status' | 'createdAt'
		>;

		const SQLCreateApplication = `
    	  INSERT INTO application (name, email, phone, serviceType, message, source)
    	  VALUES ($1, $2, $3, $4, $5, $6)
    	  RETURNING id
    	`;
		const dbOperation = async () => {
			return await pool.query(SQLCreateApplication, [
				name,
				email,
				phone,
				serviceType,
				message,
				source,
			]);
		};

		const result = await exponentialRetry(dbOperation, 3);

		const sendNotifications = async () => {
			await Promise.allSettled([sendMessageToBoot(body), sendMessageToEmail(body)]);
		};

		await exponentialRetry(sendNotifications, 3);
		monitorRetry('send_notifications', 1, true);

		res.json({
			data: { ...body, id: result.rows[0].id },
			message: 'Заявка успешно создана',
		});
	} catch (e: any) {
		logger.error(e);
		monitorRetry('create_application_full', 1, false, e);
		res.send({ error: e, success: false } as IErrorResponse);
	}
});

const getAll = asyncHandler(async (req, res) => {
	const SQLList = `SELECT * FROM Application ORDER BY "createdAt" DESC`;

	try {
		const dbOperation = async () => {
			return await pool.query(SQLList);
		};

		const result = await exponentialRetry(dbOperation, 3);
		monitorRetry('get_all_applications', 1, true);

		res.json({ success: true, data: result.rows, count: result.rows.length });
	} catch (e: any) {
		logger.error(e);
		monitorRetry('get_all_applications', 1, false, e);
		res.send({ error: e, success: false } as IErrorResponse);
	}
});

const applicationController = {
	create,
	getAll,
	validateApplication,
};

export default applicationController;
