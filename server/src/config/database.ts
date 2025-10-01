import { configDotenv } from 'dotenv';
import { Pool } from 'pg';
import { logger } from './logger';

configDotenv();

const pool = new Pool({
	host: process.env.POSTGRES_URL,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
});

pool.on('connect', () => {
	logger.info('Подключение к PostgreSQL установлено');
});

pool.on('error', (e: any) => {
	logger.error('Ошибка подключения к PostgreSQL:', e);
});

export { pool };
