import { logger } from '@/config/logger';
import applicationDAO from '@/DAO/applicationDAO';
import { IApplication } from '@/models/application';
import { asyncHandler } from '@/utils/asyncHandler';
import { verifyJwtToken } from '@/utils/jwt';
import { stringify } from 'csv-stringify';

const exportFile = asyncHandler(async (req, res) => {
	try {
		verifyJwtToken(req.headers.authorization as string);
		const chats = (await applicationDAO.getAll()).rows as IApplication[];
		const columns: Record<keyof IApplication, string> = {
			id: 'id',
			name: 'Имя',
			email: 'Email',
			phone: 'Телефон',
			service_type: 'Тип сервиса',
			message: 'Сообщение',
			created_at: 'Дата создания',
			status: 'Статус',
			source: 'Источник',
		};

		const csvData = await new Promise((resolve, reject) => {
			stringify(
				chats,
				{
					header: true,
					columns,
				},
				(e, output) => {
					if (e) reject(e);
					else resolve(output);
				},
			);
		});

		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="file.csv"');
		res.send('\uFEFF' + csvData);
	} catch (e) {
		logger.error(e);
		res.status(500).send({ error: 'Не удалось получить файл', success: false });
	}
});

const fileController = {
	exportFile,
};

export default fileController;
