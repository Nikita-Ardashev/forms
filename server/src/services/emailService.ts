import { logger } from '@/config/logger';
import transporter from '@/config/nodemailer';
import { IApplication } from '@/models/application';
import { generateJwtToken } from '@/utils/jwt';
import { randomUUID } from 'crypto';
import { MailOptions } from 'nodemailer/lib/json-transport';

const host = process.env.HOST_SITE;

export const sendMessageToEmail = (props: IApplication) => {
	const jwt = generateJwtToken({
		email: process.env.EMAIL_ADMIN as string,
		userId: randomUUID(),
	});

	const srcAdminPanel = host + '?admin=' + jwt;

	const mailHTML =
		Object.keys(props)
			.map(
				(v) =>
					`<p style="margin: 4px 0; color: black;">${v}: ${props[v as keyof typeof props]}</p>`,
			)
			.join('\n') +
		`\n<a href="${srcAdminPanel}">Ссылка на админа панель. Действует в течении 24 часов!</a>`;
	const message: MailOptions = {
		from: process.env.EMAIL_USER,
		to: process.env.EMAIL_ADMIN,
		subject: 'Новая заявка!',
		text: 'Новая заявка!',
		html: mailHTML,
	};

	try {
		transporter.sendMail(message);
		const child = logger.child({ message: props });
		child.info('Уведомления разосланы на почту успешно');
	} catch (e: any) {
		logger.error(e);
	}
};
