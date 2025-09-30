import { useMemo } from 'react';
import type { IApplication } from '../../models/application';
import './application.css';

export const Application = (props: IApplication) => {
	const render = useMemo(
		() =>
			Object.keys(props).map((p) => {
				const value = props[p as keyof IApplication];
				return (
					<p key={p}>
						<b>{p}</b>: {value}
					</p>
				);
			}),
		[props],
	);
	return <div className="application">{render}</div>;
};
