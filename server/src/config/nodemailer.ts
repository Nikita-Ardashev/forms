import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
	service: process.env.EMAIL_SERVICE,
	host: process.env.EMAIL_HOST,
	port: Number(process.env.EMAIL_PORT),
	secure: true,
	requireTLS: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	logger: true,
});

transporter.verify((error: any) => {
	if (error) {
		logger.error('Ошибка подключения к почтовому серверу:', error);
	} else {
		logger.info('Подключение к почтовому серверу установлено');
	}
});

export default transporter;
