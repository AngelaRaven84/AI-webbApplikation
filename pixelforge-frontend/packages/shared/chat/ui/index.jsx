import { useChat } from '@pixelforge/usechat';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDocuments } from '@pixelforge/api';
import './style.css';

export const Chat = () => {
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

	const handleSubmit = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		sendMessage(formData.get('message'));
		form.reset();
	};

	return (
		<section className='chat' aria-labelledby='chat-title'>
			<header className='chat__header'>
				<h2 className='chat__title' id='chat__title'>
					PixelForge-assistent
				</h2>
				<p className='chat__intro'>Hej! Vad kan jag hjälpa dig med?</p>
			</header>

			<div aria-live='polite'>
				{messages.map((message) => (
					<div key={message.id}>
						<p>{message.content}</p>

						{message.sources?.length > 0 && (
							<div>
								<p>Hämtade underlag:</p>

								{documentsPending && (
									<p role='status'>Laddar dokumentlänkar...</p>
								)}

								{documentsError && (
									<p role='alert'> Det gick inte att hämta dokumentlänkarna.</p>
								)}

								<ul>
									{documents
										.filter((document) => message.sources.includes(document.id))
										.map((document) => (
											<li key={document.id}>
												<Link
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

			{isPending && <p role='status'>Assistenten tänker...</p>}

			{error && <p role='alert'>{error.message}</p>}

			<form onSubmit={handleSubmit}>
				<label htmlFor='chat-message'>Din fråga</label>
				<input
					id='chat-message'
					name='message'
					type='text'
					placeholder='Vad letar du efter?'
					disabled={isPending}
				/>
				<button type='submit' disabled={isPending}>
					{isPending ? 'Väntar...' : 'Skicka'}
				</button>
			</form>
		</section>
	);
};
