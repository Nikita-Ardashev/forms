import { configDotenv } from 'dotenv';
import { Pool } from 'pg';
import { logger } from './logger';

configDotenv();

const pool = new Pool({
	host: process.env.POSTGRESQL_HOST,
	user: process.env.POSTGRESQL_USER,
	password: process.env.POSTGRESQL_PASSWORD,
	database: process.env.POSTGRESQL_DB,
});

pool.on('connect', () => {
	logger.info('Подключение к PostgreSQL установлено');
});

pool.on('error', (e: any) => {
	logger.error('Ошибка подключения к PostgreSQL:', e);
});

export { pool };
