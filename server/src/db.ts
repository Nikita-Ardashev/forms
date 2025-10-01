import { pool } from './config/database';

const createTableApplication = `
    CREATE TABLE IF NOT EXISTS Application
    (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL CHECK(length(name) >= 2),
        email VARCHAR NOT NULL,
        phone VARCHAR  NOT NULL,
        service_type VARCHAR(20) NOT NULL CHECK (
            service_type IN ('консультация', 'разработка', 'поддержка', 'другое')
        ),
        message VARCHAR(1000),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'новая' CHECK (
            status IN ('новая', 'обработана')
        ),
        source TEXT
    );
`;

const createTableTelegramBot = `
    CREATE TABLE IF NOT EXISTS Telegram_Bot
    (
        id SERIAL PRIMARY KEY,
        chat_id BIGINT NOT NULL UNIQUE
    );
`;

export default async function initializeDatabase() {
	try {
		await pool.query('BEGIN');

		await pool.query(createTableApplication);
		console.log('Таблица Application создана или уже существует.');

		await pool.query(createTableTelegramBot);
		console.log('Таблица Telegram_Bot создана или уже существует.');

		await pool.query('COMMIT');
	} catch (e: any) {
		await pool.query('ROLLBACK');
		if (e.code === '23505' && e.constraint === 'pg_type_typname_nsp_index') {
			console.log('Таблицы уже созданы другим процессом.');
		} else {
			console.error('Ошибка при инициализации базы данных:', e);
			throw e;
		}
	}
}

initializeDatabase();
