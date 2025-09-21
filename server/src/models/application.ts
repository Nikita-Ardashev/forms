export type TStatus = 'новая' | 'обработана';
export type TService = 'консультация' | 'разработка' | 'поддержка' | 'другое';

export interface IApplication {
	id: string; // 'uuid'
	name: string; // 'string (обязательное, 2-50 символов)'
	email: string; // 'string (валидный email)'
	phone: string; // 'string (формат +7XXXXXXXXXX)'
	serviceType: TService; // 'enum (консультация|разработка|поддержка|другое)'
	message: string; // 'string (максимум 1000 символов)'
	createdAt: Date; // 'datetime (ISO 8601)'
	status: TStatus; // 'enum (новая|обработана)'
	source: string; // 'string (откуда пришла заявка)'
}
