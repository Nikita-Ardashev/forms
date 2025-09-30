import { logger } from '@/config/logger';
import jwt from 'jsonwebtoken';

interface JwtPayload {
	userId: string;
	email: string;
	role?: string;
}

export const generateJwtToken = (payload: JwtPayload): string => {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		logger.error({ error: 'JWT_SECRET не настроен в переменных окружения' });
		throw new Error('JWT_SECRET не настроен в переменных окружения');
	}

	const token = jwt.sign(
		{
			...payload,
		},
		secret,
		{
			expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
		},
	);

	return token;
};

export const verifyJwtToken = (token: string): JwtPayload => {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		logger.error({ error: 'JWT_SECRET не настроен в переменных окружения' });
		throw new Error('JWT_SECRET не настроен в переменных окружения');
	}

	try {
		const decoded = jwt.verify(token, secret) as JwtPayload;
		return decoded;
	} catch (e) {
		logger.error(e);
		throw new Error('Невалидный JWT токен');
	}
};

export const decodeJwtToken = (token: string): JwtPayload | null => {
	try {
		const decoded = jwt.decode(token) as JwtPayload;
		return decoded;
	} catch (e: any) {
		logger.error(e);
		throw new Error(e);
	}
};
