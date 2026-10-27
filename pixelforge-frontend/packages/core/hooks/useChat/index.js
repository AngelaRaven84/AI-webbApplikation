import { useMutation } from '@tanstack/react-query';
import { sendChatMessage } from '@pixelforge/api';
import { useState } from 'react';
import { useCartStore } from '@pixelforge/usecartstore';

export const useChat = () => {
	const { mutate, isPending, error } = useMutation({
		mutationFn: sendChatMessage,
		onSuccess: (data) => {
			setPendingCartAction(data.pendingCartAction ?? null);
			for (const action of data.cartActions ?? []) {
				if (action.type === 'add_to_cart') {
					useCartStore.getState().addToCart(action.product);
				} else if (action.type === 'remove_from_cart') {
					useCartStore.getState().removeFromCart(action.productId);
				}
			}

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
	const [pendingCartAction, setPendingCartAction] = useState(null);

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
			pendingCartAction,
		});
	};

	return { messages, sendMessage, isPending, error };
};
