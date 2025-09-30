import { pool } from '@/config/database';
import { logger } from '@/config/logger';
import { IApplication } from '@/models/application';
import { sendMessageToEmail } from '@/services/emailService';
import { sendMessageToBoot } from '@/services/telegramService';
import { exponentialRetry } from '@/utils/gracefulShutdown';
import { monitorRetry } from '@/utils/retryMonitor';
import { QueryResult } from 'pg';

const create = async (body: IApplication) => {
	const { name, email, phone, service_type, message, source } = body as Omit<
		IApplication,
		'id' | 'status' | 'created_at'
	>;

	const SQLCreateApplication = `
    	  INSERT INTO application (name, email, phone, service_type, message, source)
    	  VALUES ($1, $2, $3, $4, $5, $6)
    	  RETURNING id
    	`;
	try {
		const dbOperation = async () => {
			return await pool.query(SQLCreateApplication, [
				name,
				email,
				phone,
				service_type,
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

		return result as QueryResult<IApplication>;
	} catch (e: any) {
		logger.error(e);
		throw new Error(e);
	}
};

const getAll = async () => {
	try {
		const SQLList = `SELECT * FROM Application ORDER BY "created_at" DESC`;

		const dbOperation = async () => {
			return await pool.query(SQLList);
		};

		const result = await exponentialRetry(dbOperation, 3);
		monitorRetry('get_all_applications', 1, true);

		return result as QueryResult<IApplication>;
	} catch (e: any) {
		logger.error(e);
		throw new Error(e);
	}
};

const applicationDAO = { create, getAll };

export default applicationDAO;
