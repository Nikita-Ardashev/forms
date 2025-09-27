import { logger } from '@/config/logger';
import transporter from '@/config/nodemailer';
import { IApplication } from '@/models/application';
import { MailOptions } from 'nodemailer/lib/json-transport';

export const sendMessageToEmail = (props: IApplication) => {
	const mailHTML = Object.keys(props)
		.map(
			(v) =>
				`<p style="margin: 4px 0; color: black;">${v}: ${props[v as keyof typeof props]}</p>`,
		)
		.join('\n');
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
