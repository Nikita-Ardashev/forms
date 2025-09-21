import sanitizeHTML from 'sanitize-html';
import { Request } from 'express';
export const sanitizer = (
	html: string,
	options: sanitizeHTML.IOptions | undefined = undefined,
) => {
	const sanitize = sanitizeHTML(html, options);
	return sanitize;
};

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
	const sanitized: any = {};

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === 'string') {
			sanitized[key] = sanitizer(value);
		} else if (typeof value === 'object' && value !== null) {
			sanitized[key] = sanitizeObject(value);
		} else {
			sanitized[key] = value;
		}
	}

	return sanitized;
};

export const sanitizeRequest = (req: Request) => {
	return {
		body: req.body ?? sanitizeObject(req.body),
		query: req.query ?? sanitizeObject(req.query as Record<string, any>),
		params: req.params ?? sanitizeObject(req.params),
	};
};
