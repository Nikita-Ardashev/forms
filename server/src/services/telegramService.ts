import { pool } from '@/config/database';
import { logger } from '@/config/logger';
import { IApplication } from '@/models/application';
import { IForm } from '@/models/form';
import TelegramBot from 'node-telegram-bot-api';

interface IChat {
	chat_id: number;
}

const token = process.env.TG_BOT_TOKEN as string;
const bot = new TelegramBot(token, { polling: true });

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
		return chatIds.rows;
	} catch (e: any) {
		logger.error(e);
		throw new Error(e);
	}
};

const subscriberChatIds: number[] = [];

bot.onText(/\/start/, async (msg) => {
	const chatId = msg.chat.id;

	if (!subscriberChatIds.includes(chatId)) {
		subscriberChatIds.push(chatId);
		await addChatId(chatId);
		console.log(`Новый подписчик: ${chatId}`);
	}
	bot.sendMessage(chatId, 'Привет! Вы подписались на рассылку.');
});

export const sendMessageToBoot = async (application: IApplication) => {
	try {
		const form: IForm = {
			Имя: application.name,
			Email: application.email,
			Телефон: application.phone,
			Услуга: application.serviceType,
			Сообщение: application.message,
			Время: application.createdAt,
		};
		const text = Object.keys(form)
			.map((k) => `${k}: ${form[k as keyof typeof form]}`)
			.join(',\n');

		const chatIds: IChat[] = await getChatIds();

		for (const chat of chatIds) {
			try {
				await bot.sendMessage(chat.chat_id, text);
			} catch {
				continue;
			}
		}
		const child = logger.child({ message: form });
		child.info('Уведомления разосланы по чатам телеграма успешно');
	} catch (e: any) {
		logger.error(e);
		throw new Error(e);
	}
};
