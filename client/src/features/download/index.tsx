import type { ButtonHTMLAttributes } from 'react';
import './download.css';
export const Download = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button {...props} className={`download ${props.className ?? ''}`}>
			{props.children}
		</button>
	);
};
