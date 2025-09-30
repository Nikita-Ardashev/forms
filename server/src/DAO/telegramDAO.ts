import { pool } from '@/config/database';
import { logger } from '@/config/logger';
import { QueryResult } from 'pg';

interface IChat {
	chat_id: number;
}

const addChatId = async (chatId: number) => {
	try {
		const getChatIdSQL = `
        SELECT chat_id FROM Telegram_Bot
    `;
		const chatIds: IChat[] = (await pool.query(getChatIdSQL)).rows;
		if (chatIds.some((chat) => chat.chat_id == chatId)) return;
	} catch (e) {
		logger.error(e);
	}

	try {
		const addChatIdSQL = `
        INSERT INTO Telegram_Bot (chat_id) VALUES ('${chatId}')
    `;
		await pool.query(addChatIdSQL);
	} catch (e) {
		logger.error(e);
	}
};

const getChatIds = async () => {
	try {
		const getChatIdsSQL = `
        SELECT chat_id FROM Telegram_Bot
    `;
		const chatIds = await pool.query(getChatIdsSQL);
		return chatIds as QueryResult<IChat>;
	} catch (e: any) {
		logger.error(e);
		throw new Error(e);
	}
};

const telegramDAO = { addChatId, getChatIds };

export default telegramDAO;
