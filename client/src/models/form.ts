import type { TService } from './application';

export interface IForm {
	name: string;
	email: string;
	phone: string;
	service_type: TService;
	message: string;
}

export interface IFormRU {
	Имя: string;
	Email: string;
	Телефон: string;
	Услуга: TService;
	Сообщение: string;
	Время: string;
}
