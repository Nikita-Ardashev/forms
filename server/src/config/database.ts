import { configDotenv } from 'dotenv';
import { Pool } from 'pg';

configDotenv();

const pool = new Pool({
	host: process.env.POSTGRESQL_HOST,
	user: process.env.POSTGRESQL_USER,
	password: process.env.POSTGRESQL_PASSWORD,
	database: process.env.POSTGRESQL_DB,
});

pool.on('connect', () => {
	console.log('Подключение к PostgreSQL установлено');
});

pool.on('error', (err) => {
	console.error('Ошибка подключения к PostgreSQL:', err);
});

export { pool };
