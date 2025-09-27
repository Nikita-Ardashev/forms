import pino from 'pino';

require('child_process').execSync('chcp 65001', { stdio: 'inherit' });

export const logger = pino({
	transport: {
		targets: [
			{ target: 'pino-pretty', options: { colorize: true } },
			{
				target: 'pino/file',
				options: { destination: `${__dirname}/../logs/app.log` },
			},
		],
	},
});
