import { useEffect, useMemo, useState } from 'react';
import './admin.css';
import { Application } from '../../components/application';
import { serviceTypes, type IApplication, type TService } from '../../models/application';
import { apiGetAll, apiGetCSVFile } from '../../services/api';
import { DateFilter, TypeFilter } from '../../components/filters';
import { Download } from '../download';
import { Hint } from '../hint';

type TFilterServiceType = TService | 'все';

const filterServiceType: TFilterServiceType[] = ['все', ...serviceTypes];

export const Admin = () => {
	const [error, setError] = useState({ message: '', isError: true });
	const [typeFilter, setTypeFilter] = useState<TFilterServiceType>('все');
	const handlerTypeFilter = (value: TFilterServiceType) => {
		setTypeFilter(value);
	};

	const [dateFilter, setDateFilter] = useState<{ min: Date; max: Date }>();
	const handlerDateFilter = (minDate: Date, maxDate: Date) => {
		setDateFilter({ min: minDate, max: maxDate });
	};

	const [applications, setApplications] = useState<IApplication[]>([]);
	useEffect(() => {
		apiGetAll()
			.then((r) => {
				setApplications(r.data ?? []);
			})
			.catch(() => {
				setError((v) => {
					const newV = { ...v };
					return Object.assign(newV, { message: 'Не удалось получить заявки!' });
				});
			});
	}, []);

	const handlerDownload = () => {
		apiGetCSVFile().catch(() => {
			setError((v) => {
				const newV = { ...v };
				return Object.assign(newV, { message: 'Не удалось получить файл!' });
			});
		});
	};

	const renderApplications = useMemo(() => {
		const filtered = (items: IApplication[]) => {
			const filteredItems = items
				.filter((item) => {
					if (typeFilter === 'все') return true;
					return item.service_type === typeFilter;
				})
				.filter((item) => {
					if (dateFilter === undefined) return item;
					const minFilter =
						dateFilter.min.getTime() <= new Date(item.created_at).getTime();
					const maxFilter =
						new Date(item.created_at).getTime() <= dateFilter.max.getTime();

					if (!dateFilter.max.getTime()) return minFilter;

					if (!dateFilter.min.getTime()) return maxFilter;

					return minFilter && maxFilter;
				});
			return filteredItems;
		};
		return filtered(applications).map((application) => (
			<Application key={application.id} {...application} />
		));
	}, [applications, dateFilter, typeFilter]);

	return (
		<>
			<Hint {...error} />
			<div className="admin">
				<div className="panel">
					<div className="panel__filters">
						<DateFilter callback={handlerDateFilter} />
						<TypeFilter<TFilterServiceType>
							defaultValue={filterServiceType[0]}
							items={filterServiceType}
							callback={handlerTypeFilter}
						/>
					</div>
					<Download onClick={handlerDownload}>Скачать CSV</Download>
				</div>
				<div className="applications">{renderApplications}</div>
			</div>
		</>
	);
};
