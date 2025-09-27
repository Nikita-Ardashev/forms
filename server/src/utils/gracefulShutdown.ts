import { logger } from '@/config/logger';
import { Server } from 'http';

type ApiCallFunction = () => Promise<any>;
type RetryStrategy = (fn: ApiCallFunction, maxRetries: number) => Promise<any>;

interface ApiClient {
	name: string;
	disconnect: () => Promise<void>;
	hasPendingRequests: () => boolean;
}

export let isShuttingDown = false;
const apiClients: ApiClient[] = [];

export const registerApiClient = (client: ApiClient): void => {
	apiClients.push(client);
	logger.info(`API клиент зарегистрирован: ${client.name}`);
};

export const exponentialRetry: RetryStrategy = async (
	apiCall: ApiCallFunction,
	maxRetries = 3,
): Promise<any> => {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			if (isShuttingDown) {
				throw new Error('Прерывание: идет завершение работы');
			}

			const result = await apiCall();
			logger.debug(`API вызов успешен на попытке ${attempt}`);
			return result;
		} catch (error: any) {
			logger.warn(`Ошибка API на попытке ${attempt}:`, error);

			if (attempt === maxRetries) {
				throw error;
			}

			const delayMs = Math.pow(2, attempt) * 1000;
			logger.debug(`Повтор через ${delayMs}ms`);

			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}
	}
};

export const hasPendingApiRequests = (): boolean => {
	return apiClients.some((client) => client.hasPendingRequests());
};

export const gracefulShutdown = async (
	server: Server,
	shutdownTimeout = 30000,
): Promise<void> => {
	if (isShuttingDown) {
		logger.info('Процесс завершения уже запущен');
		return;
	}

	isShuttingDown = true;
	logger.info('Начало graceful shutdown...');

	const forceShutdownTimer = setTimeout(() => {
		logger.error('Таймаут graceful shutdown, форсированное завершение');
		process.exit(1);
	}, shutdownTimeout);

	forceShutdownTimer.unref();

	try {
		logger.info('Останавливаем сервер...');
		await new Promise<void>((resolve, reject) => {
			server.close((error) => {
				if (error) {
					reject(error);
				} else {
					logger.info('Сервер остановлен');
					resolve();
				}
			});
		});

		logger.info('Ожидаем завершения API запросов...');
		const maxWaitTime = 10000;
		const startTime = Date.now();

		while (hasPendingApiRequests() && Date.now() - startTime < maxWaitTime) {
			logger.debug(`Ожидаем завершения запросов...`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		if (hasPendingApiRequests()) {
			logger.warn('Некоторые API запросы не завершились вовремя');
		}

		logger.info('Закрываем соединения с внешними API...');
		await Promise.allSettled(
			apiClients.map(async (client) => {
				try {
					await client.disconnect();
					logger.info(`Соединение закрыто: ${client.name}`);
				} catch (error: any) {
					logger.error(`Ошибка закрытия ${client.name}:`, error);
				}
			}),
		);

		logger.info('Graceful shutdown завершен успешно');
		clearTimeout(forceShutdownTimer);
		process.exit(0);
	} catch (error: any) {
		logger.error('Ошибка при graceful shutdown:', error);
		clearTimeout(forceShutdownTimer);
		process.exit(1);
	}
};

export const initGracefulShutdown = (server: Server): void => {
	const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

	signals.forEach((signal) => {
		process.on(signal, () => {
			logger.info(`Получен сигнал: ${signal}`);
			gracefulShutdown(server).catch((error) => {
				logger.error('Критическая ошибка shutdown:', error);
				process.exit(1);
			});
		});
	});

	process.on('unhandledRejection', (reason: any, promise) => {
		logger.error('Unhandled Rejection:', reason);
	});

	process.on('uncaughtException', (error: any) => {
		logger.error('Uncaught Exception:', error);
		gracefulShutdown(server).finally(() => {
			process.exit(1);
		});
	});
};
