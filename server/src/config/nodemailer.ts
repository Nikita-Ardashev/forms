import nodemailer from 'nodemailer';

// Создание транспортера для Nodemailer :cite[1]:cite[2]
const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	requireTLS: true,
	auth: {
		user: '',
		pass: '',
	},
	logger: true,
});

// Проверка подключения
transporter.verify((error) => {
	if (error) {
		console.error('Ошибка подключения к почтовому серверу:', error);
	} else {
		console.log('Подключение к почтовому серверу установлено');
	}
});

export default transporter;
