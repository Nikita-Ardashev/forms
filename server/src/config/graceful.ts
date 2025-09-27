import { pool } from './database';

export const preShutdownFunction = (signal: string | undefined): Promise<void> => {
	console.log(`Pre-shutdown hook triggered by ${signal}`);
	return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const shutdownFunction = (signal: string | undefined): Promise<void> => {
	return new Promise((resolve) => {
		pool.removeAllListeners();
		console.log('... called signal: ' + signal);
		console.log('... in cleanup');
		setTimeout(resolve, 1000);
	});
};

export const finalFunction = () => {
	console.log('Server gracefulls shutted down.....');
};
