import './App.css';
import { Admin } from './features/admin';
import { Form } from './features/form';

function App() {
	const { searchParams } = new URL(location.href);
	const isAdmin = searchParams.has('admin');
	return (
		<>
			{isAdmin ? (
				<Admin />
			) : (
				<>
					<h1>Заявка онлайн</h1>
					<Form />
				</>
			)}
		</>
	);
}

export default App;
