export interface IResponse<T> {
	error?: unknown;
	success: boolean;
	message: string;
	data?: T;
}
