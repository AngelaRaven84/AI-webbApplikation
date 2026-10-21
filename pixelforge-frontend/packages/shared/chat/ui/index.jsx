import { useChat } from '@pixelforge/usechat';

export const Chat = () => {
	const { messages, sendMessage } = useChat();

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
			<form onSubmit={handleSubmit}>
				<label htmlFor='chat-message'>Din fråga</label>
				<input
					id='chat-message'
					name='message'
					type='text'
					placeholder='Vad letar du efter?'
				/>
				<button type='submit'>Skicka</button>
			</form>
		</section>
	);
};
