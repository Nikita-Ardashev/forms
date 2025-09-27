import { NextFunction, Request, Response } from 'express';
import { isShuttingDown } from '@/utils/gracefulShutdown';
export const shutdownMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (isShuttingDown && req.path !== '/health') {
		res.setHeader('Connection', 'close');
		return res.status(503).json({
			success: false,
			error: 'Сервис находится в процессе перезапуска',
			retryAfter: 30,
		});
	}

	next();
	return;
};

export const healthCheck = async (req: Request, res: Response) => {
	const checks = {
		database: true,
		externalApi: true,
		memory: process.memoryUsage().heapUsed < 100 * 1024 * 1024,
	};

	const isHealthy = Object.values(checks).every(Boolean);
	const statusCode = isHealthy ? 200 : 503;

	res.status(statusCode).json({
		status: isHealthy ? 'healthy' : 'unhealthy',
		timestamp: new Date().toISOString(),
		checks,
		uptime: process.uptime(),
	});
};
