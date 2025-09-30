import { logger } from '@/config/logger';
import telegramDAO from '@/DAO/telegramDAO';
import { IApplication } from '@/models/application';
import { IForm } from '@/models/form';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TG_BOT_TOKEN as string;
const bot = new TelegramBot(token, { polling: true });

const { addChatId, getChatIds } = telegramDAO;

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
			Услуга: application.service_type,
			Сообщение: application.message,
			Время: application.created_at,
		};
		const text = Object.keys(form)
			.map((k) => `${k}: ${form[k as keyof typeof form]}`)
			.join(',\n');

		const chatIds = (await getChatIds()).rows;

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
