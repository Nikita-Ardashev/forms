import { useEffect, useState } from 'react';
import './hint.css';

interface IHint {
	message: string;
	isError?: boolean;
	timeMS?: number;
}

export const Hint = ({ message, isError = false, timeMS = 2000 }: IHint) => {
	const [isView, setIsView] = useState(false);
	useEffect(() => {
		const hasMessage = message.length > 0;
		if (hasMessage) {
			setIsView(true);
			const timeout = setTimeout(() => {
				setIsView(false);
			}, timeMS);

			return () => clearTimeout(timeout);
		} else {
			setIsView(false);
		}
	}, [message, timeMS]);
	return (
		<div className={`hint ${isError ? 'hind-error' : ''} ${isView ? 'hint-view' : ''}`}>
			<p>{(isError ? 'Ошибка: ' : '') + message}</p>
		</div>
	);
};
