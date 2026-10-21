import { useState } from 'react';

export const useChat = () => {
	const [messages, setMessages] = useState([]);

	const sendMessage = (content) => {
		const text = content.trim();

		if (!text) return;

		setMessages((previous) => [
			...previous,
			{
				id: crypto.randomUUID(),
				role: 'user',
				content: text,
			},
		]);
	};

	return { messages, sendMessage };
};
