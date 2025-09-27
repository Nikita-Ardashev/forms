import { TService } from './application';

export interface IForm {
	Имя: string;
	Email: string;
	Телефон: string;
	Услуга: TService;
	Сообщение: string;
	Время: Date;
}
