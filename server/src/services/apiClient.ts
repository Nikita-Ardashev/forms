import { logger } from '@/config/logger';
import { exponentialRetry } from '@/utils/gracefulShutdown';

export const createApiClient = (baseURL: string, clientName: string) => {
	let pendingRequests = 0;
	let isConnected = true;

	const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
		return exponentialRetry(async () => {
			pendingRequests++;

			try {
				const response = await fetch(`${baseURL}${endpoint}`, {
					...options,
					signal: AbortSignal.timeout(10000),
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				return await response.json();
			} finally {
				pendingRequests = Math.max(0, pendingRequests - 1);
			}
		}, 3);
	};

	const apiClient = {
		name: clientName,

		disconnect: async (): Promise<void> => {
			isConnected = false;
			logger.info(`Отключаем ${clientName}...`);

			const maxWait = 5000;
			const start = Date.now();

			while (pendingRequests > 0 && Date.now() - start < maxWait) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}

			logger.info(`${clientName} отключен`);
		},

		hasPendingRequests: (): boolean => pendingRequests > 0,

		get: (endpoint: string) => makeRequest(endpoint),

		post: (endpoint: string, data: any) =>
			makeRequest(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			}),
	};

	return apiClient;
};
