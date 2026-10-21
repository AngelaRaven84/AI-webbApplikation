import { Outlet } from 'react-router-dom';
import { Header } from '@pixelforge/header';
import { Footer } from '@pixelforge/footer';
import { Chat } from '@pixelforge/chat';
import './index.css';

export const Layout = () => {
	return (
		<>
			<Header />
			<main className='page'>
				<Outlet />
			</main>
			<Footer />
			<Chat />
		</>
	);
};
