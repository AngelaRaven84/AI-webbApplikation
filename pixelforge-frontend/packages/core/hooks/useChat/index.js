import { useMutation } from '@tanstack/react-query';
import { sendChatMessage } from '@pixelforge/api';
import { useState } from 'react';
import { useCartStore } from '@pixelforge/usecartstore';

export const useChat = () => {
	const { mutate, isPending, error } = useMutation({
		mutationFn: sendChatMessage,
		onSuccess: (data) => {
			setMessages((previous) => [
				...previous,
				{
					id: crypto.randomUUID(),
					role: 'assistant',
					content: data.content,
					sources: data.sources ?? [],
				},
			]);
		},
	});

	const [messages, setMessages] = useState([]);

	const sendMessage = (content) => {
		const text = content.trim();

		if (!text || isPending) return;

		setMessages((previous) => [
			...previous,
			{
				id: crypto.randomUUID(),
				role: 'user',
				content: text,
			},
		]);

		const cart = useCartStore
			.getState()
			.cart.map(({ productId, name, qty }) => ({
				productId,
				name,
				qty,
			}));

		mutate({
			message: text,
			history: messages.map(({ role, content }) => ({
				role,
				content,
			})),
			cart,
		});
	};

	return { messages, sendMessage, isPending, error };
};
