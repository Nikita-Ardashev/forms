/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { IForm } from '../models/form';
import type { IApplication } from '../models/application';
import type { IResponse } from '../models/response';
import { getLocation } from '../utils/location';

export const apiCreateApplication = async (
	body: IForm,
): Promise<IResponse<IApplication>> => {
	try {
		const bodyWithSource = body as IApplication;
		bodyWithSource.source = 'Не удалось получить данные о локации';

		const { lat, lng } = await getLocation();
		bodyWithSource.source = `Широта: ${lat}, Долгота: ${lng}`;

		const res = await axios.post('/api/application', bodyWithSource, {
			headers: { 'Content-Type': 'application/json' },
		});
		return res.data;
	} catch (e: any) {
		console.error(e);
		return e.response.data;
	}
};

export const apiGetAll = async (): Promise<IResponse<IApplication[]>> => {
	try {
		const { searchParams } = new URL(location.href);
		const jwt = searchParams.get('admin');

		const res = await axios.get('/api/application', {
			headers: { Authorization: `${jwt}` },
		});
		return res.data;
	} catch (e: any) {
		console.error(e);
		return e.response.data;
	}
};

export const apiGetCSVFile = async () => {
	try {
		const { searchParams } = new URL(location.href);
		const jwt = searchParams.get('admin');

		const res = await axios.get('/api/export', {
			responseType: 'blob',
			headers: { Authorization: `${jwt}` },
		});
		const blob = new Blob([res.data], {
			type: res.headers['content-type'] || 'text/csv;charset=utf-8;',
		});

		const downloadUrl = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = downloadUrl;
		link.download = 'file';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(downloadUrl);
	} catch (e: any) {
		console.error(e);
		return e.response.data;
	}
};
