import { useForm } from 'react-hook-form';
import './form.css';
import { Dropdown } from '../dropdown';
import { serviceTypes, type TService } from '../../models/application';
import z from 'zod';
import validator from 'validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiCreateApplication } from '../../services/api';
import { Hint } from '../hint';
import { useState, type ComponentProps } from 'react';

const formSchema = z.object({
	name: z
		.string()
		.min(2, 'Имя не может быть меньше 2 символов!')
		.max(50, 'Имя не может быть больше 50 символов!'),
	phone: z.string().refine((tel) => validator.isMobilePhone(tel, 'ru-RU'), {
		message: 'Некорректный номер телефона!',
	}),
	email: z.email('Некорректный email!'),
	service_type: z.literal(serviceTypes),
	message: z.string().max(1000, 'Сообщение не может быть больше 1000 символов!'),
});

type FormSchema = z.infer<typeof formSchema>;

export const Form = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

	const [hint, setHint] = useState<ComponentProps<typeof Hint>>({ message: '' });
	const handlerSubmitCreate = handleSubmit(async (data) => {
		setHint({ message: '' });
		const res = await apiCreateApplication(data);
		setHint(() => {
			const newV = { message: res.message, isError: res.error !== undefined };
			return newV;
		});
	});

	return (
		<>
			<Hint {...hint} />
			<form className="form" onSubmit={handlerSubmitCreate}>
				<input
					className="form__input"
					placeholder="Имя"
					{...register('name')}
					autoComplete="name"
				/>
				{errors.name && <p>{errors.name.message}</p>}
				<input
					className="form__input"
					placeholder="+7 ..."
					autoComplete="tel"
					{...register('phone')}
				/>
				{errors.phone && <p>{errors.phone.message}</p>}
				<input
					className="form__input"
					placeholder="Email"
					{...register('email')}
					autoComplete="email"
				/>
				{errors.email && <p>{errors.email.message}</p>}
				<Dropdown<TService>
					items={serviceTypes}
					defaultValue={'другое'}
					inputProps={{ className: 'form__input' }}
					itemProps={{ className: 'form__input' }}
					register={register('service_type')}
				/>
				{errors.service_type && <p>{errors.service_type.message}</p>}
				<textarea
					className="form__input"
					placeholder="Сообщение"
					{...register('message')}
				/>
				{errors.message && <p>{errors.message.message}</p>}
				<input
					className="form__input form__input-submit"
					type="submit"
					value={'Отправить'}
				/>
			</form>
		</>
	);
};
