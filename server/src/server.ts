import { createServer } from 'http';
import app from './app';
import GracefulShutdown from 'http-graceful-shutdown';
import { finalFunction, preShutdownFunction, shutdownFunction } from './config/graceful';
import initializeDatabase from './db';
const PORT = 3000;

const server = createServer(app);

server.listen(PORT, () => {
	initializeDatabase();
	console.log(`Server is running on port ${PORT}`);
});

GracefulShutdown(server, {
	signals: 'SIGINT SIGTERM',
	timeout: 30000,
	development: process.env.NODE_ENV === 'development',
	preShutdown: preShutdownFunction,
	onShutdown: shutdownFunction,
	finally: finalFunction,
});
