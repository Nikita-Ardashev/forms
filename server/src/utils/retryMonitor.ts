import { logger } from '@/config/logger';
import { NextFunction, Request, Response } from 'express';

const retryStats = {
	totalAttempts: 0,
	successfulRetries: 0,
	failedRetries: 0,
	lastError: null as Error | null,
};

export const monitorRetry = (
	operation: string,
	attempt: number,
	success: boolean,
	error?: Error,
) => {
	retryStats.totalAttempts++;

	if (success && attempt > 1) {
		retryStats.successfulRetries++;
	} else if (!success && attempt > 1) {
		retryStats.failedRetries++;
		retryStats.lastError = error || null;
	}

	logger.debug(`Retry монитор: ${operation}, попытка ${attempt}, успех: ${success}`);
};

export const getRetryStats = () => ({ ...retryStats });

export const retryLogger = (req: Request, res: Response, next: NextFunction) => {
	const originalSend = res.send;

	res.send = (body: any) => {
		if (res.statusCode >= 500) {
			logger.warn('Потенциальная возможность для retry');
		}

		return originalSend.call(this, body);
	};

	next();
};
