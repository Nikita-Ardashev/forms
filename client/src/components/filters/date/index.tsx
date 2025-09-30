import { useState, type ChangeEvent } from 'react';
import './date.css';

interface IDateFilter {
	callback: (minDate: Date, maxDate: Date) => void;
}

export const DateFilter = ({ callback }: IDateFilter) => {
	const [minDate, setMinDate] = useState<string>('');
	const [maxDate, setMaxDate] = useState<string>('');

	const handlerMinDate = (e: ChangeEvent<HTMLInputElement>) => {
		const date = new Date(e.currentTarget.value);
		if (maxDate.length !== 0 && date.getTime() >= new Date(maxDate).getTime()) return;
		callback(date, new Date(maxDate));
		setMinDate(e.currentTarget.value);
	};

	const handlerMaxDate = (e: ChangeEvent<HTMLInputElement>) => {
		const date = new Date(e.currentTarget.value);
		if (minDate.length !== 0 && date.getTime() <= new Date(minDate).getTime()) return;
		callback(new Date(minDate), date);
		setMaxDate(e.currentTarget.value);
	};

	return (
		<div className="date-filter">
			<input type="date" value={minDate} onChange={handlerMinDate} />
			<p>-</p>
			<input type="date" value={maxDate} onChange={handlerMaxDate} />
		</div>
	);
};
