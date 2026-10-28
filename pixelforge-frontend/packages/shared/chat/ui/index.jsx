import { useChat } from '@pixelforge/usechat';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDocuments } from '@pixelforge/api';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import './style.css';

export const Chat = () => {
	const [isOpen, setIsOpen] = useState(false);
	const messagesRef = useRef(null);
	const { messages, sendMessage, isPending, error } = useChat();

	const {
		data: documents = [],
		isPending: documentsPending,
		isError: documentsError,
	} = useQuery({
		queryKey: ['documents'],
		queryFn: fetchDocuments,
		enabled: messages.some((message) => message.sources?.length > 0),
	});

	useEffect(() => {
		if (!isOpen) return;

		const container = messagesRef.current;

		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [messages, isOpen, isPending, error, documentsPending, documentsError]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		sendMessage(formData.get('message'));
		form.reset();
	};

	return (
		<>
			<button
				className='chat-toggle'
				type='button'
				hidden={isOpen}
				aria-expanded={isOpen}
				aria-controls='chat-panel'
				onClick={() => setIsOpen(true)}>
				<MessageCircle size={22} aria-hidden='true' />
				<span>Fråga PixelForge</span>
			</button>

			<section
				className='chat'
				id='chat-panel'
				hidden={!isOpen}
				aria-labelledby='chat-title'>
				<header className='chat__header'>
					<h2 className='chat__title' id='chat-title'>
						PixelForge-assistent
					</h2>

					<p className='chat__intro'>Hej! Vad kan jag hjälpa dig med?</p>

					<button
						className='chat__close'
						type='button'
						aria-label='Stäng chatten'
						onClick={() => setIsOpen(false)}>
						<X size={20} aria-hidden='true' />
					</button>
				</header>

				<div className='chat__messages' ref={messagesRef} aria-live='polite'>
					{messages.map((message) => (
						<div
							key={message.id}
							className={`chat__message chat__message--${message.role}`}>
							<p className='chat__message-text'>{message.content}</p>

							{message.sources?.length > 0 && (
								<div className='chat__sources'>
									<p className='chat__sources-title'>Hämtade underlag:</p>

									{documentsPending && (
										<p role='status'>Laddar dokumentlänkar...</p>
									)}

									{documentsError && (
										<p role='alert'>
											{' '}
											Det gick inte att hämta dokumentlänkarna.
										</p>
									)}

									<ul className='chat__sources-list'>
										{documents
											.filter((document) =>
												message.sources.includes(document.id),
											)
											.map((document) => (
												<li className='chat__sources-item' key={document.id}>
													<Link
														className='chat__source-link'
														to={`/support/${encodeURIComponent(document.slug)}`}>
														{document.title}
													</Link>
												</li>
											))}
									</ul>
								</div>
							)}
						</div>
					))}
				</div>

				{isPending && (
					<p className='chat__status' role='status'>
						Assistenten tänker...
					</p>
				)}

				{error && (
					<p className='chat__error' role='alert'>
						{error.message}
					</p>
				)}

				<form className='chat__form' onSubmit={handleSubmit}>
					<label className='chat__label' htmlFor='chat-message'>
						Din fråga
					</label>

					<div className='chat__controls'>
						<input
							className='chat__input'
							id='chat-message'
							name='message'
							type='text'
							placeholder='Vad letar du efter?'
							disabled={isPending}
						/>
						<button className='chat__submit' type='submit' disabled={isPending}>
							{isPending ? 'Väntar...' : 'Skicka'}
						</button>
					</div>
				</form>
			</section>
		</>
	);
};
