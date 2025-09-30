import type { ComponentProps } from 'react';
import { Dropdown } from '../../../features/dropdown';
import './type.css';

export const TypeFilter = <T extends string>(props: ComponentProps<typeof Dropdown<T>>) => {
	return (
		<Dropdown
			{...props}
			wrapperProps={{ className: 'type-filter' }}
			inputProps={{ className: 'type-filter__input' }}
		/>
	);
};
