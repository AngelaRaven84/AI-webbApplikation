import { useChat } from '@pixelforge/usechat';

export const Chat = () => {
	const { messages, sendMessage, isPending, error } = useChat();

	const handleSubmit = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		sendMessage(formData.get('message'));
		form.reset();
	};

	return (
		<section aria-label='PixelForge-assistent'>
			<h2>PixelForge-assistent</h2>
			<p>Hej! Vad kan jag hjälpa dig med?</p>
			<div aria-live='polite'>
				{messages.map((message) => (
					<p key={message.id}>{message.content}</p>
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
