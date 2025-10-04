import {
	useEffect,
	useMemo,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type InputHTMLAttributes,
} from 'react';
import './dropdown.css';

interface IDropdown<T extends string> {
	callback?: (value: T) => void;
	items: T[];
	defaultValue?: T;
	wrapperProps?: HTMLAttributes<HTMLDivElement>;
	inputProps?: InputHTMLAttributes<HTMLInputElement>;
	itemProps?: ButtonHTMLAttributes<HTMLButtonElement>;
	itemsProps?: HTMLAttributes<HTMLInputElement>;
}

export const Dropdown = <T extends string>(props: IDropdown<T>) => {
	const [isView, setIsView] = useState(false);
	const [value, setValue] = useState(props.defaultValue);
	const dropdownItemsRef = useRef<HTMLDivElement>(null);

	const handlerClick = () => {
		setIsView((v) => !v);
	};

	useEffect(() => {
		const current = dropdownItemsRef.current;
		if (current === null) return;
		document.onmouseup = (e) => {
			if (isView && !Array.from(current.childNodes).includes(e.target as ChildNode)) {
				setIsView(false);
			}
		};
	}, [isView]);

	const itemsRender = useMemo(
		() =>
			props.items.map((item) => (
				<button
					{...props.itemProps}
					key={item}
					type="button"
					onClick={() => {
						setValue(item);
						if (props.callback !== undefined) props.callback(item);
						setIsView(false);
					}}
				>
					{item}
				</button>
			)),
		[props],
	);

	return (
		<div
			{...props.wrapperProps}
			className={`dropdown ${props.wrapperProps?.className ?? ''}`}
		>
			<input
				{...props.inputProps}
				className={`dropdown__input ${props.inputProps?.className ?? ''}`}
				onClick={handlerClick}
				value={value}
				type="button"
			/>
			<div
				{...props.itemsProps}
				className={`dropdown__items ${props.itemsProps?.className ?? ''}`}
				ref={dropdownItemsRef}
				style={{ display: isView ? undefined : 'none' }}
			>
				{itemsRender}
			</div>
		</div>
	);
};
