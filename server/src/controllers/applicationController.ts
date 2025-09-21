import { pool } from '@/config/database';
import { IApplication } from '@/models/application';
import { IErrorResponse } from '@/models/response';
import { sanitizeRequest } from '@/security/sanitize';
import { asyncHandler } from '@/utils/asyncHandler';
import { NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const validateApplication = [
	body('email').isEmail().normalizeEmail(),
	body('name').trim().isLength({ min: 2, max: 50 }),
	body('phone').isMobilePhone('ru-RU'),
	body('message').isLength({ max: 1000 }),
	body('serviceType').isString(),
];

const create = asyncHandler(async (req, res) => {
	const { body } = sanitizeRequest(req);

	try {
		validationResult(req).throw();

		const { name, email, phone, serviceType, message, source } = body as Omit<
			IApplication,
			'id' | 'status' | 'createdAt'
		>;

		const SQLCreateApplication = `
	INSERT INTO Application (name, email, phone, serviceType, message, source)
	VALUES ('${name}', '${email}', '${phone}', '${serviceType}', '${message}', '${source}')
	RETURNING id
	`;

		await pool.query(SQLCreateApplication);
		res.send(body);
	} catch (e: any) {
		console.error(new Error(e));
		res.send({ error: e, success: false } as IErrorResponse);
	}
});

const getAll = asyncHandler(async (req, res) => {
	const SQLList = `SELECT * FROM Application ORDER BY "createdAt" DESC`;

	try {
		const { rows } = await pool.query(SQLList);

		res.send(rows);
	} catch (e: any) {
		console.error(new Error(e));
		res.send({ error: e, success: false } as IErrorResponse);
	}
});

const applicationController = {
	create,
	getAll,
	validateApplication,
};

export default applicationController;
