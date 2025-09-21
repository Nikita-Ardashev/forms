import { pool } from './config/database';

const createTableApplication = `
CREATE TABLE Application
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL CHECK(length(name) >= 2),
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR UNIQUE NOT NULL,
    serviceType VARCHAR(20) NOT NULL CHECK (
        serviceType IN ('консультация', 'разработка', 'поддержка', 'другое')
    ),
    message VARCHAR(1000),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'новая' CHECK (
        status IN ('новая', 'обработана')
    ),
    source TEXT
);`;

async function initializeDatabase() {
	try {
		await pool.query(createTableApplication);
		console.log('Таблица Application создана.');
	} catch (e: any) {
		console.log(e);
	}
}

initializeDatabase();
